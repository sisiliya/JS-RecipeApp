import axios from 'axios';
import {keyApi, proxy} from '../config';

export default class Recipe{
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            
            const res = await axios(`https://www.food2fork.com/api/get?key=${keyApi}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(result);

        } catch(err) {
            console.log(err);
            alert('something went wrong :(');
        } 
    }

    calcTime() {
        // for every 3 ingredients 15 min
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIgredients = this.ingredients.map(el => {
            // uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // remove ()
             ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parse ingredients into count, unit, ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            
            let finalObjIng;
            let count;
            if(unitIndex > -1) {
                // unit
                const arrCount = arrIng.slice(0, unitIndex);
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // example: 4 + 1/2 -> 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                finalObjIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };


            } else if(parseInt(arrIng[0], 10)) {
                // no unit, but 1 -> number
                finalObjIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')

                }

            } else if(unitIndex === -1) {
                // no unit, no number
                finalObjIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return finalObjIng;

        });
        this.ingredients = newIgredients;
    }

    updateServings(type) {
        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //ingredients   
        this.ingredients.forEach( ing => {
            ing.count *= (newServings/this.servings);
        })



        this.servings = newServings;
    }
}