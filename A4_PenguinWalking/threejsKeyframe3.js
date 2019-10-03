var renderer = null;
var scene = null;
var camera = null;
var group = null;
var directionalLight = null;
var floor = null;
var camera_control = null;

var duration = 10, // sec
crateAnimator = null,
waveAnimator = null,
lightAnimator = null,
waterAnimator = null,
animateCrate = true,
animateWaves = true,
animateLight = true,
animateWater = true,
loopAnimation = false;

//first_line = [{x:0,y:0,z:0},{x:30,y:0,z:-10}]
right_semi_circle = [];
right_semi_circle_keys = [];
radius = 10;


var floorMapURL = './models/snow/snow.png';

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();

        // Update the camera controller
        camera_control.update();
}

function createScene(canvas) 
{
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();


    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera_control = new THREE.OrbitControls(camera, canvas);
    camera.position.z = 10;
    camera_control.update();
    scene.add(camera);

    root = new THREE.Object3D;

   // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var waterMap = new THREE.TextureLoader().load(floorMapURL);
    waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
    waterMap.repeat.set(4, 4);

    var color = 0xffffff;
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    waves = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:waterMap, side:THREE.DoubleSide}));
    waves.rotation.x = -Math.PI / 2;
    waves.position.y = -1.02;
    
    // Add the waves to our group
    root.add( waves );

    // Create the cube geometry
    map = new THREE.TextureLoader().load(floorMapURL);
    geometry = new THREE.CubeGeometry(2, 2, 2);
    
    // And put the geometry and material together into a mesh
    var color = 0xffffff;
    ambient = 0x888888;

    var objLoader = new THREE.OBJLoader();
    objLoader.load('./models/Penguin_obj/penguin.obj', function (object) {
        penguin = object;
        penguin.position.set(0, 0, 0);
        penguin.scale.set(0.5, 0.5, 0.5);

        group.add(penguin);
        
        penguinMap = new THREE.TextureLoader().load('./models/Penguin_obj/peng_texture.jpg');
        penguin.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = penguinMap;
            }
        } );
    });
    
    right_loop_coords();
    playAnimations();
    // Now add the group to our scene
    scene.add( root );
}

function playAnimations()
{
    // position animation
    if (crateAnimator)
        crateAnimator.start();
    
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate)
    {
        step();
        first_line();
        right_semi_circle_f();
    }
    
}

function right_loop_coords()
{
    var coords = {x:0, y:0, z:0};
    var x=30;
    var y=0;
    for (var theta=4.71239; theta<=7.85398; theta+=0.0174533)
    {
        x = radius * Math.cos(theta) + 30;
        z = radius * Math.sin(theta);
        coords = {x,y,z};
        right_semi_circle.push(coords);
        x += 0.01;
        
    }
    for (var keys=0;keys<1;keys+=(1/179))
    {
        right_semi_circle_keys.push(keys);
    }

    right_semi_circle_keys.push(1);
    console.log(right_semi_circle_keys);
    console.log(right_semi_circle);
}

function step()
{
    crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({ 
            interps:
                [
                    { 
                        keys:[0, 0.25, .5, .75, 1], 
                        values:[
                                { x : 0, y : 0,z : 0 },
                                { x : 0, y : 0.349066,z : .05 },
                                { x : 0, y : 0,z : 0 },
                                { x : 0, y : -0.349066, z : -.05 },
                                { x : 0, y : 0,z : 0 },
                                ],
                        target:group.rotation
                    }
                ],
            loop: true,
            duration:2 * 1000,
            //easing:TWEEN.Easing.Bounce.InOut,

        });
        crateAnimator.start();
}

function right_semi_circle_f()
{
    crateAnimator = new KF.KeyFrameAnimator;
    crateAnimator.init({ 
        interps:
            [
                { 
                    keys:right_semi_circle_keys, 
                    values:right_semi_circle,
                    target:group.position
                }
            ],
        //loop: true,
        duration:3 * 1000,
        //easing:TWEEN.Easing.Exponential.Out,

    });
    crateAnimator.start();
}

function first_line()
{
    crateAnimator = new KF.KeyFrameAnimator;
    crateAnimator.init({ 
        interps:
            [
                { 
                    keys:[0, 1], 
                    values:[
                        {x:0,y:0,z:0},
                        {x:30,y:0,z:-10}],
                    target:group.position
                }
            ],
        //loop: true,
        duration:5 * 1000,
        //easing:TWEEN.Easing.Exponential.Out,

    });
    crateAnimator.start();
}