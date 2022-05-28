const axios = require("axios");

const main = async() => {
    const {data} = await axios("https://pokeapi.co/api/v2/pokemon/eevee");
    const speciesUrl = await axios(data.species.url);
    const evolutionChain = await axios(speciesUrl.data.evolution_chain.url);
    console.log(getPokemon(data,evolutionChain));
}

getPokemon = ({id, name, weight, height, abilities}, evo_chains) => {
    let abilitiesList = []
    abilities.map(({ ability}) => {
        abilitiesList.push({ name: ability.name})
    });

    let evo_chain = getArrayEvoChain(evo_chains.data.chain)
    let evoList = []
    evo_chain.map(({ name}) =>{
        evoList.push({ name});
    });

    return data = { id, name, weight, height, abilitiesList, evoList}
};

function getArrayEvoChain ({species, evolves_to}) {
    let evoStacking = [];
    evoStacking.push({name: species.name});

    while (evolves_to.length > 0){
        if (evolves_to.length > 1){
            evolves_to.forEach(({species}) =>{
                evoStacking.push({name: species.name});
            });
        }else{
            evoStacking.push({name: evolves_to[0].species.name});
        }
        evolves_to = evolves_to[0].evolves_to;
    }
    return evoStacking;
}

main();