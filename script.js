let pokemons = [];
let descriptionObject = [];
let evolutionChainId = [];
let startLoadPokemons = 0;
let loadBatchSize = 20;
let progressValue = 0;

async function onloadfunc() {
  await loadAndShowPkm();
}

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const PKMDESCRIPTION_URL = 'https://pokeapi.co/api/v2/pokemon-species/';

async function loadAndShowPkm() {
  onLoadingSpinner();

  let endLoadValue = startLoadPokemons + loadBatchSize;

  const pkmResponseAsJson = await loadPokemons(startLoadPokemons, endLoadValue);
  pokemons.push(...createJsonObject(pkmResponseAsJson));
  render();
  offLoadingSpinner();
  renderDescription(startLoadPokemons, endLoadValue);
  resetPreloaderValues();
  startLoadPokemons = endLoadValue;
}

async function loadPokemons(start, end) {
  let pkmPromises = [];

  for (let i = start + 1; i <= end; i++) {
    const Pokemon_URL = BASE_URL + `${i}`;
    let response = await fetch(Pokemon_URL);
    pkmPromises.push(response.json());
    updatePreloaderProgressBar();
  }
  return await Promise.all(pkmPromises);
}

function onLoadingSpinner() {
  document.getElementById('loadContainer').classList.remove('d-none');
}

function offLoadingSpinner() {
  document.getElementById('loadContainer').classList.add('d-none');
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
    image: data.sprites.other['official-artwork'].front_default,
    type: data.types[0].type.name,
    types: data.types.map((type) => type.type.name),
  };
}

