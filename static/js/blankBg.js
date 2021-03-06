let camera, scene, renderer, mouse;

var horizontalOffset = 0;


var mousePosX;
var mousePosY;
var cameraPosX = 59.7;
var cameraPosY = 20.6;
var cameraPosZ = 36.5;

function init()
{
  scene = new THREE.Scene();
  
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
  renderer.render( scene, camera );
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

init();
animate();