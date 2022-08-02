const pageTitle = document.getElementById("title").innerText;

const title = document.createElement("h1");
title.innerText = pageTitle.toUpperCase();

const header = document.getElementById("header");
header.appendChild(title);
console.log("title: ", pageTitle);

const backArrow = document.createElement("ion-icon");
backArrow.setAttribute("name", "arrow-back-outline");
backArrow.addEventListener("click", ()=>{
    if(pageTitle !== "Add photo"){
        window.location = "../index.html";
    }else if(pageTitle === "Add photo"){
        window.location = "../pages/photos.html";
    }
})

if(pageTitle.toUpperCase() !== "THROUGH THE LENS") header.appendChild(backArrow);

const line1 = document.createElement("div");
line1.style.borderBottom = "2px solid #FFEEAD";
line1.style.width = "100%";
line1.style.transition = "all 500ms linear"
line1.addEventListener("mouseenter", ()=>{
    line1.style.borderBottom = "2px solid #96CEB4";
});
line1.addEventListener("mouseleave", ()=>{
    line1.style.borderBottom = "2px solid #FFEEAD";
});


const line2 = document.createElement("div");
line2.style.borderBottom = "2px solid #D9534F";
line2.style.width = "100%";
line2.addEventListener("mouseenter", ()=>{
    line2.style.borderBottom = "2px solid #96CEB4";
});
line2.addEventListener("mouseleave", ()=>{
    line2.style.borderBottom = "2px solid #D9534F";
});

const line3 = document.createElement("div");
line3.style.borderBottom = "2px solid #FFAD60";
line3.style.width = "100%";
line3.addEventListener("mouseenter", ()=>{
    line3.style.borderBottom = "2px solid #96CEB4";
});
line3.addEventListener("mouseleave", ()=>{
    line3.style.borderBottom = "2px solid #FFAD60";
});

header.appendChild(line1);
header.appendChild(line2);
header.appendChild(line3);