import $ from "cash-dom";
import gameData from "../data/gamedata.json";
import gameController from "./gameController.js";
import "nes.css/css/nes.min.css";

$(function () {
  let frController = new gameController(gameData,$('#app'));
  
});


// import Vue from "vue/dist/vue.js";

// import gameData from "../data/gamedata.json";
// import gameScreen from "./components/screen.vue";

// var app = new Vue({
//     el: '#app',
//     data: {
//       myMessage: 'Hello Vue!'
//     },
//     components: {
//         'gamescreen': gameScreen,
//     },
//     methods: {
//         getData() {
//             console.log("mounted");
//         }
//     }
//   })



 

//   var tag = document.createElement("gamescreen");
//   var text = document.createTextNode("Tutorix is the best e-learning platform");
//   tag.appendChild(text);
//   var element = document.getElementById("app");
//   element.appendChild(tag);