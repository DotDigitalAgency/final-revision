import $ from "cash-dom";
import images from '../img/*.*';
import { gsap} from 'gsap';
import TextPlugin from 'gsap/TextPlugin';



export default class GameController {
    
    constructor(datasource,root) {
        
        gsap.registerPlugin(TextPlugin);
        //append status bar template to dom
        var tmp_statusbar = root.append(`<section class="statusbar">
                                            <ul></ul>
                                            <div>
                                                <img src="${images.coin.gif}" alt="Money icon" class="coin">
                                                <span></span>
                                            </div>
                                        </section>`); 
          
        //generate progress icons
        datasource.screens.forEach((item) => {
            tmp_statusbar.find('ul').append(`<li></li>`);
        });

        
        this._statusbar = tmp_statusbar; //create class variable for statusbar
        this._total = datasource.screens.length; //get total number of screens
        this._app = root; //store the root element
        this._ds = datasource; //make config class wide

        this.money = datasource.base_value; //set money
        this.progress = 0; //set progress;

        //lets add the first screen
        this.addScreen(datasource.screens.[this.progress]);
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
        this._statusbar.find('span').text(data);
    }

    //return money
    get money() {
        return this._money;
    }
    
    //Generate new screen
    addScreen(data,visible = true) {
        console.log(data);        

        var cover_filename = data.image.split('.');
        cover_filename = images[cover_filename[0]][cover_filename[1]];

        var icon_filename;
        if (data.outcome === undefined) {
            icon_filename = ''    
        } else {
            icon_filename = data.icon.split('.');
            icon_filename = images[icon_filename[0]][icon_filename[1]];
        }
        
        var screen_template = `<section class="screen ${data.outcome}">
                                    <img class="cover" src="${cover_filename}" alt="">
                                    <h1> <img src="${icon_filename}" /> ${data.title}</h1>
                                    <div class="text">${data.text}</div>
                                    <div class="gradient"></div>
                                    <div class="buttons"></div>
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
        switch(action) {
            case "next" : this._nextScreen(e.srcElement); break;
            case "render_outcome" : this._renderOutcome(e.srcElement,this._ds.screens[idstr[0]].actions[idstr[1]]); break;
        }
    }

    //advance to next screen
    _nextScreen(current) {
        this.progress += 1;
        var active_screen = $(current).parent().parent();
        var next_data = this._ds.screens.[this.progress];
        var next_screen = this.addScreen(next_data,true);

        this._animateTransition(active_screen,next_screen);
        
    }   

    //Animate  transition between two screen
    _animateTransition(current,next) {
        //Animate transition
        gsap.ticker.fps(5); //reduce fps for old school animation
        this._animateOutro(current);
        
        next.show();
        this._animateIntro(next);
        // var content = next.find('div.text').text();
        // console.log(content)
        // gsap.to(next.find('div.text').empty(), {duration: 1, text: content, ease: "none"});
        // console.log(text);
        // current.hide();
        // next.show();

    }

    _animateIntro(screen) {
        // gsap.to(screen, {autoAlpha: 0, duration: 0.5});
        gsap.fromTo(screen, {autoAlpha: 0}, {autoAlpha:1, duration: 0.5});
    }

    _animateOutro(screen) {
        gsap.to(screen, {autoAlpha: 0, duration: 0.5});
    }

    //Show outcome screen
    _renderOutcome(current,screenData) {
        var move_value = this.money * screenData.value;
        var title_str;
        
       

        this.money += move_value//Update money value

        //restructure data to make it addscreen compatible
        var active_screen = $(current).parent().parent();
        screenData.title = (move_value < 0) ? `-$${Math.abs(move_value)}` : `+$${move_value}`;
        
        screenData.actions = [{
            "title": screenData.cta, 
            "action":"next"
        }];

        
        var next_screen = this.addScreen(screenData,false); //generate outcome screen
        this._animateTransition(active_screen,next_screen); //transition to new screen

    }
    
}