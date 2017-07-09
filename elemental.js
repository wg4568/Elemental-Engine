// Elememtal object acts as a container for engine
var Elemental = {};

// Main canvas class, manages all interaction with the canvas element
Elemental.Canvas = class {
	constructor(id) {
		this._canvas = document.getElementById(id);
		this._context = this._canvas.getContext("2d");
		this.mousePos = Elemental.Vector.Empty;

		this.keyState = {};
		this.keyStateDown = {};
		this.keyStateUp = {};
	}

	// Getters and setters
	get canvas() {
		return this._canvas;
	}

	get context() {
		return this._context;
	}

	get width() {
		return this.canvas.width;
	}

	set width(value) {
		this.canvas.width = value;
	}

	get height() {
		return this.canvas.height;
	}

	set height(value) {
		this.canvas.height = value;
	}

	get size() {
		return {x: this.height, y: this.width};
	}

	get center() {
		return {x: this.canvas.width/2, y: this.canvas.height/2};
	}

	// Event handling methods
	keyDownEvent(keycode) {
		this.keyState[keycode] = 1;
		this.keyStateDown[keycode] = 1;
	}

	keyUpEvent(keycode) {
		this.keyState[keycode] = 0;
		this.keyStateUp[keycode] = 1;
	}

	// State reading methods
	keyDown(keycode) {
		var state = this.keyStateDown[keycode];
		if (state == 1) return true;
		else return false;
	}

	keyUp(keycode) {
		var state = this.keyStateUp[keycode];
		if (state == 1) return true;
		else return false;
	}

	keyHeld(keycode) {
		var state = this.keyState[keycode];
		if (state == 1) return true;
		else return false;
	}

	// Initiation function
	start(func) {
		var parent = this;

		document.addEventListener("keydown", function(event) {
			parent.keyDownEvent(event.keyCode);
		});
		document.addEventListener("keyup", function(event) {
			parent.keyUpEvent(event.keyCode);
		});

		Elemental.Helpers.GameLoopManager.run(function(time) {
			func(parent, time);
			parent.keyStateDown = {};
			parent.keyStateUp = {};
		});
	}

	stop() {
		Elemental.Helpers.GameLoopManager.stop();
	}

	// Draw functions
	drawFill(color) {
		this.drawRect(color, Elemental.Vector.Empty, this.width, this.height);
	}

	drawLine(p1, p2, color="black", width=1, caps="round") {
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.lineCap = caps;

		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);
		this.context.lineTo(p2.x, p2.y);
		this.context.stroke();
	}

	drawText(font, text, posn, color="black") {
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText(text, posn.x, posn.y);
	}

	drawRect(color, posn, w, h) {
		this.context.fillStyle = color;
		this.context.fillRect(posn.x, posn.y, w, h);
	}

	drawSprite(sprite, posn) {
		var toDraw = [];
		var x = posn.x;
		var y = posn.y;
		for (var property in sprite.shapes) {
			if (sprite.shapes.hasOwnProperty(property)) {
				var element = sprite.shapes[property];
				toDraw.push(element);
			}
		}

		toDraw.sort(function(a, b){
			if (a.layer > b.layer) return 1;
			if (a.layer < b.layer) return -1;
			return 0;
		});

		for (var elementIndex in toDraw) {
			var element = toDraw[elementIndex];
			var scaleFactor = sprite.scale * element.scale;

			this.context.strokeStyle = element.lineColor;
			this.context.lineWidth = element.lineWidth;
			this.context.lineCap = element.lineCaps;
			this.context.lineJoin = element.lineCorners;
			this.context.miterLimit = element.lineMiterLimit;
			this.context.setLineDash([element.lineDashWidth, element.lineDashSpacing]);
			this.context.lineDashOffset = element.lineDashOffset;
			this.context.fillStyle = element.fillColor;

			this.context.translate(x, y);
			this.context.rotate(Elemental.Helpers.toRadians(element.rotation+sprite.rotation));

			this.context.beginPath();

			if (element.type == "poly") {
				this.context.beginPath();
				this.context.moveTo(
					(element.points[0].x-element.center.x)*scaleFactor,
					(element.points[0].y-element.center.y)*scaleFactor
				);
				for (var i=1; i<element.points.length; i++) {
					this.context.lineTo(
						(element.points[i].x-element.center.x)*scaleFactor,
						(element.points[i].y-element.center.y)*scaleFactor
					);
				}
			}

			if (element.type == "arc") {
				// console.log(element.arc)
				this.context.arc(
					(element.arc.center.x-element.center.x)*scaleFactor,
					(element.arc.center.y-element.center.y)*scaleFactor,
					(element.arc.radius)*scaleFactor,
					Elemental.Helpers.toRadians(element.arc.start),
					Elemental.Helpers.toRadians(element.arc.end)
				);
			}

			if (element.closePath) {
				this.context.closePath();
			}

			if (element.strokeFirst) {
				if (element.lineWidth > 0) { this.context.stroke(); }
				this.context.fill();
			} else {
				this.context.fill();
				if (element.lineWidth > 0) { this.context.stroke(); }
			}

			this.context.rotate(-Elemental.Helpers.toRadians(element.rotation+sprite.rotation));
			this.context.translate(-x, -y);
		};
	}
}

