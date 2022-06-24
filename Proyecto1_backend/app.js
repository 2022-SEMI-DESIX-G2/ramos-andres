require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;

const { PORT = 3000 } = process.env;
const CACHE = {};
const maxCacheTime = 1000 * 10;
const ERROR = {};

app.use(cors());

app.get("/cache", function (req, res) {
  res.json({ data: CACHE });
});

app.post("/pokemon/:name", async function (req, res) {
  const { name } = req.params;
  //formating data
  const formatedPokemonData = (data, evoList, locations) => {
    const pokemondata = {
      id: data.id,
      name: data.name,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities.map((ability) => ability.ability.name),
    };
    req.query.sprites && (pokemondata.sprites = data.sprites);
    req.query.evolutionChain && (pokemondata.evoList = evoList);
    req.query.locations && (pokemondata.locations = locations);

    return pokemondata;
  };

  //looking if the data is already cached
  if (CACHE[name] && JSON.parse(CACHE[name]).cacheTime > new Date()) {
    const responseData = formatedPokemonData(
      JSON.parse(CACHE[name]).data, 
      JSON.parse(CACHE[name]).evoList, 
      JSON.parse(CACHE[name]).locations);
    return res.json({ 
      name, 
      cacheTime: JSON.parse(CACHE[name]).cacheTime,
      data: responseData, 
      isCached: true });
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
  let responseData;
  try {
    const { data } = await axios.get(url);
    const speciesUrl = await axios.get(data.species.url);
    var evolutionChain = await axios.get(speciesUrl.data.evolution_chain.url);
    const locations = await axios.get(data.location_area_encounters);

    let evo_chain = getArrayEvoChain(evolutionChain.data.chain)
    let evoList = []
    evo_chain.map(({ name}) =>{
        evoList.push({ name });
    });

    responseData = formatedPokemonData(data, evoList, locations.data);
    
    //uploading data into Cache
    CACHE[name] = JSON.stringify({ cacheTime: Date.now() + maxCacheTime , data, evoList: responseData.evoList, locations: responseData.locations});
  } catch {
    ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
  }
  res.json({ 
    name, 
    cacheTime: JSON.parse(CACHE[name]).cacheTime,
    data: responseData,
    isCached: false });
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}...`);
});

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