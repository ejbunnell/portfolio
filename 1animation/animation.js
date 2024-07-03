import * as three from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let width = window.innerWidth * 0.975;
let height = window.innerHeight * 0.8;

const scene = new three.Scene();
scene.background = new three.Color(0x3C3744);
scene.fog = new three.FogExp2(0xB4C5E4, 0.025);
const camera = new three.PerspectiveCamera(75, width / height, 0.1, 1000);


let canvas = document.getElementById("dolly-camera");
const renderer = new three.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(width, height);

const floorGeometry = new three.BoxGeometry(500, 0.1, 125);
const floorTexture = new three.TextureLoader().load("../images/textures/grass.jpg");
floorTexture.wrapS = three.RepeatWrapping;
floorTexture.wrapT = three.RepeatWrapping;
floorTexture.repeat.set(50, 10);
const floor = new three.Mesh(floorGeometry, new three.MeshBasicMaterial({ color: 0x888888, map: floorTexture }));
floor.position.y = -5;
floor.position.z = -40;
scene.add(floor);

for (let i = 0; i < 2; i++) {
    const rail = new three.Mesh(new three.BoxGeometry(1, 0.75, 125), new three.MeshBasicMaterial({ color: 0x6e5b05 }));
    rail.position.y = -4.5;
    rail.position.z = -40;
    rail.position.x = i % 2 === 0 ? -3 : 3;
    scene.add(rail);
}

let doneLoading = false;

const loader = new GLTFLoader();
const offset = { x: 13.75, z: 18.5 };

const numTrees = 65;
let moveCartInterval;
console.log(camera.position.x);
for (let i = 0; i < numTrees; i++) {
    loader.load('../models/realistic_tree.glb', function (tree) {
        tree.scene.position.y = -5;
        tree.scene.position.x = (i % 2 === 0 ? 15 + (Math.random() * 3) : -15 - (Math.random() * 3)) + offset.x;
        tree.scene.position.z = -i * 1.5 + offset.z - 8;
        scene.add(tree.scene);
        if (i + 1 === numTrees) {
            doneLoading = true;
            moveCartInterval = setInterval(moveCart, 30);
        }
    }, undefined, function (error) {
        console.error(error);
        $("#error").show();
    });
}

const light = new three.AmbientLight(0xFFFFFF, 5);
scene.add(light);

const numImages = 10;

let images = [];

// Render images

for (let i = 0; i < numImages; i++) {
    let map = new three.TextureLoader().load(`../images/photos/${i}.JPG`);
    map.colorSpace = three.SRGBColorSpace;
    let material = new three.MeshBasicMaterial({ map: map });
    let geometry = new three.BoxGeometry(13.3333333333, 10, 0.001);
    images[i] = { photo: new three.Mesh(geometry, material), outOfWay: false };
    images[i].photo.rotation.y = i % 2 === 0 ? -Math.PI / 48 : Math.PI / 48;
    images[i].photo.position.x = i % 2 === 0 ? 3 : -3;
    images[i].photo.position.z = -i * 10 - 10;
    images[i].photo.position.y = 1.45;
    scene.add(images[i].photo);
}

const cart = new three.Mesh(new three.BoxGeometry(6, 1.5, 1.5), new three.MeshBasicMaterial({ color: 0x453901 }));
cart.position.y = -3;
cart.position.z = -2.5;
scene.add(cart);

function animate() {
    if (doneLoading) {
        $("#optimise").hide();
        moveClosestPhoto();
        renderer.render(scene, camera);
    }
}

function moveClosestPhoto() {
    const camZ = camera.position.z;
    for (let i = 0; i < numImages; i++) {
        const photoZ = images[i].photo.position.z;
        if ((camZ > photoZ && Math.abs(camZ - photoZ) < 5) || (camZ <= photoZ && Math.abs(camZ - photoZ) < 14)) {
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

renderer.setAnimationLoop(animate);

let lastOppAdd = false;
function cameraShake() {
    if (Math.abs(camera.rotation.z) > 0.1) camera.rotation.z /= 3;
    let shake = Math.random() * 0.03;
    if (lastOppAdd) {
        shake *= - 1;
        lastOppAdd = false;
    }
    else {
        lastOppAdd = true;
    }
    camera.rotation.z += shake;
}

let stage = 0;
function moveCart() {
    if (stage === 0) {
        camera.position.z -= 0.25;
        cart.position.z -= 0.25;
        if (camera.position.z % 0.5 === 0) {
            cameraShake();
        }
        if (camera.position.z <= -102) stage = 1;
    }
    else if (stage === 1) {
        camera.rotation.x -= .1;
        cart.rotation.x -= .1;
        camera.rotation.z = 0;
        cart.position.z += Math.PI / 12;

        camera.position.z -= 0.25;
        cart.position.z -= 0.25;
        camera.position.y -= 0.25;
        cart.position.y -= 0.25;
        if (camera.rotation.x <= -Math.PI / 2) stage = 2;
    }
    else if (stage === 2) {
        camera.position.y -= 0.25;
        cart.position.y -= 0.25;
        if (camera.position.y % 0.5 === 0) {
            splatName((camera.position.y + 4.5) * -2)
        }
        if (camera.position.y < name.length / -2 - 4) stage = 3;
    }
    else if (stage === 3) {
        setTimeout(() => {window.location.href = "../2home/home.html"}, 500);
    }
}


let name = "Elliott Bunnell".split("");
let spacing = 90 / name.length;
let positions = [];
for (let i = 1; i <= name.length; i++) {
    positions.push({x: spacing * i, y: Math.random() * 10 - 5, rot: Math.random() * 45 - 22.5})
}

function splatName(index) {
    $("body").append(`<p class="splat" style="left: ${positions[index].x}%; top: ${positions[index].y}%; transform: rotateZ(${positions[index].rot}deg)">${name[index]}</p>`);
}

$(window).on("resize", function() {
    width = window.innerWidth * 0.975;
    height = window.innerHeight * 0.8;
    camera.aspect = width / height;
    renderer.setSize(width, height);
});

// $(document).on("keydown", function (event) {
//     if (event.key === "ArrowUp") {
//         camera.position.z -= 0.25;
//         cart.position.z -= 0.25;
//         if (camera.position.z % 0.5 === 0)
//             cameraShake();
//     }
//     else if (event.key === "ArrowDown") {
//         camera.position.z += 0.25;
//         cart.position.z += 0.25;
//     }
//     else if (event.key === "ArrowLeft") {
//         camera.position.x -= 1;
//         cart.position.x -= 1;
//     }
//     else if (event.key === "ArrowRight") {
//         camera.position.x += 1;
//         cart.position.x += 1;
//     }
//     else if (event.key === "8") {
//         camera.position.y += 1;
//         cart.position.y += 1;
//     }
//     else if (event.key === "2") {
//         camera.position.y -= 1;
//         cart.position.y -= 1;
//     }
//     else if (event.key === "7") {
//         camera.rotation.x += .1;
//     }
//     else if (event.key === "1") {
//         camera.rotation.x -= .1;
//     }
// })