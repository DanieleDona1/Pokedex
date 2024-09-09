let pokemons = [];
let descriptionObject = [];
let startLoadPokemons = 0;
let evolutionChainId = [];

async function onloadfunc() {
  await loadAndShowPkm();
}

const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const PKMDESCRIPTION_URL = "https://pokeapi.co/api/v2/pokemon-species/";

async function loadAndShowPkm() {
  onLoadingSpinner();

  let endLoadValue = startLoadPokemons + 20;

  const pkmResponseAsJson = await loadPokemons(startLoadPokemons, endLoadValue);
  pokemons.push(...createJsonObject(pkmResponseAsJson));
  render();
  offLoadingSpinner();
  renderDescription(startLoadPokemons, endLoadValue);
  startLoadPokemons = endLoadValue;
}

async function loadPokemons(start, end) {
  let pkmPromises = [];

  for (let i = start + 1; i <= end; i++) {
    const Pokemon_URL = BASE_URL + `${i}`;
    let response = await fetch(Pokemon_URL);
    pkmPromises.push(response.json());
  }
  return await Promise.all(pkmPromises);
}

function onLoadingSpinner() {
  document.getElementById("loadContainer").classList.remove("dNone");
}

function offLoadingSpinner() {
  document.getElementById("loadContainer").classList.add("dNone");
}

function createJsonObject(responseAsJson) {
  return responseAsJson.map((data) => ({
    ...profilObject(data),
    ...mainObject(data),
    ...statsObject(data),
  }));
}

function profilObject(data) {
  return {
    name: data.name,
    id: data.id,
    image: data.sprites.other["official-artwork"].front_default,
    type: data.types[0].type.name,
    types: data.types.map((type) => type.type.name),
  };
}

function mainObject(data) {
  return {
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    abilities: data.abilities.map((ability) => ability.ability.name).join(", "),
  };
}

function statsObject(data) {
  return {
    hp: data.stats[0].base_stat,
    attack: data.stats[1].base_stat,
    defense: data.stats[2].base_stat,
    special_attack: data.stats[3].base_stat,
    special_defense: data.stats[4].base_stat,
    speed: data.stats[5].base_stat,
  };
}

