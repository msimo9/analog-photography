import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {collection, getDocs} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

let userID = "";
let sortByOption = "Newest";
let allPhotos = [];

onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    renderSortByButton();
    if (user) {
        userID = user.uid;
        renderAddPhotoButton();
    } else {
    
    }
    getAllPhotos();
});

const sortByNewest = () => {
    allPhotos.sort((a, b)=>{
        if(a.timeUploaded > b.timeUploaded){
            return -1;
        }
        if(a.timeUploaded < b.timeUploaded){
            return 1;
        }
        return 0;
    });
    rerenderPage();
}

const sortByOldest = () => {
    allPhotos.sort((a, b)=>{
        if(a.timeUploaded < b.timeUploaded){
            return -1;
        }
        if(a.timeUploaded > b.timeUploaded){
            return 1;
        }
        return 0;
    });
    rerenderPage();
}

const sortByPopularity = () => {
    allPhotos.sort((a, b)=>{
        if(a.numberOfLikes > b.numberOfLikes){
            return -1;
        }
        if(a.numberOfLikes < b.numberOfLikes){
            return 1;
        }
        return 0;
    });
    rerenderPage();
}

const getAllPhotos = async() => {
    const querySnapshot = await getDocs(collection(db, "photoData"));
    querySnapshot.forEach((doc) => {
        allPhotos.push(doc.data());
    });
    sortByNewest();
    //renderPhotos();
}

const rerenderPage = () => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    renderSortByButton();
    if(userID !== ""){
        renderAddPhotoButton();
    }else{
        renderPhotos();
    }
}

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
    const popularityButton = document.createElement("div");
        popularityButton.innerText = "Popularity";
        popularityButton.addEventListener("click", ()=>{
            sortByOption = "Popular";
            sortByPopularity();
        });
    const oldestButton = document.createElement("div");
        oldestButton.innerText = "Oldest";
        oldestButton.addEventListener("click", ()=>{
            sortByOption = "Oldest";
            sortByOldest();
        });
    const newestButton = document.createElement("div");
        newestButton.innerText = "Newest";
        newestButton.addEventListener("click", ()=>{
            sortByOption = "Newest";
            sortByNewest();
        });
    /*switch(sortByOption){
        case "Newest":
            newestButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
            break;
        case "Oldest":
            oldestButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
            break;
        case "Popular":
            popularityButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
            break;
        default: break;
    }
    */
   if(sortByOption === "Newest"){
        newestButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
   }else if(sortByOption === "Oldest"){
        oldestButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
   }else{
        popularityButton.innerHTML += '<ion-icon name="checkmark-outline"></ion-icon>';
   }
    sortByDropdown.appendChild(popularityButton);
    sortByDropdown.appendChild(oldestButton);
    sortByDropdown.appendChild(newestButton);

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
    photosContainer.setAttribute("id", "photos-container");
    photosContainer.classList.add("photos-container");
    allPhotos.forEach((item) => {
        const photoWrapper = document.createElement("div");
        photoWrapper.classList.add("photos-photo-wrapper");
        const photo = document.createElement("img");
        const randomNumber = Math.floor(Math.random() * 500 + 200)
        photo.setAttribute("src", `${item.photoURL}`);
        const photoInfo = document.createElement("div");
        photoInfo.innerHTML = `
            <span>${item.description}</span>
            <span>${item.date}</span>
            <span>${item.camera} | ${item.film}</span>
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
    });

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