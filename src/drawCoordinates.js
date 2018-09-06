const minPixelCoordsDiff = 100;
const xMargin = 50;
const yMargin = 50;
const yTickSize = 20;
const xTickSize = 20;


module.exports = function({
	ctx,
	box,
	width,
	height
}){
  const boxW = box[0][1] - box[0][0];
  const boxH = box[1][1] - box[1][0];

  const xRatio = boxW/width;
	const yRatio = boxH/height;

	const pMinDiffX = minPixelCoordsDiff*xRatio;

	const pow10X = Math.pow(10, Math.floor(Math.log(pMinDiffX)/Math.log(10)));
	const possiblitiesX = [pow10X*2, pow10X*5, pow10X*10];
	const diffX = possiblitiesX.filter(v => v > pMinDiffX)[0];

	const coordsX = [];
	const startXN = Math.ceil(box[0][0]/diffX);
	for(var i = 0; i < boxW/diffX; i ++){
		const value = (startXN+i)*diffX;
		coordsX.push({
			position : (value - box[0][0]) / xRatio,
			value : value
		})
	}
	const pMinDiffY = minPixelCoordsDiff*yRatio;

	const pow10Y = Math.pow(10, Math.floor(Math.log(pMinDiffY)/Math.log(10)));
	const possiblitiesY = [pow10Y*2, pow10Y*5, pow10Y*10];
	const diffY = possiblitiesY.filter(v => v > pMinDiffY)[0];

	const coordsY = [];
	const startYN = Math.ceil(box[1][0]/diffY);
	for(var i = 0; i < boxH/diffY; i ++){
		const value = (startYN+i)*diffY;
		coordsY.push({
			position : (box[1][1] - value) / yRatio,
			value : value
		})
	}

	coordsX.map(c => {
		ctx.fillRect(c.position,0,1, xTickSize);
		ctx.fillText(c.value,c.position,xTickSize);
	})
	coordsY.map(c => {
		ctx.fillRect(0, c.position, yTickSize, 1);
		ctx.fillText(c.value,yTickSize, c.position);
	})
}