function mainObject(data) {
  return {
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    abilities: data.abilities.map((ability) => ability.ability.name).join(', '),
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
  const pokemonsLength = pokemons.length;
  const myPokedex = document.getElementById('myPokedex');
  for (let i = startLoadPokemons; i < pokemonsLength; i++) {
    myPokedex.innerHTML += generateCardTemplate(i);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function renderDescription(startLoadPokemons, endLoadValue) {
  descriptionResponseAsJson = await loadDescriptions(startLoadPokemons, endLoadValue);
  descriptionObject.push(...createDescriptionObject(descriptionResponseAsJson));

  const descriptionLength = descriptionObject.length;
  for (let i = startLoadPokemons; i < descriptionLength; i++) {
    document.getElementById(`pkmDescription${i}`).innerHTML = `<div>${descriptionObject[i].description}</div>`;
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
    const description = data?.flavor_text_entries?.[2]?.flavor_text || 'No description available';

    return {
      description: sanitizeDescription(description),
    };
  });
}

function openPokemonDetails(i) {
  document.getElementById('detailViewDialog').classList.remove('d-none');
  document.getElementById('detailViewDialog').innerHTML = generateDetailCardTemplate(i);
  document.body.style.overflowY = 'hidden';
  showMain(i);
  addBorder();
}

function filterPokemon() {
  let input = document.getElementById('search').value;

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
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';
  document.getElementById('inputMessage').style.color = 'transparent';
  document.getElementById('btnFooter').disabled = true;

  let foundResults = false;
  for (let i = 0; i < pokemons.length; i++) {
    if (pokemons[i].name.includes(input)) {
      if (!foundResults) {
        document.getElementById('myPokedex').classList.add('d-none');
        document.getElementById('searchResults').classList.remove('d-none');
        foundResults = true;
      }
      document.getElementById('searchResults').innerHTML += generateFilterCardTemplate(i);
      document.getElementById(`pkmFilterDescription${i}`).innerHTML = `<div>${descriptionObject[i].description}</div>`;
    }
  }
}

function updateUIForInvalidInput() {
  document.getElementById('inputMessage').style.color = 'red';
  document.getElementById('myPokedex').classList.remove('d-none');
  document.getElementById('searchResults').classList.add('d-none');
  document.getElementById('btnFooter').disabled = false;
}

function showMain(i) {
  document.getElementById('statsCharacteristics').innerHTML = '';
  document.getElementById('evochainCharacteristics').innerHTML = '';
  document.getElementById('mainCharacteristicsContainer').innerHTML = mainCharacteristicsTemplate(i);
}

function showStats(i) {
  document.getElementById('mainCharacteristicsContainer').innerHTML = '';
  document.getElementById('evochainCharacteristics').innerHTML = '';
  document.getElementById('statsCharacteristics').innerHTML = statsCharacteristicsTemplate(i);
  removeBorder();
}

function closeDialog() {
  document.getElementById('detailViewDialog').classList.add('d-none');
  document.getElementById('search').value = '';
  document.getElementById('myPokedex').classList.remove('d-none');
  document.getElementById('btnFooter').disabled = false;
  document.getElementById('searchResults').classList.add('d-none');
  document.body.style.overflowY = 'visible';
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
  let evoApi = 'https://pokeapi.co/api/v2/pokemon-species/' + `${currentPokemon}`;
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
  const species = evolutionChainAsJson.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species;
  if (species) {
    evolutionChainId[2] = getUrlId(species.url);
  }
}

function getUrlId(url) {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

function showEvo() {
  console.log(evolutionChainId.length);
  console.log(evolutionChainId);

  // Prüfe, ob `evolutionChainId` ein Array ist und mindestens ein Element enthält
  if (Array.isArray(evolutionChainId) && evolutionChainId.length > 0) {
    // Konvertiere die Strings im Array in Zahlen
    const numbers = evolutionChainId.map(Number);

    // Überprüfe, ob die Zahlen aufsteigend sind
    const isAscending = numbers.every((num, i) => i === 0 || num > numbers[i - 1]);

    // Wenn die Zahlen aufsteigend sind, führe den Codeblock aus
    if (isAscending) {
      document.getElementById('mainCharacteristicsContainer').innerHTML = '';
      document.getElementById('statsCharacteristics').innerHTML = '';
      document.getElementById('evochainCharacteristics').innerHTML = '';
      removeBorder();

      let evoContent = '';
      for (let j = 0; j < evolutionChainId.length; j++) {
        evoContent += evoTemplate(j);
      }
      document.getElementById('evochainCharacteristics').innerHTML = evoContent;
    } else {
      document.getElementById('mainCharacteristicsContainer').innerHTML = '';
      document.getElementById('statsCharacteristics').innerHTML = '';
      document.getElementById('evochainCharacteristics').innerHTML = '';
      removeBorder();
      document.getElementById('evochainCharacteristics').innerHTML = 'Pokémon evolution chain is unknown.';
    }
  }
}

function sanitizeDescription(text) {
  return text.replace(/\f/g, ' ');
}

function previousPkm(i) {
  if (i !== -1) {
    openPokemonDetails(i);
    loadPokemonEvoChain(i);
  }
}

function nextPkm(i) {
  if (i !== startLoadPokemons) {
    openPokemonDetails(i);
    loadPokemonEvoChain(i);
  } else {
    console.log('load more Pokémon\'s');
  }
}

function updatePreloaderProgressBar() {
  const preloaderprogress = document.getElementById('preloaderProgress');
  const preloaderprogressText = document.getElementById('preloaderProgressText');

  const increment = Math.ceil(100 / loadBatchSize);
  progressValue = Math.min(progressValue + increment, 100);

  preloaderprogress.style.width = `${progressValue}%`;
  preloaderprogressText.textContent = `${progressValue}%`;
}

function resetPreloaderValues() {
  progressValue = 0;
  const preloaderprogress = document.getElementById('preloaderProgress');
  const preloaderprogressText = document.getElementById('preloaderProgressText');
  preloaderprogress.style.width = `${progressValue}%`;
  preloaderprogressText.textContent = `${progressValue}%`;
}

function addBorder() {
  const button = document.getElementById('btnMain');
  button.style.border = '5px solid rgb(221, 221, 53)';
}

function removeBorder() {
  const button = document.getElementById('btnMain');
  button.style.border = '';
}
