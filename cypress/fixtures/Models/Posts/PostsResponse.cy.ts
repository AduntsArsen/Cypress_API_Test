export interface UserDataPost {
  title?: string
  body?: string
}

export interface UserDataResponsePost extends UserDataPost{
  id: number;
  user_id: number;
  title: string;
  body: string;
  map?: any;
}

