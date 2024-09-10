function generateCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);
  return /*html*/ `
      <div class="card bg_${pokemons[i].type} cardJump">
        <div class="dFlexCeCe">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <img class="cardImg" src="${pokemons[i].image}" alt="pokeimage" />
        
        <div id="pokemonstyp" class="pokemonstyp">
          <div class="typeImg1Container">
            <img class="typeImg1" src="./assets/typeImg/${pokemons[i].types[0]}.svg">
            <span class="typeText1">${pokemons[i].types[0]}</span>
          </div>
        ${
          pokemons[i].types[1]
            ? `
          <div class="typeImg2Container">
            <img class="typeImg2" src="./assets/typeImg/${pokemons[i].types[1]}.svg">
            <span class="typeText2">${pokemons[i].types[1]}</span>
          </div>
                  `
            : ""
        }
        </div>
  
        <div class="pkmDescription" id="pkmDescription${i}">
          <div class="skeleton">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
          </div>
        </div>

        <div class="btnPrimary"><button id="btnMoreDetails" class="btnMoreDetails" onclick="openPokemonDetails(${i}); loadPokemonEvoChain(${i});">More Details</button>
            </div>
        </div>
        `;
}

function generateDetailCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);

  return /*html*/ `
      <div class="card detailCard bg_${
        pokemons[i].type
      }" onclick="event.stopPropagation();">
        <div class="dFlexCeCe">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <div class="imgContainer"><img class="cardImg" src="${
          pokemons[i].image
        }" alt="pokeimage"/>
        <img onclick="closeDialog()" class="xMark" id="xMark" src="./assets/img/xmark.svg" alt="xmark">
        <img onclick="previousPkm(${i - 1})" class="arrowImgLeft" id="arrowImgLeft" src="./assets/img/leftArrow.svg" alt="Left Arrow" class="arrowIcon leftArrow">
        <img onclick="nextPkm(${i + 1})" class="arrowImgRight" id="arrowImgRight" src="./assets/img/arrowRight.svg" alt="Right Arrow" class="arrowIcon rightArrow">
      </div>
        
        <div class="detailInfoContainer">
          <div class="navigation">
            <button onclick="showMain(${i})" id="btnMain">main</button>
            <button onclick="showStats(${i})">stats</button>
            <button onclick="showEvo()">evo chain</button>
        </div>
        <div class="viewCharacteristics">
            <div class="mainCharacteristicsContainer" id="mainCharacteristicsContainer"></div>
            <div class="statsCharacteristics" id="statsCharacteristics"></div>
            <div class="evochainCharacteristics" id="evochainCharacteristics"></div>
        </div>
      </div>
          `;
}

function mainCharacteristicsTemplate(i) {
  return /*html*/ `
              <div class="mainCharacteristics" id="mainCharacteristics">
                <div>Height:</div>
                <div>${pokemons[i].height} m</div>
              </div>
              <div class="mainCharacteristics" id="mainCharacteristics">
                <div>Weight:</div>
                <div>${pokemons[i].weight} kg</div>
              </div>
              <div class="mainCharacteristics" id="mainCharacteristics">
                <div>Base experience:</div>
                <div class="dFlexEnd">${pokemons[i].baseExperience} exp</div>
              </div>
              <div class="mainCharacteristics" id="mainCharacteristics">
                <div>Abilities:</div>
                <div>${pokemons[i].abilities}</div>
              </div>
  `;
}

function statsCharacteristicsTemplate(i) {
  return /*html*/ `
          <div class="progressContainer">
                <p>HP: ${pokemons[i].hp}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].hp}%"></div>
              </div>
              <div class="progressContainer">
                <p>ATTACK: ${pokemons[i].attack}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].attack}%"></div>
              </div>
              <div class="progressContainer">
                <p>DEFENSE: ${pokemons[i].defense}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].defense}%"></div>
              </div>
              <div class="progressContainer">
                <p>SPECIAL ATTACK: ${pokemons[i].special_attack}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].special_attack}%"></div>
              </div>
              <div class="progressContainer">
                <p>SPECIAL DEFENSE: ${pokemons[i].special_defense}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].special_defense}%"></div>
              </div>
              <div class="progressContainer">
                <p>SPEED: ${pokemons[i].speed}</p>
                <div class="progressBar bg_bar_${pokemons[i].type}" style="width: ${pokemons[i].speed}%"></div>

        </div>
  `;
}

function evoTemplate(j) {
  return /*html*/ `
    <div class="evoContainer">
      <img onclick="openPokemonDetails(${[evolutionChainId[j] - 1,]})" class="evoImg cardJump" src="${
    pokemons[evolutionChainId[j] - 1].image
  }"/>
      <span>${pokemons[evolutionChainId[j] - 1].name}</span>
    </div>
    `;
}

function generateFilterCardTemplate(i) {
  let pokemonName = capitalizeFirstLetter(pokemons[i].name);
  return /*html*/ `
      <div class="card bg_${pokemons[i].type} cardJump">
        <div class="dFlexCeCe">
          <h2 class="id">#${pokemons[i].id} ${pokemonName}</h2>
        </div>
        <img class="cardImg" src="${pokemons[i].image}" alt="pokeimage" />
        
        <div id="pokemonstyp" class="pokemonstyp">
          <div class="typeImg1Container">
            <img class="typeImg1" src="./assets/typeImg/${pokemons[i].types[0]}.svg">
            <span class="typeText1">${pokemons[i].types[0]}</span>
          </div>
        ${
          pokemons[i].types[1]
            ? `
          <div class="typeImg2Container">
            <img class="typeImg2" src="./assets/typeImg/${pokemons[i].types[1]}.svg">
            <span class="typeText2">${pokemons[i].types[1]}</span>
          </div>
                  `
            : ""
        }
        </div>
  
        <div class="pkmDescription" id="pkmFilterDescription${i}">
          <div class="skeleton">
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-text-line"></div>
          </div>
        </div>

        <div class="btnPrimary"><button id="btnMoreDetails" class="btnMoreDetails" onclick="openPokemonDetails(${i}); loadPokemonEvoChain(${i});">More Details</button>
            </div>
        </div>
        `;
}