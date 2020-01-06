
export class CheckVote {
  voteInfo = {
    type: '',
    isUserVoted : ''
  };
  getCheckedVote(votesArray, userStatus) {
    this.voteInfo.isUserVoted = votesArray.some((item) => {
      let checkVote;
      if (item.userId === userStatus.userId) {
        checkVote = true;
        this.voteInfo.type = item.type;
      } else {
        checkVote = false;
        this.voteInfo.type = item.type;
      }
      return checkVote;
    });
    return this.voteInfo;
  }
}
