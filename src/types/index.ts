export type BookmarkType = 'article' | 'video' | 'social' | 'webpage';

export type BookmarkPlatform = 
  | 'youtube' 
  | 'twitter' 
  | 'github' 
  | 'medium' 
  | 'reddit' 
  | 'linkedin'
  | 'other';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  type: BookmarkType;
  platform: BookmarkPlatform;
  tags: string[];
  collectionId?: string;
  isFavorite: boolean;
  createdAt: number;
  lastModifiedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order: number;
  createdAt: number;
  lastModifiedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  bookmarks: Bookmark[];
  errors: string[];
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync?: number;
  error?: string;
}

export interface SearchFilters {
  query?: string;
  type?: BookmarkType;
  platform?: BookmarkPlatform;
  tags?: string[];
  collectionId?: string;
  isFavorite?: boolean;
  dateFrom?: number;
  dateTo?: number;
}

export interface MetadataResult {
  title: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  type: BookmarkType;
  platform: BookmarkPlatform;
}

export type ViewMode = 'card' | 'list' | 'grid';

export type SortBy = 'createdAt' | 'lastModifiedAt' | 'title' | 'url';
export type SortOrder = 'asc' | 'desc';