function render() {
  let myPokedex = document.getElementById("myPokedex");
  for (let i = startLoadPokemons; i < pokemons.length; i++) {
    myPokedex.innerHTML += generateCardTemplate(i);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderDescription(startLoadPokemons, endLoadValue) {
  descriptionResponseAsJson = await loadDescriptions(
    startLoadPokemons,
    endLoadValue
  );
  descriptionObject.push(...createDescriptionObject(descriptionResponseAsJson));

  for (let i = startLoadPokemons; i < descriptionObject.length; i++) {
    document.getElementById(
      `pkmDescription${i}`
    ).innerHTML = `<div>${descriptionObject[i].description}</div>`;
  }
}

async function loadDescriptions(start, end) {
  let descriptionPromises = [];

  for (let i = start + 1; i <= end; i++) {
    const description_URL = PKMDESCRIPTION_URL + `${i}`;
    let descriptionResponse = await fetch(description_URL);
    descriptionPromises.push(descriptionResponse.json());
  }
  return await Promise.all(descriptionPromises);
}

function createDescriptionObject(descriptionArray) {
  return descriptionArray.map((data) => {
    const description =
      data?.flavor_text_entries?.[2]?.flavor_text || "No description available";

      return {
        description: sanitizeDescription(description),
      };
    });
  }

function openPokemonDetails(i) {
  document.getElementById("detailViewDialog").classList.remove("dNone");
  document.getElementById("detailViewDialog").innerHTML =
    generateDetailCardTemplate(i);
  document.body.style.overflowY = "hidden";
  showMain(i);
}

function filterPokemon() {
  let input = document.getElementById("search").value;

  if (isValidInput(input)) {
    processSearchResults(input);
  } else {
    updateUIForInvalidInput();
  }
}

function isValidInput(input) {
  return input.length >= 3;
}

function processSearchResults(input) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";
  document.getElementById("inputMessage").style.color = "transparent";
  document.getElementById("btnFooter").disabled = true;

  for (let i = 0; i < pokemons.length; i++) {
    if (pokemons[i].name.includes(input)) {
      document.getElementById("myPokedex").classList.add("dNone");
      document.getElementById("searchResults").classList.remove("dNone");
      document.getElementById("searchResults").innerHTML +=
        generateCardTemplate(i);
    }
  }
}

function updateUIForInvalidInput() {
  document.getElementById("inputMessage").style.color = "red";
  document.getElementById("myPokedex").classList.remove("dNone");
  document.getElementById("searchResults").classList.add("dNone");
  document.getElementById("btnFooter").disabled = false;
}

function showMain(i) {
  document.getElementById("statsCharacteristics").innerHTML = "";
  document.getElementById("evochainCharacteristics").innerHTML = "";
  document.getElementById("mainCharacteristicsContainer").innerHTML =
    mainCharacteristicsTemplate(i);
}

function showStats(i) {
  document.getElementById("mainCharacteristicsContainer").innerHTML = "";
  document.getElementById("evochainCharacteristics").innerHTML = "";
  document.getElementById("statsCharacteristics").innerHTML =
    statsCharacteristicsTemplate(i);
}

function closeDialog() {
  document.getElementById("detailViewDialog").classList.add("dNone");
  document.getElementById("search").value = "";
  document.getElementById("myPokedex").classList.remove("dNone");
  document.getElementById("btnFooter").disabled = false;
  document.getElementById("searchResults").classList.add("dNone");
  document.body.style.overflowY = "visible";
}

function loadMore() {
  loadAndShowPkm();
}

async function loadPokemonEvoChain(currentPokemon) {
  let evolutionChainAsJson = await getEvoulutionChainAsJson(currentPokemon + 1);

  addFirstEvoId(evolutionChainAsJson);
  addSecondEvoId(evolutionChainAsJson);
  addThirdEvoId(evolutionChainAsJson);
}

async function getEvoulutionChainAsJson(currentPokemon) {
  evolutionChainId = [];
  let evoApi =
    "https://pokeapi.co/api/v2/pokemon-species/" + `${currentPokemon}`;
  let response = await fetch(evoApi);
  let responseAsJson = await response.json();
  let evolutionChainUrl = responseAsJson.evolution_chain.url;
  let evolutionChain = await fetch(evolutionChainUrl);
  return await evolutionChain.json();
}

function addFirstEvoId(evolutionChainAsJson) {
  const species = evolutionChainAsJson.chain?.species;
  if (species) {
    evolutionChainId[0] = getUrlId(species.url);
  }
}

function addSecondEvoId(evolutionChainAsJson) {
  const species = evolutionChainAsJson.chain?.evolves_to?.[0]?.species;
  if (species) {
    evolutionChainId[1] = getUrlId(species.url);
  }
}

function addThirdEvoId(evolutionChainAsJson) {
  const species =
    evolutionChainAsJson.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species;
  if (species) {
    evolutionChainId[2] = getUrlId(species.url);
  }
}

function getUrlId(url) {
  const parts = url.split("/");
  return parts[parts.length - 2];
}

function showEvo() {
  document.getElementById("mainCharacteristicsContainer").innerHTML = "";
  document.getElementById("statsCharacteristics").innerHTML = "";
  document.getElementById("evochainCharacteristics").innerHTML = "";

  for (let j = 0; j < evolutionChainId.length; j++) {
    document.getElementById("evochainCharacteristics").innerHTML +=
      evoTemplate(j);
  }
}

function sanitizeDescription(text) {
  return text.replace(/\f/g, " ");
}

function previousPkm(i) {
  openPokemonDetails(i);
  loadPokemonEvoChain(i);
}

function nextPkm(i) {
  openPokemonDetails(i);
  loadPokemonEvoChain(i);
}