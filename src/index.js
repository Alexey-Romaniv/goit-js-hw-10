import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('input#search-box');
const listRef = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');
inputRef.addEventListener(
  'input',
  debounce(e => fetchCountries(e.target.value.trim()), DEBOUNCE_DELAY)
);
function fetchCountries(countryName) {
  if (!countryName) {
    listRef.innerHTML = '';
    infoCountry.innerHTML = '';
    return;
  }
  const baseUrl = 'https://restcountries.com/v3.1/name/';
  return fetch(
    `${baseUrl}${countryName}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(res => {
      moreCountries(res);
      countriesList(res);
      selectedCountry(res);
    })
    .catch(err => Notify.failure(err.message));
}

function countriesList(res) {
  if (res.length > 1 && res.length <= 10) {
    infoCountry.innerHTML = '';
    const markup = res
      .map(
        country =>
          `<li class='list'><img width='35' src='${country.flags.svg}'/> ${country.name.official}</li>`
      )
      .join('');
    return (listRef.innerHTML = markup);
  }
}

function moreCountries(res) {
  if (res.length > 10) {
    infoCountry.innerHTML = '';
    listRef.innerHTML = '';
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}

function selectedCountry(res) {
  if (res.length === 1) {
    listRef.innerHTML = '';
    let { name, flags, capital, population, languages } = res[0];
    return (infoCountry.innerHTML = `<div class='title'><img width='100' src='${
      flags.svg
    }'/> <span class='country__name'>${name.official}</span></div>
      <ul class='country__info'>
      <li><span class='descr'>Capital</span>: ${capital}</li>
      <li><span class='descr'>Population</span>: ${population}</li>
      <li><span class='descr'>Languages</span>: ${Object.values(languages)}</li>
      </ul>`);
  }
}
