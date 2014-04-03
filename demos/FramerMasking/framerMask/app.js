
// Simple experiment with masking via svg drawn elements

//PSD.text.style.backgroundColor = "red";

//PSD.black.style.clipPath = "url(#clip4)";//"circle(50%, 50%, 30%)";
//PSD.black.style.clipPath = "circle(50%, 50%, 30%)";//"circle(50%, 50%, 30%)";
//PSD.black.style.webkitClipPath = "circle(50%, 50%, 30%)";//"circle(50%, 50%, 30%)";
//PSD.black.style.webkitClipPath = "polygon( 50% 0, 100% 38%, 81% 100%, 19% 100%, 0 38% )";


var maskObj = {radiusPer: 0};

function update(){
    PSD.black.style.webkitClipPath = "circle(50%, 50%, " + maskObj.radiusPer + "%)";
}

function backDown(){
    TweenLite.to(maskObj, 1, {radiusPer:0, onComplete:backUp, onUpdate:update, ease:Expo.easeIn});
}

function backUp(){
    TweenLite.to(maskObj, 1, {radiusPer:50, onComplete:backDown, onUpdate:update, ease:Expo.easeOut});
}

update();
backUp();

//alert("clip: " + PSD.black.style.clipPath);