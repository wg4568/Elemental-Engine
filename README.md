# Elemental canvas engine

Basic setup is as follows

```html
<script src="elemental.js"></script>
<canvas id="myCanvas" width="500" height="500"></canvas>
```

### Elemental.Canvas

`(element ID) -> Class -> Canvas instance`

Create canvas instance, passing the ID of the HTML element as the only parameter

```javascript
var canvas = new Elemental.Canvas("myCanvas");
```

Properties
* `width (set, get) -> Int`
* `height (set, get) -> Int`
* `size (get) -> Vector`
* `center (get) -> Vector`

### Elemental.Canvas.keyDown

`(keycode) -> Function -> Bool`

Returns if keycode passed was pushed down this frame

### Elemental.Canvas.keyUp

`(keycode) -> Function -> Bool`

Returns if keycode was released this frame

### Elemental.Canvas.keyHeld

`(keycode) -> Function -> Bool`

Returns if keycode is currently being held down

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

Keycodes contain bindings between key names, and their representative integers.

```javascript
function frame(context, time) {
    if (context.keyHeld(Elemental.Keycodes.SPACE)) {
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
* `rotation (get, set) -> Int`
* `scale (get, set) -> Int`

### Elemental.Shape

A shape is a class representing a set of lines and their properties. The basic types are Polygons, Lines, and Arcs. A shape can make up only one simple geometry. The following properties are shared by all Shape instances.

Properties
* `layer (get, set) -> Int`
  * Determines ordering of shapes. A shape with a layer of 1 would be drawn above a shape with a layer of 0.
* `scale (get, set) -> Int`
  * Shape dimension multiplier. 1 is normal size.
* `center (get, set) -> Vector`
  * Where (0, 0) is on the sprite. Will be aligned exactly at the point where you drew the sprite. Also acts as the center when rotating.
* `rotation (get, set) -> Int`
  * Angle of rotation (in degrees). 0 is normal.
* `lineWidth (get, set) -> Int`
  * Set to 0 for no line to show.
* `lineColor (get, set) -> String`
* `lineCaps (get, set) -> String`
  * How the line is ended. Can be "round", "butt", or "square"
* `lineCorners (get, set) -> String`
  * How the corners of the line are drawn. Can be "round", "bevel", or "miter".
* `lineMiterLimit (get, set) -> Int`
  * Miter limit, if lineCorners are set to "miter".
* `lineDashWidth (get, set) -> Int`
  * Set this, and lineDashSpacing to null for no dashes. Otherwise self explanitory.
* `lineDashSpacing (get, set) -> Int`
* `fillColor (get, set) -> String`
  * Set to null for no fill.
* `closePath (get, set) -> Bool`
  * If true, will automatically connect last point in geometry to the first.
* `strokeFirst (get, set) -> Bool`
  * If true, calls context.stroke() before context.fill(). This is super low level so don't worry about it.
* `type (get, set) -> String`
  * Used by drawSprite to determine sprite type

### Elemental.Vector

### Elemental.Helpers
