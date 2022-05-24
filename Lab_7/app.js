const axios = require("axios");

const prueba = async() => {
    const {status,data} = await axios("https://pokeapi.co/api/v2/pokemon/ditto");
    console.log({status});
    console.log({data});
}

prueba();