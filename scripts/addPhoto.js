import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {doc, setDoc, getDoc, addDoc, collection} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import {ref, uploadString, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

let userID = "";
let photoInformation = {
    description: "",
    date: "",
    film: "",
    camera: "",
}
let lens = "";
let readerResult = undefined;
let grayscaleValue = false;

onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    if (user) {
        userID = user.uid;
        renderInputFields();
    }else{
        alert("An error occured. Please try again later!");
    }
});

const resetPage = () => {
    setTimeout(()=>{
        document.getElementById("add-photo-loading-div-wrappper").style.display = "none";
        window.location.reload();
    }, 3000)
}

const addPhotoInfo = async(url, time) => {
    const photoData = {
        userID: userID,
        timeUploaded: time,
        photoURL: url,
        description: photoInformation["description"] !== "" ? photoInformation["description"] : "Unknown",
        date: photoInformation["date"] !== "" ? photoInformation["date"] : "Unknown",
        film: photoInformation["film"] !== "" ? photoInformation["film"] : "Unknown",
        camera: photoInformation["camera"] !== "" ? photoInformation["camera"] : "Unknown",
        numberOfLikes: 0,
        grayscale: grayscaleValue, 
    }
    
    await setDoc(doc(db, "photoData", time.toString()), photoData);

    resetPage();
}

const uploadPhoto = (file) =>{
    window.scrollTo(0, 0);
    document.getElementById("add-photo-loading-div-wrappper").style.display = "flex";
    const d = new Date();
    const time = d.getTime();
    const storageRef = ref(storage, `/uploadedPictures/${time}`);
    uploadString(storageRef, file, 'data_url').then((snapshot) => {
        getDownloadURL(ref(storageRef))
        .then((url) => {
            addPhotoInfo(url, time);
        }).catch((error) => {
            console.log(error);
        });
    });
}

const handleFilePicker = () =>{
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            readerResult = reader.result;
            document.getElementById("add-photo-preview-image").setAttribute("src", reader.result);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    input.click();
}

