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

    let modal = document.querySelector(".modal")
    // let closeBtn = document.querySelector(".close-btn")

    // // closeBtn.onclick = function(){
    // //     modal.style.display = "none"
    // // }
    window.onclick = function(e){
        console.log("function hit");
        if(e.target == modal){
            console.log("inner funtion hit");
            modal.style.display = "none"
        }
    }

}

function openModal(){
    let modal = document.querySelector(".modal")

    modal.style.display = "block"
}