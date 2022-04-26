import cardActions from "./cards";
import GridAction from "./grid";
import axios from "axios";

var apiTimeOut;
function fillCards(config = {}, type = "swipe") {
	if (window.FirstTime === true) {
		apiTimeOut = setTimeout(() => {
			console.log(
				"API TIMEOUT: ",
				"clearing Subreddits cache and reloading in 5 sec!!"
			);
			localStorage.removeItem("lastSubreddit");
			window.location.reload();
		}, 10000);
	}

	var tempSubreddits = config.subreddits || [
		"dankmemes",
		"memes",
		"AdviceAnimals",
		"MemeEconomy",
		"ComedyCemetery",
		"PrequelMemes",
		"terriblefacebookmemes",
		"funny",
	];

	var subreddits = [];

	var max = config.max || 50;
	var lastIDs =
		config.lastIDs || JSON.parse(localStorage.lastSubreddit || "{}") || {};

	var baseUrl = "";

	tempSubreddits.forEach((subreddit) => {
		// var lastID = lastIDs[subreddit] || false;

		// if (lastID) {
		// 	subreddits.push(`${subreddit}:${lastID}`);
		// } else {
		subreddits.push(subreddit);
		// }
	});

	const sp = new URLSearchParams({
		subreddits: subreddits.join(","),
		max,
		filter: window.settings.category,
	});

	var endpoint = baseUrl + "/memes?" + sp;

	const styling = `
   color:white;
   background-color:black;
   border-left: 1px solid yellow;
   padding: 8px;
   font-weight: 600;
   font-family: Courier;
`;

	console.log(
		`%c 🕸️ ENDPOINT `,
		`${styling} font-size: 16px; border-top: 1px solid yellow;`,
		"\n\n" + endpoint + `\n\n ---- END OF ENDPOINT ---- \n\n`
	);

	axios.get(endpoint).then((response) => {
		clearTimeout(apiTimeOut);
		window.loading = false;

		window.FirstTime = false;
		var result = response.data;
		var subreddits = result.properties.subreddits;
		var allMemes = [];

		for (const key in result.data) {
			if (result.data[key] === []) {
				delete result.data[key];
			}
		}

		subreddits.forEach((subreddit) => {
			var tempSubReddit = result.data[subreddit] ?? [];

			if (tempSubReddit.length !== 0) {
				tempSubReddit = result.data[subreddit];

				var lastId = tempSubReddit.at(-1).id;

				cardActions.setLastCard(subreddit, "t3_" + lastId);

				tempSubReddit.forEach((meme) => {
					allMemes.push(meme);
				});
			}
		});

		//console.log(allMemes);
		if (type === "swipe") {
			if (allMemes.length === 0) {
				cardActions.ChangeLoadMessage({
					description:
						"Aw snap! Mr.Memebribble couldn't bribe any memes from meme-police.",
					title: "No memes found!",
					image: "../assets/icons/restart.svg",
					btn: {
						text: "Start over",
						do: () => {
							localStorage.removeItem("lastSubreddit");
							window.location.reload;
						},
					},
				});
			} else {
				cardActions.add(allMemes);
			}
		}
		if (type === "grid") {
			GridAction.add(allMemes);
		}
	});

	// .catch(function (error) {
	// 	console.log(error);
	// });
}

export default fillCards;
