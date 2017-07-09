// Sentinel object acts as a container for viewport code
var Sentinel = {};

Sentinel.Viewport = class {
	constructor(canvas) {
		this.canvas = canvas;
		this.camera = new Elemental.Vector(0, 0);
	}

	get x() {
		return this.camera.x;
	}

	get y() {
		return this.camera.y;
	}

	get position() {
		return this.camera;
	}

	set x(value) {
		this.camera.x = value;
	}

	set y(value) {
		this.camera.y = value;
	}

	set position(value) {
		this.camera = value;
	}

	get xmin() {
		return this.camera.x - canvas.center.x;
	}

	get xmax() {
		return this.camera.x + canvas.center.x;
	}

	get ymin() {
		return this.camera.y - canvas.center.y;
	}

	get ymax() {
		return this.camera.y + canvas.center.y;
	}

	translatePoint(point) {
		var newPoint = Elemental.Vector.Subtract(point, this.position);
		newPoint = Elemental.Vector.Add(newPoint, this.canvas.center)
		return newPoint;
	}

	drawFill(color) {
		this.canvas.drawFill(color);
	}

	drawLine(point1, point2, color="black", width=1, caps="round") {
		this.canvas.drawLine(
			this.translatePoint(point1),
			this.translatePoint(point2),
			color=color,
			width=width,
			caps=caps
		)
	}

	drawText(font, text, posn, color="black") {
		this.canvas.drawText(font, text, this.translatePoint(posn), color=color);
	}

	drawRect(color, posn, w, h) {
		this.canvas.drawRect(color, this.translatePoint(posn), w, h);
	}

	drawImage(image, posn) {
		this.canvas.drawImage(image, this.translatePoint(posn));
	}

	drawSprite(sprite, posn) {
		this.canvas.drawSprite(sprite, this.translatePoint(posn));
	}
}

Sentinel.Viewport.Tiled = class extends Sentinel.Viewport {
	constructor(canvas, level, tileSize=32) {
		super(canvas);
		this.levelRaw = level;
		this.level = {};

		this.parse();
	}

	parse() {
		var binData = new Uint8Array(this.levelRaw);
		var data = pako.inflate(binData);
		var stringData = String.fromCharCode.apply(null, new Uint16Array(data));
		var level = JSON.parse(atob(stringData));
		this.level = level;
		this.level.images = {};
		this.tileSize = this.level.tileSize;
		for (var property in this.level.tiles) {
			if (this.level.tiles.hasOwnProperty(property)) {
				var element = this.level.tiles[property];
				this.level.images[property] = Elemental.Helpers.LoadImage(element);
			}
		}
	}

	drawTile(gridPosn, gamePosn) {
		if ((gridPosn.x >= 0) && (gridPosn.y >= 0) && (gridPosn.x < this.level.width) && (gridPosn.y < this.level.height)) {
			var tile = this.level.mapData[gridPosn.y][gridPosn.x];
			var img = this.level.images[tile];
			this.drawImage(img, gamePosn);
		}
	}

	drawTiles() {
		var startPos = new Elemental.Vector(
			(Math.ceil(this.xmin / this.tileSize) * this.tileSize)-this.tileSize,
			(Math.ceil(this.ymin / this.tileSize) * this.tileSize)-this.tileSize
		);
		for (var x = startPos.x; x < this.xmax; x += this.tileSize) {
			for (var y = startPos.y; y < this.ymax; y += this.tileSize) {
				var posn = new Elemental.Vector(x, y);
				var gridPosn = Elemental.Vector.Divide(posn, this.tileSize);
				this.drawTile(gridPosn, posn);
			}
		}
		// console.log(startPos);
	}
}
