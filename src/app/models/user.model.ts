export interface UserModel {
  _id: string;
  label?: string;
  login: string;
  name: string;
  userId?: string;
  githubId?: string;
  location?: string;
  bio?: string;
  date?: string;
  favourites: [];
}
