

var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
snow = null,
directionalLight = null;
spotLight = null;
penguin = null;
penguinGroup = null;
rock = null;
rockGroup = null;

var duration = 10, // sec
rotationAnimator = null,
lightAnimator = null

var snowMapUrl = "./models/snow/snow.png";

var penguinMapUrl = "./models/Penguin_obj/peng_texture.jpg";
var penguinEyeMapUrl = "./models/Penguin_obj/peng_eye_texture.jpg";
var penguinObjUrl = "./models/Penguin_obj/penguin.obj";

var penguinMap = null;

//coordinates and keys
radius = 10;
totalKeys = [];
totalCoords = [];

//facing rotation angle
penguinFacing = [];

function loadObj() {

    //Penguin
    penguinMap = new THREE.TextureLoader().load(penguinMapUrl);

    var objLoader = new THREE.OBJLoader();

    objLoader.load(penguinObjUrl, function (object) {
        penguin = object;
        penguin.position.set(0, 0, 0);
        penguin.scale.set(0.3, 0.3, 0.3);
        penguin.rotation.set(0,1.5708, 0);
        penguinGroup.add(penguin);

        penguin.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = penguinMap;
            }
        });
    });

    group.add(penguinGroup);
}

function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        //console.log(group.rotation);
        // Update the animations
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

/*function createMaterials()
{
    snowTextureMap = new THREE.TextureLoader().load(snowMapURL);
    snowNormalMap = new THREE.TextureLoader().load(snowNormalMapURL);
    snowBumpMap = new THREE.TextureLoader().load(snowBumpMapURL);

    //Snow
    snowMaterial = new THREE.MeshBasicMaterial({
        map: snowTextureMap, bumpMap: snowBumpMap, bumpScale: 0.02, normalMap: snowNormalMap
    });
}*/

function createScene(canvas) 
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(1920, 1080);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    //camera = new THREE.PerspectiveCamera( 50, canvas.width / canvas.height, 1, 3500 );
    camera = new THREE.PerspectiveCamera( 50, canvas.width / canvas.height, 2, 4000 );
    camera.position.set(0, 90, 70);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
    penguinGroup = new THREE.Object3D;
    penguin = new THREE.Object3D;;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Spotlight
    spotLight = new THREE.SpotLight( 0xffffff, 2 );
    spotLight.position.set( 20, 60, -35 );
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.7;
    spotLight.decay = 2;
    spotLight.distance = 200;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    root.add( spotLight );

    // Create and add all the lights
    directionalLight.position.set(1, 1, 2);
    directionalLight.castShadow = true;
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    ambientLight.position.set(1,1,1);
    root.add(ambientLight);
    
    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map

    //Snow plane
    var snowMap = new THREE.TextureLoader().load(snowMapUrl);
    snowMap.wrapS = snowMap.wrapT = THREE.RepeatWrapping;
    snowMap.repeat.set(4, 4);

    var color = 0xffffff;
    var ambient = 0x888888;
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(300, 300, 50, 50);

    snow = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:snowMap, side:THREE.DoubleSide}));

    snow.rotation.x = -Math.PI / 2;
    snow.position.y = 0;

    loadObj();
    
    // Add the snow to our group
    root.add( snow );
    
    // Now add the group to our scene
    scene.add( root );
}

function pushLeftSemiCircleCoords() {
    var coords = {x:0, y:0, z:0};
    var x=-30;
    var y=0;

    for (var theta=4.71239; theta>=1.5708; theta-=0.0174533)
    {
        x = radius * Math.cos(theta) - 30;
        z = radius * Math.sin(theta);

        coords = {x,y,z};
        totalCoords.push(coords);
        x -= 0.01;
    }
}

function pushLeftSemiCircleKeys() {
    for (var keys=(3/16);keys<=(5/16);keys+=(0.125/179))
    {
        totalKeys.push(keys);
    }

    totalKeys.push(0.31);
}

function pushRightSemiCircleCoords() {
    var coords = {x:0, y:0, z:0};
    var x=30;
    var y=0;

    for (var theta=4.71239; theta<=7.85398; theta+=0.0174533)
    {
        x = radius * Math.cos(theta) + 30;
        z = radius * Math.sin(theta);
        coords = {x,y,z};
        totalCoords.push(coords);
        x += 0.01;
    }
}

