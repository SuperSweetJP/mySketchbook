let camera, scene, renderer, mouse;

var horizontalOffset = 0;


var mousePosX;
var mousePosY;
var cameraPosX = -8;
var cameraPosY = 4;
var cameraPosZ = 10;

var cameraMovMod = .18;

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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.setY(cameraPosY);
  camera.position.setZ(cameraPosZ);
  camera.position.setX(cameraPosX);


  mouse = new THREE.Vector2();

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( 60, 20, 60 );
  directionalLight.castShadow = true;
  scene.add( directionalLight );

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 512; // default
  directionalLight.shadow.mapSize.height = 512; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default

  //Knight model
  const loader = new THREE.GLTFLoader();
  loader.load( '../static/models/chessKnight512_2.glb', function ( gltf ) {
    // var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
  
    gltf.scene.traverse( function( node ) {
      if ( node.isMesh ) 
      { 
        node.castShadow = true;
        node.receiveShadow = false; 
        // node.material = newMaterial; 
      }
    } );
  
    scene.add( gltf.scene );
  }, undefined, function ( error ) {
    console.error( error );
  } );
  
  //Plane
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
    camera.position.x = cameraPosX + mousePosX * cameraMovMod;
    camera.position.y = cameraPosY + mousePosY * cameraMovMod;
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