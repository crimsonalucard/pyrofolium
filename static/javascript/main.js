/**
 * Created by brian on 3/9/14.
 */

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

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

function keepAspectRatioByAdjustingHeight(aspect, element){
	//aspect is width/height
	function adjustHeight(){
//		var height = getViewPortHeight();
		var width = element.width();
		var newHeight = (1/aspect)*width;
		element.height(Math.floor(newHeight));
	}
	adjustHeight();
	$(window).resize(adjustHeight);



}

function verticalCenter(innerElement){

	function syncCenter(){
		var outerHeight = $(innerElement).parent().height();

		$(innerElement).css({
			top: Math.floor(outerHeight/2),
			"margin-top": -$(innerElement).height()/2,
			position: "absolute",
			padding: "5px"
		});
	}

	syncCenter();

	$(window).resize(syncCenter);


}

function createTriangularTextWrappingSpace(element, resolution, angleOfPoint){
	//element refers to the text element not the containing element.
	//this function assumes that the text element is within a containing element.
	//it will double the height of the containing element to make up for lost text
	//area that is cutoff by the triangle.
	//creates triangular text wrapping space by floating divs left and right.
	//angleofpoint refers to the point at the bottom tip of the triangle.
	//resolution refers to the 'steps' or the height of each div in the triangle.
	function sync(){

		$(".trispacer").remove();
		var parent = element.parent();

		keepAreaOfElementTheSameByAdjustingHeight(parent, 340000);

		//doubling height
//		element.height(element.height() *0.64);
		//typically you would double the height but text area is lost faster then
		//2x due to word wrapping.

		var lineHeight = resolution;
		var height = parent.height();
		var width = parent.width();
		if (typeof angleOfPoint === 'undefined'){
			angleOfPoint = Math.PI-2*Math.atan((height*3.1)/width);
		}

		var trigConstant = Math.tan((Math.PI-angleOfPoint)/2);
		var wholeConstant = (lineHeight*100)/(trigConstant*width);
		var totalHeight = trigConstant*(width/2);
		var endingElement = Math.ceil(height/lineHeight);
		var beginningElement = Math.ceil(totalHeight/lineHeight);



		for(var i = beginningElement; i >= beginningElement-endingElement; i--){
			var leftdiv = document.createElement('div');

			if(Math.floor(i*wholeConstant) > 50){
				continue;
			}

			$(leftdiv).css({
				'float':'left',
				'height':lineHeight.toString(),
				'width':  Math.floor(i*wholeConstant).toString() + '%',
				'clear':'left'
			}).addClass("trispacer");

			var rightdiv = document.createElement('div');
			$(rightdiv).css({
				'float':'right',
				'height':lineHeight.toString(),
				'width': Math.floor(i*wholeConstant).toString() + '%',
				'clear':'right'
			}).addClass("trispacer");

			parent.prepend(rightdiv);
			parent.prepend(leftdiv);
		}

		var cleardiv = document.createElement('div');
		$(cleardiv).css({
			'clear':'both'
		}).addClass("trispacer");
		parent.append(cleardiv);
	}
	sync();
	$(window).resize(function(){
		sync();
	});

}

