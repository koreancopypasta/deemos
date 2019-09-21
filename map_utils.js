/**
 * @author Landmaster
 */

let MapUtils = {};
MapUtils.toObject = map => {
	let res = {};
	for (let [k,v] of map) { res[k] = v; }
	return res;
};
module.exports = MapUtils;