import * as THREE from "three";

const width = window.innerWidth * 0.8;
const height = 400;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

let canvas = document.getElementById("dolleyCanvas");
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( width, height );

document.body.appendChild( renderer.domElement );

const numImages = 10;

let images = [];

for (let i = 0; i < numImages; i++) {
    let map = new THREE.TextureLoader().load(`images/photos/${i}.JPG`);
    map.colorSpace = THREE.SRGBColorSpace;
    let material = new THREE.MeshBasicMaterial( { map: map} );
    let geometry = new THREE.BoxGeometry(13.3333333333, 10, 0.001);
    images[i] = new THREE.Mesh( geometry, material );
    images[i].rotation.y = i % 2 === 0 ? -Math.PI / 12 : Math.PI / 12;
    images[i].position.x = i % 2 === 0 ? 15 : -15;
    images[i].position.z = -i * 10 - 10;
    scene.add(images[i]);
}

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

$(document).on("keydown", function(event) {
    if (event.key === "ArrowUp")
        camera.position.z -= 1;
    else if (event.key === "ArrowDown")
        camera.position.z += 1;
    else if (event.key === "ArrowLeft")
        camera.position.x -= 1;
    else if (event.key === "ArrowRight")
        camera.position.x += 1;
})