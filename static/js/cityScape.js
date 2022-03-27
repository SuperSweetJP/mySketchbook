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
var mouseMod = 0.3;
var cameraPosX = 59.7;
var cameraPosY = 20.6;
var cameraPosZ = 36.5;
var cameraRotX;
var cameraRotY;
var cameraRotZ;

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

  cameraRotX = camera.rotation.x;
  cameraRotY = camera.rotation.y;
  cameraRotZ = camera.rotation.z;

  controls = new THREE.OrbitControls(camera, renderer.domElement); 

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight)

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

function generateBuilding(posX, posY, posZ, boxHeight, boxWidth, boxDepth)
{
  locPosX = posX;
  locPosY = posY;
  locPosZ = posZ;

  for(let d = 0; d < boxDepth; d++)
  {
      for(let h = 0; h < boxHeight; h++)
      {
        for(let w = 0; w < boxWidth; w++)
        {
          //top floor?
          var topFloor = (h == boxHeight - 1) ? 1 : 0;
          var frontOfBuilding = (d == 0) ? 1 : 0;

          //left corner
          if(w == 0)
          {
            generateBox(locPosX, locPosY, locPosZ, generateMaterial(0, 1, topFloor, 0, frontOfBuilding, 0));
            locPosX += buildingBlockSize;
          }
          //right coner
          else if(w == (boxWidth - 1))
          {
            generateBox(locPosX, locPosY, locPosZ, generateMaterial(1, 0, topFloor, 0, frontOfBuilding, 0));
            locPosX = posX;
          }
          //middle blocks
          else
          {
            generateBox(locPosX, locPosY, locPosZ, generateMaterial(0, 0, topFloor, 0, frontOfBuilding, 0));
            locPosX += buildingBlockSize;
          }
        }
        
        locPosY += buildingBlockSize;
      }

      locPosY = posY;
      locPosZ -= buildingBlockSize;
  }
}

function generateBox(posX, posY, posZ, material)
{ 
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(buildingBlockSize, buildingBlockSize, buildingBlockSize),
    material
  );

  scene.add(box)
  box.position.setY(posY);
  //pivot point is at center of object
  box.position.setX(posX);
  box.position.setZ(posZ);
}

function generateMaterial(matRight, matLeft, matTop, matBot, matFront, matBack)
{
  //chance for getting texture 1/0 for the block
  var d = Math.random();
  var texture;
  
  if (d < lightsOnChance)
  {
    texture = new THREE.TextureLoader().load( '../static/img/wallOn.jpg' );
  }
  else
  {
    texture = new THREE.TextureLoader().load( '../static/img/wallOff.jpg' );
  }

  var cubeMaterial = [
    matRight ? new THREE.MeshBasicMaterial({ map: texture }) : 0, //right
    matLeft ? new THREE.MeshBasicMaterial({ map: texture }) : 0, //left
    matTop ? new THREE.MeshBasicMaterial({ color: 0x615D6C }) : 0, //top
    matBot ? new THREE.MeshBasicMaterial({ color: 0x615D6C }) : 0, //bot
    matFront ? new THREE.MeshBasicMaterial({ map: texture }) : 0, //front
    matBack ? new THREE.MeshBasicMaterial({ map: texture }) : 0, //back
  ]

  return cubeMaterial;
}

function generateBuildingRow (_startPosX, _startPosY, _startPosZ, _buildCnt)
{
  var previousBuildingWidth = 0;

  for(let i = 0; i < _buildCnt; i++)
  {
    buildingHeight = getRandomIntInclusive(minStoryCnt, maxStoryCnt, storyHeight)
    buildingWidth = getRandomIntInclusive(minBuildingWidth, maxBuildingWidth, storyHeight);
    buildingDepth = getRandomIntInclusive(minBuildingDepth, maxBuildingDepth, storyHeight);
    
    generateBuilding(_startPosX + spaceBetweenBuildings * i + previousBuildingWidth, 
                    _startPosY + buildingBlockSize/2, 
                    _startPosZ, 
                    buildingHeight, 
                    buildingWidth, 
                    buildingDepth);

    previousBuildingWidth += buildingWidth;
  }
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
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

  //turn on lights on mouseover
  if(intersects.length > 0 && intersects[ 0 ].object.geometry.type == 'BoxGeometry')
  {
    if(mouseOverObject != intersects[ 0 ].object)
    {
      //set the original material to previous object
      if ( mouseOverObject )
      {
        mouseOverObject.material = originalMouseOverObjMaterial;
      }

      mouseOverObject = intersects[ 0 ].object;
      //store origin material
      originalMouseOverObjMaterial = mouseOverObject.material;
      materialMod = mouseOverObject.material;

      //console.log(mouseOverObject.geometry.type);

      texture = new THREE.TextureLoader().load( '../static/img/wallOn.jpg' );
      materialMod[4] = new THREE.MeshBasicMaterial({ map: texture });
  
      mouseOverObject.material = materialMod;
    }
  }
  else
  {
    //set the original material to previous object
    if ( mouseOverObject )
    {
      mouseOverObject.material = originalMouseOverObjMaterial;
    }

    mouseOverObject = null;
  }
  
  if(mousePosX && mousePosY)
  {
    camera.position.x = cameraPosX + mousePosX * mouseMod;
    camera.position.y = cameraPosY + mousePosY * mouseMod;
    camera.position.z = cameraPosZ;
  }

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//ToDo: some sort of game with windows. store number of cubes, if all lit up, turn them all off?

init();

generateBuildingRow(startPosX, startPosY, startPosZ, 10);

animate();