
/* wrapping all global variables in 'Immediaty Invoked Function Expression (or IIFE)' to avoid external code conflicts */
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

        var $button = $('<button type="button" role="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">'
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
          }).catch(function(e) { //ERROR handling
              console.error(e);
          });
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
        }).catch(function(e) { //ERROR handling
            console.error(e);
        });
    } // load Poekemon Details end

    function showDetails(pokemon) {
        pokemonRepository
            .loadDetails(pokemon).then(function() {
                showModal(pokemon);
              }).catch(function(e) { //ERROR handling
                  console.error(e);
              });
    } // showDetails end

    function showModal(pokemon) {
        // Clear all existing modal content
        $modalContainer.empty();

        //This is the new Bootstrap-modal
        var modal = $('<div class="modal" tabindex="-1" role="dialog"></div>'); // transparent background covering the entire screen
            var modalDialog = $('<div class="modal-dialog" role="document"></div>'); // modal box that appears on top of the background
//            var modalContent = $('<div class="modal-content"></div>');  // Wrap around the modal content
                var modalHeader = $('<div class="modal-header"></div>');
                    var titleElement = $('<h2 class="modal-title"></h2>');
                    var closeButtonElementHeader = $('<h4 type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></h4>');

                var modalBody = $('<div class="modal-body"></div>');
                    var heightElement = $('<p>Height: </p>');
                    var weightElement = $('<p>Weight: </p>');
                    var imageElement = $('<img class="img"/>').ready(pokemon);

                var modalFooter = $('<div class="modal-footer"></div>');
                    var closeButtonElementFooter = $('<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>');
//              '</div>');
//            '</div>');
//          '</div>');
//        '</div>'); //Bootstrap-modal end

        // Add the new modal content
        titleElement.text(pokemon.name);
        imageElement.attr('src', pokemon.imageUrl);
        heightElement.text(pokemon.height);
        weightElement.text(pokemon.weight);

        modal.append(modalDialog); //nedded?
//        modal.append(modalContent); //nedded?

        modal.append(modalHeader); //nedded?
        modal.append(titleElement);
        modal.append(closeButtonElementHeader);

        modal.append(modalBody); //nedded?
        modal.append(imageElement);
        modal.append(heightElement);
        modal.append(weightElement);

        modal.append(modalFooter);
        modal.append(closeButtonElementFooter);

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
