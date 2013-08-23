/*
	Fotofirmament Webgallery
	Copyright (C) 2013 Matthias Graf
	matthias.graf <a> eclasca.de
	
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// entry point
function interfaceInit() {
	new Fotofirmament(photos, pathToPhotos, pathToPreviews)
}

function Fotofirmament(photos, pathToPhotos, pathToPreviews) { // this block spans the whole file, so I dont indent it

var self = this
// set global reference for the DOM events
fotofirmament = this

// ---- constants
// use the fullsize image for transition. slows transition smoothness (fps), but may look better.
var useFullForAnimation = false
var defaultFullsizeImageSize = 91 // % of browser width or height, whichever is closer
var defaultFullscreenFullsizeImageSize = 100
var spaceBetweenPreviewsInPercentOfHorizontal = 0.2
// all in milliseconds
// if this is changed, it also has to be adjusted in the css!
var transitionLength = 400
// if I set a style to be the start-keyframe for a transition, the browser first
// needs to "acknowledge" that, before the end-keyframe can be set.
// otherwise the transition will not start, but jump to the end-keyframe right away
var cssUpdateMargin = 10
// align this with the css rules
var transitionLengthPlusMargin = transitionLength + 70
var showLoadingCircleAfterMS = transitionLength + 200
var timeToWaitUntilInterfaceElementsAreHiddenInSingleImageMode = 2000
var timeBetweenScrollingSteps = 10
var totalScrollingTime = 40 * timeBetweenScrollingSteps
var scrollOvershoot = 50 // px
// input and output are in [0,1]
// approximates ease-in-out
var scrollTransitionFunction = function(x) { return ( (Math.atan((x*2-1)*Math.PI/2)+1)/2 ) }
// linear
//var scrollTransitionFunction = function(x) { return x }


// changing the class attribute of DOM elements is what we do lots, so lets simplify it
function addOrReplaceClassAttr(elem, pattern, replacement) {
	if (replacement === undefined) // only called with 2 params, which means "pattern" is the replacement
		replacement = pattern
	changeClassAttr(elem, pattern, replacement, replacement)
}

function switchClassAttr(elem, name) {
	changeClassAttr(elem, name, "", name)
}

function removeClassAttr(elem, name) {
	changeClassAttr(elem, name, "", "")
}

function changeClassAttr(elem, pattern, replacementIfMatch, replacementIfFail) {
	changeAttr("class", elem, pattern, replacementIfMatch, replacementIfFail)
}

function changeAttr(attr, elem, pattern, replacementIfMatch, replacementIfFail) {
	if (elem !== null) {
		if (elem instanceof Array) {
			for (var i=0; i<elem.length; i++)
				changeAttr(attr, elem[i], pattern, replacementIfMatch, replacementIfFail)
		} else {
			if (typeof elem === 'string' || elem instanceof String) {
				var domElem = document.getElementById(elem)
				if (domElem === null) {
					console.log('Warning in changeAttr: "'+elem+'" not found in DOM tree.')
					return
				}
				elem = domElem
			}
			var c = elem.getAttribute(attr)
			if (c === null)
				elem.setAttribute(attr, replacementIfFail)
			else
				if (c.match(pattern))
					elem.setAttribute(attr, c.replace(pattern, replacementIfMatch))
				else
					elem.setAttribute(attr, c+" "+replacementIfFail)
		}
	} else {
		console.log("Warning in changeAttr: element is null!")
	}
}



// ---- METHOD DEFINTIONS
self.next = function () {
	if (self.current > 0) {
		self.current--
		self.switchCurrent(self.current+1, self.current)
	}
}

self.previous = function () {
	if (self.current+1 < self.photos.length) {
		self.current++
		self.switchCurrent(self.current-1, self.current)
	}
}

self.up = function () {
	if (self.current - numberOfPreviewsFittingIntoHorizontal >= 0) {
		self.current -= numberOfPreviewsFittingIntoHorizontal
		self.switchCurrent(self.current + numberOfPreviewsFittingIntoHorizontal, self.current)
	}
}

self.down = function () {
	if (self.current + numberOfPreviewsFittingIntoHorizontal < self.photos.length) {
		self.current += numberOfPreviewsFittingIntoHorizontal
		self.switchCurrent(self.current - numberOfPreviewsFittingIntoHorizontal, self.current)
	}
}

self.switchCurrent = function(oldCurrent, newCurrent) {
	if (!self.overviewIsActive) {
		self.photos[oldCurrent].hide()
		self.photos[newCurrent].show()
		self.updateURL()
	} else {
		removeClassAttr(self.photos[oldCurrent].preview, "isCurrent")
		addOrReplaceClassAttr(self.photos[newCurrent].preview, "isCurrent")
	}
	self.photos[newCurrent].scrollTo()
}

self.switchOpenClosePhoto = function(id) {
	if (self.overviewIsActive) {
		removeClassAttr(self.photos[self.current].preview, "isCurrent")
		if (id !== undefined) // if (id) does NOT work because id can be 0.
			self.current = id
		self.hideOverview()
		self.photos[self.current].open()
	} else {
		if (id !== undefined)
			self.current = id
		self.showOverview()
		self.photos[self.current].close()
	}
	self.updateURL()
}

self.zoomOut = function() {
	if (self.overviewIsActive) {
		numberOfPreviewsFittingIntoHorizontal++
		self.setPreviewSize()
	} else {
		if (self.fullsizeImageSize > 10) {
			self.fullsizeImageSize *= 0.9
			self.updateFillStyleOfCurrent()
		}
	}
}

self.zoomIn = function() {
	if (self.overviewIsActive) {
		if (numberOfPreviewsFittingIntoHorizontal > 1)
			numberOfPreviewsFittingIntoHorizontal--
		self.setPreviewSize()
	} else {
		if (self.fullsizeImageSize < 182) { // 182 * 1.1 ~= 200
			self.fullsizeImageSize *= 1.1
			self.updateFillStyleOfCurrent()
		}
	}
}

self.escape = function() {
	if (self.isFullscreen())
		self.cancelFullscreen()
	else if (!self.overviewIsActive)
		self.switchOpenClosePhoto()
}

self.updateFillStyleOfCurrent = function() {
	if (!self.overviewIsActive)
		self.photos[self.current].updateFillStyle()
}

self.updateURL = function() {
	window.location.href = window.location.href.split("#")[0] + "#" + ((!self.overviewIsActive)
		? self.photos[self.current].name
		: "overview")
}

// given with "http://www.bla.de/#nameOfPhoto"
self.getCurrentIdFromUrl = function() {
	var query = window.location.href.split("#")
	if (query.length > 1)
		return self.getIdFromPhotoName(query[1])
	return -1
}

self.getIdFromPhotoName = function(name) {
	for (var i=0; i<self.photos.length; i++)
		if (self.photos[i].name === name)
			return i
	return -1
}

self.finishedLoading = function(photoId) {
	if (photoId === self.current) {
		addOrReplaceClassAttr("loadingCircle", /opacity[^ ]*/, "opacity0")
		// start to preload next and previous photo
		if (self.current+1 < self.photos.length)
			self.preload(self.photos[self.current+1])
		if (self.current-1 > 0)
			self.preload(self.photos[self.current-1])
	}
}

