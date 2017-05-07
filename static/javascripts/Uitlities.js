// Utitlity Functions
function UtilityFunctions() {
    this.stringToTitleCase = function (inputString) {
        inputString = inputString.toLowerCase().split(' ');
        for (var i = 0; i < inputString.length; i++) {
            inputString[i] = inputString[i].charAt(0).toUpperCase() + inputString[i].slice(1);
        }
        return inputString.join(' ');
    };

    this.displayError = function (error) {
        console.log(error);
        document.getElementById('alertModalContent').innerText = 'Error Occurred';
        $('#alertModal').modal('open');
    };

    this.showMessages = function (message) {
        document.getElementById('alertModalContent').innerText = message;
        $('#alertModal').modal('open');
    };
}


// Initializations
function initFlowy(className) {
    $('.' + className).slick({
        infinite: true,
        sildesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true
    });
}