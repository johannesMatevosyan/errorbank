export interface NotificationModel {
  id: string;
  userId: string;
  postId: string;
  postTitle: string;
  content: string;
  date: string;
  commentId: string;
  type: string;
  checked: boolean;
}