function pushRightSemiCircleKeys() {
    for (var keys=(11/16);keys<=(13/16);keys+=(0.125/179))
    {
        totalKeys.push(keys);
    }

    totalKeys.push(0.81);
}

function pushPenguinOrientation() {

    //Initial line
    penguinFacing.push({y:2.35619});

    
    //Left Semi-Circle
    for(var theta=1; theta<=180; theta++)
    {
        Zchange = totalCoords[theta].z - totalCoords[theta-1].z;
        Xchange = totalCoords[theta].x - totalCoords[theta-1].x;

        slope = Zchange / Xchange;

        if(Zchange > 0)
        {
            if(Xchange > 0)
            {
                penguinFacing.push({y: 2*Math.PI - Math.atan(Zchange/Xchange)});
            }else{
                if(Xchange < 0)
                {
                    penguinFacing.push({y: Math.PI - Math.atan(Zchange/Xchange)});
                }
            }
        }else{
            if(Zchange < 0)
            {
                if(Xchange > 0)
                {
                    penguinFacing.push({y: (2*Math.PI) - Math.abs(Math.atan(Zchange/Xchange))});
                }else{
                    if(Xchange < 0)
                    {
                        penguinFacing.push({y: (Math.PI) + Math.atan(Zchange/Xchange)});
                    }
                }
            }
        }        
    }

    //Second Line
    penguinFacing.push({y:7.06858});

    //Right Semi-Circle
    for(var theta=183; theta<=362; theta++)
    {
        Zchange = totalCoords[theta].z - totalCoords[theta-1].z;
        Xchange = totalCoords[theta].x - totalCoords[theta-1].x;

        slope = Zchange / Xchange;

        if(Zchange > 0)
        {
            if(Xchange > 0)
            {
                penguinFacing.push({y: 2*Math.PI - Math.atan(Zchange/Xchange)});
            }else{
                if(Xchange < 0)
                {
                    penguinFacing.push({y: Math.PI - Math.atan(Zchange/Xchange)});
                }
            }
        }else{
            if(Zchange < 0)
            {
                if(Xchange > 0)
                {
                    penguinFacing.push({y: (2*Math.PI) - Math.atan(Zchange/Xchange)});
                }else{
                    if(Xchange < 0)
                    {
                        penguinFacing.push({y: (Math.PI) + Math.atan(Zchange/Xchange)});
                    }
                }
            }
        }       
    }

    penguinFacing.push({y:2.35619});


    console.log(penguinFacing);

}

function translationAnimation() {

    //Start on origin
    totalCoords.push({x:0, y:0, z:0});
    totalKeys.push(0);

    //Left Semi-Circle
    pushLeftSemiCircleCoords();
    pushLeftSemiCircleKeys();

    //Return to origin
    totalCoords.push({x:0, y:0, z:0});
    totalKeys.push(1/2);
 
    //Right Semi-Circle
    pushRightSemiCircleCoords();
    pushRightSemiCircleKeys();

    //Return to origin
    totalCoords.push({x:0, y:0, z:0});
    totalKeys.push(1);

    pushPenguinOrientation();

    translationAnimator = new KF.KeyFrameAnimator;
    translationAnimator.init({ 
        interps:
            [
                { 
                    keys:totalKeys, 
                    values:totalCoords,
                    target:group.position
                },
                {
                    keys: totalKeys,
                    values: penguinFacing,
                    target: group.rotation
                }
            ],
        loop: true,
        duration:10 * 3000,

    });
    translationAnimator.start();

    console.log(totalCoords);
    console.log(totalKeys);
}

function step()
{
    rotationAnimator = new KF.KeyFrameAnimator;
    rotationAnimator.init({ 
        interps:
            [
                { 
                    keys:[0, .25, .5, .75, 1], 
                    values:[
                            { y: 0, z:0},
                            { y: (-Math.PI/6), z:-0.08},
                            { y: 0, z:0},
                            { y: (Math.PI/6), z:0.08},
                            { y: 0, z:0},
                            ],
                    target:penguinGroup.rotation
                },
            ],
        loop: true,
        duration:900,
    });
    rotationAnimator.start();
}


function playAnimations()
{
    // position animation    
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    step();
    translationAnimation();
}