self.preload = function(photo) {
	if (!photo.finishedLoading) {
//			console.log("preloading: "+photo.id)
		var i = new Image()
		i.addEventListener('load', function () {
			photo.finishedLoading = true
		})
		i.onerror = function() {
			self.showErrorMessageToUser()
			console.log("Error loading image: "+photo.url)
		}
		i.src = photo.url
	}
}

self.setHowManyPreviewsShouldFitIntoHorizontal = function() {
	var w = window.innerWidth
	if (w < 800) numberOfPreviewsFittingIntoHorizontal = 2
	else if (w < 1100) numberOfPreviewsFittingIntoHorizontal = 3
	else if (w < 1400) numberOfPreviewsFittingIntoHorizontal = 4
	else if (w < 1700) numberOfPreviewsFittingIntoHorizontal = 5
	else if (w < 2000) numberOfPreviewsFittingIntoHorizontal = 6
	else numberOfPreviewsFittingIntoHorizontal = 7
}

self.updateFitIntoHorizontal = function() {
	var first
	for (var i=0; i<self.photos.length; i++) {
		var x = self.photos[i].preview.parentNode.getBoundingClientRect().top
		if (i === 0)
			first = x
		else if (first !== x) {
			if (numberOfPreviewsFittingIntoHorizontal !== i) {
				numberOfPreviewsFittingIntoHorizontal = i
			}
			break
		}
	}
}

