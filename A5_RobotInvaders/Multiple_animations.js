var renderer = null,
scene = null,
camera = null,
root = null,
robot_idle = null,
directionalLight = null;
var object;
var animator = null;
var raycaster;
loopAnimation = false;
group = null;
time = 0;
id = 1;
number_of_robots = 0;
// MOUSE
var mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
var duration = 1500; // ms
var animation = "run";
var currentTime = 0;
var runtime = 0;
var started = false;
var kickoff = 0;
var score = 0;
var robot_array = [];
var cooldown;
var max_robots = 7;
var flag = false;
var hitZero = 0;
// Done
function createDeadAnimation(){
    dof = Math.PI/2;
    animator = new KF.KeyFrameAnimator;
    animator.init({ interps:[
                {
                    keys:[0, .40, .70, .99],
                    values:[
                    { y : dof, z : 0 }, { y : dof, z: dof*(1/3) },
                    { y : dof, z: dof*(1/6) }, { y : dof, z: dof*(1/3) }, ],
                },
            ],
        loop: loopAnimation,
        duration:duration,
    });
}

// Done
function defineObject(obj, xPos, yPos, yRot){
    obj.scale.set(0.06, 0.06, 0.06);
    obj.position.x = xPos;
    obj.position.y = yPos;
    obj.rotation.y = yRot;
    obj.name = 0;
}

// Done
function loadFBX()
{
    var loader = new THREE.FBXLoader();
    loader.load( 'models/Robot/robot_run.fbx', function ( object )
    {

        object.mixer = new THREE.AnimationMixer( scene );
        var action = object.mixer.clipAction( object.animations[ 0 ], object );
        defineObject(object, -130, 500, 1.55);
        action.play();
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        console.log(object.animations);
        robot_idle = object;
        robot_array.push(robot_idle);
        scene.add( object );
    } );
}

function validateSpawn(x){
    if(x == 1)
        return number_of_robots < max_robots && seconds >= 2;
    if(x == 2)
        return number_of_robots > 0;
}

function spawn(timespec){
    if (validateSpawn(1)){

        var spawned = cloneFbx(robot_idle);
        spawned.mixer = new THREE.AnimationMixer(scene);
        var action = spawned.mixer.clipAction(robot_idle.animations[0], spawned);
        action.play()

        spawned.position.x = -140;
        spawned.position.y = 0;
        spawned.cooldown = null;

        spawned.name = id;
        id += 1;
        number_of_robots += 1;
        spawned.position.z = Math.floor(Math.random() * 200) - 100;
        robot_array.push(spawned)
        scene.add(spawned);
        runtime = timespec;
    }

}

function robotActive(robot){
    return robot.cooldown == null && robot.live != false;

}

function robotGone(robot){
    return robot.dead != true && robot.position.x >= 110;
}

function toggleRobot(robot){
    robot.cooldown = null;
    robot.live = true;
    robot.dead = true;
    scene.remove(robot);
    number_of_robots += -1;
}

function updateGame(deltat){

    if (validateSpawn(2)){
        for(let i = 0; i < robot_array.length; i++){
            if(!robotActive(robot_array[i])){
                if ((Date.now() - robot_array[i].cooldown)/1000 >= 1){
                    toggleRobot(robot_array[i]);
                    score += 1;
                    document.getElementById("score").innerHTML = "score: " + score;
                }
            }
            else {
                robot_array[i].mixer.update(deltat * 0.002);
                robot_array[i].position.x += 0.3;
            }

            if (robotGone(robot_array[i])){
                if(score)
                    score += -1;
                robot_array[i].position.x = -110;
                document.getElementById("score").innerHTML = "score: " + score;
            }

        }
    }
}

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;

    seconds = (now - runtime)/1000

    spawn(now);
    updateGame(deltat);

    if(animation =="dead")
    {
        KF.update();
    }
}


function evaluateTime(){
    time = 60 - (Date.now() - kickoff)/1000;
    document.getElementById("time").innerHTML = "Time left: " + String(Math.floor(time));
}

function updateTime(){
    kickoff = Date.now();
    now = Date.now();
    currentTime = Date.now();
    runtime = Date.now();
}


function run()
{
    requestAnimationFrame(function() { run(); });

        // Render the scene
        render();


        if(started){
             // Update the animations
            KF.update();
             evaluateTime();

            if(time > 0){ animate(); }
            else { updateTime(); }
            if(time < 1){
                hitZero += 1;
                if(hitZero == 2){
                    started = false;

                    document.getElementById("startButton").style.visibility = "visible";
                }
            }
        }

}

// Done
function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;

    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "../images/checker_large.gif";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

// Done
function createScene(canvas)
{

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(200,200,0);
    var look = new THREE.Vector3(0,0,0);
    camera.lookAt(look)
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Create and add all the lights
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(-105, 10, -5);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 400;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

     // Create the objects
    loadFBX()

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var mapURL = "images/checker_large.gif";
    var map = new THREE.TextureLoader().load(mapURL);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(300, 400, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

    // Raycast
    raycaster = new THREE.Raycaster();

    document.addEventListener('mousedown', onDocumentMouseDown);
    window.addEventListener( 'resize', onWindowResize);

    createDeadAnimation();
}

function onDocumentMouseDown(event)
{
    event.preventDefault();
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( robot_array, true );

    if ( intersects.length > 0 )
    {
        CLICKED = intersects[ 0 ].object;

        if(!animator.running)
        {
            var parent = CLICKED.parent.name;
            for(var i = 0; i<= animator.interps.length -1; i++)
            {
                animator.interps[i].target = robot_array[parent].rotation;
                robot_array[parent].live = false;
                robot_array[parent].cooldown = Date.now();
            }

            playAnimations()
        }
    }
    else
    {
        if ( CLICKED )
            CLICKED.material.emissive.setHex( CLICKED.currentHex );

        CLICKED = null;
    }
}


function start(){
    started = true;
    if(flag){
        currentTime = Date.now();
        runtime = Date.now();
        kickoff = Date.now();
        document.getElementById("score").innerHTML = "score: " + 0;
        score = 0;
        hitZero = 0;
        document.getElementById("startButton").style.visibility = "hidden";
    }else{
        flag = true;
        document.getElementById("startButton").style.visibility = "hidden";
        document.getElementById("startButton").value = "Restart game"
    }
}

// Done
function playAnimations()
{
    animator.start();
}
// Done
function render()
{
    renderer.render( scene, camera );
}
// Done
function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
