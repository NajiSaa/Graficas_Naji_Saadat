class Planeta {
  constructor(textureUrl, nLuna, position, scale, bumpUrl, normalUrl, ringUrl, rotateRing) {
    this.textureUrl = textureUrl;
    this.nLuna = nLuna;
    this.position = position;
    this.scale = scale;
    this.bumpUrl = bumpUrl;
    this.normalUrl = normalUrl;
    this.ringUrl = ringUrl;
    this.moons = new Array();

    if (this.scale == null)
        this.scale = 1;

    // Object containing planet and moons
    this.earth = new THREE.Object3D;

    let texture = new THREE.TextureLoader().load(this.textureUrl);

    let material = null;

    if (this.bumpUrl != null) {
        var bump = new THREE.TextureLoader().load(this.bumpUrl);
        material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.06 });
    } else {
        if (this.normalUrl != null) {
            var normal = new THREE.TextureLoader().load(this.normalUrl);
            material = new THREE.MeshPhongMaterial({ map: texture, normalMap: normal });
        } else
            material = new THREE.MeshPhongMaterial({ map: texture });
    }

    // Create the sphere geometry
    let geometry = new THREE.SphereGeometry(this.scale, 20, 20);
    
    // And put the geometry and material together into a mesh
    let planet = new THREE.Mesh(geometry, material);

    // Add the sphere mesh to our group
    this.earth.add( planet );

    if (ringUrl != null) {
        geometry = new THREE.TorusGeometry( this.scale + 0.25, 0.1, 2, 200 );
        let ring = new THREE.TextureLoader().load(this.ringUrl);
        material = new THREE.MeshBasicMaterial( { map: ring } );
        let torus = new THREE.Mesh( geometry, material );

        switch (rotateRing) {
            case "x":
                torus.rotation.x = Math.PI / 2;
                break;

            case "y":
                torus.rotation.y = Math.PI / 2;
                break;

            case "z":
                torus.rotation.z = Math.PI / 2;
                break;
        }
        
        this.ring = torus;
        this.earth.add( this.ring );
    }

        
    // Add the cone mesh to our group
    let newMoonPosX = 1;
    let newMoonPosY = 1;
    for (var n = 0; n < this.nLuna; n++)  {
        console.log("Create moon: " + n);
        if (n > 0) {
            newMoonPosX = Math.random() * 2 - 1;
            newMoonPosY = Math.random() * 2 - 1;
        }
        var vec3 = new THREE.Vector3( newMoonPosX, newMoonPosY, -.667 );
        moon = new Luna(vec3, scale);
        this.moons.push(moon);
        //console.log(moon);
        this.earth.add(moon.getObject());
    }

    this.earth.position.set(this.position.x, this.position.y, this.position.z);
  }

  getObject() {
 
    return this.earth;
  }

  rotateAndTranslate(basePosition, angle, days, angleTras) {
    let obj = this.earth;
    obj.rotation.y += angle / 2;

    let velocity = 365 / (days * 3);

    // Algo así
    
    obj.position.x = Math.cos(angleTras * velocity * Math.PI / 180) * basePosition;
    obj.position.z = Math.sin(angleTras * velocity * Math.PI / 180) * basePosition ;
    this.rotateMoons(angle);
    }


    rotateMoons(angle) {
        for (var i = 0; i < this.moons.length; i++) {
            this.moons[i].getObject().rotation.z += angle;
            this.moons[i].getObject().rotation.y += angle / 4;
        }
    }
}

class Luna {
    constructor(pos, scale){
        this.pos = pos;
        this.scale = scale;
        let geometry = new THREE.SphereGeometry(0.2 * scale, 20, 20);
        let textureUrl = "../images/moon_1024.jpg";
        let texture = new THREE.TextureLoader().load(textureUrl);
        let material = new THREE.MeshPhongMaterial({ map: texture });

        // put the geometry and material together into a mesh
        this.moon = new THREE.Mesh(geometry, material);

        // Move the cone up and out from the sphere
        this.moon.position.set(this.pos.x * this.scale, this.pos.y * this.scale, this.pos.z * this.scale);

    }

    getObject(){
        return this.moon;
    }
}

class Asteroid {
    constructor(pos, scale) {
        this.pos = pos;
        this.scale = scale;

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath("../models/");
        mtlLoader.load("10464_Asteroid_v1_Iterations-2.mtl", function(materials) {
            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load("../models/10464_Asteroid_v1_Iterations-2.obj", function(object) {
                object.position.x = pos.x;
                object.position.z = pos.z;
                object.scale.set(scale, scale, scale);
                console.log(object.position.x + ',' + object.position.z);
                asteroidBelt.add(object);
                let n = 0;
                let asteroid = null, posX = 0, posY = 0, randomAngle = 0;

                let location = 0;

                while (n < 100) {
                    randomAngle = Math.floor(Math.random() * 360);
                    location = Math.random() + 8.7;
                    asteroid = object.clone();
                    asteroid.position.x = Math.cos(randomAngle * Math.PI / 180) * location;
                    asteroid.position.z = Math.sin(randomAngle * Math.PI / 180) * location;
                    console.log("Angle: " + randomAngle + " " + asteroid.position.x + "," + asteroid.position.z);
                    asteroidBelt.add(asteroid);
                    n++;
                }
            });
        });
    }

    getObject() {
        return this.asteroid;
    }
}

var renderer = null, 
scene = null, 
camera = null,
solarSystem = null,
asteroidBelt = null,
earth = null,
planet = null,
moon = null, tierra = null, sun = null, venus = null, mercurio = null, marte = null, jupiter = null, saturno = null, urano = null, neptuno = null, pluton = null;

var angleTras = 0;

var duration = 5000; // ms
var currentTime = Date.now();

