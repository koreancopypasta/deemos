/**
 * @author Landmaster
 */

function MemberInfo(options) {
	this.ws = options.ws;
	this.videoRequest = null;
	
	/**
	 * The value may be 0, -1, or 1.
	 * @type {Map<string, number>}
	 */
	this.votes = new Map();
}
module.exports = MemberInfo;