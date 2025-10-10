import { environment } from "@/environment";

export const autocompleteDataFetch = (query) => {
  if (!query) return;

  return fetch(
    `${environment.geoApifyAutocompleteApi}/?apiKey=${environment.geoApifyToken}&text=${query}`
  );
};
