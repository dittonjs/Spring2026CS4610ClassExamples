"use client";
import { createClient } from "@/lib/supabase/client"
import {useEffect, useState} from "react"

export const FileLink = ({ filePath }: { filePath: string }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {

    async function loadUrl() {
        const supabase = await createClient()
        const { data, error } = await supabase
          .storage
          .from('notes')
          .createSignedUrl(filePath, 60, {download: true});
        if (error) {
          console.error('Error creating signed URL:', error)
          return
        }
        setUrl(data.signedUrl)
    }

    loadUrl()
  }, [filePath])


  if (!url) {
    return <span>Loading file...</span>
  }

  return (
    <a href={url} target="download">
      View File
    </a>
  )
}
