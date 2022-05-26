const axios = require("axios");

const main = async() => {
    const {data} = await axios("https://pokeapi.co/api/v2/pokemon/ditto");
    console.log(getPokemon(data));
}

getPokemon = ({id, name, weight, height, abilities}) => {
    let abilitiesList = []
    abilities.map(({ ability}) => {
        abilitiesList.push({ name: ability.name})
    });

    /*let evoList = []
    evo_chain.map(({ name, is_baby}) =>{
        evoList.push({ name, is_baby});
    });*/

    return data = { id, name, weight, height, abilitiesList}
};

main();