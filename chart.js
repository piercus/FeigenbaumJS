
var chart;

/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
nv.addGraph(function() {
   chart = nv.models.scatterChart()
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
  };

  var drawBif = function(options, cb){
    options || (options = {});
    
    var defaultOptions = {
        box                 : [[1, 4], [0, 1]],
        stepXRatio          : 100,//(box[0][1] - box[0][0])/100,
        iterations          : 10000,
        sensibilityYRatio   : 1000,//(box[1][1] - box[1][0])/1000,
        verifAttractors     : 20,
        firstValue          : 0.75,
        fn                  : function(p, x){ return p*x*(1-x); }
      };

    for (var i in defaultOptions) if(defaultOptions.hasOwnProperty(i) && (!options || !options.hasOwnProperty(i))){
      options[i] = defaultOptions[i];
    }

    options.stepX       || (options.stepX       = (options.box[0][1] - options.box[0][0])/options.stepXRatio);
    options.sensibility || (options.sensibility = (options.box[1][1] - options.box[1][0])/options.sensibilityYRatio);

    data = getBifurcation(options);

    d3.select('#chart1 svg')
        .datum(data)
        .call(chart);
    
    var drag = setDrag(options);

    d3.select('#chart1').call(drag);

  };

  var reset = d3.select('#chart1').append("a").attr("class","reset-button").text("reset").on("click",function(){
    drawBif();
  });

  var setDrag = function(options){
      var dragX,dragY, startX, startY, box = options.box;

      var resetDrag = function(){
        dragX = 0; 
        dragY = 0;
      };

      var resizeBox = function(x,y){
        rect.attr("width",Math.abs(x));  

        if(x>=0){
          rect.attr("x",startX);  
        } else {
          rect.attr("x",startX + x); 
        }

        
        rect.attr("height",Math.abs(y));
        if(y>=0){
          rect.attr("y",startY);  
        } else {
          rect.attr("y",startY + y); 
        }

      };


      var drag = d3.behavior.drag().on("drag",function(e,x,y){
        dragX+=d3.event.dx;
        dragY+= d3.event.dy;
        //console.log("on drag",dragX,dragY,x,y);

        resizeBox(dragX, dragY);

      }).on("dragstart",function(){

        d3.event.sourceEvent.stopPropagation(); // silence other listeners
        var s = d3.select("#chart1 svg"),
            left = s.node().getBoundingClientRect().left,
            top = s.node().getBoundingClientRect().top;

        startX = d3.event.sourceEvent.clientX-left;
        startY = d3.event.sourceEvent.clientY-top;
        rect = s.append("rect")
          .attr("style", "fill:blue;stroke:blue;stroke-width:5;opacity:0.1")
          .attr("x",startX)
          .attr("y",startY);

        //console.log("dragstart", d3.event, drag.origin());
        resetDrag();
        
      }).on("dragend",function(){
        rect.remove();

        var graphRect = d3.select(".nv-groups").node().getBoundingClientRect();

        var svgRect = d3.select('#chart1 svg').node().getBoundingClientRect();

        var dragRect = {
          left : Math.min(startX, startX + dragX)+svgRect.left,
          right : Math.max(startX, startX + dragX)+svgRect.left,
          top : Math.min(startY, startY + dragY)+svgRect.top,
          bottom : Math.max(startY, startY + dragY)+svgRect.top
        };

        

        ratioPixelScale = [
          (box[0][1] - box[0][0])/(graphRect.right-graphRect.left),
          (box[1][1] - box[1][0])/(graphRect.bottom-graphRect.top),
        ];

        newBox = [[
            (dragRect.left-graphRect.left)*ratioPixelScale[0]+box[0][0],
            (dragRect.right-graphRect.right)*ratioPixelScale[0]+box[0][1]
          ],[
            (-1)*(dragRect.bottom-graphRect.bottom)*ratioPixelScale[1]+box[1][0],
            (-1)*(dragRect.top-graphRect.top)*ratioPixelScale[1]+box[1][1]
        ]];

        //console.log(newBox, dragRect, graphRect, ratioPixelScale, box);

        drawBif({box : newBox})
        

      });

      return drag;
  }

  drawBif();
  return chart;
});
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



