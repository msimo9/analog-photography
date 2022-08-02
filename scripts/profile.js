import { onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import {doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import {ref, uploadString, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";
import {auth, db, storage} from './firebase.js';


onAuthStateChanged(auth, (user) => {
    document.getElementById("main-content").innerHTML = "";
    document.getElementById("loading-spinner").style.display = "flex";
    if (user) {
        const userID = user.uid;
        console.log("user is logged in!");
        getUserData(userID);
    } else {
        renderUserInputs();
        console.log("user is not logged in!");
    }
});

//VARIABLES

let operation = "log_in";
let userData = {
    email: "",
    password: "",
    passwordRepeat: "",
    instagramHandle: "",
}

const saveUserData = async(userID) => {
    const data = {
        userID: userID,
        email: userData.email,
        instagramHandle: userData.instagramHandle
    }
    await setDoc(doc(db, "userData", userID), data);
    console.log("sign up successful!");
}

const handleUserSignUp = async() => {
    if(userData.password === userData.passwordRepeat){
        createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userID = user.uid;
            saveUserData(userID);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, ": ", errorMessage);
        });
    }
}

const handleUserLogIn = () => {
    signInWithEmailAndPassword(auth, userData.email, userData.password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userID = user.uid;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, ": ", errorMessage);
    });
}

const getProfileImageURL = (userID) => {
    const storageRef = ref(storage, `/profilePhotos/${userID}`);
    getDownloadURL(ref(storageRef))
    .then((url) => {
        document.getElementById("profile-photo").setAttribute("src", url);
    }).catch((error) => {
        console.log(error);
        document.getElementById("profile-photo").setAttribute("src", "../icons/default-user-photo.jpeg");
    });
    document.getElementById("rotating-div").style.animation = "none";
}

const getUserData = async(userID) => {
    const docRef = doc(db, "userData", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const storageRef = ref(storage, `/profilePhotos/${userID}`);
        getDownloadURL(ref(storageRef))
        .then((url) => {
            renderProfileInfo(docSnap.data(), userID, url);
        }).catch(()=>{
            renderProfileInfo(docSnap.data(), userID, "../icons/default-user-photo.jpeg");
        });
    } else {
        console.log("No such document!");
    }
}

const renderProfileInfo = (user, userID, imageURL) => {

    //FUNCTIONS
    const uploadPhoto = (file) =>{
        const storageRef = ref(storage, `/profilePhotos/${userID}`);
        uploadString(storageRef, file, 'data_url').then((snapshot) => {
            console.log('Uploaded a data_url string!');
            getProfileImageURL(userID);
        });
    }

    const handleFilePicker = () =>{
        document.getElementById("rotating-div").style.animation = "spin 4s linear infinite";
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                uploadPhoto(reader.result);
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }
        input.click();
    }


    //PROFILE PHOTO
    const profilePhotoWrapper = document.createElement("div");
    profilePhotoWrapper.setAttribute("id", "profile-photo-wrapper");
    profilePhotoWrapper.classList.add("profile-photo-wrapper");
    profilePhotoWrapper.innerHTML = `
        <img id="profile-photo" src="${imageURL}" class="" />
        <div id="rotating-div"></div>
    `;
    profilePhotoWrapper.addEventListener("click", ()=>{handleFilePicker()})


    //PROFILE DATA

    const profileData = document.createElement("div");
    profileData.classList.add("profile-data-wrapper");
    profileData.innerHTML = `
        <div>
            <ion-icon name="mail-outline"></ion-icon>
            ${user.email}
        </div>
        ${
            user.instagramHandle !== "" ?
            `<div>
                <ion-icon name="logo-instagram"></ion-icon>
                ${user.instagramHandle}
            </div>`
            :
            ``
        }
    `;

    //EDIT INFO


    //SIGN OUT BUTTON

    const actionButton1 = document.createElement("div");
    actionButton1.classList.add("profile-fields-action-button");
    actionButton1.addEventListener("click", ()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
          
    });
    actionButton1.innerText = "Edit info";

    const actionButton2 = document.createElement("div");
    actionButton2.classList.add("profile-fields-action-button");
    actionButton2.addEventListener("click", ()=>{
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
          
    });
    actionButton2.innerText = "Sign out!";

    //MAIN CONTENT INIT
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";


    document.getElementById("loading-spinner").style.display = "none";
    //APPENDING TO MAIN CONTENT
    mainContent.appendChild(profilePhotoWrapper);
    mainContent.appendChild(profileData);
    mainContent.appendChild(actionButton1);
    mainContent.appendChild(actionButton2);

}

