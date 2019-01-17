// export default 'I am an exported string.';


/********************************************************************************/

import axios from 'axios';
import {keyApi} from '../config'; 

export default class Search {

    constructor(query) {
        this.query = query;
    };

    async getResults() {

        //const keyApi = '9eabc3b06a4a833f663a2a9b30b0d24b';
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${keyApi}&q=${this.query}`);
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch(error) {
            console.log(error);
        };
        
    };
}



















