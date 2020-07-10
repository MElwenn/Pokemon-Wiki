/* wrapping all global variables in 'Immediately Invoked Function Expression (or IIFE)' to avoid external code conflicts */
var pokemonRepository = (function() { //This is the IIFE wrap
      var pokemonList = [];
      var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; //define apiURL
      var $response = $('.pokemon-list');
      var modalContainer = ('#modal-container');

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
          })
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
                  return pokemon;
              }).then(function() {
                  showModal(pokemon);
              }).catch(function(err) {
                  console.log('Caught an error:' + err.statusText);
              }); //ERROR handling
      } // showDetails append

      function showModal(mokemon) {
          // Clear all existing modal content
          $modalContainer.innerHTML = '';

          var modal = $('<div id="modal-container"></div>');
          $('modal').append(modal);

          // Add the new modal content
          $('pok-title').text(pokemon.name);

          $('close-modal').text('Close').click(() => {
                modal.remove(modal);
          });

          $('<p id="pok-height">Height: </p>').text(pokemon.height);

          $('<p id="pok-weight">Weight: </p>').text(pokemon.weight);

      } // showModal end

      return { //return all items from the pokemonList to make it available outside the IIFE
          add: add,
          getAll: getAll,
          addListItem: addListItem,
          loadList: loadList,
          loadDetails: loadDetails, //add loadDetails
      }; // return end

})(); // Wrapping IIFE end

// outside IIFE-Wrap
pokemonRepository.loadList().then(function(){
    pokemonRepository.getAll().forEach(function (item) {
        pokemonRepository.addListItem(item);
    });
})

/*  //This code is deemed too vast
$('button').on('click', function (event) {

    var $modalContainer = $('<div id = "#modal-container" class ="#modal-container.is-visible"</div>');
    $('$modalContainer').append($modalContainer);
    $modalContainer.addClass('#modal-container.is-visible');

    !function(apiUrl) {
        pokemonList.loadDetails(apiUrl).then(function() {

            var modal = $('<div id="modal-container"></div>');
            $('modal').append(modal);
            modal.addClass('.modal');

            var closeButtonElement = $('<button id="close-modal" class=".modal-close">Close</button>');
            $('closeButtonElement').append(closeButtonElement);
            closeButtonElement.addClass('.modal-close');

            var titleElement = $('<div id="pok-title"></div>');
            $('titleElement').append(titleElement);
            titleElement.addClass('.modal h1');
            titleElement.text(apiUrl.name);

            var heightElement = $('<p>Height: </p>');
            $('heightElement').append(heightElement);
            heightElement.addClass('.modal p');
            heightElement.text(apiUrl.height);

            var weightElement = $('<p>Weight: </p>');
            $('weightElement').append(weightElement);
            weightElement.addClass('.modal p');
            weightElement.text(apiUrl.weight);

        }) // .then(function) end
    } // apiUrl end
}); // button.click end
*/
