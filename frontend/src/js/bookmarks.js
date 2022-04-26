import $ from "jquery";

const bookMarks = {
	add: (id) => {
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
		if (bookmarks[id] === undefined) {
			bookmarks[id] = window.memes[id];
		}
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	},
	remove: (id) => {
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
		if (id) {
			delete bookmarks[id];
		}
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	},
	check: (id) => {
		var bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");

		if (bookmarks[id] !== undefined) {
			return true;
		}
		return false;
	},
	get: () => {
		return JSON.parse(localStorage.getItem("bookmarks") || "{}");
	},
};
bookMarkButtonInit();
$("body").on("click", ".bookmark__btn", function () {
	var id = window.activeMeme;

	if (bookMarks.check(id)) {
		bookMarks.remove(id);
	} else {
		bookMarks.add(id);
	}

	bookMarkButtonInit();
});

function bookMarkButtonInit() {
	var bookmarks = bookMarks.get();

	if (bookmarks[window.activeMeme] !== undefined) {
		$(".bookmark__btn i").addClass("red-icon-active");
	} else {
		$(".bookmark__btn i").removeClass("red-icon-active");
	}
}

document.addEventListener("cardMoved", bookMarkButtonInit);
document.addEventListener("cardSelectionChanged", bookMarkButtonInit);
