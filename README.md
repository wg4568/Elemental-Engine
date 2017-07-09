# Elemental canvas engine

Basic setup is as follows

```html
<script src="elemental.js"></script>
<canvas id="myCanvas" width="500" height="500"></canvas>
```

Check `demo.html` for a full demo.

### Elemental.Canvas

`(element ID) -> Class -> Canvas instance`

Create canvas instance, passing the ID of the HTML element as the only parameter

```javascript
var canvas = new Elemental.Canvas("myCanvas");
```

Properties
* `width (set, get) -> Num`
* `height (set, get) -> Num`
* `size (get) -> Vector`
* `center (get) -> Vector`
* `mousePos (get) -> Vector`

### Elemental.Canvas.keyDown

`(keycode) -> Function -> Bool`

Returns if keycode passed was pushed down this frame

### Elemental.Canvas.keyUp

`(keycode) -> Function -> Bool`

Returns if keycode was released this frame

### Elemental.Canvas.keyHeld

`(keycode) -> Function -> Bool`

Returns if keycode is currently being held down

### Elemental.Canvas.mouseDown

`(button) -> Function -> Bool`

Returns if mouse button was pushed this frame

### Elemental.Canvas.mouseUp

`(button) -> Function -> Bool`

Returns if mouse button was released this frame

### Elemental.Canvas.mouseHeld

`(button) -> Function -> Bool`

Returns if mouse button is currently held down

### Elemental.Canvas.drawFill

`(color) -> Function`

Fills canvas entirely with color

### Elemental.Canvas.drawLine

`(start, end) {color, width, caps} -> Function`

Draws line between two vectors

### Elemental.Canvas.drawText

`(font, text, position) {color} -> Function`

Writes text to position on screen

### Elemental.Canvas.drawRect

`(color, position, width, height) -> Function`

Draws rectangle at position on screen

### Elemental.Canvas.drawSprite

`(sprite, position) -> Function`

Draws sprite at position on screen

### Elemental.Canvas.start

`(function) -> Function`

Begins running passed function roughly 60 times a second

```javascript
canvas.start(function(cnv, time){
    canvas.drawFill("red");
});
```

It will pass the canvas instance, and the time since last frame as parameters.

### Elemental.Canvas.stop

`() -> Function`

The reverse of Elemental.Canvas.start

### Elemental.Keycodes

Contain bindings between key names, and their representative integers.

```javascript
function frame(context, time) {
    if (context.keyHeld(Elemental.Keycodes.SPACE)) {
        context.drawFill("black");
    } else {
        context.drawFill("white");
    }
}
```

### Elemental.Mousecodes

Contains bindings between mouse button names, and their representative integers.

```javascript
function frame(context, time) {
    if (context.mouseHeld(Elemental.Mousecodes.LEFT)) {
        context.drawFill("black");
    } else {
        context.drawFill("white");
    }
}
```

### Elemental.Sprite

`(shapes) -> Class -> Sprite instance`

Takes an object or array of shapes, and consolidates them into one class. Then passed to canvas.drawSprite for drawing.

```javascript
var shape1 = ...;
var shape2 = ...;
var mySprite = new Elemental.Sprite([shape1, shape2]);

canvas.drawSprite(mySprite, posn);
```

Properties
* `rotation (get, set) -> Num`
* `scale (get, set) -> Num`

### Elemental.Shape

A shape is a class representing a set of lines and their properties. The basic types are Polygons (including lines) and Arcs. A shape can make up only one simple geometry. The following properties are shared by all Shape instances.

You can also pass a `data` keyword argument to any shape. The shape will inherit any properties contained in the passed object. This means you can configure your shape when it is initiated.

```javascript
var myShape = new Elemental.Shape.Line(data={
    lineWidth: 10,
    lineColor: "red"
});
```

Properties
* `layer (get, set) -> Num`
  * Determines ordering of shapes. A shape with a layer of 1 would be drawn above a shape with a layer of 0.
* `scale (get, set) -> Num`
  * Shape dimension multiplier. 1 is normal size.
* `center (get, set) -> Vector`
  * Where (0, 0) is on the sprite. Will be aligned exactly at the point where you drew the sprite. Also acts as the center when rotating.
