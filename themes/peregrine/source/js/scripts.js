// global variables
let body;
let moonsun;
let mainimg;

// do it when DOM is ready. It doesn't mean images are ready.
document.addEventListener("DOMContentLoaded", this.readDarkLightModeCookie)

function prepareElements () {
    body = document.getElementsByTagName("body")[0];
    moonsun = document.getElementById("moon-sun");
}
function toggleDarkLightMode () {
    // toggle class "dark" for body
    body.classList.toggle("dark")

    // change icon accordingly
    moonsun.children[0].classList.toggle("fa-moon");
    moonsun.children[0].classList.toggle("fa-sun");
}
function readDarkLightModeCookie() {
    prepareElements();
    const isDarkMode = window.localStorage.getItem("phhp-theme") == "dark";
    if (isDarkMode) {
        toggleDarkLightMode();
    }
};

function switchDarkLightMode() {
    toggleDarkLightMode();
    // set localstorage
    if (body.classList.contains("dark")) {
        window.localStorage.setItem('phhp-theme', 'dark')
    } else {
        window.localStorage.setItem('phhp-theme', 'light')
    }
}