import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {collection, getDocs, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";

let userID = "";
let sortByOption = "Newest";
let allPhotos = [];
let userData = undefined;
let likedPhotos = [];

onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    renderSortByButton();
    if (user) {
        userID = user.uid;
        renderAddPhotoButton();
        getUserData();
    } else {
    
    }
    getAllPhotos();
});

const getAuthorData = async(authorID) => {
    const docRef = doc(db, "userData", authorID);
    const docSnap = await getDoc(docRef);
    const authorData = docSnap.data();
    return authorData.instagramHandle;
}

const getUserData = async() =>{
    const docRef = doc(db, "userData", userID);
    const docSnap = await getDoc(docRef);
    userData = docSnap.data();
    likedPhotos = userData.likedPhotos;
}

const reportPhoto = (photoID) =>{

}

const deletePhoto = async(photoID) =>{
    await deleteDoc(doc(db, "photoData", photoID.toString()));
    const searchString = "photo-"+photoID;
    document.getElementById(searchString).remove();
}

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

const handleLikePhoto = async(photoID, heartStatus) => {
    const likeRef = doc(db, "photoData", photoID.toString());
    if(heartStatus === "heart"){
        await updateDoc(likeRef, {
            numberOfLikes: increment(1)
        });
    }else if(heartStatus === "heart-outline"){
        await updateDoc(likeRef, {
            numberOfLikes: increment(-1)
        });
    }

    const updateRef = doc(db, "userData", userID);
    if(heartStatus === "heart"){
        await updateDoc(updateRef, {
            likedPhotos: arrayUnion(photoID)
        });
    }else if(heartStatus === "heart-outline"){
        await updateDoc(updateRef, {
            likedPhotos: arrayRemove(photoID)
        });
    }

}

const renderPhotos = () =>{
    const photosContainer = document.createElement("div");
    photosContainer.setAttribute("id", "photos-container");
    photosContainer.classList.add("photos-container");
    allPhotos.forEach((item, index) => {
        const idString = "photo-" + item.timeUploaded;
        const threeDotsContainer = document.createElement("div");
        threeDotsContainer.classList.add("three-dots-container");

        const threeDotsSubmenu = document.createElement("div");
        threeDotsSubmenu.classList.add("three-dots-submenu");
        threeDotsSubmenu.setAttribute("name", "three-dots-submenu");
        const submenuID = "submenu-"+index;
        threeDotsSubmenu.setAttribute("id", submenuID);

        const reportButton = document.createElement("div");
        const deleteButton = document.createElement("div");

        reportButton.innerText = "Report";
        deleteButton.innerText = "Delete";

        reportButton.addEventListener("click", ()=>{reportPhoto(item.timeUploaded)});
        deleteButton.addEventListener("click", ()=>{deletePhoto(item.timeUploaded); threeDotsContainer.remove()});

        threeDotsSubmenu.appendChild(reportButton);
        if(item.userID === userID){
            threeDotsSubmenu.appendChild(deleteButton);
            threeDotsSubmenu.style.bottom = "-60px";
        }else{
            threeDotsSubmenu.style.bottom = "-30px";
        }
       

        const threeDotsIcon = document.createElement("ion-icon");
        threeDotsIcon.setAttribute("name", "ellipsis-horizontal");

        threeDotsIcon.addEventListener("click", ()=>{
            let allSubmenus = document.getElementsByName("three-dots-submenu");
            for(let i=0; i<allSubmenus.length; i++){
                if(allSubmenus[i].getAttribute("id") !== submenuID){
                    allSubmenus[i].style.display = "none";
                }
            }
            if(threeDotsSubmenu.style.display === "none"){
                threeDotsSubmenu.style.display = "flex";
            }else if(threeDotsSubmenu.style.display === "flex"){
                threeDotsSubmenu.style.display = "none";
            }else{
                threeDotsSubmenu.style.display = "flex";
            }
        });

        threeDotsContainer.appendChild(threeDotsSubmenu);
        threeDotsContainer.appendChild(threeDotsIcon);
        photosContainer.appendChild(threeDotsContainer);

        const photoWrapper = document.createElement("div");
        photoWrapper.setAttribute("id", idString);
        photoWrapper.classList.add("photos-photo-wrapper");
        const photo = document.createElement("img");
        const randomNumber = Math.floor(Math.random() * 500 + 200)
        photo.setAttribute("src", `${item.photoURL}`);
        if(item.grayscale){
            photo.style.filter = "grayscale(100%)";
        }
        const photoInfo = document.createElement("div");
        photoInfo.classList.add("photo-information");
        photoInfo.innerHTML = `
            <span>${item.description}</span>
            <span>${item.date}</span>
            <span>${item.camera} | ${item.film}</span>
        `;
        const instagramHandleText = document.createElement("span");

        getAuthorData(item.userID).then(val => {
                if(val !== ""){
                    instagramHandleText.addEventListener("click", ()=>{
                        window.open(`https://www.instagram.com/${val}/`, '_blank').focus();
                    });
                    instagramHandleText.addEventListener("mouseover", ()=>{
                        instagramHandleText.style.cursor = "pointer";
                    });
                    instagramHandleText.innerText = "@" + val;
                    photoInfo.appendChild(instagramHandleText);
                }
        });

        const heartIconWrapper = document.createElement("div");
        heartIconWrapper.classList.add("heart-icon-wrapper");
        const heartIcon = document.createElement("ion-icon");
        if(userID !== "" && likedPhotos.includes(item.timeUploaded)){
            heartIcon.setAttribute("name","heart");
        }else{
            heartIcon.setAttribute("name","heart-outline");
        }

        const numberOfLikes = document.createElement("span");
        numberOfLikes.innerText = item.numberOfLikes;
        
        heartIcon.addEventListener("click", ()=>{
            if(heartIcon.getAttribute("name") == "heart-outline"){
                heartIcon.setAttribute("name","heart");
                numberOfLikes.innerText = parseInt(numberOfLikes.innerText) + 1;
            }else{
                heartIcon.setAttribute("name","heart-outline");
                numberOfLikes.innerText = parseInt(numberOfLikes.innerText) - 1;
            }
            handleLikePhoto(item.timeUploaded, heartIcon.getAttribute("name"));
        });
        
        heartIconWrapper.appendChild(numberOfLikes);
        heartIconWrapper.appendChild(heartIcon);

        photoWrapper.appendChild(photo);
        photoWrapper.appendChild(photoInfo);
        photoWrapper.appendChild(heartIconWrapper);
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