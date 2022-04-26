import $ from "jquery";
import Roastra from "roastra";

$(document).on("click", ".open-reddit", function () {
	var link = "https://reddit.com" + window.memes[window.activeMeme].permalink;
	window.open(link, "_blank");
});

$(document).on("click", ".open-subreddit", function () {
	var link =
		"https://reddit.com/r/" + window.memes[window.activeMeme].subreddit;
	window.open(link, "_blank");
});

$(".header-icon").on("click", function () {
	var roast = new Roastra({
		plural: true,
		name: "You",
	});

	var msg = new SpeechSynthesisUtterance();
	msg.text = roast.Get().sentance;
	window.speechSynthesis.speak(msg);
});