var findAttractors = function(p, fn, attrRange, firstValue, maxIteration, sensibility, verifAttractors){
  !firstValue && (firstValue = Math.random());
  !maxIteration && (maxIteration=1000);
  !sensibility && (sensibility = 0.001);
  !verifAttractors && (verifAttractors = 5);

  var attractors = null, suite = [firstValue,], chaos = false, found = false, l = 1, attractors,t,k,m;

  var next = function(){
      suite.push(fn(p, suite[l-1]));
      l++;
  }

  while (l < maxIteration && !found){
    nextSuite = fn(p, suite[l-1])
    for(var j = l; j > l/4; j--){
      if(!found && (Math.abs(suite[j] - nextSuite) < sensibility)){
        found = true;
        cycle = l-j;

        for(var t = 0; t < verifAttractors*cycle; t++) next();

        attractors = suite.slice(l-cycle,l).sort();

        for(var k = 0; k < attractors.length; k++){
          if(found && Math.abs(suite[l-1-k] - suite[l-1-k-verifAttractors*cycle])>sensibility/10){
            found = false;
          }
        }

      }
    }

    if(!found){
      next();
      //console.log(l);
    }

  }
  
  if(!found){
    chaos = true;
    //console.log("chaos",p)
    //throw new Error("not found in "+maxIteration+" iterations");
    attractors = suite;
  }

  var selectedAttractors = [];

  for(var i = 0; i < attractors.length; i++){
    if(attractors[i] < attrRange[1] && attractors[i] > attrRange[0]){
      selectedAttractors.push(attractors[i]);
    }
  }

  if(chaos){
    //throw new Error("chaos");
    selectedAttractors = selectedAttractors.slice(-50);
  }

  return selectedAttractors.sort(function(a,b){return a-b});
};

var getBifurcation = function(options){//fn, box, step, firstValue, maxIteration, sensibility, verifAttractors){

  var pRange = options.box[0],
      attrRange = options.box[1],
      minP = pRange[0], 
      maxP = pRange[1], 
      nIter = Math.ceil((maxP-minP)/options.stepX), attractors, graphs = [], x, attractors;

  for(var i = 0; i < nIter; i++){
    x = minP+i*options.stepX;
    try {
      attractors = findAttractors(x, options.fn, attrRange, options.firstValue, options.maxIteration, options.sensibility, options.verifAttractors);

      for(var j =0; j < attractors.length; j++){
        graphs[j] ||(graphs[j] = []);
        graphs[j].push({x:x, y: attractors[j]});
      }

    } catch (e) {
      console.log(e);
    }
  }
  console.log(graphs.length);
  return graphs.map(function(g, index){ return { values : g , key : index}; });
};










function graphs(o){//a,min,u0,fn) {

  var a = o.param, min = o.min, u0 = o.u0, parabol = [],linear = [],
      iterations = [], value = o.u0 || 0.75, valueBefore, fn = o.fn;

  a ||(a= 3.576);
  min || (min = 100);

  //Data is represented as an array of {x,y} pairs.
  for (var i = 0; i < 100; i++) {
    parabol.push({x: i/100, y: fn(a,i/100)});
    linear.push({x: i/100, y: i/100});
  }

  for (var i = 0; i < 1000; i++) {
    valueBefore = value;
    value = Math.max(fn(a,valueBefore),0);
    if(i+2>min){
      iterations.push({x: valueBefore, y: value});
      iterations.push({x: value, y: value});      
    }

    console.log(value, valueBefore);
  }

  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: parabol,      //values - represents the array of {x,y} data points
      key: 'Parabol Y = '+a+'*x*(1-x)', //key  - the name of the series.
      color: '#ff7f0e'  //color - optional: choose your own line color.
    },
    {
      values: linear,
      key: 'linear X = Y',
      color: '#2ca02c'
    },
    {
      values: iterations,
      key: 'iterations',
      color: '#7777ff'
    }
  ];
}
/*
nv.addGraph(function() {
   chart = nv.models.lineChart()
  .options({
    margin: {left: 100, bottom: 100},
    //x: function(d,i) { return i},
    showXAxis: true,
    showYAxis: true,
    //transitionDuration: 250
  })
  ;

  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
  chart.xAxis
    .axisLabel("X")
    //.tickFormat(d3.format(',.01f'));

  chart.yAxis
    .axisLabel('Y')
    //.tickFormat(d3.format(',.01f'))
    ;

  var box = [[1, 3.8], [0, 10]],
      stepX = (box[0][1] - box[0][0])/100,
      iterations = 10000,
      sensibility = (box[1][1] - box[1][0])/1000,
      verifAttractors = 20,
      firstValue = 0.75;



  
  d3.select('#chart2 svg')
    .datum(graphs({param : 3.56, min : 100, u0 : 0.1, fn : }))
    .call(chart);


  //TODO: Figure out a good way to do this automatically
  nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

  //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

  return chart;
});*/