function createMaskedImage(i, width, backimage, backmask, borderWidth){

	var div = document.createElement('div');
	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
	var div2 = document.createElement('div');
	var maskid = "hexagonmask" + i.toString();
	var borderIncrement = 2/Math.sqrt(3)*borderWidth;
	var hexagonWidth = width;
	var height = width*Math.sqrt(3)/2;
	var hexagonEdgeWidth = height*Math.sqrt(3)/2;

	div = $(div).css({
		height:Math.ceil(height),
		width:Math.ceil(hexagonWidth),
		position:"absolute",
		top: i%2? 0:Math.ceil(height/2),
		left:Math.ceil((i*hexagonEdgeWidth)+(i*borderIncrement))
	}).addClass("hexagon");

	svg = $(svg).attr({
		height: '100%',
		width: '100%'
	});

	mask = $(mask).attr({
		id:maskid
	});

	//you must directly access the dom node because jquery converts to lowercase
	mask[0].setAttribute('maskUnits',"userSpaceOnUse");
	mask[0].setAttribute('maskContentUnits', "userSpaceOnUse");

	image = $(image).attr({
		width:"100%",
		height:"100%",
		"xlink:href":backmask
	});

	 foreignObject = $(foreignObject).attr({
		width:"100%",
		height:"100%",
		style:"mask: url(#"+maskid+");"
	});
	div2 = $(div2).css({
		"background-color": "#D2CCC9",
		"background-image": 'url("'+backimage+'")',
		"background-attachment": "fixed",
		"background-repeat": "no-repeat",
		"background-position": "center",
		"-webkit-mask-image": 'url('+backmask+')',
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-size": "auto 100%",
		"-webkit-mask-position-x": "50%",
		"width": "100%",
		"height": "100%",
		"position": "absolute"
	});

	//create structure

	$(foreignObject).prepend(div2);
	$(mask).prepend(image);
	$(defs).prepend(mask);
	$(svg).prepend(foreignObject);
	$(svg).prepend(defs);
	$(div).prepend(svg);


	//return div;

	//there is a bug in firefox that will now allow it to render
	//mask svg elements when generated by javascript DOM. Instead
	//shove it into the dom via a string and use$().html()...

	return div.prop('outerHTML');
}


function createTransitionSlide(aspect, width, element, alpha){

	var randomID=guid();

	var section = document.createElement('section');
	var sizeDiv = document.createElement('div');
	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');

	$(section).css({
		"overflow":"hidden",
		"width": "100%",
		"position": "relative",
		"-webkit-mask-image": "url(static/images/triangle.png)",
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%"
	});

	$(section).attr('class', 'js-generated');

	function keepAspectByChanggingHeight(element){
		$(element).height(Math.floor((1/aspect)*getViewPortWidth()));
	}

	keepAspectByChanggingHeight($(section));

	//bind the above value with resizing...
	$(window).resize(keepAspectByChanggingHeight($(section)));



	$(sizeDiv).css({
		"width":width,
		"margin-left": (-(width/2)).toString()+"px",
		"position":"absolute",
		"left":"50%",
		"bottom":"0%"
	});

	$(sizeDiv).height(Math.floor((1/aspect)*width));

	svg = $(svg).attr({
		height: '100%',
		width: '100%',
		id: 'triangle'+randomID
	});

	mask = $(mask).attr({
		id:"trianglemask"+randomID
	});

	//you must directly access the dom node because jquery converts to lowercase
	mask[0].setAttribute('maskUnits',"userSpaceOnUse");
	mask[0].setAttribute('maskContentUnits', "userSpaceOnUse");

	image = $(image).attr({
		width:"100%",
		height:"100%",
		"xlink:href": "static/images/triangle.png"
	});

	 foreignObject = $(foreignObject).attr({
		width:"100%",
		height:"100%",
		style:"mask: url(#trianglemask"+randomID+");"
	});



	var section1 = document.createElement('section');
	var svg1 = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var defs1 = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask1 = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	var image1 = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var foreignObject1 = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
	var div1 = document.createElement('div');

	$(section1).css({
		"-webkit-mask-image": "url(static/images/triangle.png)",
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%",
		"background-color": "#D2CCC9",
		"background-image": "url(static/images/no_cube.jpg)",
		"background-attachment": 'fixed',
		"background-repeat": 'no-repeat',
		"background-size": "100%",
		"background-position": "top"
	});

	$(section1).height(Math.floor((1/aspect)*width));


	svg1 = $(svg1).attr({
		height: '100%',
		width: '100%',
		id: "arrow"
	});

	mask1 = $(mask1).attr({
		id:"arrowmask"+randomID
	});

	//you must directly access the dom node because jquery converts to lowercase
	mask1[0].setAttribute('maskUnits',"userSpaceOnUse");
	mask1[0].setAttribute('maskContentUnits', "userSpaceOnUse");

	image1 = $(image1).attr({
		width:"100%",
		height:"100%",
		"xlink:href": "static/images/arrow.png"
	});

	foreignObject1 = $(foreignObject1).attr({
		width:"100%",
		height:"100%",
		style:"mask: url(#arrowmask"+randomID+");"
	});

	$(div1).css({
		"background-color": "#D2CCC9",
		"background-image": 'url(static/images/cover_cubes.jpg)',
		"background-attachment": 'fixed',
		"background-repeat": 'no-repeat',
		"background-position": 'center',
		"-webkit-mask-image": "url(static/images/arrow.png)",
		"-webkit-mask-repeat": 'no-repeat',
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%"
	});

  	$(div1).height(Math.floor((1/aspect)*width));


	$(foreignObject1).append(div1);
	$(mask1).append(image1);
	$(defs1).append(mask1);
	$(svg1).append(defs1).append(foreignObject1);
	$(section1).append(svg1);
	$(foreignObject).append(section1);
	$(mask).append(image);
	$(defs).append(mask);
	$(svg).append(defs).append(foreignObject);
	$(sizeDiv).append(svg);
	$(section).append(sizeDiv);

	element.replaceWith(section);


	if(alpha===false){
		$(section1).css({
			"background-image":"none"
		})
	}

	//rerender to fix firefox bug...
	$(section).html(
		$(section).html()
	);
}

