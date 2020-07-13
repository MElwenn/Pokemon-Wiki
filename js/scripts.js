/* wrapping all global variables in 'Immediately Invoked Function Expression (or IIFE)' to avoid external code conflicts */
var pokemonRepository = (function() { //This is the IIFE wrap
      var pokemonList = [];
      var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; //define apiURL
      var $response = $('.pokemon-list');
      var $modalContainer = ('#modal-container');

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
/* all correct up to this point */
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
                  return pokemon;
              }).then(function(pokemon) {
                  showModal(pokemon);
              }).catch(function(err) {
                  console.log('Caught an error:' + err.statusText);
              }); //ERROR handling
      } // showDetails append


      function showModal(pokemon) { //stimmt
          // Clear all existing modal content
          $modalContainer.empty();

          // create the new modal content by rendering
          var modal = $('<div id="modal-container"></div>');
          var titleElement = $('<h1></h1>');
          var heightElement = $('<p></p>');
          var weightElement = $('<p></p>');
          var closeButtonElement = $('<button class="modal-close" type="modal-close"></button>');
          closeButtonElement.on('click', hideModal);

          // add new modal content
          titleElement.text(pokemon.name);
          heightElement.text(pokemon.height);
          weightElement.text(pokemon.weight);

          // add content to modal ("child" of modal)
          modal.append(titleElement);
          modal.append(heightElement);
          modal.append(weightElement);
          modal.append(closeButtonElement);

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
