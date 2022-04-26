import Hammer from "hammerjs";
import $ from "jquery";
import fillCards from "./api.js";

import "./app.ui.js";

var memeContainer = document.querySelector(".meme");

function initCards(card, index) {
	var newCards = document.querySelectorAll(".meme--card:not(.removed)");
	var allCards = document.querySelectorAll(".meme--card");

	newCards.forEach(function (card, index) {
		card.style.zIndex = allCards.length - index;
		card.style.transform =
			"scale(" + (20 - index) / 20 + ") translateY(" + 20 * index + "px)";
		card.style.opacity = (10 - index) / 10;
	});

	memeContainer.classList.add("loaded");
}

initCards();

const cardActions = {
	ChangeLoadMessage: (config) => {
		var { btn = {}, image, title, description } = config;

		console.log(config);
		var m = $(".loader-message").text(description);
		var t = $(".loader-title").text(title);
		var i = $(".loader-img").attr("src", image);

		var dummyF = function () {};
		var btnFunction = btn.do || dummyF;
		var btnText = btn.text ?? false;

		if (btnText) {
			$(".loader-btn").fadeIn();
			var btnE = $(".loader-btn");
			btnE.html(btn.text);
			btnE.on("click", btnFunction);
		} else {
			$(".loader-btn").fadeOut();
		}
	},
	move: (card) => {
		var card = $(".meme--card:not(.removed)").first();
		var moveOutWidth = document.body.clientWidth * 1.5;
		card.animate({ left: moveOutWidth }, "slow").fadeOut();
		setTimeout(card.remove, 1000);
	},
	add: (arr, callback) => {
		$(".panel-left").fadeIn();
		var count = arr.length;
		window["activeMeme"] = arr[0].id;
		arr.forEach((obj, index) => {
			cardActions.createCard(obj);

			if (count === index + 1) {
				InitEvents();
				if (typeof callback === "function") callback();

				Promise.all(
					Array.from(document.images)
						.filter((img) => !img.complete)
						.map(
							(img) =>
								new Promise((resolve) => {
									img.onload = img.onerror = resolve;
								})
						)
				).then(() => {
					$(".loader-overlay").remove();
					console.log("images finished loading");
					$(".new-grid-item").removeClass("new-grid-item");
					window.onscroll = function (ev) {
						if (
							window.innerHeight + window.scrollY >=
							document.body.scrollHeight
						) {
							if (window.loading) return;
							$(".loader-item").remove();

							$(gridContainer).append(`
		                  <div class="grid-item-wrap loader-item"> <div class="grid-item-loader"> <div class="load--text"> <img src="../assets/images/lodaing.gif" class="loader-img" /> <h1 class="loader-title">Bribing for memes</h1> <p class="loader-message"> This might take few seconds! Cuz bribing is risky ewww! </p> <button class="loader-btn">Start Over</button> </div> </div> </div>
		                  `);
							fillCards({}, "grid");
							window.loading = true;
						}
					};
				});
			}
		});

		$(".user-icon-left").html(
			`<img class="button-user-icon" src=${
				window.memes[window.activeMeme].author.profile
			}>`
		);
	},
	setLastCard: (subreddit, id) => {
		if (!window.lastSubreddit) {
			window.lastSubreddit = {};
		}

		var localLastSubreditData = JSON.parse(
			localStorage.getItem("lastSubreddit") || "{}"
		);

		localLastSubreditData[subreddit] = id;

		window.lastSubreddit[subreddit] = localLastSubreditData;

		localStorage.setItem(
			"lastSubreddit",
			JSON.stringify(localLastSubreditData)
		);
	},
	createCard: (obj) => {
		if (obj) {
			var card = document.createElement("div");

			if (!window["memes"]) {
				window["memes"] = {};
			}
			window.memes[obj.id] = obj;

			card.classList.add("meme--card");
			card.style.backgroundImage = "url(" + obj.url + ")";
			card.setAttribute("data-meme", obj.id);
			card.setAttribute("data-subreddit", obj.subreddit);

			var spoiler = false;

			if (settings.explict === "off") {
				spoiler = false;
			} else if (settings.explict === "on") {
				if (obj.NSFW || obj.spoiler) {
					spoiler = true;
				} else {
					spoiler = false;
				}
			} else {
				spoiler = false;
			}

			card.setAttribute("data-spoiler", spoiler);
			var html = `

         <div class="meme-status v-center sbtw-center">
            <div class="user-information">
               <div class="user-icon">
                  <img src="${checkProfilePic(obj.author.profile)}" />
               </div>
               <div class="user-name v-center">
                  <div>
                     <h4>${obj.author.name}</h4>
                  </div>
                  <div>
                     <h6 title="${obj.title}">
                     ${obj.title}
                     </h6>
                  </div>
               </div>
               <div class="reddit-icon v-center open-subreddit" title="Meme from r/${
					obj.subreddit
				}">
                  <img src="../assets/icons/reddit.svg" />
               </div>
            </div>
         </div>
         `;

			function checkProfilePic(pp) {
				if (
					pp === undefined ||
					pp === null ||
					pp === "" ||
					pp === "undefined"
				) {
					return "https://www.redditstatic.com/icon.png";
				} else {
					return pp;
				}
			}

			card.innerHTML = html;
			memeContainer.appendChild(card);
			initCards();
		}
	},
};

