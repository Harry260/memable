import $ from "jquery";
import fillCards from "./api";
var gridContainer = document.querySelector(".grid-container");

const GridAction = {
	add: (arr, callback) => {
		var count = arr.length;
		window["activeMeme"] = arr[0].id;

		arr.forEach((obj, index) => {
			GridAction.createCard(obj);

			if (count === index + 1) {
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

		$(".panel-left").fadeOut();
	},
	createCard: (obj) => {
		if (obj) {
			var card = document.createElement("div");

			if (!window["memes"]) {
				window["memes"] = {};
			}
			window.memes[obj.id] = obj;

			card.classList.add("grid-item-wrap");
			card.classList.add("new-grid-item");
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

         <div class="grid-item">
         <div class="lol"></div>
         <div class="item-title">
            <h1 title="${obj.title}">${obj.title}</h1>
         </div>
         <img
            src="${obj.url}"
            class="grid-img grid-img-spoiler-${spoiler}"
         />
         <div class="user-info">
            <div class="user-icon" title="Meme by ${obj.author.name}">
               <img src="${obj.author.profile}" />
            </div>
         </div>
      </div>

         `;

			card.innerHTML = html;
			gridContainer.appendChild(card);

			$(card).on("click", function () {
				window.activeMeme = $(this).attr("data-meme");
				document.dispatchEvent(
					new CustomEvent("cardSelectionChanged", {})
				);

				$(".grid-item-wrap").css({
					padding: "0",
					zIndex: "1",
				});
				$(this).css({
					padding: "5",
					zIndex: "5",
				});
				$(".panel-left").fadeIn();

				$(".user-icon-left").html(
					`<img class="button-user-icon" src=${
						window.memes[window.activeMeme].author.profile
					}>`
				);
			});
		}
	},
};

export default GridAction;
