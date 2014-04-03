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

//function createArrowPath(thickness){
//	//thickness in pixels
//	var width = getViewPortWidth();
//	//var trigConstant =  Math.sqrt(3)*(width/2); //tan(pi/6)*(width/2)
//	var trigConstant = (1.73205080757/3)*(width/2);
//	var coord = new Array();
//	coord.push([0,  trigConstant]);
//	coord.push([width/2, 0]);
//	coord.push([width, trigConstant]);
//	coord.push([coord[2][0], coord[2][1]+thickness]);
//	coord.push([coord[1][0], coord[1][1]+thickness]);
//	coord.push([coord[0][0], coord[0][1]+thickness]);
//
//	var pathString = "";
//	for(var i=0; i<coord.length; i++){
//		pathString += Math.round(coord[i][0]).toString() + " " +  Math.round(coord[i][1]).toString() + " ";
//	}
//	console.log(pathString);
//	return pathString;
//}

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

function createTriangularTextWrappingSpace(element, resolution, angleOfPoint){
	//element refers to the text element not the containing element.
	//this function assumes that the text element is within a containing element.
	//it will double the height of the containing element to make up for lost text
	//area that is cutoff by the triangle.
	//creates triangular text wrapping space by floating divs left and right.
	//angleofpoint refers to the point at the bottom tip of the triangle.
	//resolution refers to the 'steps' or the height of each div in the triangle.
	var parent = element.parent();

	//doubling height
	element.height(element.height()*1.2);
	//typically you would double the height but text area is lost faster then
	//2x due to word wrapping.

	var lineHeight = resolution;
	var height = parent.height();
	var width = parent.width();
	if (typeof angleOfPoint === 'undefined'){
		angleOfPoint = Math.PI-2*Math.atan((height*4)/width);
	}

	var trigConstant = Math.tan((Math.PI-angleOfPoint)/2);
	var wholeConstant = (lineHeight*100)/(trigConstant*width);
	var totalHeight = trigConstant*(width/2);
	var totalElements = Math.floor(totalHeight/lineHeight);



	for(var i = totalElements; i > 0; i--){
		var leftdiv = document.createElement('div');

		$(leftdiv).css({
			'float':'left',
			'height':lineHeight.toString(),
			'width':  Math.floor(i*wholeConstant).toString() + '%',
			'clear':'left'
		});

		var rightdiv = document.createElement('div');
		$(rightdiv).css({
			'float':'right',
			'height':lineHeight.toString(),
			'width': Math.floor(i*wholeConstant).toString() + '%',
			'clear':'right'
		});

		var cleardiv = document.createElement('div');
		$(cleardiv).css({
			'clear':'both'
		});

		parent.prepend(rightdiv);
		parent.prepend(leftdiv);


	}

}

//main
(function(){
	var maskAspectRatio = 800/402;
	console.log("javascript initialized!");
	linkElementToViewPortHeight($('.cover'));
	linkElementToViewPortHeight($('.content'));
	keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.transition'));
	createTriangularTextWrappingSpace($('#about'), 10);
})();