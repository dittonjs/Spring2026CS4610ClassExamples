
  create policy "Allow users to view their own note files"
  on "storage"."objects"
  as permissive
  for all
  to authenticated, anon
using ((bucket_id = 'notes'::text));



