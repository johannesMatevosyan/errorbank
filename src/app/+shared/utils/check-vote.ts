import {formatDate } from '@angular/common';

export class CheckVote {
  voteInfo = {
    type: '',
    isUserVoted : ''
  };
  getCheckedVote(votesArray, userStatus) {
    this.voteInfo.isUserVoted = votesArray.some((item)=> {
      let checkVote;
      if (item.userId === userStatus) {
        checkVote = true;
        this.voteInfo.type = item.type;
      } else {
        checkVote = false;
        this.voteInfo.type = item.type;
      }
      return checkVote
    });
    return this.voteInfo;
  }
}
