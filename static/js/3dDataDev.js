let camera, scene, renderer, controls, mouse, raycaster;

var horizontalOffset = 0;

var cameraPosX = -5.74;
var cameraPosY = 4.5;
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


// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 60, 20, 60 );
directionalLight.castShadow = true;
scene.add( directionalLight );

//Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default

//PLANE
// var plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(600, 200),
//   new THREE.MeshLambertMaterial({
//       color: 0xD52F15,
//     })
// );
// plane.position.setZ(horizontalOffset)
// plane.lookAt(0, 1, 0)
// plane.receiveShadow = true;
// plane.castShadow = false;
// scene.add(plane)

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


controls.target.set(0, 0, 0);
controls.maxDistance = 200;
controls.update();


const loader = new THREE.FontLoader();


// const font = loader.load(
//   // resource URL
//   '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
  
//     // onLoad callback
//     function ( font ) {
//       // do something with the font
//       console.log( font );
//     },
//   );

loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

  const color = 0xD52F15;

  const matLite = new THREE.MeshBasicMaterial( {
    color: color,
    transparent: true,
    opacity: 0.4,
    side: THREE.FrontSide
  } );

  const message = 'Some text here';

  const shapes = font.generateShapes( message, 4 );

  const geometry = new THREE.ShapeGeometry( shapes );

  // Code below offsets text so that it is centered
  // geometry.computeBoundingBox();
  // const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
  // geometry.translate( xMid, 0, 0 );

  var text = new THREE.Mesh( geometry, matLite );
  text.lookAt(0, 1, 0)
  text.position.z = 5
  console.log(geometry.boundingBox)
  console.log(text.position);
  scene.add( text );
})




window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );

  //console.log(camera.position);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

animate();

var startPosX = 0;
var startPosY = 0;
var startPosZ = 0;

generateBuildingRow(startPosX, startPosY, startPosZ, 10);