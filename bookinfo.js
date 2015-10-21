var maxResults = 10;
var startIndex = 0;
var totalBooks = 0;
var apiKey = "AIzaSyAY-BLl9HgepqEFBxR5YJbC_qdE4PZF_6g";
var searchKey, operation;

var hideButton = function(button) {
	button.attr("style", "display:none;"); 
}

var showButton = function(button) {
	button.attr("style", ""); 
}

var buttonToggle = function() {
	console.log(startIndex);

	var previousButton = $('#previous-page');
	var nextButton = $('#next-page');

	//previous button
	if (startIndex == 0) {
		hideButton(previousButton);
	} else {
		showButton(previousButton);
	}
	//next button
	if (startIndex + maxResults > totalBooks) {
		hideButton(nextButton);
	} else {
		showButton(nextButton);
	}
}

var htmlConvert = function(thumbnail, title, publisher, isbn) {
	var htmlTemplate = "<div class=\"book-info\"><div class=\"thumbnail\"><img src=\""+ 
		thumbnail + "\"></div><div class=\"title\">Title: " + title + "</div>" + 
			"<div class=\"publisher\">Publisher: " + publisher + "</div>" + "<div class=\"isbn\">isbn: " + isbn + "</div></div>";
	return htmlTemplate;
}

var showResult = function(data) {
	buttonToggle();
	console.log(data.items);
	var books = data.items;
	if (totalBooks == 0) {
		$('#result').append("book not found");
	} else {
		var i, j, book, thumbnail, title, publisher, isbn;
		for (i = 0; i < books.length; i++) {
			book = books[i];
			console.log(book.volumeInfo.imageLinks);
			//no thumbnail
			if (book.volumeInfo.imageLinks == undefined) {
				thumbnail = "http://webmaster.ypsa.org/wp-content/uploads/2012/08/no_thumb.jpg";
			} else {
				thumbnail = book.volumeInfo.imageLinks.smallThumbnail;
			}

			title = book.volumeInfo.title;

			console.log(book.volumeInfo.industryIdentifiers);

			//no isbn
			if (book.volumeInfo.industryIdentifiers == undefined) {
				isbn = "not available";
			} else {
				isbn = book.volumeInfo.industryIdentifiers[0].identifier;
			}

			//no publisher
			if (book.volumeInfo.publisher == undefined) {
				publisher = "not available";
			} else {
				publisher = book.volumeInfo.publisher;
			}

			var html = htmlConvert(thumbnail, title, publisher, isbn);
			$('#result').append(html);
		}
	}
}

var clearResult = function() {
	$('#result').html("");
}

var getBooks = function(searchKey, operation, startIndex, maxResults, apiKey) {
	$.get("https://www.googleapis.com/books/v1/volumes?q=" + operation + ":" + searchKey + 
		"&maxResults=" + maxResults + "&startIndex=" + startIndex + 
			"&key=" + apiKey, function(data) {
		console.log(data);
		totalBooks = data.totalItems;
		showResult(data);
	});
}

//Button function

$('#search-button').click(function() {
	clearResult();
	$('.pagination').each(function() {
		$(this).attr("style", ""); 
	});
	searchKey = $('#search-field').val();
	console.log(searchKey);
	operation = $('input:checked').attr("value");
	getBooks(searchKey, operation, startIndex, maxResults, apiKey);
	// var url = "test2.html";
	// $('#result').load(url, function() {
	// 	$('#button3').val(searchKey);
	// 	var html = $('html').html();			
	// });
});

$('#next-page').click(function() {
	clearResult();
	startIndex += maxResults - 1;
	getBooks(searchKey, operation, startIndex, maxResults, apiKey);
});

$('#previous-page').click(function() {
	clearResult();
	startIndex -= maxResults - 1;
	getBooks(searchKey, operation, startIndex, maxResults, apiKey);
});