const renderUserInputs = () => {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";
    const formContainer = document.createElement("div");
    const titleContainer = document.createElement("div");
    const fieldsContainer = document.createElement("div");

    formContainer.classList.add("profile-form-container");
    titleContainer.classList.add("profile-title-container");
    fieldsContainer.classList.add("profile-fields-container");

    const formTitle = document.createElement("h1");
    formTitle.innerText = operation === "log_in" ? "LOG IN" : "SIGN UP";
    titleContainer.appendChild(formTitle);
    formContainer.appendChild(titleContainer);
    

    Object.keys(userData).forEach((element, index) => {
        if(operation === "log_in" && index < 2 || operation === "sign_up"){
            const inputWrapper = document.createElement("div");
            const inputField = document.createElement("input");
            if(element.toLowerCase() === "password" || element.toLowerCase() === "passwordrepeat"){
                inputField.setAttribute("type", "password");
            }else{
                inputField.setAttribute("type", "text");
            }
            inputField.addEventListener("keyup", (e)=>{
                userData[element] = e.target.value;
            })

            const inputText = document.createElement("span");

            inputWrapper.classList.add("profile-input-field-wrapper");
            inputField.classList.add("profile-input-field");
            inputText.classList.add("profile-input-field-text");

            inputText.innerText =
                index === 0 ? "Username"
                : index === 1 ? "Password"
                : index === 2 ? "Repeat password"
                : "Instagram handle"
            ;
            inputWrapper.appendChild(inputText);

            if(element.toLowerCase() === "instagramhandle"){
                const instagramHandleContainer = document.createElement("div");
                instagramHandleContainer.classList.add("instagram-handle-container");
                const atSymbol = document.createElement("span");
                atSymbol.classList.add("profile-input-at-symbol");
                atSymbol.innerText = "@";
                atSymbol.style.fontWeight = "600";
                instagramHandleContainer.appendChild(atSymbol);
                inputField.style.paddingLeft = "10px";
                instagramHandleContainer.appendChild(inputField);
                inputWrapper.appendChild(instagramHandleContainer);
            }else{
                inputWrapper.appendChild(inputField);
            }

            

            fieldsContainer.appendChild(inputWrapper);

            if(operation === "log_in" && index === 1
                ||
                operation === "sign_up" && index === 3
            ){

                const actionButton = document.createElement("div");
                actionButton.classList.add("profile-fields-action-button");
                actionButton.addEventListener("click", ()=>{
                    operation === "log_in" ? handleUserLogIn() : handleUserSignUp();
                });
                actionButton.innerText = "Submit";
                fieldsContainer.appendChild(actionButton);

                const changeOperation = document.createElement("div");
                changeOperation.innerHTML = operation === "log_in" ? `
                    Not a member yet? <span>Sign up</span>!
                ` : `
                    Already have an account? <span>Log in</span>!
                `;
                changeOperation.classList.add("change-auth-operation");
                changeOperation.addEventListener("click", ()=>{
                    operation = operation === "log_in" ? "sign_up" : "log_in";
                    mainContent.innerHTML = "";
                    renderUserInputs();
                })
                fieldsContainer.appendChild(changeOperation);
            }
        }
        formContainer.appendChild(fieldsContainer);
        document.getElementById("loading-spinner").style.display = "none";
        mainContent.appendChild(formContainer);
    });

}

