import '../styles/styles.css';
import './common-imports.js';
import Navbar from './navbar.js';

new Navbar().render();

$.getJSON(SEVER_URL + 'api/api.php', function (data) {
    let counter = 0;
    $('#loaderDiv').addClass('hidden');
    $('#galleryDiv').addClass('active');
    data.forEach((element) => {
        if(counter%2 === 0)
            $('#leftColumn').append('<a href="viewer.html?url=' + element.imagePath + '" target="_self"><img src="' + element.thumbPath + '" class="img-raised" /></a>');
        else
            $('#rightColumn').append('<a href="viewer.html?url=' + element.imagePath + '" target="_self"><img src="' + element.thumbPath + '" class="img-raised" /></a>');

        counter++;
    });
}).fail(function () {
    //TODO Error handling
    console.log("error");
});