

var indexIngredient = function(ingredientsII, ingredient, drinkIndex) {
  if (ingredientsII[ingredient]) {
    ingredientsII[ingredient].push(drinkIndex)
  } else {
    ingredientsII[ingredient] = [drinkIndex];
  }
}

// ingredient inverted index
var ingredientsII = new Set();
// currently selected ingredients
var selectedIngredients = {};

// set everything up
$(document).ready(function() {
  // load drinks
  $.getJSON("drinks.json", {}, function(drinks) {

    // create ingredient inverted index
    for (var i in drinks) {
      for (var j in drinks[i].ingredients) {
        var type = drinks[i].ingredients[j].type[0];
        indexIngredient(ingredientsII, type, i);
        for (var k = 1; k < drinks[i].ingredients[j].type.length; k++) {
          type = type + ", " + drinks[i].ingredients[j].type[k];
          indexIngredient(ingredientsII, type, i);
        }
      }
    }

    // set up autocomplete for ingredient input
    $("#ingredientInput").easyAutocomplete({
      data: Object.keys(ingredientsII),
      list: {
        match: {
          enabled: true
        }
      }
    });
  });
});

function handleIngredientKeypress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addIngredient();
  }
}

function ingredientId(ingredient) {
  return ingredient.replace(new RegExp(" ", "g"), "-");
}

// serach based on global list of selected ingredients
function search() {
  for (var i in selectedIngredients) {
    
  }
}

function removeIngredient(event) {
  const ingredient = event.data.ingredient;
  delete selectedIngredients[ingredient]
  $("#ingredients").find("#" + ingredientId(ingredient)).remove();

  search();
}


function clearIngredients() {
  // clear state
  selectedIngredients.length = 0;

  // clear displays
  $("#ingredients").empty();
  $("#results").empty();
  // no need to search - everything is cleared
}

function addIngredient() {
  const ingredient = $("#ingredientInput").val();

  // don't do anything for duplicates
  if (ingredientsII[ingredient] && !selectedIngredients[ingredient]) {

    // update ingredient
    const closeSpan =  $("<span />").addClass("drinks-ingredient-close")
                                    .html("&times;")
                                    .click({ingredient: ingredient}, removeIngredient);
    const ingredientSpan = $("<span />").attr("id", ingredientId(ingredient))
                                        .addClass("drinks-ingredient")
                                        .html(ingredient)
                                        .append(closeSpan);
    selectedIngredients[ingredient] = true;
    $("#ingredients").append(ingredientSpan);

    search()
  }

  // clear the input to make for easy incremental additions
  $("#ingredientInput").val("");

}




