import Link from "next/link";
import { fetchDogBreeds } from "@/utils/dogapi";
import SearchableDogList from "./_components/searchable_dog_list";

export default async function Home() {

  const dogs = await fetchDogBreeds();


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
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
          <SearchableDogList dogs={dogs} />
        </section>
      </main>
    </div>
  );
}
