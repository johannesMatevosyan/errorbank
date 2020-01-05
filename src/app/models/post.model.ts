export interface PostModel {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  imagePath: string;
  created: string;
  updated?: string;
  viewed?: string;
  users?: { login: string};
  numOfComments?: string;
  tags?: Array<any>;
  author?: { _id: string, name: string};
  maxPosts?: number;
  voteId?: {votes: Array<{type: 'up' | 'down', userId: string, postId: string}>};
  voteObj?: {votes: Array<{type: 'up' | 'down', userId: string, postId: string}>};
}
