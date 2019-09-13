class Planeta {

	constructor(textureUrl, nLuna) {
		
		
		var texture = new THREE.TextureLoader().load(textureUrl);
    	var material = new THREE.MeshPhongMaterial({ map: texture });
    	var geometry = new THREE.SphereGeometry(1, 20, 20);
    	var planet = new THREE.Mesh(geometry, material);

	    geometry = new THREE.SphereGeometry(0.2, 20, 20)
	    textureUrl = "../images/moon_1024.jpg";
	    texture = new THREE.TextureLoader().load(textureUrl);
	    material = new THREE.MeshPhongMaterial({ map: texture });

	    var moon = new THREE.Mesh(geometry, material);

	    moon.position.set(1, 1, -.667);

	    planet.add(moon)

	}

	animate() 
	{
	    var now = Date.now();
	    var deltat = now - currentTime;
	    currentTime = now;
	    var fract = deltat / duration;
	    var angle = Math.PI * 2 * fract;
	    var movement = now * 0.001;

	    planet.rotation.y += angle;
	    moon.rotation.z += angle;
	}
}