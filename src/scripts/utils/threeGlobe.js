import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import atmosphereVertexShader from "../../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../../shaders/atmosphereFragment.glsl";

// ===== GLOBAL VARIABLES =====
let scene, camera, renderer, sphere, atmosphere, group, raycaster, canvas;
let mouse = {
  x: undefined,
  y: undefined,
  down: false,
  xPrev: undefined,
  yPrev: undefined,
};

// ===== SCENE SETUP FUNCTIONS =====
function createScene() {
  return new THREE.Scene();
}

function createCamera() {
  return new THREE.PerspectiveCamera(
    75,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    1000
  );
}

function createRenderer() {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xebfaff);
  return renderer;
}

function createGlobe() {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load(
            "../assets/images/earth-uv.jpg"
          ),
        },
      },
    })
  );

  sphere.rotation.y = -Math.PI / 2;
  return sphere;
}

function createAtmosphere() {
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(4.8, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.NormalBlending,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );

  atmosphere.scale.set(1.3, 1.3, 1.3);
  return atmosphere;
}

function createGroup() {
  const group = new THREE.Group();
  group.rotation.offset = { x: 0, y: 0 };
  return group;
}

// ===== CITY MARKER FUNCTIONS =====
function createCityMarker({ lat, lng, country, city, flag }) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.8),
    new THREE.MeshBasicMaterial({
      color: 0x90d7ac,
      opacity: 0.4,
      transparent: true,
    })
  );

  const latitude = (lat / 180) * Math.PI;
  const longitude = (lng / 180) * Math.PI;
  const radius = 5;

  const x = radius * Math.cos(latitude) * Math.sin(longitude);
  const y = radius * Math.sin(latitude);
  const z = radius * Math.cos(latitude) * Math.cos(longitude);

  box.position.set(x, y, z);
  box.lookAt(new THREE.Vector3(0, 0, 0));
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));

  Object.assign(box, { country, city, flag });

  animateMarkerPulse(box);
  return box;
}

function animateMarkerPulse(box) {
  gsap.to(box.scale, {
    z: 0.1,
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: "linear",
    delay: Math.random(),
  });
}

// ===== DATA FUNCTIONS =====
async function fetchCitiesData() {
  try {
    const res = await fetch("../assets/cities.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return {};
  }
}

async function populateCities(group) {
  const data = await fetchCitiesData();
  for (const key in data) {
    const marker = createCityMarker(data[key]);
    group.add(marker);
  }
}

// ===== RAYCASTING & INTERACTION FUNCTIONS =====
function setupRaycaster() {
  return new THREE.Raycaster();
}

function handleIntersections() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    group.children.filter((mesh) => mesh.geometry.type === "BoxGeometry")
  );

  group.children.forEach((mesh) => {
    if (mesh.geometry.type === "BoxGeometry") {
      mesh.material.opacity = 0.4;
    }
  });

  const popupEl = document.getElementById("popupEl");
  gsap.set(popupEl, { display: "none" });

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    intersected.material.opacity = 1;

    showCityPopup(intersected.city, intersected.flag);
  }
}

function showCityPopup(cityName, countryFlag) {
  const popupEl = document.getElementById("popupEl");
  const cityNameEl = document.getElementById("city-name");
  const countryFlagEl = document.getElementById("country-flag");

  cityNameEl.textContent = cityName;
  countryFlagEl.textContent = countryFlag;

  gsap.set(popupEl, { display: "block" });
}

// ===== EVENT HANDLER FUNCTIONS =====
function setupMouseHandlers() {
  canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
}

function handleMouseDown(event) {
  mouse.down = true;
  mouse.xPrev = event.clientX;
  mouse.yPrev = event.clientY;
}

function handleMouseUp() {
  mouse.down = false;
}

function handleMouseMove(event) {
  mouse.x =
    ((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  updatePopupPosition(event);
  handleDragRotation(event);
}

function updatePopupPosition(event) {
  const popupEl = document.getElementById("popupEl");
  gsap.set(popupEl, {
    x: event.clientX,
    y: event.clientY,
  });
}

function handleDragRotation(event) {
  if (mouse.down) {
    event.preventDefault();

    const deltaX = event.clientX - mouse.xPrev;
    const deltaY = event.clientY - mouse.yPrev;

    group.rotation.offset.x += deltaY * 0.001;
    group.rotation.offset.y += deltaX * 0.005;

    mouse.xPrev = event.clientX;
    mouse.yPrev = event.clientY;

    gsap.to(group.rotation, {
      x: group.rotation.offset.x,
      y: group.rotation.offset.y,
      duration: 2,
    });
  }
}

// ===== ANIMATION & RENDERING FUNCTIONS =====
function animate() {
  requestAnimationFrame(animate);

  group.rotation.y += 0.0025;

  handleIntersections();

  renderer.render(scene, camera);
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function handleResize() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  const aspectRatio = width / height;

  renderer.setSize(width, height);
  camera.aspect = aspectRatio;
  adjustCameraForScreenSize();
  camera.updateProjectionMatrix();
}

function setupResizeHandler() {
  const debouncedResize = debounce(handleResize, 100);
  window.addEventListener("resize", debouncedResize);
}

function adjustCameraForScreenSize() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  const aspectRatio = width / height;

  let cameraDistance = 13;

  if (height > 1300) {
    cameraDistance = 24;
  } else if (aspectRatio < 0.8) {
    cameraDistance = 18;
  } else if (aspectRatio > 2.0) {
    cameraDistance = 11;
  } else if (width < 768) {
    cameraDistance = 10;
  }

  camera.position.z = cameraDistance;
  camera.updateProjectionMatrix();
}

// ===== MAIN INITIALIZATION FUNCTION =====
export function initGlobe() {
  canvas = document.getElementById("globe-canvas");
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();

  sphere = createGlobe();
  atmosphere = createAtmosphere();
  group = createGroup();

  scene.add(atmosphere);
  group.add(sphere);
  scene.add(group);

  camera.position.z = 13;

  adjustCameraForScreenSize();

  raycaster = setupRaycaster();

  populateCities(group);

  setupMouseHandlers();
  setupResizeHandler();

  animate();
}
