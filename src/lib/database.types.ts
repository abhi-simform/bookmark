export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string
          user_id: string
          url: string
          title: string
          description: string | null
          favicon: string | null
          thumbnail: string | null
          type: string
          platform: string | null
          collection_id: string
          tags: string[]
          is_favorite: boolean
          is_archived: boolean
          created_at: number
          last_modified_at: number
        }
        Insert: {
          id?: string
          user_id: string
          url: string
          title: string
          description?: string | null
          favicon?: string | null
          thumbnail?: string | null
          type?: string
          platform?: string | null
          collection_id: string
          tags?: string[]
          is_favorite?: boolean
          is_archived?: boolean
          created_at?: number
          last_modified_at?: number
        }
        Update: {
          id?: string
          user_id?: string
          url?: string
          title?: string
          description?: string | null
          favicon?: string | null
          thumbnail?: string | null
          type?: string
          platform?: string | null
          collection_id?: string
          tags?: string[]
          is_favorite?: boolean
          is_archived?: boolean
          created_at?: number
          last_modified_at?: number
        }
      }
      collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          parent_id: string | null
          order: number
          created_at: number
          last_modified_at: number
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          order?: number
          created_at?: number
          last_modified_at?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          order?: number
          created_at?: number
          last_modified_at?: number
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string | null
          created_at: number
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string | null
          created_at?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string | null
          created_at?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
