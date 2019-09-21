/**
 * @author Landmaster
 */

const TimSort = require('timsort');

let VoteUtils = {};
VoteUtils.toOrderedTuples = (map, idToInfo) => {
	let result = Array.from(map);
	TimSort.sort(result, (A,B) => B[1] - A[1]);
	if (idToInfo) {
		for (let arr of result) {
			arr.push(idToInfo.get(arr[0]));
		}
	}
	return result;
};
VoteUtils.toObject = map => {
	let res = {};
	for (let [k,v] of map) res[k] = v;
	return res;
};
module.exports = VoteUtils;