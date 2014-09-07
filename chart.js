
var chart;
var f1 = function(p, x){
  return p*x*(1-x);
}

/*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
nv.addGraph(function() {
   chart = nv.models.scatterChart()
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



  var drag = d3.behavior.drag().on("drag",function(){
    
  });
  d3.select('#chart1 svg')
    .datum(getBifurcation(f1, box, stepX, firstValue, iterations, sensibility, verifAttractors))
    .call(chart);

  d3.select('#chart1').call(drag);


  //TODO: Figure out a good way to do this automatically
  nv.utils.windowResize(chart.update);
  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });

  chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

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
    console.log("chaos",p)
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

var getBifurcation = function(fn, box, step, firstValue, maxIteration, sensibility, verifAttractors){

  var pRange = box[0],
      attrRange = box[1],
      minP = pRange[0], 
      maxP = pRange[1], 
      nIter = Math.ceil((maxP-minP)/step), attractors, graphs = [], x, attractors;

  for(var i = 0; i < nIter; i++){
    x = minP+i*step;
    try {
      attractors = findAttractors(x, fn, attrRange, firstValue, maxIteration, sensibility, verifAttractors);

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










function graphs() {
  var parabol = [],linear = [],
      iterations = [], value = 0.78, valueBefore, a = 3.576;

  //Data is represented as an array of {x,y} pairs.
  for (var i = 0; i < 100; i++) {
    parabol.push({x: i/100, y: fn(i/100,a)});
    linear.push({x: i/100, y: i/100});
  }

  for (var i = 0; i < 1000; i++) {
    valueBefore = value;
    value = Math.max(fn(valueBefore,a),0);
    if(i>100){
      iterations.push({x: valueBefore, y: value});
      iterations.push({x: value, y: value});      
    }

    console.log(value, valueBefore);
  }

  //Line chart data should be sent as an array of series objects.
  return [
    {
      values: parabol,      //values - represents the array of {x,y} data points
      key: 'Parabol Y = ax(1-x)', //key  - the name of the series.
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