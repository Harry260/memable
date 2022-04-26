import $ from "jquery";
import fillCards from "./api.js";

var layout = localStorage.getItem("layout") || "swipe";
var category = localStorage.getItem("category") || "hot";
var explict = localStorage.getItem("explict") || "off";
var subreddits = localStorage.getItem("subreddits") || [
	"dankmemes",
	"memes",
	"AdviceAnimals",
	"MemeEconomy",
	"ComedyCemetery",
	"PrequelMemes",
	"terriblefacebookmemes",
	"funny",
];

var settings = {
	layout,
	category,
	explict,
	subreddits,
};

window["settings"] = settings;

var layoutChooser = $("input[name='radioLayout']");
var categoryChooser = $("input[name='radioCat']");
var explictChooser = $("input[name='radioExplict']");
var subredditsChooser = $(".choose-subreddits");

var settingsChoosers = [
	layoutChooser,
	categoryChooser,
	explictChooser,
	subredditsChooser,
];

settingsChoosers.forEach((chooser, index) => {
	setCheckd(chooser, Object.values(settings)[index]);
});

function setCheckd(chooser, value) {
	chooser.filter(`input[value="${value}"]`).attr("checked", "");
}
layoutChooser.on("click", (e) => {
	var value = e.target.value;
	localStorage.setItem("layout", value);
	window.location.reload();
});

categoryChooser.on("click", (e) => {
	var value = e.target.value;
	localStorage.setItem("category", value);
	window.location.reload();
});

explictChooser.on("click", (e) => {
	var value = e.target.value;
	localStorage.setItem("explict", value);
	window.location.reload();
});

__init();
function __init() {
	var userPreferredLayout = layout;

	$(`.${userPreferredLayout}-root`).fadeIn();
	fillCards({}, userPreferredLayout);

	var bodyStyles = {
		swipe: {
			overflow: "hidden",
		},
		grid: {
			overflowY: "scroll",
		},
	};

	$(document.body).css(bodyStyles[userPreferredLayout]);
}

var settingsBtn = $(".settings-button");
settingsBtn.on("click", () => {
	$(".setting-pop").toggleClass("setting-pop-active");
	settingsBtn.find("i").toggleClass("bi-x");
});
