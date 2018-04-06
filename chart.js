
var chart;

var c = document.getElementById("canvas");
var rect = document.getElementById("rect");
var wrapper = document.getElementById("wrapper");
var message = document.getElementById("message");

//c.addEventListener('mousedown', onMouseDown);
var ctx = c.getContext("2d");

ctx.canvas.width=window.innerWidth;
ctx.canvas.height=window.innerHeight;

const progressFn = function(p){
  message.innerHTML = Math.floor(p*100)+'%';
};

let bif;
let dragOptions;
  /*var reset = d3.select('#chart1').append("a").attr("class","reset-button").text("reset").on("click",function(){
    drawBif();
  });*/
/**
* @param {Dragging} dragging
*/
const onSelect = function(dragOptions, dragging){
  bif.stop();
  const boxW = dragOptions.box[0][1] - dragOptions.box[0][0];
  const boxH = dragOptions.box[1][1] - dragOptions.box[1][0];

  const xRatio = boxW/dragOptions.width;
  const startX = dragOptions.box[0][0] + dragging.x*xRatio;
  const endX = startX + dragging.w*xRatio;

  const yRatio = boxH/dragOptions.height;
  const startY = dragOptions.box[1][0] + dragging.y*yRatio;
  const endY = startY + dragging.h*yRatio;

  dragOptions.box = [[
      Math.min(startX, endX),
      Math.max(startX, endX)
    ],[
      Math.min(startY, endY),
      Math.max(startY, endY)
  ]];

  drawBif({
    ctx,
    box: dragOptions.box,
    width: window.innerWidth,
    height: window.innerHeight,
    progressFn
  });
}
const box = [[1, 4], [0, 1]];
dragOptions = {
  el : wrapper,
  box,
  width: window.innerWidth,
  height: window.innerHeight,
  rect
};

dragOptions.onSelect = onSelect.bind(this, dragOptions);

const onReset = function(){

};



setDrag(dragOptions)

bif = drawBif({
  ctx,
  box: dragOptions.box,
  width: window.innerWidth,
  height: window.innerHeight,
  progressFn: progressFn
});
  //return chart;
//});
/*
function sinAndCos() {
  var sin = [],
    cos = [],
    rand = [],
    rand2 = []
    ;

  for (var i = 0; i < 100; i++) {
    sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
    cos.push({x: i, y: .5 * Math.cos(i/10)});
    rand.push({x:i, y: Math.random() / 10});
    rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
  }

  return [
    {
      area: true,
      values: sin,
      key: "Sine Wave",
      color: "#ff7f0e"
    },
    {
      values: cos,
      key: "Cosine Wave",
      color: "#2ca02c"
    },
    {
      values: rand,
      key: "Random Points",
      color: "#2222ff"
    }
    ,
    {
      values: rand2,
      key: "Random Cosine",
      color: "#667711"
    }
  ];
}*/
/**************************************
 * Simple test data generator
 */
