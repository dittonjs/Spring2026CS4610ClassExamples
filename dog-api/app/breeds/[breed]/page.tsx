import Image from "next/image";
import { fetchBreedImages } from "@/utils/dogapi";


type Props = {
  params: Promise<{ breed: string }>;
}

export default async function BreedPage(props: Props) {
  const { breed } = await props.params;

  const data = await fetchBreedImages(breed);

  return (
    <div>
      <h1>
        {breed.charAt(0).toUpperCase() + breed.slice(1)} Images
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {data.message.map((image, index) => (
          <li key={index}>
            <Image src={image} alt={`${breed} image ${index + 1}`} width={300} height={300} />
          </li>
        ))}
      </ul>
    </div>
  );
}
