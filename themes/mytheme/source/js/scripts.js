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

// window.addEventListener("load", event => {
//     const mainimg = document.getElementById('mainimg');
//     if (mainimg) {
//         load = mainimg.complete;
//         if (load) {
//             console.log("main img is ready");
//         }
//     }
// });

// function isHomePage() {
//     mainimg = document.getElementById('mainimg');
//     if (mainimg) {
//         return true;
//     } else {
//         return false;
//     }
// }

async function loading(){
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            const loader = document.getElementById("loading-container");
            loader.className = "fadeout"; // fade out the loading page
            resolve("loaded.");
        },1000); // show loading page 1s at least
    })
};

function fetchMotto() {
    jinrishici.load(function(result) {
    const mottoElement = document.querySelector("#motto")

    if (!mottoElement) return

    let text = result.data.content

    // print effect
    if (text.charAt(text.length - 1) === '。') {
        text = text.substr(0, text.length - 1);
    }
    let i = 0;
    let timer = setInterval( () => {
        if (i >= text.length) {
            clearInterval(timer);
        }
        mottoElement.innerText = (text.slice(0, i++));
    }, 100);
  });
};

(function () {
    loading().then(
        () => { fetchMotto(); }
    );
})();