self.getCustomStyleCSSRule = function() {
	// I dont want to change the style of very element, so I change the css rules instead..
	// http://www.quirksmode.org/dom/changess.html
	var styleIndex = 0
	var cssRuleCode = document.all ? 'rules' : 'cssRules' //account for IE and FF
	var ruleIndex = 0 // well, 0 for simplicity reasons. the rule changed has to be put as first in the css!
	var rule = document.styleSheets[styleIndex][cssRuleCode][ruleIndex]
	console.assert(rule.selectorText === ".custom")
	return rule.style
}

self.setPreviewSize = function() {
	// the preview frame aspect is the same for all previews, so they form a nice grid
	// the disadvantage is that a lot of space may be lost between previews
	// this problem increases proportional to the standard deviation of the image aspect ratio
	// so, to minimise the problem, we set the aspectRatioOfOverviewPreviewFrames to the mean aspect of all images
	// this will give us the most evenly spread you space between all previews
	var totalWidth = 0, totalHeight = 0
	for (var i=0; i<self.photos.length; i++) {
		totalWidth += self.photos[i].width
		totalHeight += self.photos[i].height
	}
	var aspectRatioOfOverviewPreviewFrames = totalWidth/totalHeight
	
	// account for possible scroll bar
	// -20 just to be save
	var windowWidth = document.getElementById("overviewFrame").offsetWidth-20
//		var windowWidth = document.body.clientWidth*0.97-10
//		var windowWidth = window.innerWidth*0.97-20
	
	
	var margin = windowWidth*spaceBetweenPreviewsInPercentOfHorizontal
		/numberOfPreviewsFittingIntoHorizontal/2
	var w = windowWidth*(1-spaceBetweenPreviewsInPercentOfHorizontal)
		/numberOfPreviewsFittingIntoHorizontal
	var h = w/aspectRatioOfOverviewPreviewFrames

	var ruleStyle = self.getCustomStyleCSSRule()
	ruleStyle.width = w+"px"
	ruleStyle.height = h+"px"
	ruleStyle.margin = margin+"px"
	ruleStyle.transition = "all "+transitionLength+"ms ease-in-out"
}

self.hideOverview = function() {
	self.overviewIsActive = false
	var ruleStyle = self.getCustomStyleCSSRule()
	ruleStyle.opacity = 0
	addOrReplaceClassAttr(["title", "footer"], /opacity[^ ]*/, "opacity0")
	self.runTimerForHidingInterfaceElements()

	window.setTimeout(function () {
		self.showChangeImageButton()
		if (self.isFullscreen())
			addOrReplaceClassAttr(document.body, "hideScrollbar")
	}, cssUpdateMargin)
}

self.showOverview = function() {
	self.interfaceElementsAreHidden = false
	self.overviewIsActive = true
	var ruleStyle = self.getCustomStyleCSSRule()
	ruleStyle.opacity = 1
	self.hideChangeImageButton()
	addOrReplaceClassAttr("menu", /opacity[^ ]*/, "opacity1")
	addOrReplaceClassAttr(["title", "footer"], /opacity[^ ]*/, "opacity1")
	
	// if we dont wait, the overview will be visible right away, without the transition
	window.setTimeout(function () {
		removeClassAttr(document.body, "hideScrollbar")
	}, cssUpdateMargin)
}

self.hideChangeImageButton = function() {
	addOrReplaceClassAttr(["next", "previous"], /opacity[^ ]*/, "opacity0")
	addOrReplaceClassAttr(["next", "previous"], "noClick")
}

self.showChangeImageButton = function() {
	addOrReplaceClassAttr(["next", "previous"], /opacity[^ ]*/, "opacity_CIB")
	removeClassAttr(["next", "previous"], "noClick")
}

