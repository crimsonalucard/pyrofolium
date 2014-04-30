/**
 * Created by brian on 3/9/14.
 */

//animate bgposition jquery plugin
$.fn.animateBG = function(x, y, speed) {
    var pos = this.css('background-position').split(' ');
    this.x = pos[0] || 0,
    this.y = pos[1] || 0;

    $.Animation( this, {
        x: x,
        y: y
      }, {
        duration: speed
      }).progress(function(e) {
          this.css('background-position', e.tweens[0].now+'px '+e.tweens[1].now+'px');
    });
    return this;
}

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
		var innerHeight = $(innerElement).outerHeight();

		$(innerElement).css({
			"top": "50%",
			"position": "absolute"
//			"height": innerHeight
		}).css({
			"margin-top": Math.ceil(-innerHeight/2)
		})
	}

	syncCenter();

	$(window).resize(syncCenter);
}

function horizontalCenter(innerElement){
	function syncCenter(){
		var outerWidth = $(innerElement).parent().width();
		var innerWidth = $(innerElement).width();
		$(innerElement).css({
			"left": "50%",
			"position": "absolute",
			"width": innerWidth
		}).css({
			"margin-left":-Math.ceil(innerWidth/2)
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
		var parent = element.parent().parent();

		keepAreaOfElementTheSameByAdjustingHeight(parent, 600000);

		//doubling height
//		element.height(element.height() *0.64);
		//typically you would double the height but text area is lost faster then
		//2x due to word wrapping.

		var lineHeight = resolution;
		var height = parent.height();
		var width = parent.width();
		if (typeof angleOfPoint === 'undefined'){
			angleOfPoint = Math.PI-2*Math.atan((height*2.2)/width);
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

function isString(variable){
	if( Object.prototype.toString.call(variable) == '[object String]') {
    	return true;
	}else{
		return false;
	}
}

function createArrowTransitionSlide(aspect, width, element, alpha, backgroundImage, secondBackgroundImage, firstMask, secondMask){

	var negativeHalfWidth =  (-(width/2)).toString()+"px";
	if(isString(width) && width.slice(-1) === '%'){
		var widthNum = parseInt(width.slice(0,-1));
		negativeHalfWidth = (-Math.ceil(widthNum/2)).toString()+'%'

	}

	if(secondBackgroundImage){
		secondBackgroundImage = "url("+secondBackgroundImage+")";
	}else{
		secondBackgroundImage = "url(static/images/no_cube.jpg)";
	}


	var randomID=guid();

	var section = document.createElement('section');
	var sizeDiv = document.createElement('div');
	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');

	var firstMaskString = "url(static/images/arrow.png)";
	var secondMaskString = "url(static/images/triangle.png)";
	if(firstMask){
		firstMaskString = "url("+firstMask+")";
	}
	else{
		firstMask = "static/images/arrow.png";
	}
	if(secondMask){
		secondMaskString = "url("+secondMask+")";
	}
	else{
		secondMask = "static/images/triangle.png";
	}


	$(section).css({
		"overflow":"hidden",
		"width": "100%",
		"position": "relative",
		"-webkit-mask-image": secondMaskString,
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%",
		"pointer-events": "none"
	});

	$(section).attr({
		'class':'js-generated',
		'id':$(element).attr("id")
	});

	function keepAspectByChanggingHeight(element){
		$(element).height(Math.floor((1/aspect)*getViewPortWidth()));
	}

	keepAspectByChanggingHeight($(section));

	//bind the above value with resizing...
	$(window).resize(keepAspectByChanggingHeight($(section)));



	$(sizeDiv).css({
		"width":width,
		"margin-left": negativeHalfWidth,
		"position":"absolute",
		"left":"50%",
		"bottom":"0%",
		"pointer-events": "none"
	});
	if(isString(width)){
		$(sizeDiv).height(Math.floor((1/aspect)*$(window).width()));
	}else{
		$(sizeDiv).height(Math.floor((1/aspect)*width));
	}

	svg = $(svg).attr({
		height: '100%',
		width: '100%',
		id: 'triangle'+randomID,
		"pointer-events": "none"
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
		"xlink:href": secondMask
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
		"-webkit-mask-image": secondMaskString,
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%",
		"background-color": "#D2CCC9",
		"background-image": secondBackgroundImage,
		"background-attachment": 'fixed',
		"background-repeat": 'no-repeat',
		"background-size": "100%",
		"background-position": "top",
		"pointer-events": "none"
	});

	$(section1).height(Math.floor((1/aspect)*width));


	svg1 = $(svg1).attr({
		height: '100%',
		width: '100%',
		id: "arrow",
		"pointer-events": "none"
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
		"xlink:href":firstMask
	});

	foreignObject1 = $(foreignObject1).attr({
		width:"100%",
		height:"100%",
		style:"mask: url(#arrowmask"+randomID+");"
	});

	var backgroundString =  'url(static/images/cover_cubes.jpg)';
	if(backgroundImage){
		backgroundString = 'url('+backgroundImage+')';
	}

	$(div1).css({
		"background-color": "#D2CCC9",
		"background-image": backgroundString,
		"background-attachment": 'fixed',
		"background-repeat": 'no-repeat',
		"background-position": 'center',
		"-webkit-mask-image": firstMaskString,
		"-webkit-mask-repeat": 'no-repeat',
		"-webkit-mask-position-x": "50%",
		"-webkit-mask-position-y": "100%",
		"-webkit-mask-size": "100%",
		"pointer-events": "none"
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
	var hexagonWidth = (width-((amount*borderWidth)+1))/amount/2;
	var hexagonHeight = hexagonWidth*Math.sqrt(3)/2;
	var chainWidth = Math.ceil(amount*(hexagonWidth - hexagonWidth/4) + (amount+2)*borderWidth);
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

		$(hexagon).attr('id', 'hexagon'+i.toString());

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

	function BulgeEffectOnHexagons(originElement, prevElementHeight, prevElementWidth, originalWidth, originalHeight, limit, decayFunction, inverseDecayFunction, accumalatedXOffset, accumulatedYOffset, right){
		var indexOfOrigin = $(originElement).index();
		if( indexOfOrigin>=limit || indexOfOrigin<0)
		{
			return;
		}


		var newHeight = decayFunction(prevElementHeight);
		var newWidth = decayFunction(prevElementWidth);

		var currentIndex = $(originElement).index();

		var currentYOffset = parseInt($(originElement).css("top").slice(0,-2));
		var shiftYOffset = -(newHeight-originalHeight)/2;

		var finalYOffset = currentYOffset + shiftYOffset + accumulatedYOffset;
		accumulatedYOffset = currentIndex%2===0? accumulatedYOffset+shiftYOffset : accumulatedYOffset-shiftYOffset;

		var currentXOffset = parseInt($(originElement).css("left").slice(0,-2));
		var shiftXOffset = right === true? -(newWidth-originalWidth)/2 : (newWidth-originalWidth)/2;

		var finalXOffset =  currentXOffset + shiftXOffset + accumalatedXOffset;
		accumalatedXOffset -= shiftXOffset;



		$(originElement).stop(true, false).animate({
			height:newHeight,
			width:newWidth,
			left:finalXOffset,
			top: finalYOffset
		});


		//var indexOfNext = right===true? indexOfOrigin+1 : indexOfOrigin-1;
		var nextElement = right===true ? $(originElement).next() : $(originElement).prev();

		BulgeEffectOnHexagons(nextElement, newHeight, newWidth, originalWidth, originalHeight, limit, decayFunction, inverseDecayFunction, accumalatedXOffset, accumulatedYOffset, right);

	}

	var sizeIncrease = 3;
	$(".hexagon").each(function(index, element){

		var originalWidth = $(element).width();
		var originalHeight = $(element).height();
		var originalXOffset = parseInt($(element).css('left').slice(0,-2));
		var originalYOffset = parseInt($(element).css('top').slice(0,-2));
		var centerXoffset = originalWidth*(sizeIncrease-1)/2;
		var centerYoffset = originalHeight*(sizeIncrease-1)/2;
		var totalXoffset = originalXOffset-centerXoffset;
		var totalYoffset = originalYOffset-centerYoffset;
		$.data(element, "originalXOffset", originalXOffset);
		$.data(element, "originalYOffset", originalYOffset);

		$(element).mouseover(function(eventObject){
			$(element).css({
				"z-index":99
			}).stop(true, false).animate({
				height:originalHeight*sizeIncrease,
				width:originalWidth*sizeIncrease,
				left:totalXoffset,
				top:totalYoffset
			},{
				"start":function(){

					function decay(input){
						return input*0.75;
					}

					function inverseDecay(input){
						return input/0.75;
					}
					BulgeEffectOnHexagons(
						$(this).next(),
						originalHeight*sizeIncrease,
						originalWidth*sizeIncrease,
						originalWidth,
						originalHeight,
						amount,
						decay,
						inverseDecay,
						centerXoffset,
						$(this).index()%2===0? -centerYoffset : centerYoffset,
						true
					);
					BulgeEffectOnHexagons(
						$(this).prev(),
						originalHeight*sizeIncrease,
						originalWidth*sizeIncrease,
						originalWidth,
						originalHeight,
						amount,
						decay,
						inverseDecay,
						centerXoffset,
						$(this).index()%2===0? -centerYoffset : centerYoffset,
						false
					);
				}
			});
		});

		$(element).mouseout(function(eventObject){
			//reset the size and offset of every hexagon...
					$(".hexagon").css("z-index", 98).each(function(index, element){
						$(element).animate({
							left: $.data(element, "originalXOffset"),
							top: $.data(element, "originalYOffset"),
							width: originalWidth,
							height: originalHeight
						})
					});

			});
		});




}

function fixedPositionOnScrollPast(element){
	var placeholderElement = document.createElement('div');
	$(placeholderElement).height(element.height()).width(element.width()).css({
		"position":"relative",
		"pointer-events": "none"
	});

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

function scrollPastAndHandle(element, elementTrigger, handlerDown, handlerUp){
	var marker;
	var initialScrollPoint = $(document).scrollTop();
	if(elementTrigger){
		marker = $(elementTrigger).offset().top;
	}
	else{
		marker = $(element).offset().top;
	}

	function scrollDownPastHandler(){
		if($(document).scrollTop() >= marker){
			$(window).unbind("scroll", scrollDownPastHandler);
			$(window).scroll(scrollUpPastHandler);
			handlerDown();
		}
	}

	function scrollUpPastHandler(){
		if($(document).scrollTop() <= marker){
			$(window).unbind("scroll", scrollUpPastHandler);
			$(window).scroll(scrollDownPastHandler);
			handlerUp();
		}
	}

	if(initialScrollPoint <= marker){
		$(window).scroll(scrollDownPastHandler);
	}
	else {
		$(window).scroll(scrollUpPastHandler);
	}
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

	function scrollDownPastHandler(){
		if($(document).scrollTop() >= marker){
			$(window).unbind("scroll", scrollDownPastHandler);
			$(window).scroll(scrollUpPastHandler);
//			$(element).animate({
//				"background-position-y":heightToBeMoved.toString()+"px"
//			}, 400);
			$(element).css({"background-position": "0 0"}).stop(true, false).animateBG(0, heightToBeMoved, 2000);
		}
	}

	function scrollUpPastHandler(){
		if($(document).scrollTop() <= marker){
			$(window).unbind("scroll", scrollUpPastHandler);
			$(window).scroll(scrollDownPastHandler);
			$(element).css({"background-position": "0 "+heightToBeMoved}).stop(true, false).animateBG(0, 0, 2000);
		}
	}

	if(initialScrollPoint <= marker){
		$(element).css({
			"background-position":"0 0"
		});
		$(window).scroll(scrollDownPastHandler);
	}
	else {
		$(element).css({
			"background-position-y":"0 "+heightToBeMoved.toString()
		});
		$(window).scroll(scrollUpPastHandler);
	}
}

function wheel(input, limit){

	var finalValue = input;

	if(input>=limit){
		finalValue = input%limit;
	}
	else if(input < 0 && input > -limit){
		finalValue = limit + input;
	}else if(input < -limit){
		finalValue = limit - (-input)%limit;
	}
	return finalValue;
}

function cliff(input, limit){
	if(input<0 ||input>=limit){
		throw "You reached an index that doesn't exist. Error."
	}
}

function normalDistribution(x, mean, standdev){
	return Math.exp(-(x-mean)*(x-mean)/(2*standdev*standdev))/(standdev*Math.sqrt(2*Math.PI));
}

function coreSkillsSlide(element, radius, thickness, resolution){

	////-note to self this function is unreadable.. fix later.
	//note width and height must be in pixels units!!
	var width = window.innerWidth;
	var height= window.innerHeight;

	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

	$(svg).attr({
		"width":width,
		"height":height
	});

	$(svg).css({
		"position":"absolute",
		"left": "50%",
		"top":"50%",
		"margin-top":-Math.ceil(height/2),
		"margin-left":-Math.ceil(width/2)
	});

	//make a soft gradient to create depth...
	var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	$(rect).attr({
		fill:"url(#radial)",
		width:"100%",
		height:"100%"
	});

	var stop0 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
	var stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');


	var radialGradient = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradient');
	$(radialGradient).attr({
		cx:"50%",
		cy:"50%",
		r:"50%",
		fx:"50%",
		fy:"50%",
		id:"radial"
	});
	$(svg).append(radialGradient).append(rect);


	var arcObjectArray = Array();
	for(var index = 0; index < resolution; index++){
		var startAngle = ((2*Math.PI)/resolution)*index;
		var endAngle =  (((2*Math.PI)/resolution)*(index+1));
		var color = colorCycler(index*(255*3)/(resolution));
		arcObjectArray[index] = drawArc(radius, width, height, startAngle, endAngle, 0, color, "colorCircle"+index.toString(), "colorCircle");
		$(svg).append(arcObjectArray[index].path);
	 }

	$(element).after(svg);

	function initializeRing(totalMilliseconds){
		return function(){
			for(var index = 0; index < resolution; index++){
					$("#colorCircle"+index.toString()).delay(index*totalMilliseconds/resolution).animate(
						{
							"stroke-width":thickness
						},
						{
							"complete":function(){
								if($(this).index() === resolution-1){
									startWaveOnHover();
								}
							},
							"always":function(){
								$(this).animate({
									"stroke-width":thickness
								});
							},
							"progress":function(promise, progress, remainingM){
//								var idNum = $(this).index();
//
//								$(this).attr({
//									"transform":"rotate("+remainingM/2+", "+arcObjectArray[idNum].x+", "+arcObjectArray[idNum].y+")"
//										+ "translate("+remainingM/2 +", "+remainingM/2+")"
//
//								});
							},
							"duration":200
						}
					);
			 }
		}
	}

	function deinitilializeRing(){
		$(".colorCircle").off();
		$(".colorCircle").stop(true, false).animate({
			"stroke-width":0
		});
	}

	function makeListInvisible(){
		$(element).children('ul').children('li').dequeue().fadeTo(1, 0);
	}
	makeListInvisible();

	function lockscrolling(){
		// lock scroll position, but retain settings for later
		var scrollPosition = [
		self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
		];
		var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
		html.data('scroll-position', scrollPosition);
		html.data('previous-overflow', html.css('overflow'));
		html.css('overflow', 'hidden');
		window.scrollTo(scrollPosition[0], scrollPosition[1]);
	}

	function unlockscrolling(){
	  // un-lock scroll position
      var html = jQuery('html');
      var scrollPosition = html.data('scroll-position');
      html.css('overflow', html.data('previous-overflow'));
      window.scrollTo(scrollPosition[0], scrollPosition[1])
	}

	function listOutElements(delay, callbackOnComplete){
		//let it only run once!
		var triggered = false;

		return function(){
			if(triggered === false)
			{
				lockscrolling();
				triggered = true;
				$("#skills").off();
				$(element).children('ul').children('li').dequeue();
				makeListInvisible();
				var accumulator = 0;
				$(element).children('ul').children('li').each(function(index, element){
					accumulator += delay;
					var copy = accumulator;
					$(element).delay(copy).fadeTo(400, 1);
				});
				setTimeout(callbackOnComplete, accumulator);
				setTimeout(unlockscrolling, accumulator+500);
			}

		}
	}

//	console.log($("#transition-slide3"));
//	scrollPastAndHandle($('#skills'), $("#transition-slide2"),  function(){ deinitilializeRing(); makeListInvisible();}, listOutElements(400, initializeRing(500)));
//	scrollPastAndHandle($("#skills"), $("#skills"), listOutElements(400, initializeRing(500)), deinitilializeRing);
//	scrollPastAndHandle($("#skills"), $("#transition-slide3"), function(){ deinitilializeRing(); makeListInvisible();},  listOutElements(400, initializeRing(500)));
	scrollPastAndHandle($("#skills"), $('#skills'), listOutElements(200, initializeRing(500)), function(){/*do nothing*/});


//	function bulgeOnHover(){
////		This just provided a sort of bulge effect on the circle
////		I am canning this in favor of a wave effect function.
//		$(".colorCircle").each(function(index, element){
//			$(element).mouseenter(
//				function(){
//					$(".colorCircle").stop(true, false);
//					var id = $(element).attr("id");
//					var idNum = parseInt(id.slice(11));
//
//					$(element).animate({
//						"stroke-width":4*radius*normalDistribution(0,0,6)+thickness
//					}, 100);
//
//
//					for(var i = 0; i<hoverExtend; i++){
//						var iinc = i+1;
//						var reductionConstant = 4*normalDistribution(iinc, 0, 6);
//						var newID1 = "#colorCircle" + wheel(idNum+iinc, resolution);
//						var newID2 = "#colorCircle" + wheel(idNum-iinc, resolution);
//						$(newID1).animate({
//							"stroke-width":radius*reductionConstant+thickness
//						}, 100);
//						$(newID2).animate({
//							"stroke-width":radius*reductionConstant+thickness
//						}, 100);
//					}
//
//				}).mouseleave(
//					function(){
//						console.log("unbulging!");
//						$(".colorCircle").stop(true, false);
//						$(".colorCircle").animate({
//							"stroke-width":thickness
//						}, 800);
//					}
//			);
//		});
//	}


//	function makeCircleDotted(){
//		$(".colorCircle").each(function(index, element){
//			if(index%2===0){
//				$(this).animate({"stroke-opacity":0});
//			}
//		});
//	}
//
//	function makeCircleSolid(){
//		$(".colorCircle").animate({"stroke-opacity":1});
//	}

	function startWaveOnHover(){
		function wavefront(event, growthHeight, delay, transferDelay, decayFunction, id, goingRight){
			if(growthHeight < thickness){
				return;
			}

			$("#colorCircle"+id).stop(true, false).animate({
				"stroke-width":growthHeight//+parseInt($("#colorCircle"+id).css("stroke-width").slice(0,-2))
			},
			{
				"start":function(){
					$(this).delay(delay).animate({
				    	"stroke-width":thickness
					});

					var nextId;
					if(goingRight){
						nextId = wheel(id+1, resolution);
					}
					else{
						nextId = wheel(id-1, resolution);
					}

					setTimeout(function(){
						wavefront(event, decayFunction(growthHeight), delay, transferDelay, decayFunction, nextId, goingRight);
					}, transferDelay);
				},
				"duration":25
			}
			);
		}

		$(".colorCircle").each(function(index, element){
			 $(element).mouseover(function(){
				var idNum =  parseInt($(this).attr("id").slice(11));
				var decayFunction = function(x){return x*0.95;};
				$("#colorCircle"+idNum).stop(true, false).animate({
					"stroke-width":radius/3
				},{
					"start":function(){
						$(this).animate({
							"stroke-width":thickness
						});
					},
					"duration":25
				});
				wavefront(null, decayFunction(radius/3), 10, 10, decayFunction, wheel(idNum+1, resolution), true);
				wavefront(null, decayFunction(radius/3), 10, 10, decayFunction, wheel(idNum-1, resolution), false);
			 });
		});
	}
}

function colorCycler(colorLevel){
	//color must be a number from zero to 255*3

	if(colorLevel>255*3){
		colorLevel = colorLevel%(255*3);
	}

	if(colorLevel < 255){
		return "rgb("+Math.floor(255-colorLevel).toString()+", "+Math.floor(colorLevel).toString()+", 0)";
	}else if(colorLevel >= 255 && colorLevel < 2*255){
		return "rgb(0, "+Math.floor(255-(colorLevel-255)).toString()+", "+Math.floor(colorLevel-255).toString()+")";
	}else if(colorLevel >=  2*255){
		return "rgb("+Math.floor(colorLevel-(255*2)).toString()+", 0, "+Math.floor(255-(colorLevel-(255*2))).toString()+")";
	}

}

function drawArc(radius, width, height, startingAngle, angle, thickness, color, id, className){
	function findAngleX(angle){
		return width/2 + radius*Math.sin(angle);
	}

	function findAngleY(angle){
		return height/2 - radius*Math.cos(angle);
	}

	var x1 = findAngleX(startingAngle);
	var x2 = findAngleX(angle);
	var y1 = findAngleY(startingAngle);
	var y2 = findAngleY(angle);
	var path =  document.createElementNS("http://www.w3.org/2000/svg", 'path');
	path.setAttribute("d", "M "+x1.toString()+" "+y1.toString()+" A"+radius.toString()+" "+radius.toString()+" 0 0 1 "+x2.toString()+" "+y2.toString());
	path.setAttribute("fill", "none");
	path.setAttribute("stroke-width", thickness);
	path.setAttribute("stroke", color);
	path.setAttribute("id",id);
	path.setAttribute("class",className);

	return {
		"path":path,
		"x":x1,
		"y":y1
	};


}

function createTriangleTransitionSlide(element, color){
	function sync(){
		var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

		$(svg).attr({
			"width":$(window).width(),
			"height":$(window).height()
		});
		$(svg).css({
			"pointer-events":"none"
		})
		var path =  document.createElementNS("http://www.w3.org/2000/svg", 'path');
		$(path).attr({
			"fill":color,
			"d":"M0, "+$(window).height()+" L"+$(window).width()/2+", "+$(window).height()*0.65+" L"+$(window).width()+", "+$(window).height()+" Z"
		});

		$(svg).append(path);
		$(element).html("");
		$(element).append(svg);
	}
	sync();
	$(window).resize(sync);
}

function scrolling(){
	function scrollTo(element){
		return function(){
			$('html, body').animate({
				scrollTop: $(element).offset().top
			}, 2000);
		}
	}

	$(".scrollbutton").hover(function(){
		$(this).css({
			'cursor':"pointer"
		})
	},function(){
		$(this).css({
			'cursor':"default"
		})
	});
	$("#scrollbutton1").click(scrollTo($("#aboutme")));
	$("#scrollbutton2").click(scrollTo($("#skills")));
	$("#scrollbutton3").click(scrollTo($("#work")));
	$("#scrollbutton4").click(scrollTo($("#contact")));
}

//main
(function(){
	$(document).ready(function(){
		var maskAspectRatio = 800/402;
		var backGroundAspectRatio = 1920/1426;
		console.log("javascript initialized!");
		linkElementToViewPortHeight($('.cover'));
		linkElementToViewPortHeight($('.content'));
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.transition'));
		createTriangularTextWrappingSpace($('#about'), 15);
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.center800'));
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.inner-transition'));
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide1"));
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide2"));
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide3"), false);
		fixedPositionOnScrollPast($("#aboutme"));
		createHexagonChain($("#work"),7, 10);
		fixedPositionOnScrollPast($("#skills"));
		fixedPositionOnScrollPast($("#work"));
		scrollPastAndSlideUp($("#skills"), backGroundAspectRatio);
//		scrollPastAndSlideUp($('#transition-slide2'), backGroundAspectRatio, $('#skills'));
//		scrollPastAndSlideUp($("#aboutme"), backGroundAspectRatio, $("#skills"));
		coreSkillsSlide($("#coreskills"), 200, 2, 200, 50);
		horizontalCenter($("#coreskills"));
		createTriangleTransitionSlide($("#transition-slide4"), "#2D2D3D");
		scrolling();
	});
})();