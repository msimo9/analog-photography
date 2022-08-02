import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

let userID = "";

onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    renderSortByButton();
    if (user) {
        userID = user.uid;
        console.log("user is logged in!");
        renderAddPhotoButton();
    } else {
        renderPhotos();
        console.log("user is not logged in!");
    }
});

const renderSortByButton = () => {
    const sortByContainer = document.createElement("div");
    sortByContainer.classList.add("photos-sort-by-container");

    const sortByButton = document.createElement("div");
    sortByButton.classList.add("sort-by-button");
    const sortByIcon = document.createElement("ion-icon");
    sortByIcon.setAttribute("name", "caret-down-outline");
    sortByButton.innerHTML = `
        <span> Sort by </span>
    `;
    sortByButton.appendChild(sortByIcon);

    const sortByDropdown = document.createElement("div");
    sortByDropdown.classList.add("sort-by-dropdown");
    sortByDropdown.innerHTML = `
        <div>Popularity</div>
        <div>Oldest</div>
        <div>Newest</div>
    `;

    sortByButton.addEventListener("click", ()=>{
        if(sortByIcon.getAttribute("name") == "caret-down-outline"){
            sortByIcon.setAttribute("name", "caret-up-outline");
            sortByDropdown.style.display = "flex";
        }else{
            sortByIcon.setAttribute("name", "caret-down-outline");
            sortByDropdown.style.display = "none";
        }
    });
    
    
    sortByContainer.appendChild(sortByButton);
    sortByContainer.appendChild(sortByDropdown);
    document.getElementById("main-content").appendChild(sortByContainer);
}

const renderPhotos = () =>{

    const photosContainer = document.createElement("div");
    photosContainer.classList.add("photos-container");
    for(let i = 0; i < 10; i++){
        const photoWrapper = document.createElement("div");
        photoWrapper.classList.add("photos-photo-wrapper");
        const photo = document.createElement("img");
        const randomNumber = Math.floor(Math.random() * 500 + 200)
        photo.setAttribute("src", `https://picsum.photos/${randomNumber}/300?grayscale`);
        const photoInfo = document.createElement("div");
        photoInfo.innerHTML = `
            <span>Summer holiday, 22. 7. 2022</span>
            <span>Contax T2 | Portra 400</span>
            <span>@matjazsimonic</span>
        `;  

        const heartIcon = document.createElement("ion-icon");
        heartIcon.setAttribute("name","heart-outline");
        heartIcon.addEventListener("click", ()=>{
            if(heartIcon.getAttribute("name") == "heart-outline"){
                heartIcon.setAttribute("name","heart");
            }else{
                heartIcon.setAttribute("name","heart-outline");
            }
        })

        photoWrapper.appendChild(photo);
        photoWrapper.appendChild(photoInfo);
        photoWrapper.appendChild(heartIcon);
        photosContainer.appendChild(photoWrapper);
    }

    document.getElementById("loading-spinner").style.display = "none";
    document.getElementById("main-content").appendChild(photosContainer);
}

const renderAddPhotoButton = () => {
    const addButton = document.createElement("div");
    addButton.classList.add("add-photo-button");
    addButton.addEventListener("click", ()=>{
        window.location = "./addPhoto.html";
    });
    addButton.innerHTML = `
        <div>
            <ion-icon name="add-outline"></ion-icon>
        </div>
    `;
    document.getElementById("main-content").appendChild(addButton);
    renderPhotos();
}