$(function() {
    let menuPos = 0;

    $("#menu-icons").hide();

    $("#menu-icon").click( function() {
        if (menuPos === 0) {
            $("#menu-icons").fadeIn(1500);
            $("#navbar").removeClass("hide");
            $("#navbar").addClass("show");
            $("#menu-icon").attr("src", "../images/menuDark.png");
            menuPos = 1;
        }
        else if (menuPos === 1) {
            $("#menu-icons").fadeOut(100);
            $("#navbar").removeClass("show");
            $("#navbar").addClass("hide");
            $("#menu-icon").attr("src", "../images/menuLight.png");
            menuPos = 0;
        }
    });

    let cursorPos = {x: 0, y: 0};
    $(document).on("mousemove", function(event) {
        cursorPos.x = event.clientX - 30;
        cursorPos.y = event.clientY - 150;
    });

    let moveNavbarLoop;
    let moveNavbarDelay;
    $("#navbar").on("mousedown", function() {
        moveNavbarDelay = setTimeout(() => {
            moveNavbarLoop = setInterval(() => {
                $("#navbar").css("transform", `translateX(${(cursorPos.x / window.innerWidth) * 100}vw) translateY(${(cursorPos.y / window.innerHeight) * 100}vh)`)
            }, 5);
        }, 1000);
    });

    $(document).on("mouseup", function() {
        clearInterval(moveNavbarLoop);
        moveNavbarLoop = null;
        clearTimeout(moveNavbarDelay);
    });

    $("#home").click(() => {
        window.location.href = "../2home/home.html";
    });

    $("#profile").click(() => {
        window.location.href = "../3profile/profile.html";
    });

    $("#projects").click(() => {
        window.location.href = "../4projects/projects.html";
    });

    $("#contact").click(() => {
        window.location.href = "../5contact/contact.html";
    });

    $("#sources").click(() => {
        window.location.href = "../6sources/sources.html";
    })

});