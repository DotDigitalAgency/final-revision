import Vue from "vue/dist/vue.js";

import gameData from "../data/gamedata.json";
import gameScreen from "./components/screen.vue";

var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    },
    components: {
        'gamescreen': gameScreen,
    }
  })

  console.log(gameData);