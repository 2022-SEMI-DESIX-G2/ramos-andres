(() => {
    const Utils = {
        settings: {
            backendBaseUrl: "https://pokeapi.co/api/v2",
        },
        
        methods:{
            getFormattedBackendUrl: ({ query, searchType}) => {
                return `${Utils.settings.backendBaseUrl}/${searchType}/${query}`;
            },
            
            getSearchType: ({query, searchType = "pokemon"}) => {
                return Utils.methods.fetch({
                    url: Utils.methods.getFormattedBackendUrl({query, searchType}),
                    searchType,
                });
            },
           
            fetch: async ({url, searchType}) => {
                try {
                    const response = await fetch(url);
                    if (response.status !== 200){
                        throw new Error(`${searchType} Not Found`)
                    }
                    return response.json();
                } catch (error) {
                    throw error;
                }
            },
            
            getArraySearch: url => 
            url.split("/").slice(5,7).reverse(),
    
            getEvoChain: async url => {
                try {
                    let arraySearch = Utils.methods.getArraySearch(url);
                    let {evolution_chain} = await Utils.methods.getSearchType({
                        query: arraySearch[0],
                        searchType: arraySearch[1],
                    });
                    arraySearch = Utils.methods.getArraySearch(evolution_chain.url);
                    let{chain} = await Utils.methods.getSearchType({
                        query: arraySearch[0],
                        searchType: arraySearch[1],
                    });
                    return Utils.methods.getArrayEvoChain(chain);
                } catch (error) {
                    throw error;
                }
            },

            getEcounters: async url => {
                try {
                    let arraySearch = Utils.methods.getArraySearch(url);
                    let 
                } catch (error) {
                    
                }
            },
            
            getEcountersChain: () => {
                
            },

            getArrayEvoChain: ({species, is_baby, evolves_to}) => {
                let evoStacking = [];
                evoStacking.push({name: species.name, is_baby: is_baby});

                while (evolves_to.length > 0){
                    if (evolves_to.length > 1){
                        evolves_to.forEach(({species, is_baby}) =>{
                            evoStacking.push({name: species.name, is_baby: is_baby});
                        });
                    }else{
                        evoStacking.push({name: evolves_to[0].species.name, is_baby: evolves_to[0].is_baby});
                    }
                    evolves_to = evolves_to[0].evolves_to;
                }
                return evoStacking;
            },
        },
    };
    document.Utils = Utils;
})()    