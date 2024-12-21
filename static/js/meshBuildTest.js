let camera, scene, renderer, controls, mouse, raycaster;

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

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 0, 30, 0 );
directionalLight.castShadow = true;
scene.add( directionalLight );

//Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 256; // default
directionalLight.shadow.mapSize.height = 256; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default


// set location of a vert given an index value in geometry.index
var setVert = function(geometry, vertIndex, pos){
  pos = pos || {};
  var posIndex = geometry.index.array[vertIndex] * 3,

  position = geometry.getAttribute('position');
  position.array[posIndex] = pos.x === undefined ? position.array[posIndex]: pos.x;
  position.array[posIndex + 1] = pos.y === undefined ? position.array[posIndex + 1]: pos.y;
  position.array[posIndex + 2] = pos.z === undefined ? position.array[posIndex + 2]: pos.z;

  console.log(posIndex);
};

// move vertex around
var randOffsetVert = function(geometry, vertIndex, offsetCap){
  // why is it times 3 here?
  // because each position has 3 indices. 3*1 = 3 [3 4 5], 3*2 = 6
  var posIndex = geometry.index.array[vertIndex] * 3,

  position = geometry.getAttribute('position');
  position.array[posIndex] = pos.x === undefined ? position.array[posIndex]: pos.x;
  position.array[posIndex + 1] = pos.y === undefined ? position.array[posIndex + 1]: pos.y;
  position.array[posIndex + 2] = pos.z === undefined ? position.array[posIndex + 2]: pos.z;

  console.log(posIndex);
};

//GEOMETRY
//PlaneGeom
geometry = new THREE.PlaneGeometry( 10, 10, 2, 2 );
geometry.rotateX( - Math.PI / 2 );  

const position = geometry.attributes.position;

console.log( position );
console.log( `position count ${position.count}` ); 
console.log( `position array len (count * 3 elements each) ${position.array.length}` ); 
var index = geometry.getIndex();
console.log(index);
console.log( `geometry index count ${index.count}` );      
console.log( `index count / 3 = triangles: ${index.count / 3}`);   

position.usage = THREE.DynamicDrawUsage;

// var pos = {
//   x: 1,
//   y: 0.25,
//   z: 1.25
// };

// setVert(geometry, 1, pos);

randOffsetVert(geometry, 3, 0.1)

// for ( let i = 0; i < position.count; i ++ ) {

//   const y = 10 * Math.sin( i / 2 );
//   position.setY( i, y );

// }

material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );

mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

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