// after mouse rested a while
self.hideInterfaceElements = function() {
	self.hideChangeImageButton()
	addOrReplaceClassAttr("menu", /opacity[^ ]*/, "opacity0")
	
	var currentFullFluid = self.photos[self.current].fullFluid
	if (currentFullFluid)if (currentFullFluid.parentNode)
		addOrReplaceClassAttr(currentFullFluid.parentNode, "hideCursor")
}

self.showInterfaceElements = function() {
	self.showChangeImageButton()
	addOrReplaceClassAttr("menu", /opacity[^ ]*/, "opacity1")
	var currentFullFluid = self.photos[self.current].fullFluid
	if (currentFullFluid) if (currentFullFluid.parentNode)
		removeClassAttr(currentFullFluid.parentNode, "hideCursor")
}

self.runTimerForHidingInterfaceElements = function() {
	if (!self.overviewIsActive) {
		var thisTimer = ++currentTimerID
		window.setTimeout(function () {
			if (currentTimerID === thisTimer) {
//					console.log("timeout reached!")
				if (!self.overviewIsActive && !self.interfaceElementsAreHidden) {
					self.interfaceElementsAreHidden = true
					// hide
					self.hideInterfaceElements()
				}
			}
		}, timeToWaitUntilInterfaceElementsAreHiddenInSingleImageMode)
	}
}

self.getPhotoIdFromElem = function(elem) {
	var id = parseInt(elem.getAttribute("idPhoto"))
	console.assert(!isNaN(id) && id >= 0 && id < self.photos.length)
	return id
}

self.clickedPreview = function(thisElement) {
	var id = self.getPhotoIdFromElem(thisElement)
	self.switchOpenClosePhoto(id)
}

self.clickedClose = function(thisElement) {
	var id = self.getPhotoIdFromElem(thisElement)
	self.switchOpenClosePhoto(id)
}

self.switchFullscreen = function() {
	self.isFullscreen() ? self.cancelFullscreen() : self.requestFullscreen()
}

self.isFullscreen = function() {
	return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen
}

self.requestFullscreen = function() {
	if (!self.overviewIsActive)
		addOrReplaceClassAttr(document.body, "hideScrollbar")
	
	self.fullsizeImageSize = defaultFullscreenFullsizeImageSize
	self.updateFillStyleOfCurrent()
	self.hideChangeImageButton()

	var docElm = document.documentElement
	if (docElm.requestFullscreen)
		docElm.requestFullscreen()
	else if (docElm.mozRequestFullScreen)
		docElm.mozRequestFullScreen()
	else if (docElm.webkitRequestFullScreen)
		docElm.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
}

self.cancelFullscreen = function() {
	removeClassAttr(document.body, "hideScrollbar") // show scrollbar again
//	if (!self.overviewIsActive)
//		self.showChangeImageButton()
	self.fullsizeImageSize = defaultFullsizeImageSize
	self.updateFillStyleOfCurrent()

	if (document.exitFullscreen)
		document.exitFullscreen()
	else if (document.mozCancelFullScreen)
		document.mozCancelFullScreen()
	else if (document.webkitCancelFullScreen)
		document.webkitCancelFullScreen()
}

self.showErrorMessageToUser = function(message) {
	document.getElementById("errorMessages").innerHTML =
		"Oops. Something went wrong. "+(message !== undefined ? message : "The console output may provide more insight.")
	removeClassAttr("errorMessages", "hidden")
}

self.hideErrorMessages = function() {
	addOrReplaceClassAttr("errorMessages", "hidden")
}

self.key_w = function() { self.up() }
self.key_s = function() { self.down() }
self.key_a = function() { self.next() }
self.key_d = function() { self.previous() }
self.key_e = function() { self.switchOpenClosePhoto() }
self.key_f = function() { self.switchFullscreen() }
self.key_plus = function() { self.zoomIn() }
self.key_minus = function() { self.zoomOut() }
self.key_esc = function() { self.escape() }




















