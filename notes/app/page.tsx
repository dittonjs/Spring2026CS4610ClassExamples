import Link from "next/link";
import { getNotes, type Note } from "@/utils/notes";
import { getUser } from "@/utils/auth";
import { LogoutButton } from "@/app/components/LogoutButton";

export default async function Home() {
  const { data: notes, error } = await getNotes();
  const { user } = await getUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notes App</h1>
          <div className="flex gap-3">
            {user ? (
              <>
                <LogoutButton />
                <Link
                  href="/new_note"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  + New Note
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 mb-6">
            {error.message || 'Failed to load notes. Please try refreshing the page.'}
          </div>
        )}

        {!notes || notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No notes yet. Create your first note!
            </p>
            <Link
              href="/new_note"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Note
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note: Note) => (
              <div
                key={note.id}
                className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all dark:border-gray-700 dark:hover:border-blue-600"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  {note.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {note.content}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {formatDate(note.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