// Helper object filled with helper functions and classes
Elemental.Helpers = {}

Elemental.Helpers.toRadians = function(degrees) {
	return degrees * Math.PI / 180;
}

// GameLoopManager By Javier Arevalo
Elemental.Helpers.GameLoopManager = new function() {
	this.lastTime = 0;
	this.gameTick = null;
	this.prevElapsed = 0;
	this.prevElapsed2 = 0;

	this.run = function(gameTick) {
		var prevTick = this.gameTick;
		this.gameTick = gameTick;
		if (this.lastTime == 0)
		{
			// Once started, the loop never stops.
			// But this function is called to change tick functions.
			// Avoid requesting multiple frames per frame.
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
			this.lastTime = 0;
		}
	}

	this.stop = function() {
		this.run(null);
	}

	this.tick = function () {
		if (this.gameTick != null)
		{
			var bindThis = this;
			requestAnimationFrame(function() { bindThis.tick(); } );
		}
		else
		{
			this.lastTime = 0;
			return;
		}
		var timeNow = Date.now();
		var elapsed = timeNow - this.lastTime;
		if (elapsed > 0)
		{
			if (this.lastTime != 0)
			{
				if (elapsed > 1000) // Cap max elapsed time to 1 second to avoid death spiral
				elapsed = 1000;
				// Hackish fps smoothing
				var smoothElapsed = (elapsed + this.prevElapsed + this.prevElapsed2)/3;
				this.gameTick(0.001*smoothElapsed);
				this.prevElapsed2 = this.prevElapsed;
				this.prevElapsed = elapsed;
			}
			this.lastTime = timeNow;
		}
	}
}

Elemental.Sprite = class {
	constructor(shapes) {
		this.rotation = 0;
		this.scale = 1;
		this.shapes = shapes;
	}
}

Elemental.Shape = class {
	constructor(data={}) {
		this.type = null,
		this.layer = 0;
		this.scale = 1;
		this.center = Elemental.Vector.Empty;
		this.rotation = 0;

		this.lineWidth = 1;
		this.lineColor = "black";
		this.lineCaps = "round";
		this.lineCorners = "round";
		this.lineMiterLimit = null;
		this.lineDashWidth = null;
		this.lineDashSpacing = null;

		this.fillColor = null;
		this.closePath = false;
		this.strokeFirst = false;

		this.inherit(data);
	}

	inherit(data) {
		for (var property in data) {
			if (data.hasOwnProperty(property)) {
				this[property] = data[property]
			}
		}
	}
}

