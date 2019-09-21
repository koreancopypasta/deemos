/**
 * @author Landmaster
 */

function Session(options) {
	this.host = options.host;
	this.code = options.code;
	this.members = new Set();
}
module.exports = Session;
