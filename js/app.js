import $ from "cash-dom";
import { gsap } from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import TextPlugin from 'gsap/TextPlugin';

import gameData from "../data/gamedata.json";
import gameController from "./gameController.js";

import "nes.css/css/nes.min.css";




$(function () {
  $(document).ready(function () {

    gsap.registerPlugin(ScrollToPlugin);
    gsap.registerPlugin(TextPlugin);
    gsap.ticker.fps(8)

   
    gsap.to(".intro_graphics", {opacity:0,duration:0});
    gsap.to(".intro_title", {opacity:0,duration:0});
    
    var img_height = Number($('.intro_graphics').height());
    if (img_height == 0) { img_height = 660;}
    var offset = 0-(img_height+100); //check if image is lopaded
    var intro = gsap.timeline({paused:true});
    intro.fromTo(".intro_title", {opacity:0,y:100},{y:0, opacity:1, duration:3})
    intro.fromTo(".intro_graphics", {opacity:0},{opacity:1, duration:3, delay:-1})
    intro.to(".intro_graphics", {duration: 2, y: offset, delay:-.5});
    intro.to(".intro_title",{y:-400, opacity:0, duration:1},"<")
    intro.to("div.intro div.menu", {duration: 2, y: offset},"<");
    intro.play();
    
    $("#app").hide();
    $(".intro").show();
    $(".register").hide();
    $(".highscore").hide();

    
    // showHighScore();
    
    let frController = new gameController(gameData,$('#app'),0); //Start the gem in the proper div.
    //Handling game finished event
    frController.onFinish = () => { 
      $("div.register").show();
      gsap.fromTo("div.register",{autoAlpha:0},{autoAlpha:1, duration:1, onComplete:function () {
        $('#app').hide();
      }});
    }


    //Start the game
    $("#start").on('click',(e) => {
      $("#app").show();
      gsap.to(".intro",{autoAlpha:0, duration:1, display:"none" });
    })

    //Show the high score
    $("#highscore").on('click',(e) => {
      gsap.to(".intro",{autoAlpha:0, duration:1, display:"none" });
      showHighScore();
      gsap.to(window, {duration: 1, scrollTo: 0});
    })

    //close the high score
    $("#back").on('click',(e) => {
      window.scroll(0,0);
      gsap.to("div.highscore",{autoAlpha:0, duration:.7, display:"none" });
      $('div.intro').show();
      gsap.to("div.intro",{autoAlpha:1, duration:.7 });
      // gsap.to(window, {duration: 0, scrollTo: ".menu"});
    })


    $("#register").on('click',(e) => {

      showLoading();
      
      fetch(gameData.register_url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
          name:  $('input#name')[0].value,
          email: $('input#email')[0].value,
          score: frController.money,
          playtime: frController.playtime,
        }) // body data type must match "Content-Type" header
      }).then(data => {
        if (data.status == 200) {
          setLoadingScreen('success','highscore',true);
        } else {
          console.log('error occured while submitting');
          setLoadingScreen('error','',true);
        }
      });

      
    })


  });

  function showHighScore() {
    $('div.highscore').show();
    gsap.to("div.highscore",{autoAlpha:1, duration:.5});
    showLoading();

    fetch(gameData.highscore_url).then(res => res.json()).then((result) => {
      var target = $('.highscore table tbody').empty();

      result.forEach((item,index) => {
        
        
        $(`<tr>
        <td>${index+1}.</td>
        <td>${item.name}</td>
        <td>$${Number(item.score).toLocaleString()}</td>
        </tr>`).appendTo($('.highscore table tbody'));

        $('.highscore table thead').append('<span>das</span>');

      });

      hideLoading();

    }).catch(err => { 
      //TODO: Add error handling
      console.log('error occured while loading highscore DataCue');
    });
  
  }

  // render loading screen
  function showLoading() {
    $("div.loading").show();
    $('#loading-bar').show();
    $('div.error').hide();
    $('div.success').hide();
    
    $("div.loading").addClass('blocker');
    $("div.success, div.error").hide();
    gsap.to("div.loading",.5,{autoAlpha:.9});
    
    gsap.fromTo('#loading-bar',1.5,{value:0},{value:100});
  }

  //hide loading screen
  function hideLoading() {
    gsap.to("div.loading",.5,{autoAlpha:0, display:"none"});
  }

  //chnage loading screen outcomek
  function setLoadingScreen(type,func,autoclose = false) {
    $("div.loading").removeClass('blocker');
    if (type == 'success') {
      $('div.error').hide();
      $("div.loading").data("next",func)
      gsap.to('#loading-bar',.5,{autoAlpha:0,display:"none",onComplete:function () {
        $('div.success').show();
        gsap.fromTo('div.success',.5,{autoAlpha:0},{autoAlpha:1});

      }});
      
    } else if (type == 'error') {
      $('div.success').hide();
      $("div.loading").data("next",func)
      gsap.to('#loading-bar',.5,{autoAlpha:0,display:"none",onComplete:function () {
        $('div.error').show();
        gsap.fromTo('div.error',.5,{autoAlpha:0},{autoAlpha:1});
      }});
    }

    if (autoclose) { //close automatically
      setTimeout(() => {
        hideLoading(); 
        nextLoadingAction();
      }, 3000);
    }
  }

  function nextLoadingAction() {
    if ($('div.loading').data('next') == 'highscore') { //if we have a next action to do after click process it.
      gsap.to("div.register",{autoAlpha:0, duration:1, display:"none" });
      showHighScore();
    }
  }

  //handle loading screen click -> hide on click
  $('div.loading').on('click',(e) => {
    if (!$("div.loading").hasClass('blocker')) {
      hideLoading(); //if we can close it, closw it with a click
      nextLoadingAction();
    }
  });

});

window.addEventListener('resize', (e)=>{
  let textWrapper = document.querySelector('.text_wrapper');
  const classes = ['nes-container', 'is-rounded', 'is-dark'];
  window.innerWidth>1024 ? textWrapper.classList.add(...classes): textWrapper.classList.remove(...classes);
});
