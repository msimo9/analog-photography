import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

let userID = "";
let photoInformation = {
    description: "",
    date: "",
    film: "",
    camera: "",
}
let lens = "";

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

const renderInputFields = () => {

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

    const alertDiv = document.createElement("div");
    alertDiv.classList.add("add-photo-alert");
    alertDiv.innerHTML = `
        If fields are left empty, value <i>Unknown</i> will be written.
    `;
    document.getElementById("main-content").appendChild(alertDiv);

    document.getElementById("loading-spinner").style.display = "none";
}