import Link from "next/link";


type DogBreeds = {
  message: {
    [breed: string]: string[];
  };
  status: string;
}

export default async function Home() {
  const response = await fetch("https://dog.ceo/api/breeds/list/all")
  const dogs = await response.json() as DogBreeds;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl">
          Welcome!
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          This is a simple Next.js app that uses the Dog CEO API to display a list of dog breeds.
        </p>
        <section className="mt-10 w-full">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dog Breeds
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Object.keys(dogs.message).map((breed) => (
              <li
                key={breed}
                className="rounded-lg border border-gray-200 bg-gray-100 p-4 text-center text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <Link href={`/breeds/${breed}`} className="hover:underline">
                  {breed.charAt(0).toUpperCase() + breed.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