Elemental.Shape.Polygon = class extends Elemental.Shape {
	constructor(points, data={}) {
		super();
		this.type = "poly";
		this.points = points;
		this.closePath = true;
		this.fillColor = "grey";

		this.inherit(data);
	}
}

Elemental.Shape.Line = class extends Elemental.Shape {
	constructor(points, data={}) {
		super();
		this.type = "poly";
		this.points = points;
		this.closePath = false;
		this.lineWidth = 1;
		this.lineColor = "black";

		this.inherit(data);
	}
}

Elemental.Shape.Arc = class extends Elemental.Shape {
	constructor(radius, data={}, start=0, end=360) {
		super();
		this.type = "arc";
		this.arc = {
			center: Elemental.Vector.Empty,
			radius: radius,
			start: start,
			end: end
		}
		this.closePath = true;
		this.fillColor = "grey";

		this.inherit(data);
	}
}

// Vector class and function definitions
Elemental.Vector = class {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static get Empty() {
		return {x: 0, y: 0};
	}

	static IsVector(vector) {
		return vector.hasOwnProperty("x") && vector.hasOwnProperty("y");
	}

	static Add() {
		var total = new Elemental.Vector(0, 0);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Elemental.Vector.IsVector(arguments[i])) {
				total.x += arguments[i].x;
				total.y += arguments[i].y;
			} else {
				total.x += arguments[i];
				total.y += arguments[i];
			}
		}
		return total;
	}

	static Subtract() {
		var total = new Elemental.Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Elemental.Vector.IsVector(arguments[i])) {
				total.x -= arguments[i].x;
				total.y -= arguments[i].y;
			} else {
				total.x -= arguments[i];
				total.y -= arguments[i];
			}
		}
		return total;
	}

	static Multiply() {
		var total = new Elemental.Vector(1, 1);
		for (var i = 0; i < arguments.length; i++ ) {
			if (Elemental.Vector.IsVector(arguments[i])) {
				total.x *= arguments[i].x;
				total.y *= arguments[i].y;
			} else {
				total.x *= arguments[i];
				total.y *= arguments[i];
			}
		}
		return total;
	}

	static Divide() {
		var total = new Elemental.Vector(arguments[0].x, arguments[0].y);
		for (var i = 1; i < arguments.length; i++ ) {
			if (Elemental.Vector.IsVector(arguments[i])) {
				total.x /= arguments[i].x;
				total.y /= arguments[i].y;
			} else {
				total.x /= arguments[i];
				total.y /= arguments[i];
			}
		}
		return total;
	}
}

// Keycode definitions
Elemental.Keycodes = {
	BACKSPACE: 8,
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	BREAK: 19,
	CAPSLOCK: 20,
	ESCAPE: 27,
	SPACE: 32,
	PGUP: 33,
	PGDOWN: 34,
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	INSERT: 45,
	DELETE: 46,
	N0: 48,
	N1: 49,
	N2: 50,
	N3: 51,
	N4: 52,
	N5: 53,
	N6: 54,
	N7: 55,
	N8: 56,
	N9: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	LWIN: 91,
	RWIN: 92,
	SELECT: 93,
	NUM0: 96,
	NUM1: 97,
	NUM2: 98,
	NUM3: 99,
	NUM4: 100,
	NUM5: 101,
	NUM6: 102,
	NUM7: 103,
	NUM8: 104,
	NUM9: 105,
	MULTIPLY: 106,
	ADD: 107,
	SUBTRACT: 109,
	PERIOD: 110,
	DIVIDE: 111,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUMLOCK: 144,
	SCROLLLOCK: 145,
	SEMICOLON: 186,
	EQUAL: 187,
	COMMA: 188,
	DASH: 189,
	PERIOD: 190,
	FSLASH: 191,
	GRAVE: 192,
	OBRACKET: 219,
	BSLASH: 220,
	CBRAKET: 221,
	QUOTE: 222
}
