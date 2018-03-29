
var chart;

var c = document.getElementById("canvas");
var rect = document.getElementById("#rect");

//c.addEventListener('mousedown', onMouseDown);
var ctx = c.getContext("2d");

ctx.canvas.width=window.innerWidth;
ctx.canvas.height=window.innerHeight;


var getBifurcation = function(options){//fn, box, step, firstValue, maxIteration, sensibility, verifAttractors){
  var pRange = options.box[0],
      attrRange = options.box[1],
      onProgress = options.onProgress,
      stepP = options.stepP,
      minP = pRange[0],
      maxP = pRange[1],
      minY = attrRange[0],
      maxY = attrRange[1],
      // dirty hack with the +1
      width = options.width+1,
      height = options.height,
      ctx = options.ctx,
      sensibility = options.sensibility,
      nIter = Math.ceil((maxP-minP)/options.stepP), attractors, graphs = [], attractors;
  let promises = [];
  let counter = 0;
  let p;

  const attrValue = [0, 100, 100, 255];
  const chaosValueMin = [100, 0, 0, 255];
  const chaosValueMax = [100, 0, 100, 255];
  const chaosValue = [0, 100, 0, 255];

  const imageMatrix = [];
  const yToMatrixIndex = function(y){
    return Math.floor((y-minY)/sensibility);
  }

  console.log("width", width, "height", height);

  const imgData = ctx.createImageData(width, height); // width x height
  const data = imgData.data;
  const optsMap = [];

  for(var i = 0; i < nIter; i++){
    p = minP+i*stepP;
    imageMatrix.push([]);
    const findAttractorsOpts = {
      param: p,
      fn: options.fn,
      min: minY,
      max: maxY,
      maxIteration: options.maxIteration,
      precision: sensibility/10,
      verifAttractors: options.verifAttractors
    }
    optsMap.push(findAttractorsOpts);
  }
  const l = optsMap.length;
  return Promise.map(optsMap.reverse(), (findAttractorsOpts, i) => {
    const index = l-i;
    const p = findAttractorsOpts.param;
    return findAttractors(findAttractorsOpts).then(attr => {

      counter++;
      if(findAttractorsOpts.param < 3 && findAttractorsOpts.param > 2.99){
        console.log(findAttractorsOpts, attr);
      }
      const col = [];
      //onProgress && onProgress(counter/nIter);
      if(attr.attractors){
        attr.attractors.forEach((attr)=> {
          const indexY = yToMatrixIndex(attr);
          //console.log('attractor at', i, indexY);
          col[indexY] = attrValue;
        })
      }

      if(attr.chaos){
        attr.chaos.forEach((chaos)=> {
          const indexYMin = yToMatrixIndex(chaos[0]);
          const indexYMax = yToMatrixIndex(chaos[1]);
          col[indexYMin] = chaosValueMin;
          col[indexYMax] = chaosValueMax;
          for(var indexY = indexYMin+1; indexY < indexYMax; indexY++){
            col[indexY] = chaosValue;
          }
        })
      }
      return col

    }).then(col => {
      //const yLog = 4;
      //console.log("index", index*4+yLog*width*4, i, index, [data[0+yLog*width*4], data[1+yLog*width*4]], [data[4+yLog*width*4], data[4+yLog*width*4]])
      //console.log("index", i, index, col)
      for (var j = 0; j < height; j++) {
        if(col[j]){
          const nPixel = (index+(height-1-j)*width);
          for (var k = 0; k < 4; k++) { // 4 is RGBA
            data[nPixel*4+k] = (col[j] && col[j][k]) || 0;
          }
          //console.log("nPixel", nPixel)
        }
      }
      ctx.putImageData(imgData, 0, 0);
    })
    .delay(0)
  }, {concurrency: 1})
    /*Promise.all(promises)
    .then(() => {
      console.timeEnd('findAttractors')
      return {imageMatrix, width, height};
    });*/

};

/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
//nv.addGraph(function() {
   /*chart = nv.models.scatterChart()
  .options({
    margin: {left: 100, bottom: 100},
    //x: function(d,i) { return i},
    showXAxis: true,
    showYAxis: true,
    //transitionDuration: 250
  }).showLegend(false);

  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart.xAxis
    .axisLabel("X")
    //.tickFormat(d3.format(',.01f'));

  chart.yAxis
    .axisLabel('Y')
    //.tickFormat(d3.format(',.01f'))
    ;


  var data;
  var rect;

  //augment highlightPoint
  var basichighlight = chart.scatter.highlightPoint;
  chart.scatter.highlightPoint = function(){
    var o = basichighlight.apply(this, arguments);
    data[arguments[0]].values[arguments[1]].x
    return o;
  };*/

var drawBif = function(options, cb){
  options || (options = {});

  var defaultOptions = {
      box                 : [[1, 4], [0, 1]],
      stepPRatio          : window.innerWidth,//(box[0][1] - box[0][0])/100,
      iterations          : 10000,
      sensibilityYRatio   : window.innerHeight,//(box[1][1] - box[1][0])/1000,
      verifAttractors     : 20,
      firstValue          : 0.75,
      fn                  : function(p, x){ return p*x*(1-x); }
    };

  for (var i in defaultOptions) if(defaultOptions.hasOwnProperty(i) && (!options || !options.hasOwnProperty(i))){
    options[i] = defaultOptions[i];
  }

  options.stepP       || (options.stepP       = (options.box[0][1] - options.box[0][0])/options.stepPRatio);
  options.sensibility || (options.sensibility = (options.box[1][1] - options.box[1][0])/options.sensibilityYRatio);

  options.onProgress = function(p){
    console.log('progress ', p);
  }
  console.time('getBifurcation')

  const width = Math.ceil((options.box[0][1]-options.box[0][0])/options.stepP)
  const height = Math.ceil((options.box[1][1]-options.box[1][0])/options.sensibility)
  options.width = width;
  options.height = height;
  options.ctx = ctx;


  return getBifurcation(options);


  return Promise.all(p2);
};

  /*var reset = d3.select('#chart1').append("a").attr("class","reset-button").text("reset").on("click",function(){
    drawBif();
  });*/
//setDrag({el : c, box: [[0,0],[1,1]], rect })

drawBif();
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
