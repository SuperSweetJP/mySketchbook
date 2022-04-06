let camera, scene, renderer, controls, mouse, raycaster, mixer, clock;

var horizontalOffset = 0;

var cameraPosX = 15;
var cameraPosY = 10;
var cameraPosZ = 10;


scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer( {canvas: document.querySelector('#bg')} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.setY(cameraPosY);
camera.position.setZ(cameraPosZ);
camera.position.setX(cameraPosX);


controls = new THREE.OrbitControls(camera, renderer.domElement); 

clock = new THREE.Clock();

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight)

// const light = new THREE.PointLight( 0xffffff, 10, 35 );
// light.position.set( 0, 5, 0 );
// scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 0, 30, 0 );
directionalLight.castShadow = true;
scene.add( directionalLight );

//Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 256; // default
directionalLight.shadow.mapSize.height = 256; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default


// loader.load( '../static/models/chess_knight.glb', function ( gltf ) {
//   var model = gltf.scene;
//   var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
//   model.traverse((o) => {
//   if (o.isMesh) o.material = newMaterial;
// });
// 	scene.add( model );
// }, undefined, function ( error ) {
// 	console.error( error );
// } );

const loader = new THREE.GLTFLoader();
loader.load( '../static/models/swarmAnim.glb', function ( gltf ) {
  gltf.scene.traverse( function( node ) {
    if ( node.isMesh ) 
    { 
      node.castShadow = true;
      node.receiveShadow = false; 
    }

    mixer = new THREE.AnimationMixer( gltf.scene );
		var action = mixer.clipAction( gltf.animations[ 0 ] );
		action.play();
  } );
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );

//PLANE
var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 200),
  new THREE.MeshLambertMaterial({
      color: 0xD52F15,
      // side: THREE.DoubleSide
    })
);
plane.position.setZ(horizontalOffset)
plane.lookAt(0, 1, 0)
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane)




controls.target.set(0, 0, 0);
controls.maxDistance = 200;
controls.update();


//Create a helper for the shadow camera (optional)
// const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
// scene.add( helper );

window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame( animate );

  var delta = clock.getDelta();
	if ( mixer ) mixer.update( delta );

  controls.update();
  renderer.render( scene, camera );

  // console.log(camera.position);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

animate();