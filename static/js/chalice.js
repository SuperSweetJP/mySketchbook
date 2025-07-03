let camera, scene, renderer, controls, mouse, raycaster;

var horizontalOffset = 0;

var cameraPosX = -2.41;
var cameraPosY = 5.54;
var cameraPosZ = 4.16;


scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer( {canvas: document.querySelector('#bg')} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(new THREE.Color(0x484848));
document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.setY(cameraPosY);
camera.position.setZ(cameraPosZ);
camera.position.setX(cameraPosX);

controls = new THREE.OrbitControls(camera, renderer.domElement); 



const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight)

// const light = new THREE.PointLight( 0xffffff, 10, 35 );
// light.position.set( 0, 5, 0 );
// scene.add( light );


const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 60, 20, 60 );
directionalLight.castShadow = true;
scene.add( directionalLight );

//Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default


const loader = new THREE.GLTFLoader();
loader.load( '../static/models/chalice.glb', function ( gltf ) {

  gltf.scene.traverse( function( node ) {
    if ( node.isMesh ) 
    { 
      node.castShadow = false;
      node.receiveShadow = false; 
    }
  } );

	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );


controls.target.set(0, 0, 0);
controls.maxDistance = 200;
controls.update();


//Create a helper for the shadow camera (optional)
// const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
// scene.add( helper );

window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );

  console.log(camera.position);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

animate();