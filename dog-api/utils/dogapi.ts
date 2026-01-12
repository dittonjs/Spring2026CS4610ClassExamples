export type DogBreeds = {
  message: {
    [breed: string]: string[];
  };
  status: string;
}

export async function fetchDogBreeds() {
  const response = await fetch("https://dog.ceo/api/breeds/list/all")
  const dogs = await response.json() as DogBreeds;
  return dogs
}



export type BreedResponse = {
  message: string[];
}

export async function fetchBreedImages(breed: string) {
  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
  const data = await response.json() as BreedResponse;
  return data;
}
