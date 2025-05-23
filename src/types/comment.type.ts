// Định nghĩa kiểu dữ liệu cho User và Comment dựa trên API
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar: string;
  date_joined: string;
  last_login: string | null;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  created_at: string;
  post: number;
  likes_count: number;
  is_liked: boolean;
  replies: Comment[];
  parent?: number; // optional, chỉ có ở reply
}

export interface CommentResponse {
  code: number;
  message: string;
  data: Comment | Comment[];
}

export interface AddCommentPayload {
  content: string;
  post: number;
}

export interface ReplyCommentPayload {
  content: string;
  post: number;
  parent: number;
}
