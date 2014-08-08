/**
 * Created by pat on 8/8/14.
 */

/**
 * Stage setup
 * @type {string}
 */
var i;
var d;
var canvasId = "myCanvas";
var stage = new createjs.Stage(canvasId);
createjs.Touch.enable(stage);

// Add an image - if you want one
//    var bgSrc = "placeholder.png";
//    var bg = new createjs.Bitmap(bgSrc);
//    stage.addChild(bg);

/**
 * Adjust these arrays with new objects for the drag
 * @type {{x: number, y: number, src: string, width: number, height: number, color: string}[]}
 */
var drags =
    [
        { x:150, y:130, src:"", width:50, height:50, color:"rgba(92,177,154,0.95)" },
        { x:350, y:130, src:"", width:50, height:50, color:"rgba(167,29,52,0.95)" },
        { x:550, y:130, src:"", width:50, height:50, color:"rgba(16,29,52,0.95)" }
    ];

/**
 * Adjust these arrays with new objects for the drop areas
 * @type {{x: number, y: number, src: string, width: number, height: number, color: string}[]}
 */
var drops =
    [
        { x:150, y:290, src:"", width:60, height:60, color:"rgba(92,177,154,0.95)" },
        { x:350, y:290, src:"", width:60, height:60, color:"rgba(167,29,52,0.95)" },
        { x:550, y:290, src:"", width:60, height:60, color:"rgba(16,29,52,0.95)" }
    ];

/**
 * Create all drop objects
 */
for (i = 0; i < drops.length; i++) {
    d = new createjs.Shape();
    // TODO: load in the "src" or image vs drawing a circle here
    // (note, this will also make it unnecessary to pass in width, height and color
    d.graphics.s(drops[i].color).de(-drops[i].width/2, -drops[i].height/2, drops[i].width, drops[i].height, drops[i].width, drops[i].height).ef();
    d.x = drops[i].x;
    d.y = drops[i].y;
    d.name = "drop" + i;
    d.width = drops[i].width;
    d.height = drops[i].height;
    d.alpha = 0;
    d.scaleX = 2.0;
    d.scaleY = 2.0;
    stage.addChild(d);
    // Fade in
    TweenLite.to(d, 0.5, {delay: drags.length *.15 + i * 0.15, scaleX:1.0, scaleY:1.0, alpha:1, ease:Back.easeOut});
}

/**
 * Create all drag objects
 */
for (i = 0; i < drags.length; i++) {
    d = new createjs.Shape();
    // TODO: load in the "src" or image vs drawing a circle here
    // (note, this will also make it unnecessary to pass in width, height and color
    d.graphics.f(drags[i].color).de(-drags[i].width/2, -drags[i].height/2, drags[i].width, drags[i].height, drags[i].width, drags[i].height).ef();
    d.x = drags[i].x;
    d.y = drags[i].y;
    d.startX = d.x;
    d.startY = d.y;
    d.targetid = "drop" + i;
    d.name = "drag" + i;
    d.width = drags[i].width;
    d.height = drags[i].height;
    d.alpha = 0;
    d.scaleX = 2.0;
    d.scaleY = 2.0;
    d.addEventListener("mousedown", handleDown);
    d.addEventListener("pressmove", handlePressMove);
    d.addEventListener("pressup", handlePressUp);
    stage.addChild(d);
    // Fade in
    TweenLite.to(d, 0.5, {delay: i * 0.15, scaleX:1.0, scaleY:1.0, alpha:1, ease:Back.easeOut});
}

/**
 * Handle the down event on the draggable objects
 * @param event
 */
function handleDown(event) {
    TweenLite.to(event.target, 0.5, {x:stage.mouseX, y:stage.mouseY, scaleX:1.2, scaleY:1.2, ease:Expo.easeOut });
}

/**
 * Handle the move event on the draggable objects
 * @param event
 */
function handlePressMove(event) {
    TweenLite.to(event.target, 0.2, {x:stage.mouseX, y:stage.mouseY, ease:Expo.easeOut });
}

/**
 * Handle the mouse (or touch) up for draggable objects
 * @param event
 */
function handlePressUp(event) {

    // Animate layer when moused off or touch ends
    var t = event.target;
    var targetRect = {
        left:t.x - t.width/2,
        top:t.y - t.height/2,
        right:t.x + t.width/2,
        bottom:t.y + t.height/2
    };

    var p = stage.getChildByName(t.targetid);
    var pairRect = {
        left:p.x - p.width/2,
        top:p.y - p.height/2,
        right:p.x + p.width/2,
        bottom:p.y + p.height/2
    };

    var isHit = intersectRect(targetRect, pairRect);

    if (isHit) {

        // Remove listeners from drag objects
        t.removeEventListener("mousedown", handleDown);
        t.removeEventListener("pressmove", handlePressMove);
        t.removeEventListener("pressup", handlePressUp);

        // Flag object as complete
        p.complete = true;

        // Tween it into it's final place
        TweenLite.to(t, 0.2, {x:p.x, y:p.y, scaleX:0.75, scaleY:0.75, ease:Back.easeOut });

        // Check complete - see if all the items are completed and do something if so...
        checkComplete();

    } else {
        // Failed to drop on target - go back to the start
        TweenLite.to(t, 0.2, {x:t.startX, y:t.startY, scaleX:1.0, scaleY:1.0, ease:Back.easeOut });
    }
}

/**
 * Redraw - update the stage / canvas
 * @param event
 */
function redraw(event){
    stage.update();
}

/**
 * Utility function for if two rectangles hit one another
 * @param $r1
 * @param $r2
 * @returns {boolean}
 */
function intersectRect($r1, $r2) {
    return !($r2.left > $r1.right ||
        $r2.right < $r1.left ||
        $r2.top > $r1.bottom ||
        $r2.bottom < $r1.top);
}

/**
 * See if all the objects are complete and do something if so...
 */
function checkComplete() {
    var allDone = true;
    for (var i = 0; i < drops.length; i++) {
        if (!stage.getChildByName('drop' + i).complete) {
            allDone = false;
        }
    }
    if (allDone) {
        console.log("You've done all the drag and drops!");
    }
}

/**
 * Add listeners for redrawing every "x" times a second
 */
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", redraw);

/**
 * Force initial redraw
 */
redraw();
