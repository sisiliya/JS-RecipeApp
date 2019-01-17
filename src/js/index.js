// Global app controller

// API KEY: 9eabc3b06a4a833f663a2a9b30b0d24b
// seacrh https://www.food2fork.com/api/search

/********************************************************************************/

// Doing exports/imports -> 3 ways default, named x2

// import str from './models/Search';
// import { add as a, multiply as m, ID } from './views/searchView';
// import * as searchView from './views/searchView';
// console.log(`Using imported functions 1: ${searchView.add(searchView.ID, 2)} 2: ${searchView.multiply(3,5)}. ${str}`);


/********************************************************************************/

// old browsers may not recognize fetch() !
// ako ne stane cors proxy

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {elements, renderLoader, stopLoader} from './views/base';

// Global State of the App
// -> Search object
// -> Current recipe object
// -> Shopping list objects
// -> Liked recipes
const state = {};


                                 // SEARCH CONTROLLER
const controllSearch = async() => {

    // 1. Get query from the view
    const query = searchView.getInput(); 
    

    // console.log(query);

    if(query) {
        // 2. New Search object created and added to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes 
            await state.search.getResults();


            // 5. Render results on UI
            stopLoader();
            searchView.renderResults(state.search.result);

            // 6. delete the search query from the view
            searchView.clearInput();
        } catch(err) {
            alert('error processing recipes');
            stopLoader();
        }
    }

};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});


elements.searchResAndPages.addEventListener('load', e => {
    const btn = e.target.closest('.btn-inline');
    // console.log(btn);
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage);
        
    }
});



                               // RECIPE CONTROLLER

const controlRecipe = async() => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');
    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight the selected 
        if(state.search) {
            searchView.highlightSelected(id);
        }
        

        //Create new recipe object
        state.recipe = new Recipe(id);


        try {
            // Get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calc servings and time
            state.recipe.calcServings();
            console.log(state.recipe.servings);
            state.recipe.calcTime();

            // render();
            stopLoader();
            recipeView.renderRecipe(state.recipe);
        } catch(err) {
            alert('Error processing recipe');
            console.log(err);
        }


    }
    // console.log(id);
}


// window.addEventListener('hashchange', controlRecipe);    
// window.addEventListener('load', controlRecipe);                   
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));






















