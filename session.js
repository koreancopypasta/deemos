/**
 * @author Landmaster
 */

function Session(options) {
	this.host = options.host;
	this.code = options.code;
	
	/**
	 *
	 * @type {Map<WebSocket, MemberInfo>}
	 */
	this.members = new Map();
	
	/**
	 *
	 * @type {Map<string, number>}
	 */
	this.votes = new Map();
}
Session.prototype.addMember = function (ws) { this.members.add(ws); };
Session.prototype.addRequest = function (member, videoReq) {
	if (member.videoRequest != null) {
		this.resetVote(member, videoReq);
	}
	member.videoRequest = videoReq;
	this.vote(member, videoReq, 1);
};
Session.prototype.resetVote = function (member, videoReq) {
	if (member.votes.has(videoReq)) {
		if (this.votes.has(videoReq)) {
			this.votes.set(videoReq, this.votes.get(videoReq) - member.votes.get(videoReq));
		}
		member.votes.delete(videoReq);
	}
};
Session.prototype.vote = function (member, videoReq, val) {
	this.resetVote(member, videoReq);
	if (!this.votes.has(videoReq)) {
		this.votes.set(videoReq, 0);
	}
	this.votes.set(videoReq, this.votes.get(videoReq) + val);
	member.votes.set(videoReq, val);
};
Session.prototype.evictMember = function (member) {
	for (let video of member.votes.keys()) {
		this.resetVote(member, video);
	}
	this.members.delete(member.ws);
};
Session.prototype.advanceVideo = function () {
	let winningVideo = null, winningVotes = -Infinity;
	for (let [video, votes] of this.votes) {
		if (winningVotes < votes) {
			winningVotes = votes;
			winningVideo = video;
		}
	}
	if (winningVideo !== null) {
		for (let member of this.members.values()) {
			this.resetVote(member, winningVideo);
			if (member.videoRequest === winningVideo) {
				member.videoRequest = null;
			}
		}
		this.votes.delete(winningVideo);
	}
	return winningVideo;
};

module.exports = Session;
