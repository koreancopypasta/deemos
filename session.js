/**
 * @author Landmaster
 */

function Session(options) {
	this.host = options.host;
	this.code = options.code;
	this.members = new Set();
}
Session.prototype.addMember = function (ws) { this.members.add(ws); };
module.exports = Session;
