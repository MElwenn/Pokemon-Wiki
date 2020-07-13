/* wrapping all global variables in 'Immediately Invoked Function Expression (or IIFE)' to avoid external code conflicts */
var pokemonRepository = (function() { //This is the IIFE wrap
      var pokemonList = [];
      var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; //define apiURL
      var $response = $('.pokemon-list');
      var $modalContainer = $('#modal-container');

      function add (pokemon) { // function to load the list of Pokemons
          pokemonList.push(pokemon);
          addListItem(pokemon);
      }

      function getAll() {
          return pokemonList;
      }

      function addListItem(pokemon) { //addListItem

          var $listItem = $('<li class="container"></li>');
          $response.append($listItem);

          var $button = $(
              '<button type="button" class="button" data-toggle="modal" data-target="#modal-container">'
                  + pokemon.name +
              '</button>'
          );
          $listItem.append($button);

          $button.click(function(){
              showDetails(pokemon);
          });
      } //addListItem end

      function loadList() { // function to load the list of Pokemons
          return $.ajax(apiUrl, {
              dataType: 'json'
          }).then(function (responseJSON) {
                responseJSON.results.forEach(function(item) {
                    var pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
          }).catch(function(err) {
              console.log('Caught an error:' + err.statusText);
          }); //ERROR handling
      }

      function loadDetails(pokemon) { // load Poekemon Details
          var url = pokemon.detailsUrl;
          return $.ajax(url, {
              dataType: 'json'
          }).then(function(responseJSON) {
              return responseJSON;
          }).then(function(details){
              pokemon.id = details.id;
              pokemon.imageUrl = ('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + details.id + '.png');
              pokemon.height = ('Height: ') + details.height + ('dm');
              pokemon.weight = ('Weight: ') + details.weight + ('dg');
              pokemon.types = details.types.map(function(object) {
                  return object.type.name;
              });
          }).catch(function(err) {
                  console.log('Caught an error:' + err.statusText);
          }); //ERROR handling

      } // load Poekemon Details end

/*
      function loadDetails(pokemonList) { // load Poekemon Details
          var apiUrl = pokemonList.detailsUrl;
          return $.ajax(apiUrl).then(function(apiUrl) {
              pokemonList.id = details.id;
              pokemonList.imageUrl = ('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + details.id + '.png');
              pokemonList.height = ('Height: ') + details.height + ('dm');
              pokemonList.weight = ('Weight: ') + details.weight + ('dg');
              pokemonList.types = details.types;
          }).catch(function(e) { // ERROR handling
              console.error(e);
          });
      } // load Poekemon Details end
*/

      function showDetails(pokemon) {
          pokemonRepository
              .loadDetails(pokemon).then(function() {
                  showModal(pokemon);
              }).catch(function(err) {
                  console.log('Caught an error:' + err);
              }); //ERROR handling
      } // showDetails append


      function showModal(pokemon) {
          // Clear all existing modal content
          $modalContainer.empty();

          var modal = $('<div class="modal"></div>');
          var titleEl = $('<h1></h1>');
          var heightEl = $('<p></p>');
          var weightEl = $('<p></p>');
          var closeButtonEl = $('<button class="btn btn-secondary" type="modal-close"></button>').text("Close");
          closeButtonEl.on("click", hideModal);

          // Add the new modal content
          titleEl.text(pokemon.name); // <h1>PokemonName</h1>
          heightEl.text(pokemon.height);
          weightEl.text(pokemon.weight);

          modal.append(titleEl);
          modal.append(heightEl);
          modal.append(weightEl);
          modal.append(closeButtonEl);

          $modalContainer.append(modal);
          $modalContainer.addClass("is-visible");

      } // showModal end

      function hideModal() {
          $modalContainer.removeClass("is-visible");
      }

      return { //return all items from the pokemonList to make it available outside the IIFE
          add: add,
          getAll: getAll,
          addListItem: addListItem,
          loadList: loadList,
          loadDetails: loadDetails, //add loadDetails
          showModal: showModal
      }; // return end

})(); // Wrapping IIFE end

// outside IIFE-Wrap
pokemonRepository.loadList().then(function(){
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
})
