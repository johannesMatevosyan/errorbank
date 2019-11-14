export interface PostModel {
  _id?: number;
  title: string;
  content: string;
  imagePath: string;
  created: string;
  updated?: string;
  tags?: Array<any>;
  authorId?: string;
  maxPosts?: number;
}
