let camera, scene, renderer, stats, snowParameters, controls, mouse, raycaster;
const snowMaterials = [];
snowObjects = [];

var horizontalOffset = 0;
var storyHeight = 1;
//height
var minStoryCnt = 9;
var maxStoryCnt = 21;
//width
var minBuildingWidth = 2;
var maxBuildingWidth = 5;
//depth
var minBuildingDepth = 2;
var maxBuildingDepth = 9;

var spaceBetweenBuildings = 2;

var buildingBlockSize = 1;
var lightsOnChance = 0.3;

var startPosX = 0;
var startPosY = 0;
var startPosZ = 0;

var mouseOverObject;
var originalMouseOverObjMaterial;

var mousePosX;
var mousePosY;
var cameraPosX = 59.7;
var cameraPosY = 20.6;
var cameraPosZ = 36.5;

function getRandomIntInclusive(min, max, increment) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * increment * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function init()
{
  scene = new THREE.Scene();
  //scene.background = new THREE.Color( 0xff0000 );
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  renderer = new THREE.WebGLRenderer(
      {
          canvas: document.querySelector('#bg'),
      }
  );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight);
  camera.position.setY(cameraPosY);
  camera.position.setZ(cameraPosZ);
  camera.position.setX(cameraPosX);

  //controls = new THREE.OrbitControls(camera, renderer.domElement); 

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight)

  //scene.fog = new THREE.FogExp2( 0x000000, 0.005 );

  //const gridHelper = new THREE.GridHelper(200, 50);
  //scene.add(gridHelper)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 200),
    new THREE.MeshBasicMaterial({color: 0xD52F15})
  );
  plane.lookAt(0, 1, 0)
  scene.add(plane)

  plane.position.setZ(horizontalOffset)

  window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener( 'resize', onWindowResize );
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  mousePosX = mouse.x;
  mousePosY = mouse.y;
}

function animate() {
 
  if(mousePosX && mousePosY)
  {
    camera.position.x = cameraPosX + mousePosX;
    camera.position.y = cameraPosY + mousePosY;
    camera.position.z = cameraPosZ;
  }

  //console.log(mousePosX);

  requestAnimationFrame( animate );
  //controls.update();
  renderer.render( scene, camera );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//window.requestAnimationFrame(render);

//ToDo: some sort of game with windows. store number of cubes, if all lit up, turn them all off?

init();
//initSnow();

//generateBuildingRow(startPosX, startPosY, startPosZ, 10);

animate();