function Photo(id, photo) {
	var self = this

	self.id = id
	// {name: "22859.jpg", width: "1920", height: "1280", make: "Canon", model: "Canon EOS 400D DIGITAL"
	// , exposure: "1/800", aperture: "f/3.2", date: "2013:06:24 20:11:48", focalLength: "50/1", iso: "100"}
	self.name = photo.name
	
	self.width = parseInt(photo.width)
	self.height = parseInt(photo.height)
	if (isNaN(self.width) || isNaN(self.height) || self.width <= 0 || self.height <= 0) {
		console.log("The Photo "+self.name+" reports an invalid width or height.")
		self.showErrorMessageToUser()
		// try to be robust
		self.width = 300
		self.height = 200
	}

	// optional
	if (photo.make			!== undefined) self.make		= photo.make
	if (photo.mode			!== undefined) self.model		= photo.model
	if (photo.exposure		!== undefined) self.exposure	= photo.exposure
	if (photo.aperture		!== undefined) self.aperture	= photo.aperture
	if (photo.date			!== undefined) self.date		= photo.date
	if (photo.focalLength	!== undefined) self.focalLength = photo.focalLength
	if (photo.iso			!== undefined) self.iso			= photo.iso
	
	self.url = pathToPhotos + self.name
	self.previewUrl = pathToPreviews + self.name

	self.finishedLoading = false
	self.fillStyle

	// DOM elements
	self.preview
	self.previewScaled
	self.previewScaledFluid
	self.full
	self.fullFluid

	// ---- METHOD DEFINITION
	self.loadPreview = function() {
		var frameDiv = document.createElement("div")
		frameDiv.setAttribute("id", "preview"+self.id)
		frameDiv.setAttribute("class", "imgContainerDiv custom")
		document.getElementById("overviewFrame").appendChild(frameDiv)

		var span = document.createElement("span")
		span.setAttribute("class", "helperSpanToAlignImageVertically")
		frameDiv.appendChild(span)

		self.preview = document.createElement("img")
		self.preview.setAttribute("id", self.id)
		self.preview.setAttribute("idPhoto", self.id)
		self.preview.setAttribute("class", "previewPic opacity0")
		self.preview.setAttribute("onclick", "fotofirmament.clickedPreview(this)")
	//		self.preview.setAttribute("onmouseover", "mouseoverPreview(this)")
		frameDiv.appendChild(self.preview)
		self.preview.addEventListener('load', function () {
			addOrReplaceClassAttr(self.preview, /opacity[^ ]*/, "opacity1")
		}, true)
		self.preview.setAttribute("src", self.previewUrl)
	}

	self.newFrame = function(name, frameClass, picClass, style, src, callbackOnImageLoaded) {
		var frameDiv = document.createElement("div")
		frameDiv.setAttribute("id", "picFrame_"+name+self.id)
//		frameDiv.setAttribute("idPhoto", self.id)
//		frameDiv.setAttribute("onclick", "fotofirmament.clickedClose(this)")
		frameDiv.setAttribute("class", frameClass)
		document.body.appendChild(frameDiv)

		var span = document.createElement("span")
		span.setAttribute("class", "helperSpanToAlignImageVertically")
		frameDiv.appendChild(span)

		var pic = document.createElement("img")
		pic.setAttribute("id", name+self.id)
		pic.setAttribute("idPhoto", self.id)
		pic.setAttribute("class", picClass)
		pic.setAttribute("style", style)
		pic.setAttribute("onclick", "fotofirmament.clickedClose(this)")
		if (callbackOnImageLoaded !== undefined)
			pic.addEventListener('load', callbackOnImageLoaded, true)
		pic.setAttribute("src", src)
		frameDiv.appendChild(pic)
		return pic
	}

	self.callbackOnFinishedLoading = function () {
		self.finishedLoading = true
		fotofirmament.finishedLoading(self.id)
	}

	// keyframes for transitioning a preview (in overview mode) to its fullsize
	self.getStyleForTransitionStart = function() {
		var rect = self.preview.getBoundingClientRect()
		return "width: "+self.preview.offsetWidth+"px; left: "+rect.left+"px; top: "+rect.top
			+"px; transition: all "+transitionLength+"ms ease-in-out;"
	}

	self.getStyleForTransitionEnd = function() {
		var ww = document.body.clientWidth // acounts for scrollbars, window.innerWidth doesnt
		var wh = window.innerHeight // document.body.clientHeight === 0 in firefox

		var actualWidth = ww/wh > self.width/self.height
			? wh*(fotofirmament.fullsizeImageSize/100)*(self.width/self.height)
			: ww*(fotofirmament.fullsizeImageSize/100)
		var actualHeight = actualWidth*(self.height/self.width)
		return "width: "+actualWidth+"px; left: "+(ww-actualWidth)/2+"px; top: "+(wh-actualHeight)/2
			+"px; transition: all "+transitionLength+"ms ease-in-out;"
	}
	
	// this updates how an image is fit into its frame by either restraining its width or height
	self.updateFillStyle = function(force) {
		// decide which side to scale: the one closer to the browser window border.
		// fotofirmament.fullsizeImageSize/2 because the frame is 200% the browser window size
		// in order to allow zooming beyond the browser window borders
		var fillStyle = ((document.body.clientWidth/window.innerHeight > self.width/self.height)
			? "height" : "width")+":"+(fotofirmament.fullsizeImageSize/2)+"%;"
		
		// force means the elements are set up for the first time, so we allways want to set their initial style
		if (fillStyle !== self.fillStyle || force === "force") {
			// we dont want to transition newly initialised images
			if (force !== "force")
				fillStyle += "transition: width 100ms ease-in-out, height 100ms ease-in-out;"
			if (self.previewScaledFluid) self.previewScaledFluid.setAttribute("style", fillStyle)
			if (self.fullFluid) self.fullFluid.setAttribute("style", fillStyle)
			self.fillStyle = fillStyle
		}
	}

	// realises going from overview mode to the single image viewing mode
	self.open = function() {
		// during transition, loading can already be started
		fotofirmament.preload(this)
		var style = self.getStyleForTransitionStart()
		self.previewScaled = self.newFrame("previewScaled", "frame z2", "movingImage", style, self.previewUrl)
		if (useFullForAnimation) self.full = self.newFrame("full", "frame z3", "movingImage", style, self.url)
		addOrReplaceClassAttr(self.preview, /opacity[^ ]*/, "opacity0_noTransition")
		addOrReplaceClassAttr(self.preview, "visited")

		window.setTimeout(function () {
			var style = self.getStyleForTransitionEnd()
			self.previewScaled.setAttribute("style", style)
			if (useFullForAnimation) self.full.setAttribute("style", style)
		}, cssUpdateMargin)

		window.setTimeout(function () {
			if (!fotofirmament.overviewIsActive && self.id === fotofirmament.current) {
				self.previewScaledFluid = self.newFrame("previewScaledFluid", "frame z2", "rawImage z2 imageBGnShadow opacity1", "", self.previewUrl)
				self.fullFluid = self.newFrame("fullFluid", "frame z3"+(fotofirmament.interfaceElementsAreHidden ? " hideCursor" : "")
					, "rawImage z3 opacity1", "", self.url, self.callbackOnFinishedLoading)
				self.updateFillStyle("force")
				self.removeOpenTransitionArtifacts()
			}
		}, transitionLengthPlusMargin)

		self.showLoadingCircleIfNotFinishedLoadingAfterInterval()
	}

	self.removeOpenTransitionArtifacts = function() {
		addOrReplaceClassAttr(self.preview, /opacity[^ ]*/, "opacity1_noTransition")
		self.removeFrameOf(self.previewScaled)
		if (useFullForAnimation) self.removeFrameOf(self.full)
	}

	// for going back to the overview
	self.close = function() {
		// if they are not still transitioning / if not closed before fully opened yet
		if (!self.preview.getAttribute("class").match(/opacity0[^ ]*/)) {
			var style = self.getStyleForTransitionEnd()
			self.previewScaled = self.newFrame("previewScaled", "frame z2", "movingImage", style, self.previewUrl)
			if (useFullForAnimation) self.full = self.newFrame("full", "frame z3", "movingImage", style, self.url)
			addOrReplaceClassAttr(self.preview, /opacity[^ ]*/, "opacity0_noTransition")
			self.removeFrameOf(self.previewScaledFluid)
			self.removeFrameOf(self.fullFluid)
			addOrReplaceClassAttr("loadingCircle", /opacity[^ ]*/, "opacity0")
			self.scrollTo("noAnimation")
		} else {
			console.log("close() has been called before open() could finish transitioning")
		}

		window.setTimeout(function () {
			var style = self.getStyleForTransitionStart()
			self.previewScaled.setAttribute("style", style)
			if (useFullForAnimation) self.full.setAttribute("style", style)
		}, cssUpdateMargin)

		window.setTimeout(function () {
			self.removeOpenTransitionArtifacts()
			addOrReplaceClassAttr(self.preview, "visited")
			// disabled. I only want to see the isCurrent markup if I used keys (not the mouse)
			if (false) if (fotofirmament.overviewIsActive && self.id === fotofirmament.current)
				addOrReplaceClassAttr(self.preview, "isCurrent")
		}, transitionLengthPlusMargin)
	}

	self.show = function() {
		self.previewScaledFluid = self.newFrame("previewScaledFluid", "frame z2", "rawImage z0 imageBGnShadow opacity0", "", self.previewUrl)
		self.fullFluid = self.newFrame("fullFluid", "frame z3"+(fotofirmament.interfaceElementsAreHidden ? " hideCursor" : "")
			, "rawImage z1 opacity0", "", self.url, self.callbackOnFinishedLoading)
		self.updateFillStyle("force")
		if (self.preview) // is null before overview is loaded.
			addOrReplaceClassAttr(self.preview, "visited")

		window.setTimeout(function () {
			addOrReplaceClassAttr([self.previewScaledFluid, self.fullFluid], /opacity[^ ]*/, "opacity1")
		}, cssUpdateMargin)

		window.setTimeout(function () {
			addOrReplaceClassAttr(self.previewScaledFluid, /z./, "z2")
			addOrReplaceClassAttr(self.fullFluid, /z./, "z3")
		}, transitionLengthPlusMargin)

		self.showLoadingCircleIfNotFinishedLoadingAfterInterval()
	}

	self.hide = function() {
		// this is just a precausion ... if open() is followed by this call before transition could end
		self.removeOpenTransitionArtifacts()
		// may be null if next was called, before transition could end (resulting in showing the full picture)
		if (self.previewScaledFluid)
			addOrReplaceClassAttr(self.previewScaledFluid, /opacity[^ ]*/, "opacity0")
		if (self.fullFluid)
			addOrReplaceClassAttr(self.fullFluid, /opacity[^ ]*/, "opacity0")

		window.setTimeout(function () {
			if (self.id !== fotofirmament.current) {
				self.removeFrameOf(self.previewScaledFluid)
				self.removeFrameOf(self.fullFluid)
			}
		}, transitionLengthPlusMargin)
	}

	self.showLoadingCircleIfNotFinishedLoadingAfterInterval = function() {
		window.setTimeout(function () {
			if (!self.finishedLoading && fotofirmament.current === self.id)
				addOrReplaceClassAttr("loadingCircle", /opacity[^ ]*/, "opacity1")
		}, showLoadingCircleAfterMS)
	}
	
	self.removeFrameOf = function(elem) {
		if (elem !== null && elem !== undefined) {
			var elemid = elem.getAttribute("id")
			var frame = elem.parentNode
			if (frame) {
				var frameParent = frame.parentNode
				if (frameParent) {
					frameParent.removeChild(frame)
					// kill also all duplicates
					self.removeFrameOf(document.getElementById(elemid))
				}
			}
		}
	}

	// smooth scrolling the overview to the preview image
	self.scrollTo = function(noAnimation) {
		var rect = self.preview.getBoundingClientRect()
		var elemTop = rect.top
		var elemBottom = rect.bottom
		var wh = window.innerHeight

		// locking
		currentScrollAnimationID++
		var thisScrollAnimationID = currentScrollAnimationID
		
		// input may be negative (scrolls upwards), or positive (scroll down)
		var scrollLoop = function(totalDistanceToGo, distanceTraveled, timePassed) {
			if (noAnimation) { // one step only
				window.scrollBy(0, totalDistanceToGo)
				return
			}
			if (distanceTraveled === undefined)
				distanceTraveled = 0
			if (timePassed === undefined)
				// if timePassed would be === 0, we would not move in this round
				timePassed = timeBetweenScrollingSteps
			if (thisScrollAnimationID !== currentScrollAnimationID
					|| Math.abs(distanceTraveled) >= Math.abs(totalDistanceToGo)
					|| timePassed > totalScrollingTime)
				return
			
			var x = timePassed / totalScrollingTime
			var y = scrollTransitionFunction(x)
			var d = totalDistanceToGo * y
			var stepLength = d - distanceTraveled
			
			window.scrollBy(0, stepLength)
			
			window.setTimeout(function () {
				scrollLoop(totalDistanceToGo, distanceTraveled + stepLength, timePassed + timeBetweenScrollingSteps)
			}, timeBetweenScrollingSteps)
		}
		
		if (elemTop < 0)
			scrollLoop(elemTop - scrollOvershoot)
		if (elemBottom > wh)
			scrollLoop(elemBottom - wh + scrollOvershoot)
	}
}

















