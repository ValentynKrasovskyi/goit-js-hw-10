import './css/styles.css';
import  debounce  from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryContainer: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, 300));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery.length === 0) {
    clearPage();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      if (countries.length > 10) {
        clearPage();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (countries.length === 1) {
        renderCountryCard(countries[0]);
        return;
      }

      renderCountryList(countries);
    })
    .catch(error => console.log(error));
}

function clearPage() {
  refs.countryContainer.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountryCard(country) {
  const { name, capital, population, languages, flags } = country;

  refs.countryList.innerHTML = '';
  refs.countryContainer.innerHTML = `
    <div class="country-card">
      <img class="country-flag" src="${flags.svg}" alt="Flag of ${name.official}" />
      <div class="country-details">
        <h2 class="country-name">${name.official}</h2>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p><b>Languages:</b> ${languages.map(lang => lang.name).join(', ')}</p>
      </div>
    </div>
  `;
}

function renderCountryList(countries) {
  refs.countryContainer.innerHTML = '';
  refs.countryList.innerHTML = countries
    .map(country => `<li class="country-item"><img class="country-flag" src="${country.flags.svg}" alt="Flag of ${country.name.official}" />${country.name.official}</li>`)
    .join('');
}

