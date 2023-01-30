import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { geocode, suggest } from "@esri/arcgis-rest-geocoding";

const API_KEY = "AAPK47d21ecc09fa420dbebb59fe69e7874agRwpk7Dk09tMvyGDM27PvwEC9uRKVXFPJ3i8MJgH41mQQHvnp7pyKon0_-H9Q_Om";
const authentication = new ApiKeyManager({ key: API_KEY });

let sugg = [];

let inputField = document.getElementById("input");
let ulField = document.getElementById("suggestions");
let apt = document.getElementById("apt");
let city = document.getElementById("city");
let state = document.getElementById("state");
let postal = document.getElementById("postal");
let country = document.getElementById("country");
let form = document.getElementById("form");
let address = "";
let theCity = "";
let theState = "";
let thePostal = "";
let theCountry = "";
let value = {};

//getting suggestions
inputField.addEventListener("input", ({ target }) => {
  suggest(target.value, {
    params: { maxSuggestions: 5 },
    authentication,
  }).then((res) => {
    res.suggestions.forEach((item) => {
      sugg.push(item);
    });
    if (target.value) {
      inputField.setAttribute("autocomplete", "new-password");
    }
    changeAutoComplete(target.value);
  });
});

//showing suggestions
function changeAutoComplete(data) {
  ulField.innerHTML = ``;
  if (data.length > 0) {
    ulField.style.border = "1px solid gray";
    for (value of sugg) {
      const li = document.createElement("li");
      li.innerHTML = value.text;
      li.innerText = value.text;
      li.classList.add(value.magicKey);
      li.classList.add("list-group-item-action");
      li.classList.add("active");
      li.addEventListener("click", (event) => {
        inputField.removeAttribute("autocomplete");
        li.classList.remove("active");
        geo(event.target.className);
        ulField.style.border = "";
        ulField.innerHTML = "";
      });
      ulField.appendChild(li);
    }
    sugg = [];
  }
}

function geo(magicKey) {
  geocode({
    magicKey,
    maxLocations: 1,
    outFields: "*",
    authentication,
  }).then((resu) => {
    let result = resu.candidates[0];
    console.log(result);
    result.attributes.StAddr
      ? (inputField.value = result.attributes.StAddr)
      : (inputField.value = result.attributes.ShortLabel);
    address = result.attributes.StAddr;
    theCity = result.attributes.City;
    city.value = result.attributes.City;
    theState = result.attributes.Region;
    state.value = result.attributes.Region;
    theCountry = result.attributes.CntryName;
    country.value = result.attributes.CntryName;
    thePostal = result.attributes.Postal;
    postal.value = result.attributes.Postal;
    setAllFields();
  });
}

function setAllFields() {
  apt.addEventListener("change", (event) => {
    event.preventDefault();
    apt = event.target.value;
  });
  city.addEventListener("change", (event) => {
    event.preventDefault();
    theCity = event.target.value;
  });
  state.addEventListener("change", (event) => {
    event.preventDefault();
    theState = event.target.value;
  });
  postal.addEventListener("change", (event) => {
    event.preventDefault();
    thePostal = event.target.value;
  });
  country.addEventListener("change", (event) => {
    event.preventDefault();
    theCountry = event.target.value;
  });

  geocode({
    address: address,
    city: theCity,
    region: theState,
    postal: thePostal,
    countryCode: theCountry,
    authentication,
  })
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  geocode({
    address: address,
    city: theCity,
    region: theState,
    postal: thePostal,
    countryCode: theCountry,
    authentication,
  }).then((res) => {
    if (res.candidates[0].score > 95) {
      alert("Form accepted!");
      window.location.reload(false);
    } else {
      alert("Please check address!");
    }
  });
});
