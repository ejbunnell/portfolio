import * as THREE from "three";

const width = window.innerWidth * 0.8;
const height = 400;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

const fs = require("fs");

// const directoryPath = '/path/to/your/directory';

// // Use fs.readdirSync to read the contents of the directory synchronously
// const fileList = fs.readdirSync(directoryPath);

// console.log('Files and folders in the directory:', fileList);

var map = new THREE.TextureLoader().load( "images/photos/12 elk 1.JPG" );
var material = new THREE.MeshBasicMaterial( { map: map, color: 0xffffff } );
var geometry = new THREE.BoxGeometry(10, 10, 0.1);
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.rotation.y = -0.9;
camera.position.z = 5;
cube.position.x = 10;

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

$(document).on("keydown", function(event) {
    if (event.key === "ArrowUp")
        camera.position.z += 1;
    else if (event.key === "ArrowDown")
        camera.position.z -= 1;
})