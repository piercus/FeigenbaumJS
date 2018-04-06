
const calculateBifurcation = require('./calculateBifurcation')

/**
* @param {Array.<Array.<number>>} [box=[[1, 4], [0, 1]]]
* @param {number} width
* @param {number} height
* @param ctx
* @param {number} [verifAttractors=20]
* @param {function} [fn=function(p, x){ return p*x*(1-x); }]
* @return {Promise.<null>}
*/


module.exports = function(options = {}){
  options || (options = {});

	if(typeof(options.width) !== 'number'){
		return Promise.reject(new Error('width is mandatory'))
	}

	if(typeof(options.height) !== 'number'){
		return Promise.reject(new Error('height is mandatory'))
	}

  var defaultOptions = {
      box                 : [[1, 4], [0, 1]],
      verifAttractors     : 20,
      fn                  : function(p, x){ return p*x*(1-x); }
    };

  for (var i in defaultOptions) if(defaultOptions.hasOwnProperty(i) && (!options || !options.hasOwnProperty(i))){
    options[i] = defaultOptions[i];
  }

	if(!options.sensibility){
		options.sensibility = [
			(options.box[0][1] - options.box[0][0])/options.width,
			(options.box[1][1] - options.box[1][0])/options.height
		]
	}

  return _draw(options);
};

/**
* @param box
* @param stepP
* @param width
* @param height
* @param context
* @param sensibility
* @param ctx
*/


const _draw = function(options){//fn, box, step, firstValue, maxIteration, sensibility, verifAttractors){
  var pRange = options.box[0],
      attrRange = options.box[1],
      stepP = options.sensibility[0],
      minP = pRange[0],
      maxP = pRange[1],
      minY = attrRange[0],
      maxY = attrRange[1],
      width = options.width,
      height = options.height,
      ctx = options.ctx,
      sensibility = options.sensibility[1],
      nIter = Math.floor((maxP-minP)/stepP)-1, attractors, graphs = [], attractors;
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

  const imgData = ctx.createImageData(width, height); // width x height
  const data = imgData.data;
  const optsMap = [];

  for(var i = 0; i < nIter; i++){
    p = minP+i*stepP;
    imageMatrix.push([]);
    const calculateBifurcationOpts = {
      param: p,
      fn: options.fn,
      min: minY,
      max: maxY,
      maxIteration: options.maxIteration,
      precision: sensibility/10,
      verifAttractors: options.verifAttractors
    }
    optsMap.push(calculateBifurcationOpts);
  }
  const l = optsMap.length;
  return Promise.map(optsMap.reverse(), (calculateBifurcationOpts, i) => {
    const index = l-i;
    const p = calculateBifurcationOpts.param;
    return calculateBifurcation(calculateBifurcationOpts).then(attr => {

      counter++;
      if(calculateBifurcationOpts.param < 3 && calculateBifurcationOpts.param > 2.99){
        console.log(calculateBifurcationOpts, attr);
      }
      const col = [];
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
};
