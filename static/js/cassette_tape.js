let camera, scene, renderer, controls, mouse, raycaster, mixer, clock;

var horizontalOffset = 0;

var cameraPosX = 0;
var cameraPosY = 3;
var cameraPosZ = 6;


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

clock = new THREE.Clock();

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight)

// Loader
let action1, action2;

const loader = new THREE.GLTFLoader();
loader.load('../static/models/cassette_tape.glb', function (gltf) {
  gltf.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = false;
      node.receiveShadow = false;
    }
  });

  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  action1 = mixer.clipAction(gltf.animations[0]);
  action2 = mixer.clipAction(gltf.animations[1]);

  action1.setLoop(THREE.LoopOnce);
  action1.clampWhenFinished = true;
  action1.paused = true;

  action2.setLoop(THREE.LoopOnce);
  action2.clampWhenFinished = true;
  action2.paused = true;
}, undefined, function (error) {
  console.error(error);
});


controls.target.set(0, 0, 0);
controls.maxDistance = 200;
controls.update();

window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame( animate );

  var delta = clock.getDelta();
	if ( mixer ) mixer.update( delta );

  controls.update();
  renderer.render( scene, camera );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

animate();

window.addEventListener('click', () => {
  if (action1 && action2) {
    action1.reset();
    action1.paused = false;
    action1.play();
    action2.reset();
    action2.paused = false;
    action2.play();
  }
});