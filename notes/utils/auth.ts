'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error getting user:', error)
      return { user: null, error: new Error(error.message) }
    }

    return { user, error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to get user')
    console.error('Unexpected error getting user:', error)
    return { user: null, error }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to sign out')
    console.error('Unexpected error signing out:', error)
    return { error }
  }
}
