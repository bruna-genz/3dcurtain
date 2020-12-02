import * as THREE from '../build/three.module.js';

import { FBXLoader } from './jsm/loaders/FBXLoader.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js'

let container;
let camera, scene, renderer, textureLoader, texture;
let object;

const imgLoaderEvent = () => {
  document.querySelector("#image-input").addEventListener("change", updateImage)
}

const init = () => {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff)
  
  // Camera
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 50;

 // Lights
  var light = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(light)
  
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
  hemiLight.position.set( 0, 100, 0 );
  scene.add( hemiLight );

  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
  hemiLight.position.set( 0, -100, 0 );
  scene.add( hemiLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, 2.0, 1000 );
  dirLight.position.set( 0, 200, 100 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = 100;
  dirLight.shadow.camera.left = - 120;
  dirLight.shadow.camera.right = 120;
  scene.add( dirLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, 2.0, 1000 );
  dirLight.position.set( 0, -200, -100 );
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = 100;
  dirLight.shadow.camera.left = - 120;
  dirLight.shadow.camera.right = 120;
  scene.add( dirLight );

  // manager
  const loadModel = () => {

    object.traverse(child => {
      if ( child.isMesh ) {
        child.material.map = texture;
        console.log(child)
      }
    });

    //Curtain
    object.position.x = -5;
    object.position.y = -12;
    
    scene.add( object );
    console.log(object)
  }

  const manager = new THREE.LoadingManager( loadModel );

  // texture
  textureLoader = new THREE.TextureLoader();
  texture = textureLoader.load( 'textures/map2.png' );
  texture.wrapS = THREE.MirroredRepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  texture.repeat.set( 2, 1);

  // model
  const onProgress = ( xhr ) => {
    if ( xhr.lengthComputable ) {
      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
    }
  }

  const onError = () => {
    console.log("error")
  }

  const loader = new FBXLoader( manager );

  // The right models are: shower-curtain.obj and Pillow3d.obj
  loader.load( 'models/fbx/3dmodel-curtain.fbx', ( obj ) => {
    object = obj;
    console.log(object)
  }, onProgress, onError );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  let controls = new OrbitControls(camera, renderer.domElement)
}

const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const updateImage = (e) => {
  const image = URL.createObjectURL(event.target.files[0])
  texture = textureLoader.load( image )
  texture.needsUpdate = true

  texture.wrapS = THREE.MirroredRepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  texture.repeat.set( 2, 2 );
}

init();
animate();
imgLoaderEvent();