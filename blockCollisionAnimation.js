let collisions = 0;

class Block {

    constructor(x, y, color) {
  
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 40;
      this.vel = 0;
      this.color = color;
      this.exponent = 0
      this.mass = 10 ** this.exponent
  
    }
  
    setSize = (exp) => {
  
      this.exponent = exp;
      this.mass = 10 ** this.exponent
      this.y -= this.width * (this.exponent)/3;
      this.width *= (this.exponent/3 + 1)
      this.height  *= (this.exponent/3 + 1)
  
    }
  
    getSize = () => {
  
      return [this.x, this.y, this.width, this.height]
  
    }
  
  }

onmessage = function(evt) {
  collisions = 0;

  let outsideBlock = new Block(400, 440, 'red');
  let insideBlock = new Block(800, 440, 'blue');
  outsideBlock.setSize(Number(evt.data.exponent));
  const canvas = evt.data.canvas;
  const timeSteps = Math.ceil(10 ** (outsideBlock.exponent/(insideBlock.exponent+1) -Math.ceil(outsideBlock.exponent/2)));
  outsideBlock.vel = 1/timeSteps ;

  requestAnimationFrame((timestamp) => {moveBlocks(timestamp, canvas, outsideBlock, insideBlock, timeSteps)});

}


drawBlocks = (outsideBlock, insideBlock, canvas) => {

    if (canvas.getContext) {
    
    const ctx = canvas.getContext('2d');

    //clear aby umożliwic animacje
    ctx.clearRect(0,0,980,480)

    //inside block
    ctx.fillStyle = insideBlock.color;
    ctx.fillRect(...insideBlock.getSize());

    //outside block

    ctx.fillStyle = outsideBlock.color;
    ctx.fillRect(...outsideBlock.getSize());
    
    }

}

drawScene = (outsideBlock, insideBlock, canvas) => {

    if (canvas.getContext) {

    const ctx = canvas.getContext('2d');

    drawBlocks(outsideBlock, insideBlock, canvas);

    ctx.fillStyle = 'black';
    
    //floor
    ctx.fillRect(0, 480, 980, 20);
    //wall
    ctx.fillRect(980, 0, 20, 500);

    
    drawNumberOfCollisions(canvas);

    }

}

drawNumberOfCollisions = (canvas) => {

    if (canvas.getContext) {

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'red';
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("Liczba zderzeń: " + collisions, 10, 50);

    }

}


moveBlocks = (timestamp, canvas, outsideBlock, insideBlock, timeSteps) => {

  for (let i = 0; i < timeSteps; i++) {
    if (outsideBlock.x + outsideBlock.width > insideBlock.x){

      vel1 = ((outsideBlock.mass - insideBlock.mass) / (outsideBlock.mass + insideBlock.mass)) * outsideBlock.vel + ((2 * insideBlock.mass) / (outsideBlock.mass + insideBlock.mass)) * insideBlock.vel
      vel2 = ((insideBlock.mass - outsideBlock.mass) / (outsideBlock.mass + insideBlock.mass)) * insideBlock.vel + ((2 * outsideBlock.mass) / (outsideBlock.mass + insideBlock.mass)) * outsideBlock.vel
      
      outsideBlock.vel = vel1
      insideBlock.vel = vel2
      collisions += 1

    }  

    else if(insideBlock.x + insideBlock.width > 980){

      insideBlock.vel = -insideBlock.vel
      collisions += 1

    }
    
    outsideBlock.x +=  outsideBlock.vel
    insideBlock.x += insideBlock.vel

  }

  drawScene(outsideBlock, insideBlock, canvas);
  if(outsideBlock.x + outsideBlock.width < 0){
    endSimulation(canvas)
    postMessage({ isAnimationFinished: true, collisions });
    return;
  }

  requestAnimationFrame(() => {moveBlocks(timestamp, canvas, outsideBlock, insideBlock, timeSteps)});


  
}
  
endSimulation = (canvas) =>{

    if (canvas.getContext) {

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Koniec symulacji", 400, 100);

    }

}