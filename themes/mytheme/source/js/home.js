
async function loading(){
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            const loader = document.getElementById("loading-container");
            loader.className = "fadeout"; // fade out the loading page
            resolve("loaded!");
        }, 1000); // show loading page 1s at least
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
    }, 200);
  });
};


// the main image must be ready when load-event is triggered.
window.addEventListener("load", event => {
    loading().then(
        () => { fetchMotto(); }
    );
});