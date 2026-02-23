'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'

export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  file_url: string | null
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
  content: string,
  file: File | null
): Promise<{ data: Note | null; error: Error | null }> {
  try {
    const supabase = await createClient()
    const { user } = await getUser()
    const filePath = `${user?.id}/${file?.name}`
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          user_id: user?.id,
          file_url: file ? filePath : null,
        },
      ])
      .select()
      .single()

    if (file) {
      await supabase.storage.from("notes").upload(filePath, file);
    }


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
