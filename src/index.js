import './css/styles.css';
import debounce from 'lodash.debounce';
import {Notify} from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, 300));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    clearCountryInfo();
    clearCountryList();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        clearCountryInfo();
        clearCountryList();
      } else if (countries.length > 1) {
        renderCountryList(countries);
        clearCountryInfo();
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        clearCountryList();
      } else {
        clearCountryInfo();
        clearCountryList();
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
      clearCountryInfo();
        clearCountryList();
    });
}

function renderCountryList(countries) {
  const countryListMarkup = countries.map(({ name, flags: { svg } }) => {
    return `
      <li class="country-list__item">
        <img src="${svg}" alt="${name}" width="40" height="25">
        <span>${name}</span>
      </li>
    `;
  }).join('');

  refs.countryList.innerHTML = countryListMarkup;
}

function renderCountryInfo(country) {
  const { name, flags: { svg }, capital, population, languages } = country;

  const countryInfoMarkup = `
    <div class="country-info__flag">
      <img src="${svg}" alt="${name}" width="200" height="125">
    </div>
    <div class="country-info__details">
      <h2 class="country-info__name">${name}</h2>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${languages.map(({ name }) => name).join(', ')}</p>
    </div>
  `;

  refs.countryInfo.innerHTML = countryInfoMarkup;
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
