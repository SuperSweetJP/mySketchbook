// Get window constants
var width  = window.innerWidth; 
var height = window.innerHeight;
var aspect = width/height;
var near = 0.1;
var far = 1000;
var fov = 90;

// Initialize Graphics Engine
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
camera.position.set(0,0,5);
camera.lookAt(new THREE.Vector3(0,0,0));
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width,height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add Lighting
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0,5,5);
light.target.position.set(0,0,0);
light.shadow.camera.near = near;       
light.shadow.camera.far = far;      
light.shadow.camera.left = -15;
light.shadow.camera.bottom = -15;
light.shadow.camera.right = 15;
light.shadow.camera.top	= 15;
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add(light);

// Create Geometry
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshPhongMaterial({color: 0x0000ff, side: THREE.DoubleSide});
var crosscap = new THREE.Mesh(geometry, material);
crosscap.receiveShadow = true;
crosscap.castShadow = true;
scene.add(crosscap);
var floor_geometry = new THREE.PlaneGeometry(1000,1000);
var floor_material = new THREE.MeshPhongMaterial({color: 0xffffff});
var floor = new THREE.Mesh(floor_geometry,floor_material);
floor.position.set(0,-2,0);
floor.rotation.x -= Math.PI/2;
floor.receiveShadow = true;
floor.castShadow = false;
scene.add(floor);

const loader = new THREE.GLTFLoader();
loader.load( '../static/models/swarm_model.glb', function ( gltf ) {

  gltf.scene.traverse( function( node ) {
    if ( node.isMesh ) { node.castShadow = true; node.receiveShadow = true; }
  } );

	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

// Render
render();

// Render Loop
function render() {
	requestAnimationFrame(render);
	crosscap.rotation.x += 0.01;
	crosscap.rotation.y += 0.01;
	renderer.render(scene, camera);
}

// Parametric function for cross cap sphere
function paramFunc(u,v) {
	u = 2*Math.PI*u;
	v = 2*Math.PI*v;
	param = new THREE.Vector3();
	param.x = Math.sin(u)*Math.sin(2*v);
	param.y = Math.pow(Math.cos(v),2)*Math.sin(2*u);
	param.z = Math.pow(Math.cos(v),2)*Math.cos(2*u);
	return param;
}