'use strict';

const btn = document.querySelector('button');
const container = document.querySelector('.container');
const main = document.querySelector('main');
const body = document.querySelector('.body1')
const h2 = document.querySelector('.country h2');
const active = document.querySelector('.active');


const apiKey = '5765f4d3ef42492ebdc6ef991ec17b2b';

const whereAmI = function (lat, lng) {
    fetch(`https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${lat}+${lng}&pretty=1&no_annotations=1`)
        .then((responce) => {
            if (!responce.ok) throw new Error(`Problem with Geo-Coding ${responce.status}`);
            return responce.json();
        })
        .then(data => {
            let geoLocationCountry = data.results[0].components.country;
            let geoLocationCity = data.results[0].components.city;
            console.log(`You are in ${geoLocationCity}, ${geoLocationCountry}`);
            if(geoLocationCity === undefined) geoLocationCity = '🔎';
            corDinateOutput(geoLocationCity, geoLocationCountry)
            getCountryData(geoLocationCountry)
        })
        .catch(err => console.log(err))
}


function corDinateOutput(city, country) {
    const html = `
    <h2 class="corDinateh2">You are in ${city}, ${country}</h2>
    `
    container.insertAdjacentHTML('afterbegin', html);
}


const getCountryData = (country) => {
    fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
        .then(responce => responce.json())
        .then((data) => {
            renderCountry(data[0]);
            const neighbour = data[0].borders[0];
            if (!neighbour) throw new Error(`Neighbour not found ⭐⭐${neighbour.status}`);
            return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)

        })
        .then(responce => responce.json())
        .then(([data2]) => {
            renderCountry(data2,'neighbour');
        })
        .catch((err) => {
            console.error(`${err} ❌`);
            renderError(`Something went wrong ❌❌ ${err}`);
        })
};

function renderCountry(data, className ='') {
    const languages = Object.values(data.languages);
    const currencies = Object.values(data.currencies).map((val) => val.name);
    

    const html = `
    <article class="country ${className}">
        <img style="border-radius: 8px;" class="country_img" src="${data.flags.png}" />
        <div class="country_data">
        <h3 class="country_name">${data.name.common}</h3>
        <h4 class="country_region">${data.region}</h4>
        <p class="country_row"><span> </span>${(+data.population / 1000000).toFixed(1) + 'M'}
        people</p>
        <p class="country_row"><span> </span>${languages}</p>
        <p class="country_row"><span> </span>${currencies}</p>
        </div>
        </article>
    `
    

    container.insertAdjacentHTML('beforeend', html);
}

//This is how we can get our current position Coordinates in JavaScript
//navigator.geolocation.getCurrentPosition((position) => console.log(position),(err) => console.error(err));

const getPosition = function(){
    return new Promise((res,rej)=>{
        //navigator.geolocation.getCurrentPosition((position) => res(position),(err) => rej(err));
        //WE can also do this thing like this
        navigator.geolocation.getCurrentPosition(res,rej);
    })
}

const currentPosition = function(){
getPosition().then(responce => {
    whereAmI(responce.coords.latitude,responce.coords.longitude);
    })
}



//San Francisco, United States
whereAmI('37.7749','-122.419');
//Shanghai, China
//whereAmI('31.224361','121.469170');
currentPosition();


