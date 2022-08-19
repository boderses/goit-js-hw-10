import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;


const searchList = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
    

searchList.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    if (searchList === "") {
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return;
    }

    fetchCountries(searchList.value.trim())
        .then(result => {
            createCountryList(result);
            console.log(result);
        })
        .catch(error => {
            Notify.failure("Oops, there is no country with that name");
            countryList.innerHTML = "";
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
    countryList.innerHTML = markup;
    countryInfo.innerHTML = "";

    if (countries.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        countryList.innerHTML = "";
    }
    if (countries.length === 1) {
        performCountryInfo(countries[0]);
    }
}

function performCountryInfo(countryObj) {
    const languageMarkup = Object.values(countryObj.languages).join(", ");
    const infoMarkup = `
    <span class = "country-info-data">Capital:</span><span>${countryObj.capital}</span><br>
    <span class = "country-info-data">Population:</span><span>${countryObj.population}</span><br>
    <span class = "country-info-data">Languages:</span><span>${languageMarkup}</span>
    `;
    countryInfo.innerHTML = infoMarkup;
}
