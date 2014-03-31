/**
 * Created by brian on 3/9/14.
 */
function getViewPortHeight(){
	return $(window).height();
}

function getViewPortWidth(){
	return $(window).width();
}

function linkElementToViewPortHeight(element){
	var height = getViewPortHeight();
	element.height(height);
	$(window).resize(function(){
		var height = getViewPortHeight();
		element.height(height);
	});
}

function createArrowPath(thickness){
	//thickness in pixels
	var width = getViewPortWidth();
	//var trigConstant =  Math.sqrt(3)*(width/2); //tan(pi/6)*(width/2)
	var trigConstant = (1.73205080757/3)*(width/2);
	var coord = new Array();
	coord.push([0,  trigConstant]);
	coord.push([width/2, 0]);
	coord.push([width, trigConstant]);
	coord.push([coord[2][0], coord[2][1]+thickness]);
	coord.push([coord[1][0], coord[1][1]+thickness]);
	coord.push([coord[0][0], coord[0][1]+thickness]);

	var pathString = "";
	for(var i=0; i<coord.length; i++){
		pathString += Math.round(coord[i][0]).toString() + " " +  Math.round(coord[i][1]).toString() + " ";
	}
	console.log(pathString);
	return pathString;
}

function keepAspectRatioByAdjustingHeight(aspect, element){
	//aspect is width/height
	function adjustHeight(){
//		var height = getViewPortHeight();
		var width = getViewPortWidth();
		var newHeight = (1/aspect)*width;
		element.height(Math.floor(newHeight));
	}
	adjustHeight();
	$(window).resize(adjustHeight);



}



//main
(function(){
	var maskAspectRatio = 800/402;
	console.log("javascript initialized!");
	linkElementToViewPortHeight($('.cover'));
	linkElementToViewPortHeight($('.content'));
	keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.transition'));
})();