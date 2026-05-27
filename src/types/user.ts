export default interface IUser {
  image?: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'provider';
}
