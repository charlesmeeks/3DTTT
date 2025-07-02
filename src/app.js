import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GameState, Player } from './game.js';

let scene, camera, renderer, controls;
let cells = [];
const gs = new GameState();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hudTurn = document.getElementById('current-player');
const hudCoords = document.getElementById('coords');
let hovered = null;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4,4,4);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x202020);
    document.body.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Build 3x3x3 grid lines (hollow cube)
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
    const grid = new THREE.Group();
    const step = 1;
    for (let i = 0; i <= 3; i++) {
        for (let j = 0; j <= 3; j++) {
            const geometry1 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, i*step, j*step),
                new THREE.Vector3(3*step, i*step, j*step)
            ]);
            grid.add(new THREE.Line(geometry1, gridMaterial));

            const geometry2 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i*step, 0, j*step),
                new THREE.Vector3(i*step, 3*step, j*step)
            ]);
            grid.add(new THREE.Line(geometry2, gridMaterial));

            const geometry3 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i*step, j*step, 0),
                new THREE.Vector3(i*step, j*step, 3*step)
            ]);
            grid.add(new THREE.Line(geometry3, gridMaterial));
        }
    }
    scene.add(grid);

    // Create invisible cubes for each cell
    const cubeGeo = new THREE.BoxGeometry(0.9,0.9,0.9);
    for(let z=0; z<3; z++) {
        for(let y=0; y<3; y++) {
            for(let x=0; x<3; x++) {
                if (x===1 && y===1 && z===1) continue; // skip center
                const material = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent:true, opacity:0.25 });
                const cube = new THREE.Mesh(cubeGeo, material);
                cube.position.set(x+0.5, y+0.5, z+0.5);
                cube.userData.coord = {x,y,z};
                scene.add(cube);
                cells.push(cube);
            }
        }
    }

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);

    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cells);
    if (intersects.length > 0) {
        const cell = intersects[0].object;
        const {x,y,z} = cell.userData.coord;
        if (gs.makeMove(x,y,z)) {
            cell.material = new THREE.MeshLambertMaterial({ color: gs.get(x,y,z) === Player.RED ? 0xff0000 : 0x0000ff, transparent:true, opacity:0.8 });
            cell.userData.filled = true;
            const next = gs.current === Player.RED ? 'Red' : 'Blue';
            hudTurn.textContent = next;
            const winner = gs.checkWin();
            if (winner) {
                setTimeout(()=>alert(`${winner === Player.RED ? 'Red' : 'Blue'} wins!`), 10);
                hudTurn.textContent = `${winner === Player.RED ? 'Red' : 'Blue'} wins!`;
            }
        }
    }
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(cells);
    if (intersects.length > 0) {
        const cell = intersects[0].object;
        if (hovered && hovered !== cell) {
            hovered.material.opacity = hovered.userData.filled ? 0.8 : 0.25;
        }
        hovered = cell;
        cell.material.opacity = 0.5;
        const {x,y,z} = cell.userData.coord;
        hudCoords.textContent = `Cell: ${x},${y},${z}`;
    } else {
        if (hovered) {
            hovered.material.opacity = hovered.userData.filled ? 0.8 : 0.25;
            hovered = null;
        }
        hudCoords.textContent = '';
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
