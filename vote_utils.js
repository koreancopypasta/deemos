/**
 * @author Landmaster
 */

const TimSort = require('timsort');

let VoteUtils = {};
VoteUtils.toOrderedTuples = (map, idToTitles) => {
	let result = Array.from(map);
	TimSort.sort(result, (A,B) => B[1] - A[1]);
	if (idToTitles) {
		for (let arr of result) {
			arr.push(idToTitles.get(arr[0]));
		}
	}
	return result;
};
module.exports = VoteUtils;