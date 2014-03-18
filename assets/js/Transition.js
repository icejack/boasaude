(function(window) {

    // transition object
    var Transition = window.Transition = {
        control: false,
        class: 'transitionApp1'
    };

    /* effects, for select one effect, create or view effects in transitions.css */
    Transition.animations = {
        
        'mapa.html': 'transitionApp1'
    }
    //get current class for page
    Transition.getClassAnimation = function(page) {
         if (Transition.animations.hasOwnProperty(page)) {
            return Transition.animations[page];
       }
       return Transition.class;
    
    }

    //start transition
    Transition.start = function() {
        FG.$content.addClass(Transition.class);
    };
    //end transition with listener
    Transition.End = function() {
        if (Transition.control) {
            PageLoad.load(Navigator.currentPage);

            Transition.control = false;
            if (!Navigator.isBack) {
                //window.History.pushState(null, null, Navigator.currentPage);
            }
        }
    };
    //toggleMenu
    Transition.toggleMenu = function() {
        if (!FG.$menu.hasClass("transitionMenuAppStart")) {
            Transition.showMenu();
        } else {
            Transition.hideMenu();
        }
    };
    //hide panel menu
    Transition.hideMenu = function() {
        FG.$menu.removeClass("transitionMenuAppStart");
        FG.$content.removeClass("transitionContentAppStart");
        FG.$headerApp.removeClass("transitionContentAppStart");
    };
    //show panel menu
    Transition.showMenu = function() {
        FG.$menu.addClass("transitionMenuAppStart");
        FG.$content.addClass("transitionContentAppStart");
        FG.$headerApp.addClass("transitionContentAppStart");
    };

})(window);