// in case multiple timers are running in parallel, used to determine which is the current/latest one
var currentTimerID = 0
var currentScrollAnimationID = 0
var numberOfPreviewsFittingIntoHorizontal
self.fullsizeImageSize = defaultFullsizeImageSize
self.interfaceElementsAreHidden = false

if (Object.prototype.toString.call( photos ) !== '[object Array]' || photos.length <= 0) {
	console.log("something is wrong with the photos variable")
	self.showErrorMessageToUser("There seem to be no photos.")
	return
}
if (navigator.appName === "Microsoft Internet Explorer")
	self.showErrorMessageToUser("Internet Explorer detected. Please get yourself a decent browser before someone gets hurt.")

// sort photos by name
// TODO use exif date instead, if existing
photos.sort(function(a,b) { return -(a.name.localeCompare(b.name)) })
// photos and self.photos are very different things
self.photos = new Array(photos.length)
for (var i=0; i<photos.length; i++)
	self.photos[i] = new Photo(i, photos[i])

self.setHowManyPreviewsShouldFitIntoHorizontal()
self.setPreviewSize()
// currently selected photo
self.current = self.getCurrentIdFromUrl()
self.overviewIsActive = self.current === -1

if (self.overviewIsActive) {
	// default
	self.current = 0
	self.showOverview()
} else {
	self.photos[self.current].show()
	// hide before starting to load, to load in the background
	self.hideOverview()
}

