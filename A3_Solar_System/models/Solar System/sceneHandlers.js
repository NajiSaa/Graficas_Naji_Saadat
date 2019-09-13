
var mouseDown = false, pageX = 0, pageY = 0, button = -1;

function rotateScene(deltax, deltay)
{
    solarSystem.rotation.y += deltax / 100;
    solarSystem.rotation.x += deltay / 100;

    $("#rotation").html("rotation:" + solarSystem.rotation.x.toFixed(1) + "," + solarSystem.rotation.y.toFixed(1) + ",0");
}

function translateScene(deltax, deltay) {
    solarSystem.position.y -= deltay / 100;
    solarSystem.position.x += deltax / 100;
}

function scaleScene(scale)
{
    solarSystem.scale.set(scale, scale, scale);
    $("#scale").html("scale: " + scale);
}

function onMouseMove(evt)
{
    if (!mouseDown)
        return;
    
    evt.preventDefault();

    var deltax = evt.pageX - pageX;
    pageX = evt.pageX;

    var deltay = evt.pageY - pageY;
    pageY = evt.pageY;

    switch(button) {
        case 0:
            rotateScene(deltax, deltay);
            break;

        case 2:
            translateScene(deltax, deltay);
            break;
    }
}

function onMouseDown(evt)
{
    evt.preventDefault();
    
    mouseDown = true;
    button = evt.button;
    pageX = evt.pageX;
    pageY = evt.pageY;
}

function onMouseUp(evt)
{
    evt.preventDefault();
    
    mouseDown = false;
    button = -1;
}

function addMouseHandler(canvas)
{
    canvas.oncontextmenu = function(e){ e.preventDefault(); };
    canvas.addEventListener( 'mousemove', 
            function(e) { onMouseMove(e); }, false );
    canvas.addEventListener( 'mousedown', 
            function(e) { onMouseDown(e); }, false );
    canvas.addEventListener( 'mouseup', 
            function(e) { onMouseUp(e); }, false );
}