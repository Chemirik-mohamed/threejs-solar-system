import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Timer } from "three";

// console.log('hello')
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercureTexture = textureLoader.load("/textures/mercurymap.jpg");
const venusTexture = textureLoader.load("/textures/venusmap.jpg");
const earthTexture = textureLoader.load("/textures/earthlights1k.jpg");
const moonTexture = textureLoader.load("/textures/moonmap1k.jpg");

const solarSystem = new THREE.Group();

const sun = new THREE.Mesh(
	new THREE.SphereGeometry(1.5, 32, 32),
	new THREE.MeshBasicMaterial({ map: sunTexture }),
);

const sunLight = new THREE.PointLight(0xffffff, 25, 1000, 1);
sunLight.position.copy(sun.position); // lumière sort du soleil
scene.add(sunLight);

const pointLightHelper = new THREE.PointLightHelper(sunLight, 0.2);
scene.add(pointLightHelper);

const mercure = new THREE.Mesh(
	new THREE.SphereGeometry(1, 16, 16),
	new THREE.MeshStandardMaterial({ map: mercureTexture }),
);

const venus = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshStandardMaterial({ map: venusTexture }),
);

const earth = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshStandardMaterial({ map: earthTexture }),
);

const moon = new THREE.Mesh(
	new THREE.SphereGeometry(0.2, 8, 8),
	new THREE.MeshStandardMaterial({ map: moonTexture }),
);
earth.add(moon);
earth.position.x = 7;
solarSystem.add(earth);

venus.position.x = 5;
solarSystem.add(venus);

mercure.position.x = 2.8;
solarSystem.add(mercure);

sun.position.set(0, 0, 0);
solarSystem.add(sun);

const canvas = document.querySelector("canvas.webgl");

scene.add(solarSystem);

const sizes = {
	width: innerWidth,
	height: innerHeight,
};

const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
);

camera.position.z = 4;

window.addEventListener("resize", () => {
	sizes.width = innerWidth;
	sizes.height = innerHeight;

	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
const control = new OrbitControls(camera, canvas);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const timer = new Timer();

const tick = () => {
	window.requestAnimationFrame(tick);

	timer.update();

	const elapsedTime = timer.getElapsed();

	const angle = elapsedTime / 2;
	mercure.position.x = Math.cos(angle) * 3;
	mercure.position.z = Math.sin(angle) * 3;

	venus.position.x = Math.cos(angle + 0.5) * 5;
	venus.position.z = Math.sin(angle + 0.5) * 5;

	earth.position.x = Math.cos(angle + 1) * 7;
	earth.position.z = Math.sin(angle + 1) * 7;

	earth.rotation.y += 0.01;
	venus.rotation.y += 0.01;
	mercure.rotation.y += 0.01;

	earth.rotation.z += 0.01;
	venus.rotation.z += 0.1;
	mercure.rotation.z += 0.01;

	const moonAngle = elapsedTime;
	moon.position.x = Math.cos(moonAngle) * 1.2;
	moon.position.z = Math.sin(moonAngle) * 1.2;

	control.update();
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.render(scene, camera);
};

tick();
