
function onScrollWheel(e){
    var evt=window.event || e //equalize event object
    var delta=evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta

    // If the change in wheel is positive hide (scroll up), if negative show (scroll down)
    if (delta < 0) {
        footerIn();
    } else if (delta > 0) {
        footerOut();
    }
}

function footerIn(){
    TweenLite.to(PSD.footer,.5, {y:909, ease:Expo.easeOut});
}

function footerOut(){
    TweenLite.to(PSD.footer,.5, {y:1200, ease:Expo.easeOut});
}

// Hide footer to begin with
PSD.footer.y = 1200;

// Add mouse wheel listener
var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

if (document.attachEvent) { //if IE (and Opera depending on user setting)
    document.attachEvent("on"+mousewheelevt, onScrollWheel);
} else if (document.addEventListener) {//WC3 browsers
    document.addEventListener(mousewheelevt, onScrollWheel, false);
}