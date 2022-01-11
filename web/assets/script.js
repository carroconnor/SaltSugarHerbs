window.onscroll = function() {
    var nav = document.getElementById('navId');
    var rightNav = document.getElementById('rightNavId');

    //header image bottom
    var rightNav = document.getElementById('headerImage');
    var offSet = rightNav.offsetTop + rightNav.offsetHeight;

    if ( window.pageYOffset >= offSet ) {
        nav.classList.add("onScrollNav");
    } else {
        nav.classList.remove("onScrollNav");
    }
}

window.onload = function(){

    let modal = document.querySelector(".modal");
    let slideShow = document.querySelector(".slideShowModal")

    window.onclick = function(e){
        if(e.target == slideShow){
            slideShow.style.display = "none"
        }
        else if(e.target == modal){
            modal.style.display = "none"
        }
    }
}

function openModal(){
    let modal = document.querySelector(".modal")

    modal.style.display = "block"
}

function openSlideShow(){
    console.log("slide show open");
    let modal = document.querySelector(".slideShowModal")

    modal.style.display = "block"

    var slideIndex = 1;
    showSlides(slideIndex);
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    let modal = document.querySelector(".slideShowModal")

    modal.style.display = "block"
    showSlides(slideIndex = n);
}

function showSlides(n) {
    console.log(n);
    var i;
    var slides = document.getElementsByClassName("gallerySlides");
    // var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    // for (i = 0; i < dots.length; i++) {
    //     dots[i].className = dots[i].className.replace(" active", "");
    // }
    slides[slideIndex-1].style.display = "block";
    // dots[slideIndex-1].className += " active";
}

function findIndex(n) {
    console.log(n);
    var res = n*2;
    if(n % 2 !== 0){
        res = res -1;
    }
    return res; 
}