import {auth, db, storage} from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";

let userID = "";

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
    
}