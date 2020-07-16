
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

          // This is the old jQuery-Button
//        var $button = $(
//            '<button type="button" class="button" data-toggle="modal" data-target="#modal-container">'
//                + pokemon.name +
//            '</button>'
//        );

//        var $button = $('<button type="button" role="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-container">'
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
    } // showDetails append

    function showModal(pokemon) {
        // Clear all existing modal content
        $modalContainer.empty();

        var modalFade = $('<div class="modal fade" id="exampleModalCenter"></div>');
        var modalDialogCentered = $('<div class="modal-dialog modal-dialog-centered"</div>');
        var modalContent = $('<div class="modal-content"></div>');

        var modalHeader = $('<div class="modal-header">');
        var modalTitle = $('<h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>');
        var titleElement = $('<h1></h1>');
        var closeButtonElementHeader = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close">').text("Close");
        closeButtonElementHeader.on("click", hideModal);

        var modalBody = $('<div class="modal-body"></div>');
        var imageElement = $('<img class="img"/>').ready(pokemon);
        var heightElement = $('<p></p>');
        var weightElement = $('<p></p>');

        var modalFooter =$('<div class="modal-footer">');
        var closeButtonElementFooter =$('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');
        closeButtonElementFooter.on("click", hideModal);

        // Add the new modal content
        titleElement.text(pokemon.name);
        imageElement.attr('src', pokemon.imageUrl);
        heightElement.text(pokemon.height);
        weightElement.text(pokemon.weight);

        modal.append(titleElement);
        modal.append(imageElement);
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
