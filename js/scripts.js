/* wrapping all global variables in 'Immediately Invoked Function Expression (or IIFE)' to avoid external code conflicts */
var pokemonRepository = (function() { //This is the IIFE wrap
      var pokemonList = [];
      var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; //define apiURL
      var response = {
          name: apiUrl.name,
          detailsUrl: apiUrl.url
      };

      function loadList() { // function to load the list of Pokemons
          return $.ajax('https://pokeapi.co/api/v2/pokemon/?limit=150', {
              dataType: 'json' }).then(function (responseJSON) {
                  console.log(responseJSON); // This is the parsed JSON response
              }).then(function(json) { // if promise resolved, all data passed in resolved function is availabe here
                  $('loadList').each(function (i) {
                      var newElement = $('<div class="new-class">Content is here!</div>');
                      $('body').append(newElement);
                      var results = $(this).val();
//                      var loadListName = $(this).attr('name');
                      results.get(name, url);

                  });//.catch(function(e) { //ERROR handling

//                        console.error(e);
//                    });
//                  add(item); // adds the object to the loadList ("item" rather than " "Pokemon")
              });
      } // function loadList end

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

      function getAll() {
          return pokemonList;
      }

      function add (apiUrl) { // function to load the list of Pokemons
          pokemonList.push(apiUrl);
          addListItem(apiUrl);
      }

      function addListItem(apiUrl) { //addListItem

          var hitList = $('<ul class="pokemon-list"></ul>');
//              $('body').append(hitList);
          $('body').append('<ul class="pokemon-list"></ul>');
          hitList.addClass('body');

          var listItem = $('<div class="container"></div>');
//              $('.container').append(listItem);
          $('.container').append('<div class="container"></div>');
          listItem.addClass('.container');

          var button = $('<button type="button" class="button" data-toggle="modal" data-target="#modal-container"> + apiUrl.name + </button>')
//              $('.button').append(button);
          $('.button').append('<button class="button"></button>');
          button.addClass('.button')
          button.text(apiUrl.name);

      } //addListItem end

      function response() {
          return $.ajax(apiUrl, {
              dataType: 'json'
          }).then(function(pokemonList) {
              $.each(pokemonList.results, function (pokemonList, apiUrl) {
                  loadList({
                      name: apiUrl.name,
                      detailsUrl: apiUrl.url
                  })
              })
          }.catch(function(e) { //ERROR handling
              console.error(e);
          }));
      } // response end

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

//***********

// call pokemon apiURL using jQuery (Task 1.9)
//      $.ajax('https://pokeapi.co/api/v2/pokemon/?limit=150', {
//        dataType: 'json' }).then(function (responseJSON) {
//          console.log(responseJSON); // This is the parsed JSON response
//      });
/*
function response() {
return $.ajax(apiUrl, {
  dataType: 'json'
}).then(function(pokemonList) {
  $.each(pokemonList.results, function (pokemonList, apiUrl) {
      function loadList() {
          name: apiUrl.name,
          detailsUrl: apiUrl.url
      }
  })
}.catch(function(e) { //ERROR handling
  console.error(e);
}));
} // response end

*/
