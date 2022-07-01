require("dotenv").config();

const { dbConnection } = require('./db/config');
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios").default;
const Pokemon = require("./models/pokemoninfo");

const { PORT = 3000 } = process.env;
const CACHE = {};
const cacheExpireTime = 1000 * 10;
const ERROR = {};

app.use(cors());

app.get("/cache", function (req, res) {
  res.json({ data: CACHE });
});

app.post("/pokemon/:name", async function (req, res) {
  const { name } = req.params;
  const pokemonFind = await Pokemon.findOne({name});



  //formating data
  const formatedPokemonData = (data, evoList, locations) => {
    const pokemondata = {
      id: data.id,
      name: data.name,
      weight: data.weight,
      height: data.height,
      abilities: data.abilities.map((ability) => ability.ability.name),
      cachedate: new Date(),
      sprites : data.sprites,
      evoList : evoList,
      locations : locations
    };

    return pokemondata;
  };

  const now = new Date();

  //looking if the data is already cached
  if (pokemonFind && !(now - pokemonFind.cachedate >= cacheExpireTime)) {
    return res.json({ 
      data: pokemonFind, 
      isCached: true });
  }

  const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
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

    //uploading data into DB
    const pokemonData = formatedPokemonData(data, evoList, locations.data);
    if(pokemonFind){
      const pokemonUpdate = await Pokemon.findOneAndUpdate(
        {name},
        {pokemonData}, 
        {new: true});
        if(!req.query.sprites)
          pokemonUpdate.sprites = undefined
        if (!req.query.evolutionChain)
          pokemonUpdate.evoList = undefined
        if (!req.query.locations)
          pokemonUpdate.locations = undefined
        return res.json({ 
          data: pokemonUpdate, 
          isCached: false });
    }
    const pokemonDb = await Pokemon(pokemonData)
    const pokemonResponse = await pokemonDb.save();
    
    if(!req.query.sprites)
     pokemonResponse.sprites = undefined
    if (!req.query.evolutionChain)
      pokemonResponse.evoList = undefined
    if (!req.query.locations)
      pokemonResponse.locations = undefined
    
    res.json({ 
      data: pokemonResponse,
      isCached: false });

  } catch {
    ERROR[name] = JSON.stringify({ name, error: "Invalid pokemon." });
  }
  
});


//Conecion con la base de datos
(async()=>{
  await dbConnection().then(() => {
      console.log('Conexion a la BD establecida con éxito...')
      app.listen(PORT, () => {
          console.log(`Running on port ${PORT}...`);
  })
  }).catch(err => console.log(err))
})();


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