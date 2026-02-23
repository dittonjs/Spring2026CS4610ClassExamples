drop policy "Allow users to view their own note files" on "storage"."objects";


  create policy "Allow users to view their own note files"
  on "storage"."objects"
  as permissive
  for all
  to authenticated
using (((bucket_id = 'notes'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))))
with check (((bucket_id = 'notes'::text) AND ((storage.foldername(name))[1] = ( SELECT (auth.uid())::text AS uid))));