const renderInputFields = () => {

    const loadingDivWrapper = document.createElement("div");
    loadingDivWrapper.setAttribute("id", "add-photo-loading-div-wrappper");
    loadingDivWrapper.classList.add("add-photo-loading-div-wrappper");
    loadingDivWrapper.innerHTML = "<span>UPLOADING</span>"
    const loadingDivBar = document.createElement("div");
    loadingDivBar.classList.add("add-photo-loading-div-bar");
    loadingDivBar.addEventListener("click", ()=>{
        const barBackgroundColor = loadingDivBar.style.backgroundColor;
        if(barBackgroundColor == "rgb(217, 83, 79)"){
            loadingDivBar.style.backgroundColor = "#FFAD60";
        }else{
            loadingDivBar.style.backgroundColor = "#D9534F";
        }
    });
    let screenWidth = screen.width;
    let i = 0;
    let direction = "right";
    loadingDivBar.style.left = i+"px";
    const moveBar = () => {
        setTimeout(()=>{
            loadingDivBar.style.left = i+"px";
            if(direction === "right"){
                i++;
            }else{
                i--;
            }
            
            if(i > 450 || i < 0){
                if(direction === "right"){
                    direction = "left";
                }else{
                    direction = "right";
                }
            }
            moveBar();
        }, 3);
    }

    moveBar();
        
    loadingDivWrapper.appendChild(loadingDivBar);
    document.getElementById("main-content").appendChild(loadingDivWrapper);

    const previewImageWrapper = document.createElement("div");
    previewImageWrapper.classList.add("add-photo-image-picker-wrapper");
    previewImageWrapper.addEventListener("click", ()=>{

    });
    const previewImage = document.createElement("img");
    previewImage.setAttribute("id", "add-photo-preview-image");
    previewImage.classList.add("add-photo-preview-image");
    
    const pickImageButton = document.createElement("div");
    pickImageButton.classList.add("add-photo-pick-image-button");

    const pickImageIcon = document.createElement("ion-icon");
    pickImageIcon.setAttribute("id", "pick-image-icon");
    pickImageIcon.setAttribute("name", "add-outline");
    pickImageIcon.addEventListener("click", ()=>{
        handleFilePicker();
    })

    pickImageButton.appendChild(pickImageIcon);
    pickImageButton.addEventListener
    previewImageWrapper.appendChild(pickImageButton);

    const previewImageDescription = document.createElement("div");
    previewImageDescription.classList.add("add-photo-preview-image-description");

    const imageDescription = document.createElement("span");
    previewImageDescription.appendChild(imageDescription);

    const imageDate = document.createElement("span");
    previewImageDescription.appendChild(imageDate);

    const imageCamera = document.createElement("span");
    previewImageDescription.appendChild(imageCamera);

    const imageFilm = document.createElement("span");
    previewImageDescription.appendChild(imageFilm);


    previewImageWrapper.appendChild(previewImage);
    previewImageWrapper.appendChild(previewImageDescription);

    const toggleSwitchWrapper = document.createElement("div");
    toggleSwitchWrapper.innerHTML += `
        <span style="margin-right: 2px;">Grayscale?</span>
    `;
    const toggleSwitchContainer = document.createElement("label");
    const toggleSwitch = document.createElement("input");
    const toggleSwitchText = document.createElement("span");

    toggleSwitchWrapper.classList.add("toggle-switch-wrapper")
    toggleSwitchContainer.classList.add("toggleSwitch");
    toggleSwitchText.classList.add("toggleSlider");
    toggleSwitch.setAttribute("type", "checkbox");
    toggleSwitch.addEventListener("change", ()=>{
        if(toggleSwitch.checked){
            document.getElementById("add-photo-preview-image").style.filter = "grayscale(100%)";
            grayscaleValue = true;
        }else{
            document.getElementById("add-photo-preview-image").style.filter = "none";
            grayscaleValue = false;
        }
    });

    toggleSwitchContainer.appendChild(toggleSwitch);
    toggleSwitchContainer.appendChild(toggleSwitchText);
    toggleSwitchWrapper.appendChild(toggleSwitchContainer);
    document.getElementById("main-content").appendChild(toggleSwitchWrapper);

    document.getElementById("main-content").appendChild(previewImageWrapper);

    Object.keys(photoInformation).forEach(element => {
        
        let allowedCharacters = 15;
        const inputFieldWrapper = document.createElement("div");
        inputFieldWrapper.classList.add("add-photo-wrapper")
        const inputField = document.createElement("input");
        if(element === "date"){
            inputField.setAttribute("type", "date");
            inputField.style.width = "100%";
        }
        const inputFieldText = document.createElement("span");
        inputFieldText.innerText = element.substring(0,1).toUpperCase() + element.substring(1, element.length).toLowerCase();

        inputField.setAttribute("placeholder",
        element === "description" ? "e.g., Summer holiday" :
        element === "film" ? "e.g., Portra 400" :
        element === "camera" ? "e.g., Contax T2" : 
        "");

        if(element !== "date"){
            inputField.addEventListener("keyup", (e)=>{
                if(allowedCharacters > 0 || e.code === "Backspace"){
                    photoInformation[element] = e.target.value;
                    allowedCharacters = 15 - photoInformation[element].length;
                    charactersLeft.innerHTML = `
                        ${allowedCharacters}
                    `;
                    if(element === "description"){
                        imageDescription.innerText = e.target.value;
                    }
                    else if(element === "camera"){
                        imageCamera.innerText = "";
                        imageCamera.innerText = e.target.value;
                        if(photoInformation["film"].length > 0){
                            imageCamera.innerText += " | " + photoInformation["film"];
                        }
                    }
                    else if(element === "film"){
                        imageCamera.innerText = photoInformation["camera"] + " | " + e.target.value;
                    }
                    inputField.value = photoInformation[element];
                }else{
                    inputField.value = photoInformation[element];
                }
            });
            const charactersLeft = document.createElement("div");
            charactersLeft.classList.add("add-photo-characters-left");
            charactersLeft.innerHTML = `
                ${allowedCharacters}
            `;
            inputFieldWrapper.appendChild(charactersLeft);
        }else{
            inputField.addEventListener("change", (e)=>{
                photoInformation[element] = e.target.value;
                imageDate.innerText = e.target.value;
            });
        } 
        
        inputFieldWrapper.appendChild(inputFieldText);
        inputFieldWrapper.appendChild(inputField);

        document.getElementById("main-content").appendChild(inputFieldWrapper);
        if(element === "camera"){
            let charsLeft = 25;
            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.classList.add("checkbox-wrapper")
            const checkboxInput = document.createElement("input");
            checkboxInput.setAttribute("type", "checkbox");
            checkboxInput.addEventListener("change", ()=>{
                const additionalInput = document.createElement("div");
                additionalInput.setAttribute("id", "separate-lens-input");
                additionalInput.innerHTML = `
                    <span>Lens</span>
                `;
                const lensInput = document.createElement("input");
                lensInput.setAttribute("type","text");
                lensInput.setAttribute("placeholder","e.g. Canon 50mm f/1.8");
                additionalInput.appendChild(lensInput);
                const charsLeftLens = document.createElement("span");
                charsLeftLens.setAttribute("id", "chars-left");
                charsLeftLens.innerText = charsLeft;
                additionalInput.appendChild(charsLeftLens);
                additionalInput.addEventListener("keyup", (e)=>{
                    if(charsLeft > 0 || e.code === "Backspace"){
                        lens = e.target.value;
                        charsLeft = 25 - lens.length;
                        charsLeftLens.innerText = charsLeft;
                        lensInput.value = lens;
                    }else{
                        lensInput.value = lens;
                    }
                });
                if(checkboxInput.checked){
                    document.getElementById("main-content").appendChild(additionalInput);
                }else{
                    document.getElementById("separate-lens-input").remove();
                }
            })
            const checkboxText = document.createElement("span");
            checkboxText.innerText = "Separate lens";
            checkboxWrapper.appendChild(checkboxInput);
            checkboxWrapper.appendChild(checkboxText);
            document.getElementById("main-content").appendChild(checkboxWrapper)
        }
    });

    const submitButton = document.createElement("div");
    submitButton.classList.add("add-photo-submit-button");
    submitButton.innerHTML = `
        <span>Submit</span>
    `;
    submitButton.addEventListener("click", ()=>{
        uploadPhoto(readerResult);
        window.scrollTo(0,0);
    });
    document.getElementById("main-content").appendChild(submitButton);
    
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("add-photo-alert");
    alertDiv.innerHTML = `
        If fields are left empty, value <i>Unknown</i> will be written.
    `;
    document.getElementById("main-content").appendChild(alertDiv);
    

    document.getElementById("loading-spinner").style.display = "none";
}