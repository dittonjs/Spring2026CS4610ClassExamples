import Image from "next/image";

type BreedResponse = {
  message: string[];
}

type Props = {
  params: Promise<{ breed: string }>;
}

export default async function BreedPage(props: Props) {
  const { breed } = await props.params;

  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await response.json() as BreedResponse;

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
