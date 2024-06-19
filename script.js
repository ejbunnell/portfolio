$(function() {

    let menuPos = 0;

    $("#menu-icon").click( function() {
        if (menuPos === 0) {
            $("#menu-icons").css("display", "block");
            $("#navbar").css("background-color", "#28242D");
            $("#menu-icon").attr("src", "images/menuDark.png");
            menuPos = 1;
        }
        else if (menuPos === 1) {
            $("#menu-icons").css("display", "none");
            $("#navbar").css("background-color", "#3C3744");
            $("#menu-icon").attr("src", "images/menuLight.png");
            menuPos = 0;
        }
    });

    // $("#profile").click(function() {
    //     console.log($("h1").)
    // })

});