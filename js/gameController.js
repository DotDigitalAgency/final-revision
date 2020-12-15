import $ from "cash-dom";
import images from '../img/*.*';
import { gsap} from 'gsap';
import TextPlugin from 'gsap/TextPlugin';



export default class GameController {
    
    constructor(datasource,root,startProgress = 0) {
        
        gsap.registerPlugin(TextPlugin);
        // gsap.ticker.fps(12); //Set fps to five for retro feelings
        //append status bar template to dom
        var tmp_statusbar = root.append(`<section class="statusbar">
                                            <ul></ul>
                                            <div>
                                                <img src="${images.coin.gif}" alt="Money icon" class="coin">
                                                <span class="money"></span>
                                            </div>
                                        </section>`); 
          
        //generate progress icons
        datasource.screens.forEach((item) => {
            tmp_statusbar.find('ul').append(`<li><img src="${images.section.svg}" /></li>`);
        });

        
        this._statusbar = tmp_statusbar; //create class variable for statusbar
        this._total = datasource.screens.length; //get total number of screens
        this._app = root; //store the root element
        this._ds = datasource; //make config class wide
        this._gameTime;

        this.money = datasource.base_value; //set money
        this.progress = startProgress; //set progress;

        //lets add the first screen
        this._animateIntro(this.addScreen(datasource.screens[this.progress]));
    }

    //Set progress bar to proper value
    //TODO: Optimize
    set progress(data) {
        for (let i = 0; i<= this._total; i++) {
            if (i < data) { //past
                this._statusbar.find('li').eq(i).addClass('done');
                this._statusbar.find('li').eq(i).removeClass('active');
            } else if (i == data) {
                this._statusbar.find('li').eq(i).addClass('active');
            } else {
                this._statusbar.find('li').eq(i).removeClass('done active');
            }
        }
        this._progress = data;
    }

    //return progress
    get progress() {
        return this._progress;
    }

    //set money
    set money(data) {
        this._money = data;
        this._statusbar.find('span.money').text(data);
    }

    //return money
    get money() {
        return this._money;
    }

    get playtime() {
        if (!this._gameTime) { return 0}
        var time = new Date();
        return time - this._gameTime;
    }
    
    //Generate new screen
    addScreen(data,visible = true) {

        var cover_filename = data.image.split('.');
        cover_filename = images[cover_filename[0]][cover_filename[1]];

       

        var icon_filename;
        if (data.outcome === undefined) {
            icon_filename = ''   
        } else {
            icon_filename = data.icon.split('.');
            icon_filename = images[icon_filename[0]][icon_filename[1]];

            if (data.outcome == "endgame") {
                data.title = `$${Number(this.money).toLocaleString()}`
            }
        }
        
        //preload next image
        // console.log();

        // var img=new Image();
        // img.src=url;



        
        var screen_template = `<section class="screen ${data.outcome}">
                                    <img class="cover" src="${cover_filename}" alt="">
                                    <div class='text_wrapper'>
                                        <h1> <img src="${icon_filename}" /><span>${data.title}</span></h1>
                                        <div class="text">${data.text}</div>
                                        <div class="gradient"></div>
                                        <div class="buttons"></div>
                                    </div>
                                </section>`;

        var scr_dom = $(screen_template).appendTo(this._app);
        
        if (!visible) { scr_dom.hide();  } //hide if visible set to false

        data.actions.forEach((element,index) => {
            var tmp_button = $(`<button class="nes-btn" data-id="${this.progress}/${index}" data-type="${element.action}">${element.title}</button>`).appendTo(scr_dom.find('div.buttons'));
            tmp_button.on('click',(e) => {
                this._handleClick(e);
            })
        });

        return scr_dom;
    }

    //handle button click
    _handleClick(e) {
        var idstr = e.srcElement.dataset.id.split('/')
        var action = e.srcElement.dataset.type

        //start the timer if it's not yet started
        if(!this._gametime) { this._gameTime = new Date(); }

        switch(action) {
            case "next" : this._nextScreen(e.srcElement); break;
            case "render_outcome" : this._renderOutcome(e.srcElement,this._ds.screens[idstr[0]].actions[idstr[1]]); break;
            case "highscore" : this.onFinish(); break;
        }
    }

    //advance to next screen
    _nextScreen(current) {
        this.progress += 1;
        var active_screen = $(current).closest('section');;
        var next_data = this._ds.screens[this.progress];
        var next_screen = this.addScreen(next_data,true);

        this._animateTransition(active_screen,next_screen);
        
    }   

    //Animate  transition between two screen
    _animateTransition(current,next) {
        this._animateOutro(current);
        this._animateIntro(next);

    }

    _animateIntro(screen) {
        // gsap.to(screen, {autoAlpha: 0, duration: 0.5});
        screen.css('opacity',0).show();


         //coun up number if needed
        if (screen.hasClass('positive') || screen.hasClass('negative')) { //it's a positive screen
            
            // screen.find('h1 span').text('$0')
            var txt = screen.find('h1 span').text()
            var num_value = parseInt(txt.slice(0, 1) + txt.slice(2)); 
            
            var y_offset = (num_value < 0) ? -30 : 30 
            // y_offset = 0;
  
            var Cont={val:0};
            gsap.to(Cont,1,{val:num_value,roundProps:"val",onUpdate:function(){
                    var render_str = (num_value < 0) ? `-$${Math.abs(Cont.val)}` : `+$${Cont.val}`;
                    screen.find('h1 span').text(render_str);
            //     // document.getElementById("counter").innerHTML=Cont.val
            }});

            // gsap.from(screen.find('h1'),{ autoAlpha:0, y:y_offset, duration: 1})
        } 

       gsap.fromTo(screen, {autoAlpha: 0}, {autoAlpha:1, duration: 1}); //fade in
        
        var content = screen.find('.typewriter').text(); //animte with the typewriter effect
        if (content) {
            gsap.to(screen.find('.typewriter').empty(), {duration: 1, text: {value:content,padSpace:false},  ease: "none"});
        }
    }

    _animateOutro(screen) {
        
        gsap.to(screen, {autoAlpha: 0, duration: 1, onComplete:() => {
            screen.detach();
        }});
    }

    //Show outcome screen
    _renderOutcome(current,screenData) {
        var move_value = Math.round(this.money * screenData.value);
        var title_str;
        
        this.money += move_value;    //Update money value

        //restructure data to make it addscreen compatible
        var active_screen = $(current).closest('section');
        screenData.title = (move_value < 0) ? `-$${Math.abs(move_value)}` : `+$${move_value}`;
        
        screenData.actions = [{
            "title": screenData.cta, 
            "action":"next"
        }];

        
        var next_screen = this.addScreen(screenData,false); //generate outcome screen
        this._animateTransition(active_screen,next_screen); //transition to new screen

    }

    onFinish() {

    }
    
}