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

function getRandomIntInclusive(min, max, increment) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * increment * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
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