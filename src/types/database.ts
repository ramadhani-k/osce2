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
      exams: {
        Row: {
          id: string
          name: string
          date: string
          access_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          access_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          access_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          name: string
          identifier: string
          role: 'student' | 'examiner'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          identifier: string
          role: 'student' | 'examiner'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          identifier?: string
          role?: 'student' | 'examiner'
          created_at?: string
        }
      }
      rubrics: {
        Row: {
          id: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rubric_items: {
        Row: {
          id: string
          rubric_id: string
          description: string
          weight: number
          max_scale: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          rubric_id: string
          description: string
          weight?: number
          max_scale?: number
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          rubric_id?: string
          description?: string
          weight?: number
          max_scale?: number
          order_index?: number
          created_at?: string
        }
      }
      stations: {
        Row: {
          id: string
          exam_id: string
          rubric_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          rubric_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          rubric_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          exam_id: string
          station_id: string
          student_id: string
          examiner_id: string
          scores: Json
          normalized_score: number
          created_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          station_id: string
          student_id: string
          examiner_id: string
          scores: Json
          normalized_score: number
          created_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          station_id?: string
          student_id?: string
          examiner_id?: string
          scores?: Json
          normalized_score?: number
          created_at?: string
        }
      }
    }
  }
}
