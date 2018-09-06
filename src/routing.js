/**
* @param {Array.<Array.<number>>} [opts.box=[[1, 4], [0, 1]]]
*/

const navigate = function ({box}) {
  var current = window.location.href;
  window.location.href = current.replace(/#(.*)$/, '')
    + '#'
    + box[0][0] + '/'
    + box[0][1] + '/'
    + box[1][0] + '/'
    + box[1][1];
}

/**
* @param {Array.<Array.<number>>} [opts.box=[[1, 4], [0, 1]]]
* @return {Array.<Array.<number>>} res.box
*/

const parse = function () {
  var current = window.location.href;
	const matches = current.match(/#([0-9\.]+)\/([0-9\.]+)\/([0-9\.]+)\/([0-9\.]+)$/);
	if(!matches){
		return null
	}
	return {
		box: [
			[
				parseInt(matches[1],10),
				parseInt(matches[2],10)
			],[
				parseInt(matches[3],10),
				parseInt(matches[4],10)
			]
		]
	}

}
module.exports = {
  navigate,
	parse
}
