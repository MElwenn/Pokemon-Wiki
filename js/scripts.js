
/* wrapping all global variables in 'Immediaty Invoked Function Expression (or IIFE)' to avoid external code conflicts */
var pokemonRepository = (function() { //This is the IIFE wrap
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; //define apiURL
    var $response = $('#myUL'); // used #myUL instead of $('.pokemon-list'); to meet boostrap notation
    var $modalContainer = $('#modal-container');

    function add (pokemon) { // function to load the list of Pokemons
        pokemonList.push(pokemon);
        addListItem(pokemon);
    }

    const capitalize = (letter) => {
        if (typeof letter !== 'string') return '';
        return letter.charAt(0).toUpperCase() + letter.slice(1);
    };

    function getAll() {
        return pokemonList;
    }

    function addListItem(pokemon) { //addListItem

        var $listItem = $('<div class="list-group"></div>');
        var $button = $('<button type="button" class="list-group-item list-group-item-action data-toggle="modal" data-target="#modal-container">'+ capitalize(pokemon.name) + '</button>');
        $response.append($button);
        $button.on('click', function(){
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

        // This is the modal container
        var modal = $('#modal-container').modal('show'); // transparent blury background covering the entire screen
        var modalDialog = $('#modalDialog'); // modal box that appears on top of the background
        var modalContent = $('#modalContent');  // Wrap around the modal content
        //This is the modal header
        var modalHeader = $('#modalHeader');
        modalHeader.empty();
        var titleElement = $('<h5>' + pokemon.name + '</h5>');

        modalHeader.append(titleElement);

        //This is the modal body
        var $modalBody = $('#modalBody');
        $modalBody.html ('Height: ' + pokemon.height + '<br/><br/>' +
                         'Weight: ' + pokemon.weight + '<br/><br/>'
        );
        var imageElement = $("<img class='modal-image img' src='" + pokemon.imageUrl + "'>");
        $modalBody.append(imageElement);

        //This is the modal footer
        var modalFooter = $('#modalFooter');
        var closeButtonElementFooter = $('#modalCloseFooter');
    } // showModal end

    return { //return all items from the pokemonList to make it available outside the IIFE
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails, //add loadDetails
        showModal: showModal,
//        searchBox: searchBox
    }; // return end

})(); // Wrapping IIFE end

// outside IIFE-Wrap
pokemonRepository.loadList().then(function(){
  pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
  });
})

// Search-Box functionalities
// filter search results using the searchBox
function filterResult() { // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_list
    var input, filter, ul, $response, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    $response = ul.getElementsByTagName("$response");
    for (i = 0; i < $response.length; i++) {
        a = $response[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            $response[i].style.display = ""; // $response.display, $button.display, $listItem.display or pokemon.display do not work here
        } else {
            $response[i].style.display = "none";  // $response.display, $button.display, $listItem.display or pokemon.display do not work here
        }
    }
}
//$(document).ready(function(){
    $('#myInput').on('keyup', function filterResult(){
        var value = $(this).val().toLowerCase();
        $('.titleElement').filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
//});
