$(function() {
    $("#animation").click(() => {
        window.location.href = "../1animation/animation.html";
    });

    $("#play-button").click(() => {
        window.location.href = "../1animation/animation.html";
    });


    $("#animation").on("mouseenter", () => {
        $("#animation").animate({
            opacity: 0.5,
            width: "55%"
        }, 500);
        $("#play-button").animate({
            opacity: 1,
        }, 250);
    })

    $("#animation").on("mouseleave", () => {
        $("#animation").animate({
            opacity: 1,
            width: "60%"
        }, 500);
        $("#play-button").animate({
            opacity: 0.75,
        }, 250);
    })
});