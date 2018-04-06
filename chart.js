
var chart;

var c = document.getElementById("canvas");
var rect = document.getElementById("rect");
var wrapper = document.getElementById("wrapper");

//c.addEventListener('mousedown', onMouseDown);
var ctx = c.getContext("2d");

ctx.canvas.width=window.innerWidth;
ctx.canvas.height=window.innerHeight;

  /*var reset = d3.select('#chart1').append("a").attr("class","reset-button").text("reset").on("click",function(){
    drawBif();
  });*/
/**
* @param {Dragging} dragging
*/
const onSelect = function(box, dragging){
  console.log('onSelect');
}
const box = [[0,0],[1,1]];
setDrag({
  el : wrapper,
  box,
  rect,
  onSelect: onSelect.bind(this, box)
})

drawBif({
  ctx,
  width: window.innerWidth,
  height: window.innerHeight
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
