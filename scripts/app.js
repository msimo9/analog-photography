const mainContent = document.getElementById("main-content");
const elementsContainer = document.createElement("div");

for(let i=0; i<3; i++){
    const elementWrapper = document.createElement("div");
    const elementPicture = document.createElement("img");
    const elementTitle = document.createElement("span");

    elementWrapper.classList.add("first-page-element-wrapper");
    elementWrapper.addEventListener("click", ()=>{
        window.location = i === 0 ? "../pages/photos.html" : i === 1 ? "../pages/profile.html" : "../pages/about.html";
    });

    elementPicture.setAttribute("src", "../icons/directory_closed_cool-0.png");

    elementPicture.addEventListener("mouseenter", ()=>{
        elementPicture.setAttribute("src", "../icons/directory_open_cool-0.png");
    });
    elementPicture.addEventListener("mouseleave", ()=>{
        elementPicture.setAttribute("src", "../icons/directory_closed_cool-0.png");
    });

    elementTitle.innerText = i === 0 ? "Photos" : i === 1 ? "Profile" : "About";

    elementWrapper.appendChild(elementPicture);
    elementWrapper.appendChild(elementTitle);
    elementsContainer.appendChild(elementWrapper);
}

mainContent.appendChild(elementsContainer);