function InitEvents() {
	initCards();
	document.querySelectorAll(".meme--card").forEach(function (el) {
		var hammertime = new Hammer(el);

		hammertime.on("pan", function (event) {
			el.classList.add("moving");
		});

		hammertime.on("pan", function (event) {
			if (event.target.classList.contains("meme--card")) {
				if (event.deltaX === 0) return;
				if (event.center.x === 0 && event.center.y === 0) return;

				var xMulti = event.deltaX * 0.03;
				var yMulti = event.deltaY / 80;
				var rotate = xMulti * yMulti;

				event.target.style.transform =
					"translate(" +
					event.deltaX +
					"px, " +
					event.deltaY +
					"px) rotate(" +
					rotate +
					"deg)";

				// var positionRadialPercentage =
				// 	(Math.max(
				// 		event.deltaX < 0 ? event.deltaX * -1 : event.deltaX,
				// 		event.deltaY < 0 ? event.deltaY * -1 : event.deltaY
				// 	) /
				// 		memeContainer.clientWidth) *
				// 	100;
			}
		});

		hammertime.on("panend", function (event) {
			el.classList.remove("moving");
			memeContainer.classList.remove("meme_love");
			memeContainer.classList.remove("meme_nope");

			var moveOutWidth = document.body.clientWidth;
			var keep =
				Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

			event.target.classList.toggle("removed", !keep);
			if (!keep) {
				var nextId = $(event.target).next().attr("data-meme") || false;
				var prevId = $(event.target).attr("data-meme");
				window.activeMeme = nextId;

				document.dispatchEvent(
					new CustomEvent("cardMoved", {
						detail: {
							prevCard: window.memes[prevId],
							currentCard: window.memes[nextId],
						},
					})
				);
				event.target.remove();
			}

			if (keep) {
				event.target.style.transform = "";
			} else {
				var endX = Math.max(
					Math.abs(event.velocityX) * moveOutWidth,
					moveOutWidth
				);
				var toX = event.deltaX > 0 ? endX : -endX;
				var endY = Math.abs(event.velocityY) * moveOutWidth;
				var toY = event.deltaY > 0 ? endY : -endY;
				var xMulti = event.deltaX * 0.03;
				var yMulti = event.deltaY / 80;
				var rotate = xMulti * yMulti;

				event.target.style.transform =
					"translate(" +
					toX +
					"px, " +
					(toY + event.deltaY) +
					"px) rotate(" +
					rotate +
					"deg)";
				initCards();
			}
		});
	});
}

document.addEventListener("cardMoved", function (e) {
	var currentCard = e.detail.currentCard;
	cardActions.setLastCard(currentCard.subreddit, currentCard.id);
	try {
		var activeMeme = window.memes[window.activeMeme] ?? false;
		$(".user-icon-left").html(
			`<img class="button-user-icon" src=${activeMeme.author.profile}>`
		);
	} catch (error) {
		var cardsLenght = $(".meme--card").length;
		console.log(cardsLenght);
		if (cardsLenght === 1) {
			fillCards();
			$(".user-icon-left").html(
				`<img class="button-user-icon" src="../assets/images/lodaing.gif">`
			);
		}
	}
});

export default cardActions;