function createHexagonChain(element, amount, borderWidth){
	var width = element.parent().width();
	var hexagonWidth = (width-((amount*borderWidth)+1))/amount;
	var hexagonHeight = hexagonWidth*Math.sqrt(3)/2;
	var chainWidth = Math.ceil(amount*(hexagonWidth - hexagonWidth/4) + (amount+1)*borderWidth);

	var container = document.createElement('div');
	$(container).width(chainWidth).height(Math.ceil(hexagonHeight*1.5)).css({
		position: "absolute",
		left: "50%",
		"margin-left": -Math.ceil(chainWidth/2)
	}).attr("id","hexagonChain");

	for(var i = 0; i<amount; i++){

		var hexagon = createMaskedImage(
			i,
			Math.floor(hexagonWidth),
			"static/images/cover_cubes.jpg",
			"static/images/hexagon_small.png",
			borderWidth);

		$(container).html(
			$(container).html() + hexagon
		);
	}

	$('#work').append(
		container
	);

	verticalCenter($(container));



	var hexagons = (function generateHexagonSelectors(amount, id){
		var hexagons = Array();
		for(var i = 0; i< amount; i++){
			hexagons[i] = "#"+id+i.toString();
		}
		return hexagons;
	})(amount, "hexagonmask");


	$(".hexagon").each(function(index, element){

		var originalWidth = $(element).width();
		var orginalHeight = $(element).height();

		$(element).mouseover(function(eventObject){
			$(element).animate({
				height:orginalHeight*3,
				width:originalWidth*3
			});
		});

		$(element).mouseout(function(eventObject){
			$(element).animate({
				height:orginalHeight,
				width:originalWidth
			});
		});
	});




}

function fixedPositionOnScrollPast(element){
	var placeholderElement = document.createElement('div');
	$(placeholderElement).height(element.height()).width(element.width()).css("position","relative");
	var scrollMarker = element.offset().top;
	var initialScrollPosition;


	function scrollDownHandler(){
		if($(document).scrollTop() >= scrollMarker){
			$(window).unbind("scroll", scrollDownHandler);
			$(window).scroll(scrollUpHandler);
			$(element).css({
				"position":"fixed",
				"top":0
			});
			$(element).after(placeholderElement);


		}
	}

	function scrollUpHandler(){
		if($(document).scrollTop() < scrollMarker){
			$(window).unbind("scroll", scrollUpHandler);
			$(window).scroll(scrollDownHandler);
			$(element).css({
				"position":"relative",
				"top":0
			});
			$(placeholderElement).remove();

		}
	}

	function initialize(){
		$(window).unbind("scroll", scrollDownHandler);
		$(window).unbind("scroll", scrollUpHandler);
		initialScrollPosition = $(document).scrollTop();
		if(initialScrollPosition < scrollMarker){
			$(window).scroll(scrollDownHandler);
		}
		else{
			$(window).scroll(scrollUpHandler);
		}
	}

	initialize();

	$(window).resize(initialize);
}

