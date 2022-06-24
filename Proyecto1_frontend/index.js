(() => {
    const App = {
      config: {
        baseApiUrl: "http://localhost:3000/pokemon",
      },
      htmlElements: {
        form: document.querySelector("#pokemon-finder-form"),
        input: document.querySelector("#pokemon-input"),
        response:document.querySelector("#pokemon-finder-response"),
        spriteCheckbox: document.querySelector("#pokemon-sprite-query"),
        evolutionCheckbox: document.querySelector("#pokemon-evolution-query"),
        encounterCheckbox: document.querySelector("#pokemon-encounter-query"),
      },
      init: () => {
        App.htmlElements.form.addEventListener(
          "submit",
          App.handlers.handleFormSubmit
        );
      },
      handlers: {
        handleFormSubmit: async (e) => {
          e.preventDefault();
          
          try {
            const pokemon = App.htmlElements.input.value.toLowerCase();
            const checkboxes = '?'+
            `${App.htmlElements.spriteCheckbox.checked ? "sprites=true&" : ""}`+
            `${App.htmlElements.evolutionCheckbox.checked ? "evolutionChain=true&" : ""}`+
            `${App.htmlElements.encounterCheckbox.checked ? "locations=true" : ""}`
            ;
            const url = App.utils.getUrl({ pokemon, checkboxes });
            const { data } = await axios.post(url);
            console.log(data);
            App.htmlElements.response.innerHTML = "";
            App.htmlElements.response.innerHTML = App.templates.pokemonCard(data.data, data);
            if (data.data.sprites){
              App.htmlElements.response.innerHTML += App.templates.spriteCard(data.data); 
            }
            if (data.data.evolution){
              App.htmlElements.response.innerHTML += App.templates.evolutionCard(data.data);
            }
            if (data.data.location){
              App.htmlElements.response.innerHTML += App.templates.locationCard(data.data);
            }
          } catch (e) {
            App.htmlElements.response.innerHTML = App.templates.errorCard(e);
          }
        },
      },
      templates: {
        
        errorCard: (error) =>{
          return '<div class="trayBox error">'+
                  '<h2 id="nombre">Error</h2>'+
                  '<div id="error-message">'+
                    `<p>${error}</p>}`+
                    '<span>Hubo un error</span><br>'+
                    '<br>'+
                  '</div>'+
                '</div>'
        },

        pokemonCard: ({ abilities, height, id, name, weight }) => {
                
          const abilityList = abilities.map(
              (ability) => 
              `<li style="text-transform: capitalize">${ability}</li>`
          );

          return '<div class="card">'+
                      '<div>'+
                          '<p><b>Pokedex Number</b></p>'+
                          '<p class="pokedex-number">'+
                              `<span>#${id}</span>`+
                          '</p>'+
                      '</div>'+
                      `<h2 class="pokemon-name"><b style="text-transform: capitalize">${name}</b></h2>`+
                      '<div class="pokemon-atributtes">'+
                          '<div class="pokemon-abilities">'+
                              '<p><b>Abilities</b></p>'+
                              `<ul>${abilityList.join("")}</ul>`+
                          '</div>'+ 
                          '<div class="pokemon-dimensions">'+
                              '<p><b>Dimesions</b></p>'+
                              '<ul>'+
                                  `<li>Height: ${height}</li>`+
                                  `<li>Weight: ${weight}</li>`+
                              '</ul>'+
                          '</div>'+
                      '</div>'+
                  '</div>';
      },

      spriteCard: ({sprites}) => {
          return '<div class="sprite-card">'+
                      '<div class="pokemon-sprites">'+
                          '<p><b>Sprites</b></p>'+
                          `<img src="${sprites.front_default}" alt="">`+
                          `<img src="${sprites.back_default}" alt="">`+
                          `<img src="${sprites.front_shiny}" alt="">`+
                          `<img src="${sprites.back_shiny}" alt="">`+
                      '</div>'+
                  '</div>';
      },

      evolutionCard: ({evo_chain}) => {
          const evolutionList = evo_chain.map(
              (name) => 
              `<li style="text-transform: capitalize">${name}</li>`
          );

          return '<div class="evolution-card">'+
                      '<div class="pokemon-evolution-chain">'+
                          '<p><b>Evolution chain</b></p>'+
                          `<ul>${evolutionList.join("")}</ul>`+
                      '</div>'+  
                  '</div>';
      },

      locationCard: (locations) => {
        ubications = locations.locations.map(
          (locations) =>
            `<li>${locations.location_area.name} <br>
            Chance: ${locations.version_details[0].encounter_details[0].chance}</li>`
        );
        return '<div class="location-card">'+
                  '<div class="pokemon-location">'+
                    '<p><b>Evolution chain</b></p>'+
                    `<ul>${locations.join("")}</ul>`+
                  '</div>'+  
                '</div>';
      },

      },
      utils: {
        getUrl: ({ pokemon, checkboxes }) => {
          return `${App.config.baseApiUrl}/${pokemon}${checkboxes}`;
        },
      },
    };
    App.init();
  })();