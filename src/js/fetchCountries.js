
export function fetchCountries(searchQuery) {
  const BASE_URL = 'https://restcountries.com/v2/name';
  const url = `${BASE_URL}/${searchQuery}?fields=name,flags,languages,population,capital`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      throw error;
    });
}