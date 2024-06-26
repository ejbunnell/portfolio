import * as three from "three";

const width = window.innerWidth * 0.8;
const height = 400;

const scene = new three.Scene();
scene.background = new three.Color(0x3C3744);
scene.fog = new three.FogExp2(0xB4C5E4, 0.025);
const camera = new three.PerspectiveCamera( 75, width / height, 0.1, 1000 );


let canvas = document.getElementById("dolly-camera");
const renderer = new three.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( width, height );

const geometry = new three.BoxGeometry( 100, 0.1, 500 );
const material = new three.MeshBasicMaterial( { color: 0x000000 } );
const floor = new three.Mesh( geometry, material );
floor.position.y = -5;
floor.position.z = -40;
scene.add( floor );

const numImages = 10;

let images = [];

for (let i = 0; i < numImages; i++) {
    let map = new three.TextureLoader().load(`images/photos/${i}.JPG`);
    map.colorSpace = three.SRGBColorSpace;
    let material = new three.MeshBasicMaterial({map: map});
    let geometry = new three.BoxGeometry(13.3333333333, 10, 0.001);
    images[i] = {photo: new three.Mesh( geometry, material), outOfWay: false, animateId : null};
    images[i].photo.rotation.y = i % 2 === 0 ? -Math.PI / 48 : Math.PI / 48;
    images[i].photo.position.x = i % 2 === 0 ? 3 : -3;
    images[i].photo.position.z = -i * 10 - 10;
    scene.add(images[i].photo);
}

function animate() {
    moveClosestPhoto();
	renderer.render(scene, camera);
}

function moveClosestPhoto() {
    // let closestPhotoIndex = Math.round((camera.position.z + 10) / -10);
    // if (closestPhotoIndex < 0) closestPhotoIndex = 0;
    // else if (closestPhotoIndex > numImages - 1) closestPhotoIndex = numImages - 1;

    // let dist = Math.abs(camera.position.z - images[closestPhotoIndex].photo.position.z);
    // if (images[closestPhotoIndex].outOfWay === false) {
    //     if (dist < 3) {
    //         images[closestPhotoIndex].outOfWay = true;
    //         animatePhotoAway(closestPhotoIndex);
    //     }
    // }
    // else {
    //     if (dist < 5) {
    //         images[closestPhotoIndex].outOfWay = false;
    //         animatePhotoBack(closestPhotoIndex);
    //     }
    // }
    
    for (let i = 0; i < numImages; i++) {
        if (Math.abs(Math.abs(camera.position.z)- Math.abs(images[i].photo.position.z)) < 8) {
            if (images[i].outOfWay === false) {
                console.log(`Beginning of photo ${i} away`);
                animatePhotoAway(i);
            }
        }
        else {
            if (images[i].outOfWay === true) {
                console.log(`Beginning of photo ${i} back`);
                animatePhotoBack(i);
            }
        }
    }
}

function animatePhotoAway(photoIndex) {
    
    const dPI = photoIndex % 2 === 0 ? -Math.PI : Math.PI;
    images[photoIndex].animateId = setInterval(() => {
        images[photoIndex].photo.rotation.y += dPI / 48;
        if (Math.abs(images[photoIndex].photo.rotation.y) + 0.1 >= Math.PI / 2) {
            images[photoIndex].outOfWay = true;
            console.log(`End of photo ${photoIndex} away`);
            images[photoIndex].photo.rotation.y = dPI / 2;
            clearInterval(images[photoIndex].animateId);
            images[photoIndex].animateId = null;
        }
    }, 35)
}

function animatePhotoBack(photoIndex) {
    const dPI = photoIndex % 2 === 0 ? -Math.PI : Math.PI;
    images[photoIndex].animateId = setInterval(() => {
        images[photoIndex].photo.rotation.y -= dPI / 48;
        if (Math.abs(images[photoIndex].photo.rotation.y) - 0.1 <= Math.PI / 48) {
            images[photoIndex].outOfWay = false;
            console.log(`End of photo ${photoIndex} back`);
            images[photoIndex].photo.rotation.y = dPI / 48;
            clearInterval(images[photoIndex].animateId);
            images[photoIndex].animateId = null;
        }
    }, 35)
}

renderer.setAnimationLoop( animate );

$(document).on("keydown", function(event) {
    if (event.key === "ArrowUp")
        camera.position.z -= .25;
    else if (event.key === "ArrowDown")
        camera.position.z += 1;
    else if (event.key === "ArrowLeft")
        camera.position.x -= 1;
    else if (event.key === "ArrowRight")
        camera.position.x += 1;
    else if (event.key === "8")
        camera.position.y += 1;
    else if (event.key === "2")
        camera.position.y -= 1;
})