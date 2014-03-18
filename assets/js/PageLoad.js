(function(window) {

    // page load object
    var PageLoad = window.PageLoad = {
        ajxHandle: null
    };

    //load ajax 
    PageLoad.load = function(page) {
        PageLoad.ajxHandle = $.get("pages/" + page, PageLoad.success);
    };
    //sucess load
    PageLoad.success = function(content) {

        if (FG.currentController != null) {
            // unset everything in the previous controller
            // prevent memory leaks
            FG.currentController.destroy();
        }

        // add content in #page
        FG.$contentLoad.html(content);

        // create new controller
        switch (Navigator.currentPage) {
            case 'home.html':
                FG.currentController = new HomeController();
                break;
            case 'mapa.html':
                FG.currentController = new MapaController();
                break;
            default:
                alert('Nenhum controle encontrado.');
                break;
        }

        // once new controller created, initialize it
        if (FG.currentController != null) {
            FG.currentController.initialize();
        }

//        FG.scrollApp.refresh();
        Transition.hideMenu();
        FG.$content.removeClass(Transition.class);
    };


})(window);