import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;


const searchList = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
    

const onInput = (e) => {
cleanMarkup()
const nameCountry = e.target.value.trim().toLowerCase();

if(nameCountry === "") {
    cleanMarkup()
    return;
}  
  fetchCountries(nameCountry)
  .then(countries => {
    insertMarkup(countries);
  }).catch(error => {if(error === "Error 404") {
    Notify.failure("Oops, there is no country with that name")
  }})
}

searchList.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

const createMaxMarkup = item => `
<li>
<img src="${item.flags.svg}" width=70px><br>
 <span class = "country-info-data">Name:</span><span>${item.name.official}</span><br>
  <span class = "country-info-data">Capital:</span><span>${item.capital}</span><br>
 <span class = "country-info-data">Population:</span><span>${item.population}</span><br>
 <span class = "country-info-data">Languages:</span><span> ${Object.values(item.languages)}</span>
</li>
`;

const createMinMarkup = country => `
   <li class = "country-item">
 <img class = "country-img" src = ${country.flags.svg} width = 30></img>
 <p class = "country-name">${country.name.official}</p>
     </li>
`;


function generateMarkup(array) {
    if(array.length > 10) {
        Notify.warning(
        "Too many matches found. Please enter a more specific name.")} 

    else if(array.length >= 2 && array.length <= 10){            
        return array.reduce((acc, item) => acc + createMinMarkup(item), "")}

     else if(array.length === 1) {
        return array.reduce((acc, item) => acc + createMaxMarkup(item), "") 
    } 
}


function insertMarkup(array) {
    const result = generateMarkup(array);
    countryList.insertAdjacentHTML('beforeend', result);
}

function cleanMarkup(){
countryList.innerHTML = "";
 countryInfo.innerHTML = "";
}