var planetGroup, planet_1, planet_2;
var planet_1_orbit;

function animate() 
{
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    var movement = now * 0.001;

    sun.rotation.y += angle / 2;
    mercurio.rotateAndTranslate(mercurio.position.x, angle, 88, angleTras);
    venus.rotateAndTranslate(venus.position.x, angle, 225, angleTras);
    tierra.rotateAndTranslate(tierra.position.x, angle, 365, angleTras);
    marte.rotateAndTranslate(marte.position.x, angle, 687, angleTras);

    jupiter.rotateAndTranslate(jupiter.position.x, angle, 12 * 365, angleTras);


    saturno.rotateAndTranslate(saturno.position.x, angle, 11000, angleTras);

    urano.rotateAndTranslate(urano.position.x, angle, 80 * 365, angleTras);

    neptuno.rotateAndTranslate(neptuno.position.x, angle, 165 * 365, angleTras);

    pluton.rotateAndTranslate(pluton.position.x, angle, 90400, angleTras);

    asteroidBelt.rotation.y += angle / 64;
    angleTras++;
}

function rotateAndTranslate(obj, basePosition, angle, days) {
    obj.rotation.y += angle / 2;

    let velocity = 365 / (days * 10);
    
    obj.position.x = Math.cos(angleTras * velocity * Math.PI / 180) * basePosition;
    obj.position.z = Math.sin(angleTras * velocity * Math.PI / 180) * basePosition ;
    angleTras++;
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render scene
        renderer.render( scene, camera );
        animate();
}

function createOrbit(radius)  {
    let segments = 64;
    material = new THREE.LineBasicMaterial( { color: new THREE.Color("rgb(255, 255, 0)") } ),
    geometry = new THREE.CircleGeometry( radius, segments );

    geometry.vertices.shift();

    let orbit = new THREE.LineLoop( geometry, material);
    orbit.rotation.x = Math.PI / 2;

    return orbit;
}

function createAsteroidBelt() {
    for (var createAngle = 0; createAngle < 360; createAngle++)
        console.log('Angulo:' + createAngle + ': ' + Math.cos(createAngle * Math.PI / 180) * 8 + ',' + ',' + Math.sin(createAngle * Math.PI / 180) * 8);

    createAngle = Math.floor(Math.random() * 360);
    let location = Math.random() + 8.7;
  
    let asteroidBelt = new Asteroid(new THREE.Vector3(Math.cos(createAngle * Math.PI / 180) * location, 0, Math.sin(createAngle * Math.PI / 180) * location), 1);

}

function createScene(canvas)
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );


    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    scene.background = new THREE.TextureLoader().load("../images/space.jpg");
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    solarSystem = new THREE.Object3D;
    asteroidBelt = new THREE.Object3D;
    var light = new THREE.PointLight( 0xffffff, 2.5, 10);
    solarSystem.add(light);

    var textureUrl = "../images/sunmap.jpg";
    var texture = new THREE.TextureLoader().load(textureUrl);
    var material = new THREE.MeshBasicMaterial({ map: texture});

    var geometry = new THREE.SphereGeometry(1, 20, 20);
    
    sun = new THREE.Mesh(geometry, material);

    solarSystem.add( sun );

    mercurio = new Planeta("../images/mercurymap.jpg", 0, new THREE.Vector3(2, 0, 0), 0.5 * 0.38, "../images/mercurybump.jpg");
    venus =  new Planeta("../images/venusmap.jpg", 0, new THREE.Vector3(4, 0, 0), 0.5 * 0.95, "../images/venusbump.jpg");
    
    tierra = new Planeta("../images/earth_atmos_2048.jpg", 1, new THREE.Vector3(6, 0, 0), 0.5);

    marte = new Planeta("../images/marsmap.jpg", 2, new THREE.Vector3(8, 0, 0), 0.5 * 0.55, null, "../images/marsnormal.jpg");

    jupiter = new Planeta("../images/jupitermap.jpg", 10, new THREE.Vector3(11, 0, 0), 0.5 * 2.5);

    saturno = new Planeta("../images/saturnmap.jpg", 10, new THREE.Vector3(14, 0, 0), 0.5 * 1.8, null, null, "../images/saturnringmap.jpg", "x");

    urano = new Planeta("../images/uranusmap.jpg", 10, new THREE.Vector3(17, 0, 0), 0.5 * 1.3, null, null, "../images/uranusringmap.jpg", "y");

    neptuno = new Planeta("../images/neptunemap.jpg", 10, new THREE.Vector3(20, 0, 0), 0.5 * 1.2);

    pluton = new Planeta("../images/plutomap.jpg", 5, new THREE.Vector3(23, 0, 0), 0.5 * 0.3, "../images/plutobump.jpg");

    solarSystem.add(mercurio.getObject());
    solarSystem.add(createOrbit(mercurio.position.x));

    solarSystem.add(venus.getObject());
    solarSystem.add(createOrbit(venus.position.x));

    solarSystem.add(tierra.getObject());
    solarSystem.add(createOrbit(tierra.position.x));

    solarSystem.add(marte.getObject());
    solarSystem.add(createOrbit(marte.position.x));

    solarSystem.add(jupiter.getObject());
    solarSystem.add(createOrbit(jupiter.position.x));

    solarSystem.add(saturno.getObject());
    solarSystem.add(createOrbit(saturno.position.x));

    solarSystem.add(urano.getObject());
    solarSystem.add(createOrbit(urano.position.x));

    solarSystem.add(neptuno.getObject());
    solarSystem.add(createOrbit(neptuno.position.x));

    solarSystem.add(pluton.getObject());
    solarSystem.add(createOrbit(pluton.position.x));

    createAsteroidBelt();
    solarSystem.add(asteroidBelt);

    scene.add( solarSystem );
} 