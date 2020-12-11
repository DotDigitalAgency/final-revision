import $ from "cash-dom";
import gameData from "../data/gamedata.json";
import gameController from "./gameController.js";
import "nes.css/css/nes.min.css";
import * as dat from 'dat.gui';


$(function () {
  
  let frController = new gameController(gameData,$('#app'),0); //Start the gem in the proper div.
  //const gui = new dat.GUI();
});





//changing window size - add remove border - event listener
window.addEventListener('resize', (e)=>{
  let textWrapper = document.querySelectorAll('.text_wrapper');
  const classes = ['nes-container', 'is-rounded', 'is-dark'];
  if(window.innerWidth>1024){
    textWrapper.forEach((element)=> element.classList.add(...classes));
  } else {
    textWrapper.forEach((element)=> element.classList.remove(...classes));
  }
})

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