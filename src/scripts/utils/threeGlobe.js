import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import atmosphereVertexShader from "../../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../../shaders/atmosphereFragment.glsl";

export function initGlobe() {
  const canvas = document.getElementById("globe-canvas");

  const scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(
    75,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // create stars
  function createStarTexture() {
    const size = 50;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    // Draw a circular gradient
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.fill();

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10, // Adjust the size as needed
      map: createStarTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending, // For a glowing effect
      depthWrite: false,
    });

    const starVertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  }

  createStarField();

  // create sphere
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

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
  );

  atmosphere.scale.set(1.4, 1.4, 1.4);

  scene.add(atmosphere);

  const group = new THREE.Group();
  group.add(sphere);
  scene.add(group);

  camera.position.z = 13;

  function createBox({ lat, lng, country, city, flag }) {
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

    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.lookAt(new THREE.Vector3(0, 0, 0));

    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));

    group.add(box);

    gsap.to(box.scale, {
      z: 0.1,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "linear",
      delay: Math.random(),
    });

    box.country = country;
    box.city = city;
    box.flag = flag;
  }

  async function getCities() {
    try {
      const res = await fetch("../assets/cities.json");
      const data = await res.json();
      for (const key in data) {
        createBox({
          lat: data[key].lat,
          lng: data[key].lng,
          country: data[key].country,
          city: data[key].city,
          flag: data[key].flag,
        });
      }
    } catch (error) {
      console.error("Failed to fetch cities", error, error.statusText);
    }
  }

  getCities();

  sphere.rotation.y = -Math.PI / 2;
  group.rotation.offset = {
    x: 0,
    y: 0,
  };

  const mouse = {
    x: undefined,
    y: undefined,
    down: false,
    xPrev: undefined,
    yPrev: undefined,
  };

  const raycaster = new THREE.Raycaster();

  const popupEl = document.getElementById("popupEl");
  const cityName = document.getElementById("city-name");
  const countryFlag = document.getElementById("country-flag");

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    raycaster.setFromCamera(mouse, camera);
    group.rotation.y += 0.0025;
    const intersects = raycaster.intersectObjects(
      group.children.filter((mesh) => {
        return mesh.geometry.type === "BoxGeometry";
      })
    );

    group.children.forEach((mesh) => {
      mesh.material.opacity = 0.4;
    });

    gsap.set(popupEl, {
      display: "none",
    });

    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material.opacity = 1;

      gsap.set(popupEl, {
        display: "block",
      });

      cityName.innerHTML = intersects[i].object.city;
      countryFlag.innerHTML = intersects[i].object.flag;
    }

    renderer.render(scene, camera);
  }

  animate();

  canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
    mouse.down = true;
    mouse.xPrev = clientX;
    mouse.yPrev = clientY;
  });
  addEventListener("mouseup", () => {
    mouse.down = false;
  });

  addEventListener("mousemove", (event) => {
    mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    gsap.set(popupEl, {
      x: event.clientX,
      y: event.clientY,
    });

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
  });

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const handleResize = debounce(() => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }, 100);

  window.addEventListener("resize", handleResize);
}
