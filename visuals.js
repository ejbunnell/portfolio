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

// Render images

for (let i = 0; i < numImages; i++) {
    let map = new three.TextureLoader().load(`images/photos/${i}.JPG`);
    map.colorSpace = three.SRGBColorSpace;
    let material = new three.MeshBasicMaterial({map: map});
    let geometry = new three.BoxGeometry(13.3333333333, 10, 0.001);
    images[i] = {photo: new three.Mesh( geometry, material), outOfWay: false};
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
    const camZ = camera.position.z;
    for (let i = 0; i < numImages; i++) {
        const photoZ = images[i].photo.position.z;
        if ((camZ > photoZ && Math.abs(camZ - photoZ) < 3) || (camZ <= photoZ && Math.abs(camZ - photoZ) < 14)) {
            if (images[i].outOfWay === false) {
                animatePhotoAway(i);
            }
        }
        else {
            if (images[i].outOfWay === true) {
                animatePhotoBack(i);
            }
        }
    }
}

function animatePhotoAway(photoIndex) {
    const dPI = photoIndex % 2 === 0 ? -Math.PI : Math.PI;
    if (images[photoIndex].photo.rotation.y !== dPI / 48) return;
    images[photoIndex].outOfWay = true;
    const animateId = setInterval(() => {
        images[photoIndex].photo.rotation.y += dPI / 192;
        if (Math.abs(images[photoIndex].photo.rotation.y) + 0.1 >= Math.PI / 2) {
            images[photoIndex].photo.rotation.y = dPI / 2;
            clearInterval(animateId);
        }
    }, 5)
}

function animatePhotoBack(photoIndex) {
    const dPI = photoIndex % 2 === 0 ? -Math.PI : Math.PI;
    if (images[photoIndex].photo.rotation.y !== dPI / 2) return;
    images[photoIndex].outOfWay = false;
    const animateId = setInterval(() => {
        images[photoIndex].photo.rotation.y -= dPI / 192;
        if (Math.abs(images[photoIndex].photo.rotation.y) - 0.1 <= Math.PI / 48) {
            images[photoIndex].photo.rotation.y = dPI / 48;
            clearInterval(animateId);
        }
    }, 5)
}

renderer.setAnimationLoop( animate );

$(document).on("keydown", function(event) {
    if (event.key === "ArrowUp")
        camera.position.z -= 0.25;
    else if (event.key === "ArrowDown")
        camera.position.z += 0.25;
    else if (event.key === "ArrowLeft")
        camera.position.x -= 1;
    else if (event.key === "ArrowRight")
        camera.position.x += 1;
    else if (event.key === "8")
        camera.position.y += 1;
    else if (event.key === "2")
        camera.position.y -= 1;
    else if (event.key === "7")
        camera.rotation.x += .1;
    else if (event.key === "1")
        camera.rotation.x -= .1;
})