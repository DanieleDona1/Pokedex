function generateCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);
  return /*html*/ `
      <div class="card bg-${pokemons[i].type} card-jump">
        <div class="d-flex-c-c">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <img class="card-img" src="${pokemons[i].image}" alt="poke-image" />
        <!-- <img class="card-img-showdown" src="${pokemons[i].image_showdown}" alt="poke-image" /> -->

        <div id="pokemonstyp" class="pokemons-typ">
          <div class="type-img1-container">
            <img class="type-img1" src="./assets/typeImg/${pokemons[i].types[0]}.svg">
            <span class="type-text1">${pokemons[i].types[0]}</span>
          </div>
        ${
          pokemons[i].types[1]
            ? `
          <div class="type-img2-container">
            <img class="type-img2" src="./assets/typeImg/${pokemons[i].types[1]}.svg">
            <span class="type-text2">${pokemons[i].types[1]}</span>
          </div>
                  `
            : ''
        }
        </div>

        <div class="pkm-description" id="pkmDescription${i}">
          <div class="skeleton">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
          </div>
        </div>

        <div class="btn-primary"><button id="btnMoreDetails" class="btn-more-details" onclick="openPokemonDetails(${i}); loadPokemonEvoChain(${i});">More Details</button>
            </div>
        </div>
        `;
}

function generateDetailCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);

  return /*html*/ `
      <div class="card detail-card bg-${pokemons[i].type}" onclick="event.stopPropagation();">
        <div class="d-flex-c-c">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <div class="img-container"><img class="card-img" src="${pokemons[i].image}" alt="poke-image"/>
        <img onclick="closeDialog()" class="x-mark" id="xMark" src="./assets/img/xmark.svg" alt="xmark">
        <img onclick="previousPkm(${i - 1})" class="arrow-img-left" id="arrowImgLeft" src="./assets/img/leftArrow.svg" alt="left-arrow">
        <img onclick="nextPkm(${i + 1})" class="arrow-img-right" id="arrowImgRight" src="./assets/img/arrowRight.svg" alt="right-arrow">
      </div>

        <div class="detail-info-container">
          <div class="navigation">
            <button onclick="showMain(${i})" id="btnMain">main</button>
            <button onclick="showStats(${i})">stats</button>
            <button onclick="showEvo()">evo chain</button>
        </div>
        <div class="view-characteristics">
            <div class="main-characteristics-container" id="mainCharacteristicsContainer"></div>
            <div class="stats-characteristics" id="statsCharacteristics"></div>
            <div class="evochain-characteristics" id="evochainCharacteristics"></div>
        </div>
      </div>
          `;
}

function mainCharacteristicsTemplate(i) {
  return /*html*/ `
              <div class="main-characteristics" id="mainCharacteristics">
                <div>Height:</div>
                <div>${pokemons[i].height} m</div>
              </div>
              <div class="main-characteristics" id="mainCharacteristics">
                <div>Weight:</div>
                <div>${pokemons[i].weight} kg</div>
              </div>
              <div class="main-characteristics" id="mainCharacteristics">
                <div>Base experience:</div>
                <div class="d-flex-end">${pokemons[i].baseExperience} exp</div>
              </div>
              <div class="main-characteristics" id="mainCharacteristics">
                <div>Abilities:</div>
                <div>${pokemons[i].abilities}</div>
              </div>
  `;
}

function statsCharacteristicsTemplate(i) {
  return /*html*/ `
          <div class="progress-container">
                <p>HP: ${pokemons[i].hp}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].hp}%"></div>
              </div>
              <div class="progress-container">
                <p>ATTACK: ${pokemons[i].attack}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].attack}%"></div>
              </div>
              <div class="progress-container">
                <p>DEFENSE: ${pokemons[i].defense}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].defense}%"></div>
              </div>
              <div class="progress-container">
                <p>SPECIAL ATTACK: ${pokemons[i].special_attack}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].special_attack}%"></div>
              </div>
              <div class="progress-container">
                <p>SPECIAL DEFENSE: ${pokemons[i].special_defense}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].special_defense}%"></div>
              </div>
              <div class="progress-container">
                <p>SPEED: ${pokemons[i].speed}</p>
                <div class="progress-bar bg-bar-${pokemons[i].type}" style="width: ${pokemons[i].speed}%"></div>

        </div>
  `;
}

function evoTemplate(j) {
  return /*html*/ `
    <div class="evo-container">
      <img onclick="openPokemonDetails(${[evolutionChainId[j] - 1]})" class="evo-img card-jump" src="${pokemons[evolutionChainId[j] - 1].image}"/>
      <span>${pokemons[evolutionChainId[j] - 1].name}</span>
    </div>
    `;
}

function generateFilterCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);
  return /*html*/ `
      <div class="card bg-${pokemons[i].type} card-jump">
        <div class="d-flex-c-c">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <img class="card-img" src="${pokemons[i].image}" alt="poke-image" />

        <div id="pokemonstyp" class="pokemons-typ">
          <div class="type-img1-container">
            <img class="type-img1" src="./assets/typeImg/${pokemons[i].types[0]}.svg">
            <span class="type-text1">${pokemons[i].types[0]}</span>
          </div>
        ${
          pokemons[i].types[1]
            ? `
          <div class="type-img2-container">
            <img class="type-img2" src="./assets/typeImg/${pokemons[i].types[1]}.svg">
            <span class="type-text2">${pokemons[i].types[1]}</span>
          </div>
                  `
            : ''
        }
        </div>

        <div class="pkm-description" id="pkmFilterDescription${i}">
          <div class="skeleton">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
          </div>
        </div>

        <div class="btn-primary"><button id="btnMoreDetails" class="btn-more-details" onclick="openPokemonDetails(${i}); loadPokemonEvoChain(${i});">More Details</button>
            </div>
        </div>
        `;
}
