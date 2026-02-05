
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

export type Category = 'Politikë' | 'Sport' | 'Showbiz' | 'Ekonomi' | 'Botë' | 'Kronikë' | 'Drenica' | 'Tech';
