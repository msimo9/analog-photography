import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

let userID = "";

onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    if (user) {
        userID = user.uid;
        console.log("user is logged in!");
        renderAddPhotoButton();
    } else {
        renderPhotos();
        console.log("user is not logged in!");
    }
});

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


        photoWrapper.appendChild(photo);
        photoWrapper.appendChild(photoInfo);
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