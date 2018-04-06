const minPixelCoordsDiff = 100;

module.exports = drawCoordinates({
	ctx,
	box,
	width,
	height
}){
  const boxW = box[0][1] - box[0][0];
  const boxH = box[1][1] - box[1][0];

  const xRatio = boxW/width;
	const yRatio = boxH/height;

	const pMinDiff = minPixelCoordsDiff*xRatio;

	const pow10 = Math.floor(Math.log(pMinDiff)/Math.log(10));
	const possiblities = [pow10*2, pow10*5, pow10*10];
	const diff = possibilities.filter(v => v > pMinDiff)[0];

	const coordsX = [];
	for(var i = box[0][0]; i < box[0][1]; i += diff){

	}

}
