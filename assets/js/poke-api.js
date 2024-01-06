const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    // Mapeia as habilidades e guarda no array abilities do Pokemon
    const abilitiesPromises = pokeDetail.abilities.map((ability) => {
        const abilityUrl = ability.ability.url;
        return fetch(abilityUrl)
            .then(response => response.json())
            .then(abilityDetails => ({
                name: ability.ability.name,
                url: abilityUrl,
                effect: abilityDetails.effect_entries[0].effect,
                // Adicione outras propriedades que você deseja extrair da URL da habilidade
                // Exemplo: hidden: abilityDetails.is_hidden
            }));
    });


    // Mapeia as estatísticas e guarda no array stats do Pokemon
    const stats = pokeDetail.stats.map(stat => ({
        name: stat.stat.name,
        baseValue: stat.base_stat,
    }));

    pokemon.stats = stats;

    // Adiciona a propriedade evolution_chain.url à instância do Pokemon
    pokemon.evolutionChainUrl = pokeDetail.species.url;

    // Aguarda todas as chamadas assíncronas das URLs das habilidades
    return Promise.all(abilitiesPromises)
        .then(abilitiesDetails => {
            pokemon.abilities = abilitiesDetails;
            console.log('Abilidades aqui', pokemon.abilities);
            console.log('Stats aqui', pokemon.stats);
            console.log('Evolução aqui', pokemon.evolutionChainUrl);

            console.log(pokeDetail);
            return pokemon;
        });
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}


// Função para obter informações de evolução
pokeApi.getEvolutionChain = (evolutionChainUrl) => {
    return fetch(evolutionChainUrl)
        .then(response => response.json());
}