import { useRouter } from "next/navigation"
import { useState } from "react"
import { createNote } from "@/utils/notes"

export const useNewNote = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: createError } = await createNote(title, content)

    if (createError) {
      setError(createError.message)
      setIsSubmitting(false)
      return
    }

    // Redirect to home page after successful creation
    router.push('/')
  }

  return { title, content, isSubmitting, error, setTitle, setContent, setIsSubmitting, setError, handleSubmit }
}
