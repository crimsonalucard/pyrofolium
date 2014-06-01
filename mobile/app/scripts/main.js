//console.log('\'Allo \'Allo!');


function syncCoverSlideHeight(){
	var heightOfCoverImage = $(".fullscreenbg img").height();
	$(".fullscreenbg").height(heightOfCoverImage);
}

syncCoverSlideHeight();

$(window).resize(syncCoverSlideHeight);

