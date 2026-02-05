
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  author: string;
  isFeatured?: boolean;
}

export interface AdConfig {
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export type RequestStatus = 'pending' | 'approved' | 'ignored';

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: RequestStatus;
}

export type UserRole = 'Admin' | 'Moderator';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

export type Category = 'Politikë' | 'Sport' | 'Showbiz' | 'Ekonomi' | 'Botë' | 'Kronikë' | 'Komuna' | 'Tech';
