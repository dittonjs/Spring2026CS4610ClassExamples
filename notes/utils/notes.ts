'use server'

import { createClient } from '@/lib/supabase/server'

export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export async function getNotes(): Promise<{ data: Note[] | null; error: Error | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as Note[], error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to fetch notes')
    console.error('Unexpected error fetching notes:', error)
    return { data: null, error }
  }
}

export async function createNote(
  title: string,
  content: string
): Promise<{ data: Note | null; error: Error | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as Note, error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to create note')
    console.error('Unexpected error creating note:', error)
    return { data: null, error }
  }
}
