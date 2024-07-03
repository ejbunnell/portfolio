$(function() {
    emailjs.init({
        publicKey: "j4SZx1lNSK6n6qv6H",
    });
    document.getElementById("contact-form").addEventListener("submit", function (event) {
        event.preventDefault();
        emailjs.sendForm('contact_service', 'contact_form', this)
            .then(() => {
                $("#name").val("");
                $("#email").val("");
                $("#message").val("");
                alert("Your message was succesfully sent!");
            }, (error) => {
                console.log(error);
            });
    });
});