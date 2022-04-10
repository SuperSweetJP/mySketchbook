let camera, scene, renderer, mouse;

var horizontalOffset = 0;

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

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight)

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 200),
    new THREE.MeshBasicMaterial({color: 0xD52F15})
  );
  plane.lookAt(0, 1, 0)
  scene.add(plane)

  plane.position.setZ(horizontalOffset)

  window.addEventListener( 'resize', onWindowResize );
}

function animate() {
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