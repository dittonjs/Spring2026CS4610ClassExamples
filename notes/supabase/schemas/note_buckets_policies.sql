CREATE POLICY "Allow users to view their own note files"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'notes'
  AND (
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  )
)
WITH CHECK (
  bucket_id = 'notes'
  AND (
    (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  )
);
