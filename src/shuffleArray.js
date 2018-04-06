module.exports = function(array){
	return array.map(item => {
		return {
			item,
			random: Math.random()
		}
	}).sort((a, b) => {
		return a.random < b.random;
	}).map(o => o.item);
};