// TODO load previews in a more intelligent on-demand-way
// -> calulate which previews are actually visible (depends on page position, how many fit into horizontal, body width and preview aspect)
// -> changes with selected image, page scroll, window resize, zoom in/out
for (var i=0; i<self.photos.length; i++)
	self.photos[i].loadPreview()
self.photos[self.current].scrollTo("noAnimation")

window.onresize = function(event) {
	self.updateFillStyleOfCurrent()
	self.updateFitIntoHorizontal()
//		self.setPreviewSize()
}

var lastMousePosition = [0,0]
window.onmousemove = function(event) {
	// ok, seems like chrome fires onmousemove events even though the mouse did not move
	// so we will need to check the mouse position ...
	var mousePosition = [event.clientX, event.clientY]
	if (!(lastMousePosition[0] === mousePosition[0] && lastMousePosition[1] === mousePosition[1]))
		if (!self.overviewIsActive) {
			if (self.interfaceElementsAreHidden) {
				self.interfaceElementsAreHidden = false
				self.showInterfaceElements()
			}
			self.runTimerForHidingInterfaceElements()
		}
	lastMousePosition = mousePosition
}

document.addEventListener("keydown", function (evt) {
	switch(evt.keyCode) {
	case 87: self.key_w(); break
	case 83: self.key_s(); break
	case 37: // left arrow
	case 65: self.key_a(); break
	case 39: // right arrow
	case 68: self.key_d(); break
	case 13: // enter
	case 71: // g
	case 69: self.key_e(); break
	case 70: self.key_f(); break
//		case 76: // l // lights on and off
	case 107: self.key_plus(); break
	case 109: self.key_minus(); break
	case 27: self.key_esc(); break
	default:
		if (false)
			console.log("keydown. You pressed the " + evt.keyCode + " key")
	}
}, false)

}
