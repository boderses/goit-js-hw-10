 function fetchCountries(name) {
  const BASE_URL = "https://restcountries.com/v3.1/"
  return fetch(
    `${BASE_URL}name/${name}?`
  )
    .then(response => {        
        if (response.status === 200) {            
            return response.json();
          }
                
          if (response.status === 404) {
            return Promise.reject('Error 404');
          }     
    })    
} 

export default fetchCountries;