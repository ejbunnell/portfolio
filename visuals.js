import * as three from "three";

const width = window.innerWidth * 0.8;
const height = 400;

const scene = new three.Scene();
scene.background = new three.Color(0x3C3744);
// scene.fog = new three.FogExp2(0xB4C5E4, 0.025);
const camera = new three.PerspectiveCamera( 75, width / height, 0.1, 1000 );


let canvas = document.getElementById("dolly-camera");
const renderer = new three.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( width, height );

const geometry = new three.BoxGeometry( 100, 0.1, 100 );
const material = new three.MeshBasicMaterial( { color: 0x000000 } );
const floor = new three.Mesh( geometry, material );
floor.position.y = -5;
floor.position.z = -30;
scene.add( floor );

const numImages = 10;

let images = [];

for (let i = 0; i < numImages; i++) {
    let map = new three.TextureLoader().load(`images/photos/${i}.JPG`);
    map.colorSpace = three.SRGBColorSpace;
    let material = new three.MeshBasicMaterial( { map: map} );
    let geometry = new three.BoxGeometry(13.3333333333, 10, 0.001);
    images[i] = new three.Mesh( geometry, material );
    images[i].rotation.y = i % 2 === 0 ? -Math.PI / 12 : Math.PI / 12;
    images[i].position.x = i % 2 === 0 ? 7.5 : -7.5;
    images[i].position.z = -i * 10 - 10;
    scene.add(images[i]);
}

function animate() {
	renderer.render( scene, camera );
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