* `rotation (get, set) -> Num`
  * Angle of rotation (in degrees). 0 is normal.
* `lineWidth (get, set) -> Num`
  * Set to 0 for no line to show.
* `lineColor (get, set) -> String`
* `lineCaps (get, set) -> String`
  * How the line is ended. Can be "round", "butt", or "square"
* `lineCorners (get, set) -> String`
  * How the corners of the line are drawn. Can be "round", "bevel", or "miter".
* `lineMiterLimit (get, set) -> Num`
  * Miter limit, if lineCorners are set to "miter".
* `lineDashWidth (get, set) -> Num`
  * Set this, and lineDashSpacing to null for no dashes. Otherwise self explanitory.
* `lineDashSpacing (get, set) -> Num`
* `fillColor (get, set) -> String`
  * Set to null for no fill.
* `closePath (get, set) -> Bool`
  * If true, will automatically connect last point in geometry to the first.
* `strokeFirst (get, set) -> Bool`
  * If true, calls context.stroke() before context.fill(). This is super low level so don't worry about it.
* `type (get, set) -> String`
  * Used by drawSprite to determine sprite type

### Elemental.Shape.Polygon

`(points) {data} -> Class -> Shape.Polygon instance`

Creates closed polygon between the passed array of vectors.

```javascript
var myPoly = new Elemental.Shape.Polygon([
    new Vector(0, 0),
    new Vector(10, 0),
    new Vector(10, 10),
    new Vector(0, 10),
]);
```

### Elemental.Shape.Line

`(points) {data} -> Class -> Shape.Line instance`

Creates a line between passed array of vectors.

```javascript
var myLine = new Elemental.Shape.Polygon([
    new Vector(0, 0),
    new Vector(10, 10),
    new Vector(20, 10)
]);
```

### Elemental.Shape.Arc

`(radius) {start, end, data} -> Class -> Shape.Arc instance`

Creates an arc given the radius, and the start and end of the segment (in degrees). To create a full circle, start at 0 and end at 360. These are also the defaults for the keyword arguments.

```javascript
var myArc = new Elemental.Shape.Arc(50, start=0, end=180);
```

The above code makes a closed semi-circle, with a radius of 50px.

### Elemental.Vector

A vector is a representation of a point in the Elemental engine. They have two properties, an X and a Y. Anywhere where Elemental asks for a point, it is looking for a vector.

A vector can be any property with an `x` and `y` attribute. You can define an acceptable vector any of the following ways...

```javascript
var myVector = new Elemental.Vector(0, 0);
var myVector = {x: 0, y: 0};
var myVector = Elemental.Vector.Blank;
```

### Elemental.Vector.Empty

`() -> Static Get -> Vector instance of value (0, 0)`

Gives new vector instance, with an x and y of 0.

### Elemental.Vector.IsVector

`(vector) -> Static Function -> Bool`

Returns whether passed vector is a valid vector.

### Elemental.Vector.Add

`(vectors...) -> Static Function -> Vector`

Returns sum of all vectors. Can pass a numeric value also.

### Elemental.Vector.Subtract

`(vectors...) -> Static Function -> Vector`

Subtracts each vector from the next. Can pass a numeric value also.

### Elemental.Vector.Multiply

`(vectors...) -> Static Function -> Vector`

Returns product of all vectors. Can pass a numeric value also.

### Elemental.Vector.Divide

`(vectors...) -> Static Function -> Vector`

Divides each vector by the next. Can pass a numeric value also.

### Elemental.Helpers

An object used to store a series of helper functions that can be used by the user.

### Elemental.Helpers.toRadians

`(degrees) -> Static Function -> Num`

Converts degrees to radians

### Elemental.Helpers.toDegrees

`(radians) -> Static Function -> Num`

Converts radians to degrees

### Elemental.Helpers.angleBetween

`(point1, point2) -> Static Function -> Num`

Finds angle between two vectors. Angle follows the same conventions as canvas arcs, and works in all 4 quadrants.

### Elemental.Helpers.stepBetween

`(point1, point2) -> Static Function -> Vector`

Returns a vector with a normalized "step" to move from point1 to point2.
