/*jslint browser: true*/
/*global $, jQuery, alert*/


//mobile check function
window.mobilecheck = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}


//measures the width of an element not yet inserted into the DOM
$.fn.measure = function (fn) {
	var el = $(this).clone(false);
	el.css({
		visibility: 'hidden',
		position: 'absolute',
		display: 'inline',
		"white-space": "nowrap"
	});
	el.appendTo('body');
	result = fn.apply(el);
	el.remove();
	return result;
}

function getInternetExplorerVersion() {
	//official code from the Microsoft does not account for
	//Windows 8 IE 9 "Netscape".
	//Typically it is better to use feature detection. However for
	//position: fixed there is a bug in IE 9 windows 8 that is not detectable
	//via feature detection...
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	else if (navigator.appName == 'Netscape') {
		var ua = navigator.userAgent;
		var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	return rv;
}

var walk_the_DOM = function walk(node, func) {
	func(node);
	node = node.firstChild;
	while (node) {
		walk(node, func);
		node = node.nextSibling;
	}
};

function changeFixedPositionToAbsoluteIfIE(element) {
	if (getInternetExplorerVersion() !== -1) {
		if ($(element).css("position") === "fixed") {
			$(element).css({"position": "absolute"});
		}
	}
}


function ieSpecificChecks() {
	//no feature detection for position fixed.

	function moveFixedDivIntoSection() {
		if (getInternetExplorerVersion() !== -1) {
			$("#front-content").appendTo("#first-section");
		}
	}

	function changeBodyBackgroundToAbsolute() {
		if (getInternetExplorerVersion() !== -1 && $('body').css("background-attachment") === "fixed") {
			$('body').css({
				"background-attachment": "scroll",
				"background-color": "#D2CCC9"
			});
		}
	}

	changeFixedPositionToAbsoluteIfIE($("#front-title"));
	changeFixedPositionToAbsoluteIfIE($("#scrollbutton1"));
	moveFixedDivIntoSection();
	changeBodyBackgroundToAbsolute();

	if (doesSVGForeignObjectExist() !== true) {
		$("#aboutme, #skills").css({
			"background-image": "none"
		});

		createTriangleTransitionSlide($("#transition-slide1"), "#B2ABAD");
		$("#aboutme").css({
			"background-color": "#B2ABAD"
		});
		createTriangleTransitionSlide($("#transition-slide2"), "#D2CCC9", false, "#D2CCC9", "#B2ABAD");
		$("#skills").css({
			"background-color": "#D2CCC9"
		})
		createTriangleTransitionSlide($("#transition-slide3"), "#B2ABAD", false, "#B2ABAD", "#D2CCC9");
		$("#work").css({
			"background-color": "#B2ABAD"
		});
		createTriangleTransitionSlide($("#transition-slide4"), "#2D2D3D", false, "#2D2D3D", "#B2ABAD");

	}


}

function doesSVGForeignObjectExist() {
	try {
		return SVGForeignObjectElement !== 'undefined'
	}
	catch (e) {
		return false;
	}
}


function ieFixedBackgroundFlickerhack() {
	//fix ie background flickering...
	try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch (err) {
	}
}

//animate bgposition jquery plugin
$.fn.animateBG = function (x, y, speed, complete) {
	if (getInternetExplorerVersion() === -1) {
		var pos = this.css('background-position').split(' ');
		this.x = pos[0] || 0;
		this.y = pos[1] || 0;

		$.Animation(this, {
			x: x,
			y: y
		}, {
			duration: speed,
			"complete": complete ? complete() : function () {
			}
		}).progress(function (e) {
			this.css('background-position', e.tweens[0].now + 'px ' + e.tweens[1].now + 'px');
		});
	}
	return this;
}

function lockscrolling() {
	var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that

	//check to see if scrolling is already locked! without this test there are cases where it unlockscrolling() will not
	//work
	if (html.css('overflow') !== "hidden") {
		// lock scroll position, but retain settings for later
		var scrollPosition = [
				self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
				self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
		];
		html.data('scroll-position', scrollPosition);
		html.data('previous-overflow', html.css('overflow'));
		html.css('overflow', 'hidden');
		window.scrollTo(scrollPosition[0], scrollPosition[1]);
	}
}

function unlockscrolling() {
	// un-lock scroll position
	var html = jQuery('html');

	if (html.css('overflow') === 'hidden') {
		var scrollPosition = html.data('scroll-position');
		html.css('overflow', html.data('previous-overflow'));
		if (scrollPosition) {
			window.scrollTo(scrollPosition[0], scrollPosition[1]);
		}
	}
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

function getViewPortHeight() {
	return $(window).height();
}

function getViewPortWidth() {
	return $(window).width();
}

function linkElementToViewPortHeight(element) {
	var height = getViewPortHeight();
	element.height(height);
	$(window).resize(function () {
		var height = getViewPortHeight();
		element.height(height);
	});
}

function keepAspectRatioByAdjustingHeight(aspect, element) {
	//aspect is width/height
	function adjustHeight() {
//		var height = getViewPortHeight();
		var width = element.width();
		var newHeight = (1 / aspect) * width;
		element.height(Math.floor(newHeight));
	}

	adjustHeight();
	$(window).resize(adjustHeight);


}

function verticalCenter(innerElement) {

	function syncCenter() {
		var innerHeight = $(innerElement).outerHeight();

		$(innerElement).css({
			"top": "50%",
			"position": "absolute"
//			"height": innerHeight
		}).css({
			"margin-top": Math.ceil(-innerHeight / 2)
		})
	}

	syncCenter();

	$(window).resize(syncCenter);
}

function horizontalCenter(innerElement) {
	function syncCenter() {
		var outerWidth = $(innerElement).parent().width();
		var innerWidth = $(innerElement).width();
		$(innerElement).css({
			"left": "50%",
			"position": "absolute",
			"width": innerWidth
		}).css({
			"margin-left": -Math.ceil(innerWidth / 2)
		});


	}

	syncCenter();

	$(window).resize(syncCenter);
}

function createTriangularTextWrappingSpace2(element, angleOfPoint) {
	//this function will attempt to fit the text contained in "element" into an inverted Isosceles triangle of the
	//specified angle.
	//It does this by measuring the total length of the text and multiplying it by the height of text to get a rough
	// estimate the total area the text occupies. It will then create a triangle of equal area and try to fit the
	// text into this triangle by inserting line breaks at the correct points. It does not optimize or ensure that
	// each line will fit it just chooses the initial closest solution.
	//This is actually the most expensive function to calculate, I may remove it in the future.

	var clone = $(element).clone();
	var originalText = $(element).html();
	var totalLengthOfText = $(element).measure(function () {
		return $(this).width();
	});
	var heightOflineOfText = $(element).measure(function () {
		return $(this).height();
	});
	var totalArea = totalLengthOfText * heightOflineOfText;

	var widthOfTriangle = 2 * Math.sqrt(totalArea * Math.atan(angleOfPoint / 2));
	var heightOfTriangle = Math.sqrt(totalArea / Math.atan(angleOfPoint / 2));

	var totalLines = Math.ceil(heightOfTriangle / heightOflineOfText);
	var lengthOfSpace = (function () {
		var plength = $(clone).html("p").measure(function () {
			return $(this).width();
		});

		var pSpaceplength = $(clone).html("p p").measure(function () {
			return $(this).width();
		});

		$(clone).html(originalText);

		return pSpaceplength - 2 * plength;
	})();


	//synchronize to resize event;
	var that = this;
	$(window).resize(function () {
		if ($(window).width() <= 817) {
			if (!$(window).data("aboutTriangleCalculated")) {
				$(window).data("aboutTriangleCalculated", true);
				$(element).find("br").remove();
			}
		} else {
			if ($(window).data("aboutTriangleCalculated")) {
				$(window).data("aboutTriangleCalculated", false);
				//use memoized result for speed during resize...
				$(element).html(that.triangleText);
			}
		}
	});

	this.findAmountOfWordsthatWillFitInLine = function (lineLength, wordLengthArray) {
		if (wordLengthArray === null) {
			return;
		}

		var accumulatedWords = 0;
		var accumulatedLength = 0;
		var prevLength = 0;
		for (var key in wordLengthArray) {
			prevLength = accumulatedLength;
			if (parseInt(key) > 0) {
				accumulatedLength += lengthOfSpace;
			}
			accumulatedLength += wordLengthArray[key];
			accumulatedWords += 1;
			if (accumulatedLength > lineLength) {
				if (Math.abs(lineLength - prevLength) >= Math.abs(accumulatedLength - lineLength)) {
					return accumulatedWords;
				} else {
					return accumulatedWords - 1;
				}
			}
		}

		//loop exits without returning flush everything
		return accumulatedWords;

	}

	this.generateHTMLStrings = function () {

		function LineObject(ArrayOfWords) {
			this.htmlString = ArrayOfWords.join(' ') + " <br />"
		}

		var arrayOfLineObjects = Array();
		var resultWordsPerLineArray = Array();
		var lengthOfWordsArray = this.generateArrayOfLengthOfWords();
		var wordsArray = this.generateArrayOfWords();
		for (var i = 0; i < totalLines; i++) {
			if (wordsArray.length === 0) {
				break;
			}
			var goalWidth = this.findWidthBasedOnLineNumberFromTop(i);
//				console.log(goalWidth);
			var result = this.findAmountOfWordsthatWillFitInLine(goalWidth, lengthOfWordsArray);
//				console.log(result);
//				console.log(lengthOfWordsArray.slice(0, result));
			arrayOfLineObjects[i] = new LineObject(wordsArray.slice(0, result));
			//console.log(arrayOfLineObjects[i].htmlString);
			lengthOfWordsArray = lengthOfWordsArray.slice(result);
			wordsArray = wordsArray.slice(result);
//				console.log(wordsArray.slice(0, result["lengthOfLine"]));
//				wordsArray = wordsArray.slice(result["lengthOfLine"]);
		}

		return arrayOfLineObjects;
	}

	this.appendToElement = function () {
		var htmlStrings = this.generateHTMLStrings();
		var finalString = ""
		for (var key in htmlStrings) {
			finalString += htmlStrings[key].htmlString;
		}

		//because this is expensive to calculate, memoize the the string for future use.
		this.triangleText = finalString;

		if ($(window).width() > 817) {
			$(element).html(finalString);
		}
	}


	this.findWidthBasedOnLineNumberFromTop = function (lineNumber) {
		var currentHeight = (lineNumber + 1) * (heightOflineOfText) - (heightOflineOfText / 2);
		return -(widthOfTriangle / heightOfTriangle) * currentHeight + widthOfTriangle;
	}

	this.generateArrayOfWords = function () {
		return $(element).html().split(' ');
	}

	this.generateArrayOfLengthOfWords = function () {
		var arrayOfWords = this.generateArrayOfWords();

		var arrayOfLengthOfWords = Array();
		for (var i = 0; i < arrayOfWords.length; i++) {
			arrayOfLengthOfWords[i] = $(clone).html(arrayOfWords[i] + "p").measure(function () {
				return $(this).width();
			}) - $(clone).html("p").measure(function () {
				return $(this).width();
			});
		}

		return arrayOfLengthOfWords;
	}
}


function createTriangularTextWrappingSpace(element, resolution, angleOfPoint) {
	if (doesSVGForeignObjectExist() !== true) {
		//transition slide only functions with foreign Object SVG tag...
		return;
	}


	//element refers to the text element not the containing element.
	//this function assumes that the text element is within a containing element.
	//it will double the height of the containing element to make up for lost text
	//area that is cutoff by the triangle.
	//creates triangular text wrapping space by floating divs left and right.
	//angleofpoint refers to the point at the bottom tip of the triangle.
	//resolution refers to the 'steps' or the height of each div in the triangle.
	function sync() {

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
		if (typeof angleOfPoint === 'undefined') {
			angleOfPoint = Math.PI - 2 * Math.atan((height * 2.2) / width);
		}

		var trigConstant = Math.tan((Math.PI - angleOfPoint) / 2);
		var wholeConstant = (lineHeight * 100) / (trigConstant * width);
		var totalHeight = trigConstant * (width / 2);
		var endingElement = Math.ceil(height / lineHeight);
		var beginningElement = Math.ceil(totalHeight / lineHeight);


		for (var i = beginningElement; i >= beginningElement - endingElement; i--) {
			var leftdiv = document.createElement('div');

			if (Math.floor(i * wholeConstant) > 50) {
				continue;
			}

			$(leftdiv).css({
				'float': 'left',
				'height': lineHeight.toString(),
				'width': Math.floor(i * wholeConstant).toString() + '%',
				'clear': 'left'
			}).addClass("trispacer");

			var rightdiv = document.createElement('div');
			$(rightdiv).css({
				'float': 'right',
				'height': lineHeight.toString(),
				'width': Math.floor(i * wholeConstant).toString() + '%',
				'clear': 'right'
			}).addClass("trispacer");

			parent.prepend(rightdiv);
			parent.prepend(leftdiv);
		}

		var cleardiv = document.createElement('div');
		$(cleardiv).css({
			'clear': 'both'
		}).addClass("trispacer");
		parent.append(cleardiv);
	}

	sync();
	$(window).resize(function () {
		sync();
	});

}

function createMaskedImage(i, width, backimage, backmask, borderWidth, customXOffset, customYOffset, defaultBackgroundColor) {
	if (!backimage) {
		backimage = "";
	}


	var div = document.createElement('div');
	//var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var svg = document.createElement("svg");
	var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	//var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var image = document.createElementNS("http://www.w3.org/2000/svg", "image");

	var maskImage = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var div2 = document.createElement('div');
	var maskid = "hexagonmask" + i.toString();
	var borderIncrement = 2 / Math.sqrt(3) * borderWidth;
	var hexagonWidth = width;
	var height = width * Math.sqrt(3) / 2;
	var hexagonEdgeWidth = height * Math.sqrt(3) / 2;
	var left = Math.ceil((i * hexagonEdgeWidth) + (i * borderIncrement));
	var top = i % 2 ? 0 : Math.ceil(height / 2);
	var img = document.createElement("img");
	var backgroundColorCover = document.createElement('div');

	$(svg).attr({
		"width": "100%",
		"height": "100%",
		"version": "1.1",
		"xmlns": "http://www.w3.org/2000/svg",
		"xmlns:xlink": "http://www.w3.org/1999/xlink"
	});


	if (doesSVGForeignObjectExist()) {
		var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
		foreignObject = $(foreignObject).attr({
			width: "100%",
			height: "100%",
			style: "mask: url(#" + maskid + ");"
		});
		$(img).attr({
			"src": backimage
		}).css({
			"height": "100%",
			"width": "auto",
			"max-width": "none",
			display: "inline-block",
			"position": "absolute"
		});

		$(backgroundColorCover).css({
			"width": "100%",
			"height": "100%",
			"position": "absolute",
			"background-color": defaultBackgroundColor
		}).attr("id", "hexagonCover" + i.toString()).addClass("hexagonCover");
		$(div2).prepend(backgroundColorCover);
		$(div2).prepend(img);
		$(foreignObject).prepend(div2);
		$(svg).prepend(foreignObject);
		mask = $(mask).attr({
			id: maskid
		});

		//you must directly access the dom node because jquery converts to lowercase
		mask[0].setAttribute('maskUnits', "userSpaceOnUse");
		mask[0].setAttribute('maskContentUnits', "userSpaceOnUse");

		maskImage = $(maskImage).attr({
			width: "100%",
			height: "100%",
			"xlink:href": backmask
		});
		$(mask).prepend(maskImage);

		$(svg).attr({
			height: '100%',
			width: '100%'
		});

		$(div2).css({
			"background-color": defaultBackgroundColor,
			"background-image": 'url("' + backimage + '")',
			"background-attachment": "fixed",
			"background-repeat": "repeat",
			"background-size": "auto 100%",
			"background-origin": "content-box",
			"background-position": Math.ceil(left - customXOffset).toString() + "px, " + Math.ceil(top - customYOffset).toString() + "px",
			"mask": 'url(' + backmask + ')',
			"-webkit-mask-image": 'url(' + backmask + ')',
			"-webkit-mask-repeat": "no-repeat",
			"-webkit-mask-size": "auto 100%",
			"-webkit-mask-position-x": "50%",
			"width": "100%",
			"height": "100%",
			"position": "absolute",
			"overflow": "hidden"
		});

		if (doesCSSExist("webkitBackfaceVisibility")) {
			$(div2).css({
				"background-attachment": "scroll"
			});
		}


		//create structure
		//$(div2).append(img);
		$(defs).prepend(mask);


		$(svg).prepend(defs);
		$(div).prepend(svg);
	} else {
		//IE does not correctly create the image element for svg using document.createElementNS(). It also has huge parsing issues when using jquery or the DOM API for creating svg elements. by creating these objects I'm keeping accessing the dom api at a minimum

		function customElementString(elementName, attributeObject, innerHTML) {
			var that = this;
			this.elementName = elementName;
			this.attributeObject = attributeObject;
			var innerHTML = innerHTML ? innerHTML : "";
			var htmlString = "";
			this.reload = function (elementName, attributeObject) {
				htmlString = "<" + elementName;
				for (var key in attributeObject) {
					htmlString = htmlString + " " + key + "=" + attributeObject[key];
				}

				htmlString = htmlString + " ";
			}

			this.reload(elementName, attributeObject);

			this.append = function (internalString) {
				innerHTML = internalString;
			}

			this.returnString = function () {
				if (innerHTML !== "") {
					return htmlString + ">" + innerHTML + "</" + elementName + ">";
				}
				else {
					return htmlString + "/>";
				}
			}
		}

		function appendStringIntoElement(element, stringToAppend) {
			//console.log(element.innerHTML);
			element.innerHTML = element.innerHTML + stringToAppend;
		}

		var rect = new customElementString("rect", {
			"width": "100%",
			"height": "100%",
			"fill": defaultBackgroundColor,
			"mask": "url(#" + maskid + ")",
			"class": "hexagonCover"
		});

		image = new customElementString("image", {
			"mask": "url(#" + maskid + ")",
			"xlink:href": backimage,
			"width": "100%",
			"height": "100%"
		});

		maskImage = new customElementString("image", {
			"width": "100%",
			"height": "100%",
			"xlink:href": backmask
		});
		mask = new customElementString("mask", {
			"id": maskid,
			"maskUnits": "userSpaceOnUse"
		}, maskImage.returnString());

		defs = new customElementString("defs", {}, mask.returnString());
		svg = new customElementString("svg", {
			"width": "100%",
			"height": "100%",
			"version": "1.1"
//			"xmlns":"http://www.w3.org/2000/svg",
//			"xmlns:xlink":"http://www.w3.org/1999/xlink"
		}, defs.returnString() + image.returnString() + rect.returnString());
		appendStringIntoElement(div, svg.returnString());
	}


	div = $(div).css({
		height: Math.ceil(height),
		width: Math.ceil(hexagonWidth),
		position: "absolute",
		top: top,
		left: left
	}).addClass("hexagon");

	$(svg).attr({
		height: '100%',
		width: '100%'
	});

	$(div2).css({
		"background-color": defaultBackgroundColor,
		"background-image": 'url("' + backimage + '")',
		"background-attachment": "fixed",
		"background-repeat": "repeat",
		"background-size": "auto 100%",
		"background-origin": "content-box",
		"background-position": Math.ceil(left - customXOffset).toString() + "px, " + Math.ceil(top - customYOffset).toString() + "px",
		"mask": 'url(' + backmask + ')',
		"-webkit-mask-image": 'url(' + backmask + ')',
		"-webkit-mask-repeat": "no-repeat",
		"-webkit-mask-size": "auto 100%",
		"-webkit-mask-position-x": "50%",
		"width": "100%",
		"height": "100%",
		"position": "absolute",
		"overflow": "hidden"
	});

	if (doesCSSExist("webkitBackfaceVisibility")) {
		$(div2).css({
			"background-attachment": "scroll"
		});
	}


	//create structure
	//$(div2).append(img);

	$(div).css({
		height: Math.ceil(height),
		width: Math.ceil(hexagonWidth),
		position: "absolute",
		top: top,
		left: left
	}).addClass("hexagon");


	//return div;

	//there is a bug in firefox that will now allow it to render
	//mask svg elements when generated by javascript DOM. Instead
	//shove it into the dom via a string and use $().html()...

	return div;
}

function isString(variable) {
	if (Object.prototype.toString.call(variable) == '[object String]') {
		return true;
	} else {
		return false;
	}
}

function createArrowTransitionSlide(aspect, width, element, alpha, backgroundImage, secondBackgroundImage, firstMask, secondMask) {
	if (doesSVGForeignObjectExist() !== true) {
		//transition slide only functions with foreign Object SVG tag...
		return;
	}
	var negativeHalfWidth = (-(width / 2)).toString() + "px";
	if (isString(width) && width.slice(-1) === '%') {
		var widthNum = parseInt(width.slice(0, -1));
		negativeHalfWidth = (-Math.ceil(widthNum / 2)).toString() + '%'

	}

	if (secondBackgroundImage) {
		secondBackgroundImage = "url(" + secondBackgroundImage + ")";
	} else {
		if (doesCSSExist("webkitBackfaceVisibility")) {
			secondBackgroundImage = "none"
		}
		else {
			secondBackgroundImage = "url(static/images/no_cube.jpg)";
		}
	}


	var randomID = guid();

	var section = document.createElement('section');
	var sizeDiv = document.createElement('div');
//	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
//	var defs = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
//	var mask = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
//	var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
//	var foreignObject = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');

	var firstMaskString = "url(static/images/arrow.png)";
	var secondMaskString = "url(static/images/triangle.png)";
	if (firstMask) {
		firstMaskString = "url(" + firstMask + ")";
	}
	else {
		firstMask = "static/images/arrow.png";
	}
	if (secondMask) {
		secondMaskString = "url(" + secondMask + ")";
	}
	else {
		secondMask = "static/images/triangle.png";
	}
	if (doesCSSExist("webkitBackfaceVisibility")) {
		secondMaskString = "none";
	}


	$(section).css({
//		"overflow":"hidden",
		"width": "100%",
		"position": "relative",
		"pointer-events": "none",
		"z-index": 1
	});
//	if (!doesCSSExist("webkitBackfaceVisibility")) {
//		$(section).css({
//			"mask": secondMaskString,
//			"-webkit-mask-image": secondMaskString,
//			"-webkit-mask-repeat": "no-repeat",
//			"-webkit-mask-position-x": "50%",
//			"-webkit-mask-position-y": "100%",
//			"-webkit-mask-size": "100%"
//		});
//	}
//
	$(section).attr({
		'class': 'js-generated',
		'id': $(element).attr("id")
	});

	function keepAspectByChanggingHeight(element) {
//		var height = Math.floor((1 / aspect) * getViewPortWidth());
		$(element).height($(window).height());
//		$(eleemnt)
//		console.log(height)
	}

	keepAspectByChanggingHeight($(section));

	//bind the above value with resizing...
	$(window).resize(keepAspectByChanggingHeight($(section)));


	$(sizeDiv).css({
		"width": width,
		"margin-left": negativeHalfWidth,
		"position": "absolute",
		"left": "50%",
		"bottom": "-10%",
		"pointer-events": "none",
		"z-index": 200
	});
	if (isString(width)) {
		$(sizeDiv).height(Math.floor((1 / aspect) * $(window).width()));
	} else {
		$(sizeDiv).height(Math.floor((1 / aspect) * width));
	}

//	svg = $(svg).attr({
//		height: '100%',
//		width: '100%',
//		id: 'triangle' + randomID,
//		"pointer-events": "none"
//	});

//	mask = $(mask).attr({
//		id:"trianglemask"+randomID
//	});

	//you must directly access the dom node because jquery converts to lowercase
//	mask[0].setAttribute('maskUnits',"userSpaceOnUse");
//	mask[0].setAttribute('maskContentUnits', "userSpaceOnUse");

//	image = $(image).attr({
//		width: "100%",
//		height: "100%",
//		"xlink:href": secondMask
//	});

//	foreignObject = $(foreignObject).attr({
//		width: "100%",
//		height: "100%"
////		style:"mask: url(#trianglemask"+randomID+");"
//	});


	var section1 = document.createElement('section');
	var svg1 = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	var defs1 = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	var mask1 = document.createElementNS("http://www.w3.org/2000/svg", 'mask');
	var image1 = document.createElementNS("http://www.w3.org/2000/svg", 'image');
	var foreignObject1 = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
	var div1 = document.createElement('div');


	$(section1).css({
		"background-attachment": 'scroll',
		"background-repeat": 'no-repeat',
		"background-size": "100%",
		"background-position": "top",
		"pointer-events": "none"
	});

	if (!doesCSSExist("webkitBackfaceVisibility")) {
		$(section1).css({
			"background-attachment": "fixed",
			"-webkit-mask-image": secondMaskString,
			"-webkit-mask-repeat": "no-repeat",
			"-webkit-mask-position-x": "50%",
			"-webkit-mask-position-y": "100%",
			"-webkit-mask-size": "100%",
//			"background-color": "#D2CCC9",
			"background-image": secondBackgroundImage
		});
	}

	$(section1).height(Math.floor((1 / aspect) * width));


	svg1 = $(svg1).attr({
		height: '100%',
		width: '100%',
		id: "arrow",
		"pointer-events": "none"
	});

	mask1 = $(mask1).attr({
		id: "arrowmask" + randomID
	});

	//you must directly access the dom node because jquery converts to lowercase
	mask1[0].setAttribute('maskUnits', "userSpaceOnUse");
	mask1[0].setAttribute('maskContentUnits', "userSpaceOnUse");

	image1 = $(image1).attr({
		width: "100%",
		height: "100%",
		"xlink:href": firstMask
	});

	foreignObject1 = $(foreignObject1).attr({
		width: "100%",
		height: "100%",
		style: "mask: url(#arrowmask" + randomID + ");"
	});

	var backgroundString = 'url(static/images/cover_cubes_reduced.jpg)';
	if (backgroundImage) {
		backgroundString = 'url(' + backgroundImage + ')';
	}

	$(div1).css({
		"background-color": "#D2CCC9",
		"background-image": backgroundString,
		"background-attachment": 'fixed',
		"background-repeat": 'no-repeat',
		"background-position": 'center',
		"background-size": "auto 100%",
		"pointer-events": "none"
	});

	if (doesCSSExist("webkitBackfaceVisibility")) {
		$(div1).css({
			"background-attachment": "scroll",
			"background-size": "auto " + $(window).height() + "px"
		}).attr("id", "parallaxbg-" + $(element).attr("id"));
	} else {
		$(div1).css({
//			"-webkit-mask-image": firstMaskString,
//			"-webkit-mask-repeat": 'no-repeat',
//			"-webkit-mask-position-x": "50%",
//			"-webkit-mask-position-y": "100%",
//			"-webkit-mask-size": "100%"
		});
	}

	$(div1).height(Math.floor((1 / aspect) * width));


	$(foreignObject1).append(div1);
	$(mask1).append(image1);
	$(defs1).append(mask1);
	$(svg1).append(defs1).append(foreignObject1);
	$(section1).append(svg1);
//	$(foreignObject).append(section1);
//	$(mask).append(image);
//	$(defs).append(mask);
//	$(svg).append(defs).append(foreignObject);
	$(sizeDiv).append(svg1);
	$(section).append(sizeDiv);

	element.replaceWith(section);


	if (alpha === false) {
		$(section1).css({
			"background-image": "none"
		})
	}

	//rerender to fix firefox bug...
	$(section).html(
		$(section).html()
	);
}

function mainPage() {
	if (Modernizr.csstransforms && Modernizr.csstransitions) {
		//do nothing....
	}
}


function createHexagonChain(element, borderWidth, backgroundWidth, backgroundHeight) {


	var workList = $(element).find("#worklist");
	$(workList).remove();
	var amount = $(workList).children().length;


	var width = 800;
	var hexagonWidth = (width - ((amount * borderWidth) + 1)) / amount / 2;
	var hexagonHeight = hexagonWidth * Math.sqrt(3) / 2;
	var chainWidth = Math.ceil(amount * (hexagonWidth - hexagonWidth / 4) + (amount + 2) * borderWidth);
	var container = document.createElement('div');
	$(container).width(chainWidth).height(Math.ceil(hexagonHeight * 1.5)).css({
		position: "absolute",
		left: "50%",
		"margin-left": -Math.ceil(chainWidth / 2)
	}).attr("id", "hexagonChain");

	var slideSetArray = {};

	$(window).resize(function () {
		chainWidth = Math.ceil(amount * (hexagonWidth - hexagonWidth / 4) + (amount + 2) * borderWidth);
		$(container).css({
			"margin-left": -Math.ceil(chainWidth / 2)
		})
	});

	$(workList).children().each(function (index, element) {
		var hexagonID = 'hexagon' + index.toString();
		slideSetArray[hexagonID] = new SlideSetObject($(element), hexagonID);

		var hexagon = createMaskedImage(
			index,
			Math.floor(hexagonWidth),
			slideSetArray[hexagonID].coverImage,
			"static/images/hexagon_small.png",
			borderWidth,
			Math.ceil(backgroundWidth / 3),
			Math.ceil(backgroundHeight / 7),
			colorCycler(Math.ceil(index * 255 / ($(workList).children().length) + 510))
		);

		$(hexagon).attr('id', hexagonID);


		$(container).html(
				$(container).html() + hexagon.prop("outerHTML")
		);
	});

	$('#work').append(
		container
	);

	verticalCenter($(container));


	var hexagons = (function generateHexagonSelectors(amount, id) {
		var hexagons = Array();
		for (var i = 0; i < amount; i++) {
			hexagons[i] = "#" + id + i.toString();
		}
		return hexagons;
	})(amount, "hexagonmask");

	function BulgeEffectOnHexagons(originElement, prevElementHeight, prevElementWidth, originalWidth, originalHeight, limit, decayFunction, inverseDecayFunction, accumalatedXOffset, accumulatedYOffset, right) {


		var indexOfOrigin = $(originElement).index();
		if (indexOfOrigin >= limit || indexOfOrigin < 0) {
			return;
		}


		var newHeight = decayFunction(prevElementHeight);
		var newWidth = decayFunction(prevElementWidth);

		var currentIndex = $(originElement).index();

		//var currentYOffset = parseInt($(originElement).css("top").slice(0,-2));
		var currentYOffset = $.data($(originElement)[0], "originalYOffset");
		var shiftYOffset = -(newHeight - originalHeight) / 2;

		var finalYOffset = currentYOffset + shiftYOffset + accumulatedYOffset;
		accumulatedYOffset = currentIndex % 2 === 0 ? accumulatedYOffset + shiftYOffset : accumulatedYOffset - shiftYOffset;

//		var currentXOffset = parseInt($(originElement).css("left").slice(0,-2));
		var currentXOffset = $.data($(originElement)[0], "originalXOffset");


		var shiftXOffset = right === true ? (newWidth - originalWidth) / 2 : -(newWidth - originalWidth) / 2;
		accumalatedXOffset += shiftXOffset;
		var finalXOffset = right === true ? currentXOffset - 2 * shiftXOffset + accumalatedXOffset : currentXOffset + accumalatedXOffset;


		$(originElement).stop(true, false).animate({
			height: newHeight,
			width: newWidth,
			left: finalXOffset,
			top: finalYOffset
		});


		//var indexOfNext = right===true? indexOfOrigin+1 : indexOfOrigin-1;
		var nextElement = right === true ? $(originElement).next() : $(originElement).prev();

		BulgeEffectOnHexagons(nextElement, newHeight, newWidth, originalWidth, originalHeight, limit, decayFunction, inverseDecayFunction, accumalatedXOffset, accumulatedYOffset, right);

	}

	var sizeIncrease = 7;

	$(".hexagonCover").hover(function () {
		$(".hexagonCover").stop(true, false).fadeOut();
	});

	$(".hexagon").each(function (index, element) {


		var originalWidth = $(element).width();
		var originalHeight = $(element).height();
		var originalXOffset = parseInt($(element).css('left').slice(0, -2));
		var originalYOffset = parseInt($(element).css('top').slice(0, -2));
		var centerXoffset = originalWidth * (sizeIncrease - 1) / 2;
		var centerYoffset = originalHeight * (sizeIncrease - 1) / 2;
		var totalXoffset = originalXOffset - centerXoffset;
		var totalYoffset = originalYOffset - centerYoffset;
		$.data(element, "originalXOffset", originalXOffset);
		$.data(element, "originalYOffset", originalYOffset);


//		$("#hexagonCover"+index.toString()).hover(function(){
//			$(this).stop(true, false).fadeOut();
//		}, function(){
//			//do nothing leave it fadedOut.
//		});


		var magnifyGlassImage = document.createElement("img");

		$(magnifyGlassImage).attr({
			"src": "static/images/magnifying_glass.svg"
		}).attr({
			"id": "innerhexagon" + index.toString(),
			"class": "innerhexagon"
		}).css({
			"width": "100%",
			"height": "100%"
		});

		$(element).children().eq(0).children(1).eq(1).children().eq(0).children().eq(1).append(magnifyGlassImage);

		$(element).mouseover(function (eventObject) {

//			$(".innerhexagon").stop(true, false).fadeIn(400, function(){
//				$(magnifyGlassImage).stop(true, false).fadeOut();
//			});
			$(element).css({
				"z-index": 99,
				"cursor": "pointer"
			}).stop(true, false).animate({
				height: originalHeight * sizeIncrease,
				width: originalWidth * sizeIncrease,
				left: totalXoffset,
				top: totalYoffset
			}, {
				"start": function () {

					function decay(input) {
						return input * 0.6;
					}

					function inverseDecay(input) {
						return input / 0.6;
					}

					BulgeEffectOnHexagons(
						$(this).next(),
							originalHeight * sizeIncrease,
							originalWidth * sizeIncrease,
						originalWidth,
						originalHeight,
						amount,
						decay,
						inverseDecay,
							centerXoffset + borderWidth,
							$(this).index() % 2 === 0 ? -centerYoffset : centerYoffset,
						true
					);
					BulgeEffectOnHexagons(
						$(this).prev(),
							originalHeight * sizeIncrease,
							originalWidth * sizeIncrease,
						originalWidth,
						originalHeight,
						amount,
						decay,
						inverseDecay,
							-centerXoffset - borderWidth,
							$(this).index() % 2 === 0 ? -centerYoffset : centerYoffset,
						false
					);
				}
			});
		});

		$(element).mouseout(function (eventObject) {
			//reset the size and offset of every hexagon...

			$(".innerHexagon").stop(true, false).fadeOut();

			$(".hexagon").css({
				"z-index": 98,
				"cursor": "default"
			}).each(function (index, element) {
				$(element).animate({
					left: $.data(element, "originalXOffset"),
					top: $.data(element, "originalYOffset"),
					width: originalWidth,
					height: originalHeight
				}, {
					"complete": function () {
						//$(magnifyGlassImage).fadeIn();
						$(".hexagonCover").stop(true, false).fadeIn();
					}
				});
			});

		});
	});


	//create slideset
	for (var key in slideSetArray) {
		var workScrollPosition = $("#work").offset().top;
		$('#' + slideSetArray[key].clickID).click(function () {

			$("#work").children().each(function () {
				if (!Modernizr.csstransitions) {
					$(this).fadeOut();
				} else {
					$(this).css({
						opacity: 0,
						"-webkit-transition": "all 200ms ease",
						"-moz-transition": "all 200ms ease",
						"-ms-transition": "all 200ms ease",
						"-o-transition": "all 200ms ease",
						"transition": "all 200ms ease"
					});
				}
			});

			$('body, html').scrollTop(workScrollPosition);
			lockscrolling();


			slideSetArray[$(this).attr('id')].createOverlay($('#work'));
		});
	}
}

function fixedPositionOnScrollPastAndHandle(element, handleDown, handleUp) {
	if (getInternetExplorerVersion() !== -1) {
		return;
	}

	var placeholderElement = document.createElement('div');
	$(placeholderElement).height(element.height()).width(element.width()).css({
		"position": "relative",
		"pointer-events": "none"
	});

	var scrollMarker = element.offset().top;
	var initialScrollPosition;


	function scrollDownHandler() {
		if ($(document).scrollTop() >= scrollMarker) {
			$(window).unbind("scroll", scrollDownHandler);
			$(window).scroll(scrollUpHandler);
			$(element).css({
				"position": "fixed",
				"top": 0
			});
			ieFixedBackgroundFlickerhack();
			$(element).after(placeholderElement);

			handleDown ? handleDown() : (function () {/*do nothing*/
			})();
		}
	}

	function scrollUpHandler() {
		if ($(document).scrollTop() < scrollMarker) {
			$(window).unbind("scroll", scrollUpHandler);
			$(window).scroll(scrollDownHandler);
			$(element).css({
				"position": "relative",
				"top": 0
			});
			$(placeholderElement).remove();
			handleUp ? handleUp() : (function () {/*do nothing*/
			})();
		}
	}

	function initialize() {
		$(window).unbind("scroll", scrollDownHandler);
		$(window).unbind("scroll", scrollUpHandler);
		initialScrollPosition = $(document).scrollTop();
		if (initialScrollPosition < scrollMarker) {
			$(window).scroll(scrollDownHandler);
		}
		else {
			$(window).scroll(scrollUpHandler);
		}
	}

	initialize();

	$(window).resize(initialize);
}

function keepAreaOfElementTheSameByAdjustingHeight(element, area) {
	$(element).height(Math.ceil(area / $(element).width()));
}

function scrollPastAndHandle(element, elementTrigger, handlerDown, handlerUp) {
	var marker;
	var initialScrollPoint = $(document).scrollTop();
	if (elementTrigger) {
		marker = $(elementTrigger).offset().top;
	}
	else {
		marker = $(element).offset().top;
	}

	function scrollDownPastHandler() {
		if ($(document).scrollTop() >= marker) {
			$(window).unbind("scroll", scrollDownPastHandler);
			$(window).scroll(scrollUpPastHandler);
			handlerDown();
		}
	}

	function scrollUpPastHandler() {
		if ($(document).scrollTop() <= marker) {
			$(window).unbind("scroll", scrollUpPastHandler);
			$(window).scroll(scrollDownPastHandler);
			handlerUp();
		}
	}

	if (initialScrollPoint <= marker) {
		$(window).scroll(scrollDownPastHandler);
	}
	else {
		$(window).scroll(scrollUpPastHandler);
	}
}

function scrollPastAndSlideUp(element, aspect, elementTrigger) {

	if (doesSVGForeignObjectExist()) {
		var marker;
		var initialScrollPoint = $(document).scrollTop();
		var heightToBeMoved;
		if (elementTrigger) {
			marker = $(elementTrigger).offset().top;
			heightToBeMoved = -2 * Math.ceil((1 / aspect) * $(elementTrigger).width());
		}
		else {
			marker = $(element).offset().top;
			heightToBeMoved = -2 * Math.ceil((1 / aspect) * $(element).width());
		}

		function scrollDownPastHandler() {
			if ($(document).scrollTop() >= marker) {
				$(window).unbind("scroll", scrollDownPastHandler);
				$(window).scroll(scrollUpPastHandler);
				//			$(element).animate({
				//				"background-position-y":heightToBeMoved.toString()+"px"
				//			}, 400);
				$(element).css({"background-position": "0 0"}).stop(true, false).animateBG(0, heightToBeMoved, 800);
			}
		}

		function scrollUpPastHandler() {
			if ($(document).scrollTop() <= marker) {
				$(window).unbind("scroll", scrollUpPastHandler);
				$(window).scroll(scrollDownPastHandler);
				$(element).css({"background-position": "0 " + heightToBeMoved}).stop(true, false).animateBG(0, 0, 800);
			}
		}

		if (initialScrollPoint <= marker) {
			$(element).css({
				"background-position": "0 0"
			});
			$(window).scroll(scrollDownPastHandler);
		}
		else {
			$(element).css({
				"background-position-y": "0 " + heightToBeMoved.toString()
			});
			$(window).scroll(scrollUpPastHandler);
		}
	}
}

function wheel(input, limit) {

	var finalValue = input;

	if (input >= limit) {
		finalValue = input % limit;
	}
	else if (input < 0 && input > -limit) {
		finalValue = limit + input;
	} else if (input < -limit) {
		finalValue = limit - (-input) % limit;
	}
	return finalValue;
}

function cliff(input, limit) {
	if (input < 0 || input >= limit) {
		throw "You reached an index that doesn't exist. Error."
	}
}

function normalDistribution(x, mean, standdev) {
	return Math.exp(-(x - mean) * (x - mean) / (2 * standdev * standdev)) / (standdev * Math.sqrt(2 * Math.PI));
}

function coreSkillsSlide(element, radius, thickness, resolution) {

	////-note to self this function is unreadable.. fix later.
	//note width and height must be in pixels units!!
	var width = window.innerWidth;
	var height = window.innerHeight;

	var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

	$(svg).attr({
		"width": width,
		"height": height
	});

	$(svg).css({
		"position": "absolute",
		"left": "50%",
		"top": "50%",
		"margin-top": -Math.ceil(height / 2),
		"margin-left": -Math.ceil(width / 2)
	});

	//make a soft gradient to create depth...
	var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
	$(rect).attr({
		fill: "url(#radial)",
		width: "100%",
		height: "100%"
	});

	var stop0 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
	var stop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop');


	var radialGradient = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradient');
	$(radialGradient).attr({
		cx: "50%",
		cy: "50%",
		r: "50%",
		fx: "50%",
		fy: "50%",
		id: "radial"
	});
	$(svg).append(radialGradient).append(rect);


	var arcObjectArray = Array();
	for (var index = 0; index < resolution; index++) {
		var startAngle = ((2 * Math.PI) / resolution) * index;
		var endAngle = (((2 * Math.PI) / resolution) * (index + 1));
		var color = colorCycler(index * (255 * 3) / (resolution));
		arcObjectArray[index] = drawArc(radius, width, height, startAngle, endAngle, 0, color, "colorCircle" + index.toString(), "colorCircle");
		$(svg).append(arcObjectArray[index].path);
	}

	$(element).after(svg);

	function initializeRing(totalMilliseconds) {
		return function () {
			for (var index = 0; index < resolution; index++) {
				$("#colorCircle" + index.toString()).delay(index * totalMilliseconds / resolution).animate(
					{
						"stroke-width": thickness
					},
					{
						"complete": function () {
							if ($(this).index() === resolution - 1) {
								startWaveOnHover();
							}
						},
						"always": function () {
							$(this).animate({
								"stroke-width": thickness
							});
						},
						"progress": function (promise, progress, remainingM) {
//								var idNum = $(this).index();
//
//								$(this).attr({
//									"transform":"rotate("+remainingM/2+", "+arcObjectArray[idNum].x+", "+arcObjectArray[idNum].y+")"
//										+ "translate("+remainingM/2 +", "+remainingM/2+")"
//
//								});
						},
						"duration": 200
					}
				);
			}
		}
	}

	function deinitilializeRing() {
		$(".colorCircle").off();
		$(".colorCircle").stop(true, false).animate({
			"stroke-width": 0
		});
	}

	function makeListInvisible() {
		$(element).children('ul').children('li').dequeue().fadeTo(1, 0);
	}

	makeListInvisible();

//	function lockscrolling(){
//		// lock scroll position, but retain settings for later
//		var scrollPosition = [
//		self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
//		self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
//		];
//		var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
//		html.data('scroll-position', scrollPosition);
//		html.data('previous-overflow', html.css('overflow'));
//		html.css('overflow', 'hidden');
//		window.scrollTo(scrollPosition[0], scrollPosition[1]);
//	}
//
//	function unlockscrolling(){
//	  // un-lock scroll position
//      var html = jQuery('html');
//      var scrollPosition = html.data('scroll-position');
//      html.css('overflow', html.data('previous-overflow'));
//      window.scrollTo(scrollPosition[0], scrollPosition[1])
//	}

	function listOutElements(delay, callbackOnComplete) {
		//let it only run once!
		var triggered = false;

		return function () {
			if (triggered === false) {
				$('html, body').css({
					"scrollTop": $("#skills").offset().top
				});
				lockscrolling();
				triggered = true;
				$("#skills > div").off();
				$(element).children('ul').children('li').dequeue();
				makeListInvisible();
				var accumulator = 0;
				$(element).children('ul').children('li').each(function (index, element) {
					accumulator += delay;
					var copy = accumulator;
					$(element).delay(copy).fadeTo(400, 1);
				});
				setTimeout(callbackOnComplete, accumulator);
				setTimeout(unlockscrolling, accumulator + 500);
			}

		}
	}

//	console.log($("#transition-slide3"));
//	scrollPastAndHandle($('#skills'), $("#transition-slide2"),  function(){ deinitilializeRing(); makeListInvisible();}, listOutElements(400, initializeRing(500)));
//	scrollPastAndHandle($("#skills"), $("#skills"), listOutElements(400, initializeRing(500)), deinitilializeRing);
//	scrollPastAndHandle($("#skills"), $("#transition-slide3"), function(){ deinitilializeRing(); makeListInvisible();},  listOutElements(400, initializeRing(500)));
	scrollPastAndHandle($("#skills > div"), $('#skills'), listOutElements(200, initializeRing(500)), function () {/*do nothing*/
	});


	function startWaveOnHover() {
		function wavefront(event, growthHeight, delay, transferDelay, decayFunction, id, goingRight) {
			if (growthHeight < thickness * 2.3) {
				return;
			}

			$("#colorCircle" + id).stop(true, false).animate({
					"stroke-width": growthHeight//+parseInt($("#colorCircle"+id).css("stroke-width").slice(0,-2))
				},
				{
					"start": function () {
						$(this).delay(delay).animate({
							"stroke-width": thickness
						}, {
							duration: 150
						});

						var nextId;
						if (goingRight) {
							nextId = wheel(id + 1, resolution);
						}
						else {
							nextId = wheel(id - 1, resolution);
						}

						setTimeout(function () {
							wavefront(event, decayFunction(growthHeight), delay, transferDelay, decayFunction, nextId, goingRight);
						}, transferDelay);
					},
					"duration": 150
				}
			);
		}

		$(".colorCircle").data("isHandlerActive", false);
		$(".colorCircle").each(function (index, element) {
			$(element).mouseover(function () {

				if ($(".colorCircle").data("isHandlerActive") === false) {//shut off handler temporarily for 1600 ms
					$(".colorCircle").data("isHandlerActive", true);
					setTimeout(function () {
						$(".colorCircle").data("isHandlerActive", false);
					}, 1600);


					if ($(this).is(":animated")) {
						//if the element is in the process of animating, return...
						return;
					}
					var idNum = parseInt($(this).attr("id").slice(11));
					var decayFunction = function (x) {
						return x * 0.975;
					};
					$("#colorCircle" + idNum).stop(true, false).animate({
						"stroke-width": radius / 3
					}, {
						"start": function () {
							$(this).animate({
								"stroke-width": thickness
							}, {
								duration: 150
							});
						},
						"duration": 150
					});
					wavefront(null, decayFunction(radius / 3), 15, 15, decayFunction, wheel(idNum + 1, resolution), true);
					wavefront(null, decayFunction(radius / 3), 15, 15, decayFunction, wheel(idNum - 1, resolution), false);
				}
			});
		});


		//trigger random events
		function randomWaveTrigger(amountOfTimes) {


			return function recursive() {
				if (amountOfTimes === 0) {
					return;
				}
				var randomID = Math.floor(Math.random() * resolution);
				$("#colorCircle" + randomID).trigger("mouseenter");
				amountOfTimes--;
				setTimeout(recursive, 3500);
			}
		}

		setTimeout(randomWaveTrigger(5), 1000);


	}
}

function colorCycler(colorLevel, isSVG) {
	//color must be a number from zero to 255*3

	if (colorLevel > 255 * 3) {
		colorLevel = colorLevel % (255 * 3);
	}

	var red = "0"
	var green = "0";
	var blue = "0";

	if (colorLevel < 255) {
		red = 255 - colorLevel;
		green = colorLevel;
		blue = 0;
	} else if (colorLevel >= 255 && colorLevel < 2 * 255) {
		red = 0;
		green = 255 - (colorLevel - 255);
		blue = colorLevel - 255;
	} else if (colorLevel >= 2 * 255) {
		red = colorLevel - (255 * 2);
		green = 0;
		blue = 255 - (colorLevel - (255 * 2));
	}

	if (isSVG === true) {
		red = red / 255;
		green = green / 255;
		blue = blue / 255;
	}

	return "rgb(" + Math.floor(red).toString() + "," + Math.floor(green).toString() + "," + Math.floor(blue).toString() + ")";
}

function drawArc(radius, width, height, startingAngle, angle, thickness, color, id, className) {
	function findAngleX(angle) {
		return width / 2 + radius * Math.sin(angle);
	}

	function findAngleY(angle) {
		return height / 2 - radius * Math.cos(angle);
	}

	var x1 = findAngleX(startingAngle);
	var x2 = findAngleX(angle);
	var y1 = findAngleY(startingAngle);
	var y2 = findAngleY(angle);
	var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
	path.setAttribute("d", "M " + x1.toString() + " " + y1.toString() + " A" + radius.toString() + " " + radius.toString() + " 0 0 1 " + x2.toString() + " " + y2.toString());
	path.setAttribute("fill", "none");
	path.setAttribute("stroke-width", thickness);
	path.setAttribute("stroke", color);
	path.setAttribute("id", id);
	path.setAttribute("class", className);

	return {
		"path": path,
		"x": x1,
		"y": y1
	};


}

function createTriangleTransitionSlide(element, color, upper, uppercolor, backgroundColor) {
	function sync() {
		$(element).height(
			$(window).height()
		).width(
			$(window).width()
		).css({
				"z-index": 100,
				"overflow": "visible"
			});

		if (backgroundColor) {
			$(element).css({
				"background-color": backgroundColor
			})
		}


		var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');

		$(svg).attr({
			"width": $(element).width(),
			"height": $(element).height()
		});
		$(svg).css({
			"pointer-events": "none",
			"position": "absolute",
			"top": "1px",
			"overflow": "visible"
		})
		var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
		$(path).attr({
			"fill": color,
			"d": "M0, " + $(element).height() + " L" + $(element).width() / 2 + ", " + $(element).height() * 0.65 + " L" + $(element).width() + ", " + $(element).height() + " Z"
		});

		if (upper) {
			var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			$(path2).attr({
				"fill": uppercolor,
				"d": "M0, 0 L" + $(element).width() / 2 + ", " + $(element).height() * 0.35 + " L" + $(element).width() + ",0 Z"
			});
			$(svg).append(path2);

		}

		$(svg).append(path);
		$(element).html("");
		$(element).append(svg);
	}

	sync();
	$(window).resize(sync);
}

function scrollTo(element, complete, speed) {
	return function () {
		$('html, body').animate({
			scrollTop: $(element).offset().top
		}, speed ? speed : 2000);
		if (complete) {
			complete();
		}
	}
}

function scrolling() {

	$(".scrollbutton").hover(function () {
		$(this).css({
			'cursor': "pointer"
		})
	}, function () {
		$(this).css({
			'cursor': "default"
		})
	});
	$("#scrollbutton1").click(scrollTo($("#aboutme")));
	$("#scrollbutton2").click(scrollTo($("#skills")));
	$("#scrollbutton3").click(scrollTo($("#work")));
	$("#scrollbutton4").click(scrollTo($("#contact")));
}


function initializeLoadingScreen() {
	if (!$(".loading").length) {
		return;
	}
	var section = document.createElement("section");

	$(section).css({
		"position": "fixed",
		"width": "100%",
		"height": "100%",
		"background-color": "#E6DEDE",
		"z-index": 99
	}).attr({
		"class": "loading"
	})

	var img = document.createElement("img");
	$(img).attr({
		"src": "static/images/loading.svg"
	}).css({
		"position": "absolute",
		"width": "200px",
		"height": "200px",
		"left": "50%",
		"top": "50%",
		"margin-top": "-100px",
		"margin-left": "-100px"
	});
	$(section).append(img);
	$("body").prepend(section);
	document.location = "#";
	lockscrolling();
}

function removeLoadingScreen() {
	document.location = "#";
	$(".loading").delay(2000).fadeTo(2000, 0, function () {
		document.location = "#";
		$(".loading").remove();
		unlockscrolling();
		document.location = "#";
	});
}

function SlideSetObject(listElement, associatedClickID) {
	var that = this;
	this.slides = Array();
	var currentSlideIndex = 0;


//	console.log($(listElement).children());
	$(listElement).children().each(function (index, element) {
		if ($(element).prop("tagName") === "IMG") {
			that.coverImage = $(element).attr("src");
		}
	});

	function SlideObject(setOfElements) {
		var that = this;
		var htmlString = "";
		var slideSizer = document.createElement("div");

		//vertical centering hack...
		$(slideSizer).css({
			width: "50%",
			"display": "inline-block",
			"vertical-align": "middle"
		});


		$(setOfElements).children().each(function (index, element) {
			if ($(element).prop("tagName") === "H3") {
				that.h3 = document.createElement("H3");
				$(that.h3).html($(element).html()).css({
					"color": "#D2CCC9",
					"font-size": 25,
					"text-align": "center"
				});
				htmlString += $(that.h3)[0].outerHTML;
				$(slideSizer).append(that.h3);


			} else if ($(element).prop("tagName") === "IMG") {
				that.image = document.createElement("IMG");
				$(that.image).attr({
					"src": $(element).attr("src")
				}).css({
//					"max-width": $(element).attr("class") === "noStyling" ? "auto" : "70%",
//					"max-height": "70%",
					"margin-left": "auto",
					"margin-right": "auto",
					"display": "block"
				});

				if ($(element).attr("class") !== "noStyling") {
					$(that.image).css({
						"-webkit-box-shadow": "0px 0px 81px 15px rgba(0,0,0,0.75)",
						"-moz-box-shadow": "0px 0px 81px 15px rgba(0,0,0,0.75)",
						"box-shadow": "0px 0px 81px 15px rgba(0,0,0,0.75)",
						"border-radius": "5px",
						"-moz-border-radius": "5px",
						"-webkit-border-radius": "5px"
					});
				}

				htmlString += $(that.image)[0].outerHTML;
				$(slideSizer).append(that.image);

			} else if ($(element).prop("tagName") === "P") {
				that.p = document.createElement("P");
				$(that.p).css({
					"text-align": "center",
					"margin": "20px",
					"font-size": "16px",
					"color": "#D2CCC9"
				}).html($(element).html());
				htmlString += $(that.p)[0].outerHTML;
//				$(finalElement).append(that.p);
				$(slideSizer).append(that.p);
			}
		});


		this.generateSlideHTML = function () {
			return htmlString;
		}

		this.getSlideElement = function () {
			return slideSizer;
			//return table;
		}

	}

	function updateSlideToolsElement() {
		$(".sliderDot").attr({
			"src": "static/images/slideDot.svg"
		});

		$("#sliderDot" + currentSlideIndex.toString()).attr({
			"src": "static/images/slideDotSelected.svg"
		})
	}

	this.createSlideToolsElement = function () {


		if (that.slides.length < 2) {
			return;
		}

		var lengthOfSVGElements = 60;

		var container = document.createElement('div');
		var containerWidth = lengthOfSVGElements * (that.slides.length + 2)
		$(container).css({
			width: containerWidth,
			bottom: "7%",
			"position": "absolute",
			left: "50%",
			"margin-left": -Math.ceil(containerWidth / 2)
		}).attr("id", "slideSetSelctor");
		var left = document.createElement('img');
		$(left).attr('src', "static/images/slideLeft.svg").click(function () {
			var e = $.Event('keyup');
			e.keyCode = 37; // Character 'left'
			$(document).trigger(e);
		});

		var right = document.createElement('img');
		$(right).attr('src', "static/images/slideRight.svg").click(function () {
			var e = $.Event('keyup');
			e.keyCode = 39; // Character 'right'
			$(document).trigger(e);
		});

		$(right).add(left).hover(function () {
			$(this).css({
				"cursor": "pointer"
			});
		}, function () {
			$(this).css({
				"cursor": "default"
			});
		});


		$(container).append(left);
		for (var i = 0; i < that.slides.length; i++) {
			var dot = document.createElement('img');
			var src = "static/images/slideDot.svg";
			if (i === currentSlideIndex) {
				src = "static/images/slideDotSelected.svg";
			}


			$(dot).attr({
				"src": src,
				"id": "sliderDot" + (i).toString(),
				"class": "sliderDot"
			}).hover(function () {
				$(this).css({
					"cursor": "pointer"
				});
			}, function () {
				$(this).css({
					"cursor": "default"
				});
			}).click(function () {
				var nextSlideIndex = parseInt($(this).attr("id").slice(9));
				var currentSlide = that.slides[currentSlideIndex].getSlideElement();
				var nextSlide = that.slides[nextSlideIndex].getSlideElement();
				$(nextSlide).css("opacity", 0);
				var slideContainer = $(currentSlide).parent();
				$(currentSlide).fadeOut(100, function () {
					$(this).remove();
					$(slideContainer).append(nextSlide);//append fucks with the display property...
					$(nextSlide).css("display", "inline-block").animate({
						opacity: 1
					}, 100);
					currentSlideIndex = nextSlideIndex;
					updateSlideToolsElement();
				});
			});
			$(container).append(dot);
		}
		$(container).append(right);

		return container;
	}

	//console.log($(listElement).find("ul"));
	$(listElement).children("ul").children().each(function (index, element) {
		//console.log("slide", index, $(element).html());
		that.slides[index] = new SlideObject($(element));
	});

	var docHeight = $(window).height();

	this.clickID = associatedClickID;

	this.createOverlay = function (placementElement) {
		var zindex = $(placementElement).data("z-index", $(placementElement).css("z-index"));
		$(placementElement).css("z-index", 10);
		var slideSetSizer = document.createElement("div");

		$(slideSetSizer).css({
			width: "100%",
			position: "absolute",
			top: "50%",
			"margin-top": 0,
			overflow: "hidden",
			"-moz-box-shadow": "inset 0  10px 20px -8px #000010, " +
				"inset 0 -10px 20px -8px #000010, " +
				"0px 0px 30px 0px rgba(0, 0, 0, 0.29)",
			"-webkit-box-shadow": "inset 0  10px 20px -8px #000010, " +
				"inset 0 -10px 20px -8px #000010, " +
				"0px 0px 30px 0px rgba(0, 0, 0, 0.29)",
			"box-shadow": "inset 0  10px 20px -8px #000010, " +
				"inset 0 -10px 20px -8px #000010, " +
				"0px 0px 30px 0px rgba(0, 0, 0, 0.29)",
			"background-image": 'url("static/images/overlaybg_hires.jpg")',
			"z-index": 200,
			"text-align": "center",
			"height": 0
		}).attr({
			"id": "slideset"
		});
		var initialSlideToAppend = that.slides[currentSlideIndex].getSlideElement();
		$(initialSlideToAppend).css({
			"opacity": 0
		});
		$(slideSetSizer).append(initialSlideToAppend);
		$(initialSlideToAppend).animate({
			opacity: 1
		}, {
			duration: 100
		});


		$(placementElement).append(slideSetSizer);
		$(placementElement).append(that.createSlideToolsElement((9 / 8) * docHeight)).fadeIn();
		if (!Modernizr.csstransitions) {
			$(slideSetSizer).stop(true, false).animate({
					"height": Math.ceil(3 * docHeight / 4),
					"margin-top": -Math.ceil(3 * docHeight / 8)
				}
			);
		} else {
			$(slideSetSizer).css({
				"height": Math.ceil(3 * docHeight / 4),
				"margin-top": -Math.ceil(3 * docHeight / 8),
				"-webkit-transition": "all 200ms ease",
				"-moz-transition": "all 200ms ease",
				"-ms-transition": "all 200ms ease",
				"-o-transition": "all 200ms ease",
				"transition": "all 200ms ease"
			})
		}

		$(document).data("slideAnimationStarted", false);


		$(document).keyup(function (e) {
			if ($(document).data("slideAnimationStarted") === false) {
				var escape = 27;
				if (e.keyCode === escape) {
					$(slideSetSizer).trigger('click');
					$(this).off('keyup');
				}
			}
		});


		//if there are more then one slide register slide transition events.
		if (that.slides.length > 1) {
			$(document).keyup(function (e) {
				if ($(document).data("slideAnimationStarted") === false) {
					var right = 39;
					var left = 37;
					if (e.keyCode === right) {
						//moveCurrentSlideLeftOut();
						var nextSlideIndex = wheel(currentSlideIndex + 1, that.slides.length);
						cycleSlides(nextSlideIndex);
						currentSlideIndex = nextSlideIndex;
						//moveSlideFromRightIn();
					} else if (e.keyCode === left) {
//						moveCurrentSlideRightOut();
						var nextSlideIndex = wheel(currentSlideIndex - 1, that.slides.length);
						cycleSlides(nextSlideIndex);
						currentSlideIndex = nextSlideIndex;
//						moveSlideFromLeftIn();
					}
					updateSlideToolsElement();
				}
			});

			function cycleSlides(nextSlideIndex) {
				fadeCurrentSlideOut(function () {
					fadeSlideIn(nextSlideIndex);
				});
			}

			function fadeCurrentSlideOut(complete) {
				$(document).data("slideAnimationStarted", true);
				var currentSlideElement = $(that.slides[currentSlideIndex].getSlideElement());
				//var currentSlideElement = $(".slideObject");
				$(currentSlideElement).css("display", "inline-block").fadeOut(100, function () {
					$(currentSlideElement).remove();
					//$(document).data("slideAnimationStarted", false);
					if (complete) {
						complete();
					}
				});
			}

			function fadeSlideIn(nextSlideIndex) {
				var currentSlideElement = $(that.slides[nextSlideIndex].getSlideElement());
				$(currentSlideElement).css({
					"display": "inline-block",
					"opacity": 0
				});
				$(slideSetSizer).append(currentSlideElement);
				$(currentSlideElement).animate({
					"opacity": 1
				}, {
					complete: function () {
						$(document).data("slideAnimationStarted", false);
					},
					duration: 100
				});
			}


			function moveCurrentSlideLeftOut() {
				$(document).data("slideAnimationStarted", true);
				var currentSlideElement = $(that.slides[currentSlideIndex].getSlideElement());
				//var currentSlideElement = $(".slideObject");
				$(currentSlideElement).css("left", "50%").animate({
						"left": "0%",
						"opacity": 0
					},
					{
						"complete": function () {
							$(currentSlideElement).remove();
							$(document).data("slideAnimationStarted", false);
						}
					});
			}

			function moveCurrentSlideRightOut() {
				$(document).data("slideAnimationStarted", true);
				var currentSlideElement = $(that.slides[currentSlideIndex].getSlideElement());
				//var currentSlideElement = $(".slideObject");
				$(currentSlideElement).css("left", "50%").animate({
						"left": "100%",
						"opacity": 0
					},
					{
						"complete": function () {
							$(currentSlideElement).remove();
							$(document).data("slideAnimationStarted", false);
						}
					});
			}

			function moveSlideFromRightIn() {
				var currentSlideElement = $(that.slides[currentSlideIndex].getSlideElement());
				$(slideSetSizer).append(currentSlideElement);
				$(currentSlideElement).css("left", "100%").animate({
					"left": "50%",
					"opacity": 1
				});
			}

			function moveSlideFromLeftIn() {
				var currentSlideElement = $(that.slides[currentSlideIndex].getSlideElement());
				$(slideSetSizer).append(currentSlideElement);
				$(currentSlideElement).css("left", "0%").animate({
					"left": "50%",
					"opacity": 1
				});
			}
		}


		$(slideSetSizer).click(function () {

			var that = this;
			function disableAnim(){
				$(this).css({
					"-webkit-transition": "none",
					"-moz-transition": "none",
					"-ms-transition": "none",
					"-o-transition": "none",
					"transition": "none"
				})
			}
			$(placementElement).children().each(function () {
				$(this).css({
					opacity: 1,
					"-webkit-transition": "all 200ms ease",
					"-moz-transition": "all 200ms ease",
					"-ms-transition": "all 200ms ease",
					"-o-transition": "all 200ms ease",
					"transition": "all 200ms ease"
				});
			})
					.on("transitionend", disableAnim)
					.on("webkitTransitionEnd", disableAnim)
					.on("oTransitionEnd", disableAnim);
			$(placementElement).css("z-index", zindex);

			if (!Modernizr.csstransitions) {
				$(this).stop(true, false).animate({
						"height": 0,
						"margin-top": 0
					},
					{
						complete: function () {
							$(that).remove();
							unlockscrolling();
							$(document).unbind("keyup");
							$(that).remove();
						}
					}
				);
			} else {
				function complete() {
					$(that).remove();
					unlockscrolling();
					$(document).unbind("keyup");
					$(that).remove();
				}

				$(this).css({
					height: 0,
					"margin-top": 0,
					"-webkit-transition": "all 200ms ease",
					"-moz-transition": "all 200ms ease",
					"-ms-transition": "all 200ms ease",
					"-o-transition": "all 200ms ease",
					"transition": "all 200ms ease"
				})
					.on("transitionend", complete)
					.on("webkitTransitionEnd", complete)
					.on("oTransitionEnd", complete);
			}


			$("#slideSetSelctor").fadeOut(400, function () {
				$(this).remove();
			});
		});
	}
}

function contactSlide() {
	var currentFontsize = $(".glow").css("font-size");
	$(".email").hover(function () {

		if (!Modernizr.csstransitions) {
			$(".glow").animate({
				"font-size": parseInt(currentFontsize) + 10
			}, 1000);
			$("#contact-title").fadeTo(1000, 0.2);
		} else {
			$("#contact-title, .emails").css({
				"-webkit-transition": "all 1s",
				"-moz-transition": "all 1s",
				"-o-transition": "all 1s",
				"-ms-transition": "all 1s",
				"transition": "all 1s"
			});

			if (Modernizr.csstransforms) {
				$(".emails").css({
					"-webkit-transform": "scale(1.25)",
					"-moz-transform": "scale(1.25)",
					"-ms-transform": "scale(1.25)",
					"-o-transform": "scale(1.25)",
					"transform": "scale(1.25)"
				});
			} else {
				$(".glow").css({
					"font-size": parseInt(currentFontsize) + 10
				});
			}


			$("#contact-title").css({
				"opacity": 0.2
			});
		}
	}, function () {
		if (!Modernizr.csstransitions) {
			$(".glow").animate({
				"font-size": currentFontsize
			}, 200);
			$("#contact-title").fadeTo(200, 1);
		} else {
			if (Modernizr.csstransforms) {
				$(".emails").css({
					"-webkit-transform": "scale(1)",
					"-moz-transform": "scale(1)",
					"-ms-transform": "scale(1)",
					"-o-transform": "scale(1)",
					"transform": "scale(1)"
				});
			} else {
				$(".glow").css({
					"font-size": currentFontsize
				});
			}
			$("#contact-title").css({
				"opacity": 1
			});
		}
	})
}

function initializeSlideViews() {
	$("#skills").css("visibility", "hidden");
	$("#work").css("visibility", "hidden");
	$("#contact").css("visibility", "hidden");
	$("#transition-slide2").css("visibility", "hidden");
	$("#transition-slide3").css("visibility", "hidden");

//			$("#skills, #work, #contact, #transition-slide2, #transition-slide3").hide();

}
function createNoCubeBgElementAfterElement(element, customBG) {
	var div = document.createElement("div");
	$(div).addClass("nocubeBGChrome");
	var html = $(element).html();
	$(element).html("");
	$(element).prepend(div);
	$(div).html(html);
	if (customBG) {
		$(div).css({
			"background-image": "none"
		});
	}

	return div;
}

function doesCSSExist(css) {
	return css in document.body.style;
}

function executeIfBackfaceVisibilityExists(toExecute) {
	if (doesCSSExist("webkitBackfaceVisibility")) {
		toExecute();
	}
}

function createNoCubeBgElementIfBackFaceExists(element, id, customBG) {
	executeIfBackfaceVisibilityExists(function () {
		var div = createNoCubeBgElementAfterElement(element, customBG);
		$(div).attr("id", id);
	});
}

function chromeOptimizations() {
	if (!doesCSSExist("webkitBackfaceVisibility")) {
		return;
	}
	createNoCubeBgElementIfBackFaceExists($("#aboutme"), "aboutmeBG");
	createNoCubeBgElementIfBackFaceExists($("#skills"), "skillsBG");
	createNoCubeBgElementIfBackFaceExists($("#work"), "workBG", "none");
//	function setElementToAbsoluteTopZero(element){
//		var that = this;
//		this.element = element;
//		this.execute = function(){
//			if(that.off !== true){
//				console.log("setting to zero!");
//				$(that.element).css({
//					position:"absolute",
//					top: 0
//				});
//				that.off = true;
//			}
//		}
//	}
	var $aboutmeBG = $("#aboutmeBG");
	var $skillsBG = $("#skillsBG");
	var $workBG = $("#workBG");
	var $parallaxbg1 = $("#parallaxbg-transition-slide1");
	var $parallaxbg2 = $("#parallaxbg-transition-slide2");
	var $parallaxbg3 = $("#parallaxbg-transition-slide3");
	var tenPercentOfWindowHeight = $("transition-slide1").height() * 0.1;
	var parallaxbg1position = $parallaxbg1.offset().top + tenPercentOfWindowHeight;
	var parallaxbg2position = $parallaxbg2.offset().top + tenPercentOfWindowHeight;
	var parallaxbg3position = $parallaxbg3.offset().top + tenPercentOfWindowHeight;
	var transitionslide1position = $("#transition-slide1").offset().top;
	var transitionslide2position = $("#transition-slide2").offset().top;
	var transitionslide3position = $("#transition-slide3").offset().top;
	var transitionslide4position = $("#transition-slide4").offset().top;
	var aboutmeposition = $aboutmeBG.offset().top;
	var skillsposition = $("#skills").offset().top;
	var workposition = $("#work").offset().top;
	var moveTriUpEnabled = true;
	var windowHieght = $(window).height() * 2;

//	var setAboutBGToZero = new setElementToAbsoluteTopZero($("#aboutmeBG"));
//	var setSkillsBGToZero = new setElementToAbsoluteTopZero($("#skillsBG"));
	$(window).scroll(function () {
		window.requestAnimationFrame(function () {

			var currentPosition = $(window).scrollTop();

			if (currentPosition > 0 && currentPosition < aboutmeposition) {
				//			console.log("50% "+(currentPosition-transitionslide1position).toString()+"px");
				$parallaxbg1.css({
					"background-position": "50% " + (currentPosition - parallaxbg1position).toString() + "px"
				});
//				$("#parallaxbg-transition-slide1").css({
//					"position": "absolute",
//					top:currentPosition-parallaxbg1position,
//					width: "100%"
//				});
//				$("#parallaxbg-transition-slide1").css({
//					position:"fixed",
//					width: "100%"
//				})
			} else if (currentPosition > aboutmeposition && currentPosition < skillsposition) {
				$parallaxbg2.css({
					"background-position": "50% " + (currentPosition - parallaxbg2position).toString() + "px"
				});
			} else if (currentPosition > skillsposition && currentPosition < workposition) {
				$parallaxbg3.css({
					"background-position": "50% " + (currentPosition - parallaxbg3position).toString() + "px"
				});
			}
			if (currentPosition > transitionslide1position && currentPosition < aboutmeposition) {
				$aboutmeBG.css({
					top: currentPosition - aboutmeposition
				});
			} else {
				$aboutmeBG.css({
					top: 0
				});

				if (currentPosition > transitionslide2position && currentPosition < skillsposition) {
					$skillsBG.css({
						"transition": "none !important",
						top: currentPosition - skillsposition
					});
					if (!moveTriUpEnabled) {
						moveTriUpEnabled = true;
						$("#skillsBG").css({
							"background-position": "50% 0%"
						});
					}
				}
				else {
					if (currentPosition > transitionslide3position && currentPosition < workposition) {
						$workBG.css({
							top: currentPosition - workposition,
							"z-index": 0
						});
					}
					else {
						$workBG.css({
							top: 0
						});
					}
					$skillsBG.css({
						top: 0
					});
					if (currentPosition >= skillsposition && moveTriUpEnabled) {
						moveTriUpEnabled = false;
						$skillsBG.css({
							"transition": "all 500ms ease",
//					"-webkit-transform": "translateY(-" + windowHieght + "px)"
							"background-position": "50% -" + windowHieght.toString() + "px"
						});
					}
				}

			}
		});

	});
}


//main
(function () {
	//run immediately
	if (window.mobilecheck()) {
		//redirect if browser is mobile
		window.location = "mobile/";
	}


	$(document).ready(function () {
		console.log("loading...");
		initializeLoadingScreen();
		var maskAspectRatio = 800 / 402;
		var backGroundAspectRatio = 1920 / 1426;
		linkElementToViewPortHeight($('.cover'));
		linkElementToViewPortHeight($('.content'));
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.transition'));
		//createTriangularTextWrappingSpace($('#about'), 15);
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.center800'));
		keepAspectRatioByAdjustingHeight(maskAspectRatio, $('.inner-transition'));
		mainPage();
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide1"), false);
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide2"), false);
		createArrowTransitionSlide(maskAspectRatio, 800, $("#transition-slide3"), false);

		initializeSlideViews();

		fixedPositionOnScrollPastAndHandle($("#aboutme"), function () {
			$("#skills").css("visibility", "visible");
			$("#transition-slide2").css("visibility", "visible");
			$("#transition-slide1").css("visibility", "hidden");


		}, function () {
			$("#transition-slide1").css("visibility", "visible");

			$("#transition-slide2").css("visibility", "hidden");
			$("#skills").css("visibility", "hidden");
		});
		//cardFanSlideSets($("#worklist"));

		fixedPositionOnScrollPastAndHandle($("#skills"), function () {
			$("#aboutme").css("visibility", "hidden");
			$("#transition-slide2").css("visibility", "hidden");
			$("#work").css("visibility", "visible");
			$("#transition-slide3").css("visibility", "visible");
		}, function () {
			$("#transition-slide2").css("visibility", "visible");
			$("#aboutme").css("visibility", "visible");

			$("#transition-slide3").css("visibility", "hidden");
			$("#work").css("visibility", "hidden");
		});
		if (!doesCSSExist("webkitBackfaceVisibility")) {
			scrollPastAndSlideUp($("#skills"), backGroundAspectRatio);
		}
		//		scrollPastAndSlideUp($('#transition-slide2'), backGroundAspectRatio, $('#skills'));
		//		scrollPastAndSlideUp($("#aboutme"), backGroundAspectRatio, $("#skills"));
		horizontalCenter($("#coreskills"));
		if (doesSVGForeignObjectExist()) {
			createTriangleTransitionSlide($("#transition-slide4"), "#2D2D3D");
		}
		scrolling();
		ieSpecificChecks();

//		The initial area of the occupied space by text is not accurate. Thus you have to use ludicrous angles
//		to achieve the correct triangular effect
		var triangleText = new createTriangularTextWrappingSpace2($("#about"), Math.PI * 8);
		triangleText.appendToElement();
		contactSlide();
		chromeOptimizations();
		coreSkillsSlide($("#coreskills"), 180, 2, 200, 50);
		fixedPositionOnScrollPastAndHandle($("#work"), function () {
			$("#contact").css("visibility", "visible");
		}, function () {
			$("contact").css("visibility", "hidden");

			$("#tranistion-slide3").css("visibility", "visible");
			$("#skills").css("visibility", "visible");
		});
		createHexagonChain($("#work"), 10, 1920, 1424);
		removeLoadingScreen();
		console.log("loading complete...");
	});
})();