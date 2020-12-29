let outsideBlock;
let insideBlock;
const blockAnimationWorker = new Worker('./blockCollisionAnimation.js');
let canvas;

setUp = () => {
  canvas = document.getElementById("demo_canvas");
  outsideBlock = new Block(400, 440, 'red');
  insideBlock = new Block(800, 440, 'blue');
  drawScene(outsideBlock, insideBlock, canvas);
}

setBlocksMass = () => {
  outsideBlock = new Block(400, 440, 'red');
  insideBlock = new Block(800, 440, 'blue');
  outsideBlock.setSize(Number(document.getElementById("outside_block_mass").value));
  drawScene(outsideBlock, insideBlock, canvas);

}

resetSimulation = () => {
  document.getElementById("outside_block_mass").selectedIndex = "0";
  document.getElementById("simulationButton").disabled = false;
  document.getElementById("setButton").disabled = false;
  outsideBlock = new Block(400, 440, 'red');
  insideBlock = new Block(800, 440, 'blue');
  drawScene(outsideBlock, insideBlock, canvas);


}

saveResult = (collisions) => {
  const tableBody = document.getElementById('result_table').getElementsByTagName('tbody')[0];
  const newRow = tableBody.insertRow(-1);
  let cell1 = newRow.insertCell(0);
  let cell2 = newRow.insertCell(1);
  let cell3 = newRow.insertCell(2);
  cell1.innerHTML = outsideBlock.mass;
  cell2.innerHTML = insideBlock.mass;
  cell3.innerHTML = collisions;
}

const runSimulation = async () => {

  document.getElementById("simulationButton").disabled = true;
  document.getElementById("setButton").disabled = true;

  canvasContainer = document.getElementById("CanvasContainer");

  const animationCanvas = document.createElement('canvas');
  animationCanvas.width = canvas.width;
  animationCanvas.height = canvas.height;
  animationCanvas.style.width = canvas.width;
  animationCanvas.style.height = canvas.height;

  canvas.style.display = 'none';

  const simulationButton = document.getElementById("simulationButton")
  canvasContainer.insertBefore(animationCanvas,simulationButton );
  const offscreen = animationCanvas.transferControlToOffscreen();


  blockAnimationWorker.postMessage({ canvas: offscreen, exponent: outsideBlock.exponent}, [offscreen]);

  blockAnimationWorker.onmessage = async(evt) => {

    if (evt.data.isAnimationFinished) {

      saveResult(evt.data.collisions);
      
      await new Promise(r => setTimeout(r, 2000));

      canvasContainer.removeChild(animationCanvas);
      canvas.style.display = 'block';

      resetSimulation();

    }
  };
  


}


