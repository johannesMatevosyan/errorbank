export interface PostModel {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  imagePath: string;
  created: string;
  updated?: string;
  viewed?: string;
  tags?: Array<any>;
  author?: { _id: string, name: string};
  maxPosts?: number;
}
