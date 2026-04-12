export interface SocialMediaItem {
  id: string;
  platform: string;
  url: string;
  photo: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SocialMediaResponse {
  items: SocialMediaItem[];
  pagination: Pagination;
}
