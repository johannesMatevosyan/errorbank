export interface PostModel {
  _id?: string;
  title: string;
  content: string;
  imagePath: string;
  created: string;
  updated?: string;
  tags?: Array<any>;
  author?: { _id: string, name: string};
  maxPosts?: number;
}
