export function fetchCountries(countryName, countriesList, selectedCountry) {
  const baseUrl = 'https://restcountries.com/v3.1/name/';
  return fetch(
    `${baseUrl}${countryName}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error('Oops, there is no country with that name');
    }
    return response.json();
  });
}