function keepAreaOfElementTheSameByAdjustingHeight(element, area){
	$(element).height(Math.ceil(area/$(element).width()));
}


function scrollPastAndSlideUp(element, aspect, elementTrigger){


	var marker;
	var initialScrollPoint = $(document).scrollTop();
	var heightToBeMoved;
	if(elementTrigger){
		marker = $(elementTrigger).offset().top;
		heightToBeMoved = -2*Math.ceil((1/aspect)*$(elementTrigger).width());
	}
	else{
		marker = $(element).offset().top;
		heightToBeMoved = -2*Math.ceil((1/aspect)*$(element).width());
	}
	console.log(aspect);
	console.log($(element).width());

	function scrollDownPastHandler(){
		if($(document).scrollTop() > marker){
			$(window).unbind("scroll", scrollDownPastHandler);
			$(window).scroll(scrollUpPastHandler);
			$(element).animate({
				"background-position-y":heightToBeMoved.toString()+"px"
			}, 400);
		}
	}

	function scrollUpPastHandler(){
		if($(document).scrollTop() <= marker){
			$(window).unbind("scroll", scrollUpPastHandler);
			$(window).scroll(scrollDownPastHandler);
			$(element).animate({
				"background-position-y":"0px"
			});
		}
	}

	if(initialScrollPoint <= marker){
		$(element).css({
			"background-position-y":"0px"
		});
		$(window).scroll(scrollDownPastHandler);
	}
	else {
		$(element).css({
			"background-position-y":heightToBeMoved.toString()+"px"
		});
		$(window).scroll(scrollUpPastHandler);
	}
}

function coreSkills(element){
	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	$(element).children();
}

function drawArc(radius, width, height, startingAngle, angle){
	function findAngleX(angle){
		return width/2 + radius*Math.sin(angle);
	}

	function findAngleY(angle, color, thickness){
		return height/2 - radius*Math.cos(angle);
	}

	var x1 = findAngleX(startingAngle);
	var x2 = findAngleX(angle);
	var y1 = findAngleY(startingAngle);
	var y2 = findAngleY(angle);
	var path =  document.createElementNS("http://www.w3.org/2000/svg", 'path');
	$(path).attr({
		"d":"M "+x1.toString()+" "+y1.toString()+", A "+x2.toString()+" "+y2.toString(),
		"fill":"none",
		"stroke-width":thickness,
		"stroke":color
	});
	return path
}

function addSpecialEffects(){

}


//main
(function(){
	var maskAspectRatio = 800/402;
	var backGroundAspectRatio = 1920/1426;


	console.log("javascript initialized!");
	linkElementToViewPortHeight($('.cover'));
	linkElementToViewPortHeight($('.content'));
	keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.transition'));
	createTriangularTextWrappingSpace($('#about'), 25);
	keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.center800'));
	keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.inner-transition'));
	createTransitionSlide(maskAspectRatio, 800, $("#transition-slide1"));
	createTransitionSlide(maskAspectRatio, 800, $("#transition-slide2"));
	createTransitionSlide(maskAspectRatio, 800, $("#transition-slide3"), false);
	fixedPositionOnScrollPast($("#aboutme"));
	createHexagonChain($("#work"),7, 10);
	fixedPositionOnScrollPast($("#skills"));
	scrollPastAndSlideUp($("#skills"), backGroundAspectRatio);
	scrollPastAndSlideUp($('#transition-slide2'), backGroundAspectRatio, $('#skills'));
	scrollPastAndSlideUp($("#aboutme"), backGroundAspectRatio, $("#skills"));
})();