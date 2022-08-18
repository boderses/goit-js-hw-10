import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

refs = {
    searchList: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.searchList.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    if (refs.searchList === "") {
        refs.countryList.innerHTML = "";
        refs.countryInfo.innerHTML = "";
        return;
    }

    fetchCountries(refs.searchList.value.trim())
        .then(result => {
            createCountryList(result);
            console.log(result);
        })
        .catch(error => {
            Notify.failure("Oops, there is no country with that name");
            refs.countryList.innerHTML = "";
            console.log(error);
        })
}

function createCountryList(countries) {
    const markup = countries.map(country => `
            <li class = "country-item">
                <img class = "country-img" src = ${country.flags.svg} width = 30></img>
                <p class = "country-name">${country.name.official}</p>
            </li>
            `).join("");
    refs.countryList.innerHTML = markup;
    refs.countryInfo.innerHTML = "";

    if (countries.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        refs.countryList.innerHTML = "";
    }
    if (countries.length === 1) {
        performCountryInfo(countries[0]);
    }
}

function performCountryInfo(countryObj) {
    const langMarkup = Object.values(countryObj.languages).join(", ");
    const countryInfoMarkup = `
    <span class = "country-info-data">Capital:</span><span>${countryObj.capital}</span><br>
    <span class = "country-info-data">Population:</span><span>${countryObj.population}</span><br>
    <span class = "country-info-data">Languages:</span><span>${langMarkup}</span>
    `;
    refs.countryInfo.innerHTML = countryInfoMarkup;

    const countryTitle = refs.countryList.querySelector('.country-name'); 
    countryTitle.style.fontSize = "25px";
    countryTitle.style.fontWeight = "500";
}