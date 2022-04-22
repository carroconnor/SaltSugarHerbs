window.onscroll = function() {
    var nav = document.getElementById('navId');

    //header image bottom
    var rightNav = document.getElementById('headerContainer');
    var offSet = rightNav.offsetTop + rightNav.offsetHeight;

    if ( window.pageYOffset >= offSet ) {
        nav.classList.add("onScrollNav");
    } else {
        nav.classList.remove("onScrollNav");
    }
}

window.onload = function(){

    let modal = document.querySelector(".modal");
    let slideShow = document.querySelector(".slideShowModal");

    window.onclick = function(e){
        if(e.target == slideShow){
            slideShow.style.display = "none";
        }
        else if(e.target == modal){
            modal.style.display = "none";
        }
    }
}

function scrollTo(elementId){
    console.log(elementId);
    document.getElementById(elementId).scrollIntoView(true);
}

function closeModal(){
    let modal = document.querySelector(".modal");
    modal.style.display = "none";
}

function openModal(){
    let modal = document.querySelector(".modal");

    modal.style.display = "block";
}

function openSlideShow(){
    let modal = document.querySelector(".slideShowModal");
    modal.style.display = "block";

    var slideIndex = 1;
    showSlides(slideIndex);
}

function closeSlideShow(){
    let modal = document.querySelector(".slideShowModal");
    modal.style.display = "none";
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    let modal = document.querySelector(".slideShowModal");
    modal.style.display = "block";

    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("gallerySlides");

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex-1].style.display = "block";
}