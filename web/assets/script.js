window.onscroll = function() {
    var nav = document.getElementById('navId');
    var rightNav = document.getElementById('rightNavId');

    //header image bottom
    var rightNav = document.getElementById('headerImage');
    var offSet = rightNav.offsetTop + rightNav.offsetHeight;

    if ( window.pageYOffset >= offSet ) {
        nav.classList.add("onScrollNav");
        //rightNav.classList.remove("onScrollRightNav");
    } else {
        nav.classList.remove("onScrollNav");
        //rightNav.classList.add("onScrollRightNav");
    }
}