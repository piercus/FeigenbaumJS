const Bif = require('bifurcation');

module.exports = function({fn, param, precision, min, max}){
	const bif = new Bif({
		fn: fn
	});

	return bif.attractors({param, precision, min, max})
}
