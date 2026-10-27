const images = document.querySelectorAll(".gallery-grid img");

images.forEach(image => {

    image.addEventListener("click", () => {

        image.classList.toggle("active");

    });

});

window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");

    if(window.scrollY > 50){
        nav.style.background = "#ffffff";
    } else {
        nav.style.background = "#ffffffdd";
    }

});