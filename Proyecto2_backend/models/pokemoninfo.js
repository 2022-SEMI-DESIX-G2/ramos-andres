const { Schema, model } = require('mongoose');

const PokemonSchema = Schema({
    name: {
        type: String
    },
    abilities: {
        type: Array
    },
    id: {
        type: Number
    },
    sprites: {
        type: Object
    },
    evoList: {
        type: Array
    },
    locations: {
        type: Array
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    cachedate: {
        type: Date
    },
});

module.exports = model('Pokemon', PokemonSchema);