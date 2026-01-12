"use client";
import { DogBreeds } from "@/utils/dogapi";
import Link from "next/link";
import { useState } from "react";

type SearchableDogListProps = {
  dogs: DogBreeds;
}

export default function SearchableDogList({ dogs }: SearchableDogListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBreeds = Object.keys(dogs.message).filter((breed) =>
    breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search dog breeds..."
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredBreeds.map((breed) => (
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
    </div>
  );
}
