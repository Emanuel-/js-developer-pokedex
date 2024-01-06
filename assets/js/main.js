const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail" style="user-select: none;">
                
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
            <div style="display: none;">
                <div id="hab1">${pokemon.abilities[0]["name"]}</div>
                <div id="deschab1">${pokemon.abilities[0]["effect"]}</div>
                <div id="hab2">${pokemon.abilities[1]["name"]}</div>
                <div id="deschab2">${pokemon.abilities[1]["effect"]}</div>

                <div id="stat1">${pokemon.stats[0]["name"]}</div>
                <div id="descstat1">${pokemon.stats[0]["baseValue"]}</div>
                <div id="stat2">${pokemon.stats[1]["name"]}</div>
                <div id="descstat2">${pokemon.stats[1]["baseValue"]}</div>
                <div id="stat3">${pokemon.stats[2]["name"]}</div>
                <div id="descstat3">${pokemon.stats[2]["baseValue"]}</div>
                <div id="stat4">${pokemon.stats[3]["name"]}</div>
                <div id="descstat4">${pokemon.stats[3]["baseValue"]}</div>
                <div id="stat5">${pokemon.stats[4]["name"]}</div>
                <div id="descstat5">${pokemon.stats[4]["baseValue"]}</div>
                <div id="stat6">${pokemon.stats[5]["name"]}</div>
                <div id="descstat6">${pokemon.stats[5]["baseValue"]}</div>

                
              


            </div>

        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)



$('#pokemonList').on('click', 'li', function() {
    const pokemonId = $(this).data('id');
    const pokemonName = $(this).find('.name').text();
    const pokemonNumber = $(this).find('.number').text();
    const pokemonClass =$(this).find('.types li').map(function() {
        return $(this).text();
    }).get().join(' ');
    const pokemonPhoto = $(this).find('img').attr('src');
    console.log('Aqui imagem', pokemonPhoto);
    const pokemonColor = getPokemonColor(pokemonClass.split(' ')[0]); // Função para obter a cor do cartão
    const pokemonAbility1 = $(this).find('#hab1').text();
    const pokemonDescAbility1 = $(this).find('#deschab1').text();
    const pokemonAbility2 = $(this).find('#hab2').text();
    const pokemonDescAbility2 = $(this).find('#deschab2').text();
    const pokemonHP = $(this).find('#descstat1').text();
    const pokemonAttack = $(this).find('#descstat2').text();
    const pokemonDeffense = $(this).find('#descstat3').text();
    const pokemonSpecialAttack = $(this).find('#descstat4').text();
    const pokemonSpecialDefense = $(this).find('#descstat5').text();
    const pokemonSpeed = $(this).find('#descstat6').text();



    // Exibir informações no console (você pode personalizar isso conforme necessário)
    console.log('ID do Pokémon:', pokemonId);
    console.log('Nome do Pokémon:', pokemonName);
    console.log('Classe do Pokémon:', pokemonClass);
    console.log('Número do Pokémon:', pokemonNumber);

    // Exibir informações no modal
    $('#pokemonId').text(pokemonNumber);
    $('#pokemonName').text(capitalizeFirstLetter(pokemonName));
    $('#pokemonNumber').text(pokemonNumber);
    $('#pokemonClass').text(pokemonClass);
    $('#move1 h3').text(capitalizeFirstLetter(pokemonAbility1));
    $('#move1 p').text(capitalizeFirstLetter(pokemonDescAbility1));
    $('#move2 h3').text(capitalizeFirstLetter(pokemonAbility2));
    $('#move2 p').text(capitalizeFirstLetter(pokemonDescAbility2));
    $('[aria-label="HP example"] div').text(pokemonHP)
    $('[aria-label="Attack example"] div').text(pokemonAttack)
    $('[aria-label="Defense example"] div').text(pokemonDeffense)
    $('[aria-label="Special Attack example"] div').text(pokemonSpecialAttack)
    $('[aria-label="Special Defense example"] div').text(pokemonSpecialDefense)
    $('[aria-label="Speed example"] div').text(pokemonSpeed)



    // Atualizar a foto do Pokémon e a cor do cartão
    $('#pokemonImage').attr('src', pokemonPhoto); // Atualiza o src da imagem
    $('#pokemonImage').attr('alt',  pokemonName); // Atualiza o alt da imagem
    $('[aria-label="HP example"] div').attr('style', 'width:'+preencheBarra(pokemonHP)+'%');
    $('[aria-label="Attack example"] div').attr('style', 'width:'+preencheBarra(pokemonAttack)+'%');
    $('[aria-label="Defense example"] div').attr('style', 'width:'+preencheBarra(pokemonDeffense)+'%');
    $('[aria-label="Special Attack example"] div').attr('style', 'width:'+preencheBarra(pokemonSpecialAttack)+'%');
    $('[aria-label="Special Defense example"] div').attr('style', 'width:'+preencheBarra(pokemonSpecialDefense)+'%');
    $('[aria-label="Speed example"] div').attr('style', 'width:'+preencheBarra(pokemonSpeed)+'%');
    $('.modal-header').css('background-color', pokemonColor);
    $('.modal-header').css('color', 'white');



    //$('#pokemonImage').css('background-image', `url(${pokemonPhoto})`);
    //$('#cardColor').css('background-color', pokemonColor);

    // Definir o título do modal como o nome do Pokémon clicado
    $('#TituloModalCentralizado').text(`Detalhes do Pokémon - ${capitalizeFirstLetter(pokemonName)}`);

    // Abrir o modal
    var myModal = new bootstrap.Modal(document.getElementById('ExemploModalCentralizado'));
    myModal.show();
  });

  
loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getPokemonColor(pokemonType) {
    // Mapeia os tipos de Pokémon para as cores correspondentes
    const typeToColorMap = {
        'grass': '#77c850',
        'fire': '#ee7f30',
        'water': '#678fee',
        'electric': '#f7cf2e',
        'ice': '#98d5d7',
        'ground': '#dfbf69',
        'flying': '#a98ff0',
        'poison': '#a040a0',
        'fighting': '#bf3029',
        'psychic': '#f65687',
        'dark': '#725847',
        'rock': '#b8a137',
        'bug': '#a8b720',
        'ghost': '#6e5896',
        'steel': '#b9b7cf',
        'dragon': '#6f38f6',
        'fairy': '#f9aec7'
    };

    // Verifica se o tipo do Pokémon está mapeado
    if (typeToColorMap.hasOwnProperty(pokemonType)) {
        return typeToColorMap[pokemonType];
    }

    // Retorna uma cor padrão se o tipo não estiver mapeado
    return '#a6a877'; // ou qualquer cor padrão desejada
}

function preencheBarra(hab){
    return (parseFloat(hab)/2).toString();
}



//function abrirModal() {
//    // Abrir o modal quando o item da lista for clicado
//    var myModal = new bootstrap.Modal(document.getElementById('ExemploModalCentralizado'));
//    myModal.show();
//  }