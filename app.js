let speed = 90;
let scale = 0.7; 
let canvas;
let ctx;

let cat = {
    x: 200,
    y: 300,
    xspeed: 10,
    yspeed: 10,
    img: new Image()
};

(function main(){
    canvas = document.getElementById("bg");
    ctx = canvas.getContext("2d");
    cat.img.src = 'cat.png';
    cat.img.onclick='redir()';

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    pickColor();
    update();
})();

function update() {
    setTimeout(() => {
        //Draw the canvas background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //Draw DVD Logo and his background
        ctx.fillStyle = logoColor;
        //ctx.fillRect(dvd.x, dvd.y, dvd.img.width*scale, dvd.img.height*scale);
        ctx.drawImage(cat.img, cat.x, cat.y, cat.img.width*scale, cat.img.height*scale);
        //Move the logo
        cat.x+=cat.xspeed;
        cat.y+=cat.yspeed;
        //Check for collision 
        checkHitBox();
        update();   
    }, speed)
}

//Check for border collision
function checkHitBox(){
    if(cat.x+cat.img.width*scale >= canvas.width || cat.x <= 0){
        cat.xspeed *= -1;
    }
        
    if(cat.y+cat.img.height*scale >= canvas.height || cat.y <= 0){
        cat.yspeed *= -1;
    }    
}

function redir(){
    window.location = "https://www.google.com";
}

function pickColor(){
    logoColor = 'white';
}