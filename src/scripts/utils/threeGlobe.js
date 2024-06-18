import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import atmosphereVertexShader from "../../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../../shaders/atmosphereFragment.glsl";

export function initGlobe() {
  const canvas = document.getElementById("globe-canvas");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // create stars
  function createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const startMaterial = new THREE.PointsMaterial({ color: 0xffffff });

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
    const stars = new THREE.Points(starGeometry, startMaterial);
    scene.add(stars);
  }

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

  createStarField();

  const group = new THREE.Group();
  group.add(sphere);
  scene.add(group);

  camera.position.z = 13;

  function createBox({ lat, lng, country, city, flag }) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.8),
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
      duration: 1.4,
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

  const mouse = {
    x: undefined,
    y: undefined,
  };

  const raycaster = new THREE.Raycaster();

  const popupEl = document.getElementById("popupEl");
  const cityName = document.getElementById("city-name");
  const countryFlag = document.getElementById("country-flag");

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    group.rotation.y += 0.002;

    // if (mouse.x) {
    //   gsap.to(group.rotation, {
    //     x: -mouse.y * 0.1,
    //     y: mouse.x * 1.5,
    //     duration: 1,
    //   });
    // }

    raycaster.setFromCamera(mouse, camera);

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
      console.log(countryFlag.innerHTML);
    }

    renderer.render(scene, camera);
  }

  animate();

  addEventListener("mousemove", (event) => {
    mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    gsap.set(popupEl, {
      x: event.clientX,
      y: event.clientY,
    });
  });

  window.addEventListener("resize", () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}
