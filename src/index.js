import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('input#search-box');
const listRef = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

inputRef.addEventListener(
  'input',
  debounce(e => searchCountry(e.target.value.trim()), DEBOUNCE_DELAY)
);
function searchCountry(countryName) {
  if (!countryName) {
    listRef.innerHTML = '';
    infoCountry.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(res => {
      if (res.length > 10) {
        listRef.innerHTML = '';
        infoCountry.innerHTML = '';
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (res.length > 1) {
        infoCountry.innerHTML = '';
        const markup = res
          .map(
            country =>
              `<li class='list'><img width='35' src='${country.flags.svg}'/> ${country.name.official}</li>`
          )
          .join('');
        listRef.innerHTML = markup;
        return;
      }

      if (res.length) {
        listRef.innerHTML = '';
        const { name, flags, capital, population, languages } = res[0];
        infoCountry.innerHTML = `<div class='title'><img width='100' src='${
          flags.svg
        }'/> <span class='country__name'>${name.official}</span></div>
        <ul class='country__info'>
        <li><span class='descr'>Capital</span>: ${capital}</li>
        <li><span class='descr'>Population</span>: ${population}</li>
        <li><span class='descr'>Languages</span>: ${Object.values(
          languages
        )}</li>
        </ul>`;
        return;
      }
    })
    .catch(err => Notify.failure(err.message));
}
