import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import atmosphereVertexShader from "../../shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "../../shaders/atmosphereFragment.glsl";

const STAR_COUNT = 1000;
const SPHERE_RADIUS = 5;
const CAMERA_POSITION_Z = 13;
const STAR_FIELD_SIZE = 2000;
const BOX_GEOMETRY_SIZE = 0.18;
const DEBOUNCE_WAIT = 100;

class Globe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.offsetWidth / this.canvas.offsetHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.group = new THREE.Group();
    this.mouse = {
      x: undefined,
      y: undefined,
      down: false,
      xPrev: undefined,
      yPrev: undefined,
    };
    this.raycaster = new THREE.Raycaster();
    this.popupEl = document.getElementById("popupEl");
    this.cityName = document.getElementById("city-name");
    this.countryFlag = document.getElementById("country-flag");

    this.init();
  }

  init() {
    this.setupRenderer();
    this.createStarField();
    this.createSphere();
    this.createAtmosphere();
    this.loadCities();
    this.setupEventListeners();
    this.animate();
  }

  setupRenderer() {
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.position.z = CAMERA_POSITION_Z;
  }

  createStarField() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const x = (Math.random() - 0.5) * STAR_FIELD_SIZE;
      const y = (Math.random() - 0.5) * STAR_FIELD_SIZE;
      const z = -Math.random() * STAR_FIELD_SIZE;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  createSphere() {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(SPHERE_RADIUS, 50, 50),
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

    this.group.add(sphere);
    this.scene.add(this.group);
  }

  createAtmosphere() {
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(SPHERE_RADIUS, 50, 50),
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      })
    );

    atmosphere.scale.set(1.4, 1.4, 1.4);
    this.scene.add(atmosphere);
  }

  async loadCities() {
    try {
      const res = await fetch("../assets/cities.json");
      const data = await res.json();
      for (const key in data) {
        this.createBox(data[key]);
      }
    } catch (error) {
      console.error("Failed to fetch cities", error);
    }
  }

  createBox({ lat, lng, country, city, flag }) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(BOX_GEOMETRY_SIZE, BOX_GEOMETRY_SIZE, 0.8),
      new THREE.MeshBasicMaterial({
        color: 0x90d7ac,
        opacity: 0.4,
        transparent: true,
      })
    );

    const latitude = (lat / 180) * Math.PI;
    const longitude = (lng / 180) * Math.PI;
    const radius = SPHERE_RADIUS;

    const x = radius * Math.cos(latitude) * Math.sin(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.cos(longitude);

    box.position.set(x, y, z);
    box.lookAt(new THREE.Vector3(0, 0, 0));
    box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));

    this.group.add(box);

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

  setupEventListeners() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener(
      "resize",
      this.debounce(this.onResize.bind(this), DEBOUNCE_WAIT)
    );
  }

  onMouseDown(event) {
    this.mouse.down = true;
    this.mouse.xPrev = event.clientX;
    this.mouse.yPrev = event.clientY;
  }

  onMouseUp() {
    this.mouse.down = false;
  }

  onMouseMove(event) {
    this.mouse.x =
      ((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 2 -
      1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.set(this.popupEl, { x: event.clientX, y: event.clientY });

    if (this.mouse.down) {
      event.preventDefault();
      const deltaX = event.clientX - this.mouse.xPrev;
      const deltaY = event.clientY - this.mouse.yPrev;

      if (!this.group.rotation.offset) {
        this.group.rotation.offset = { x: 0, y: 0 };
      }

      this.group.rotation.offset.x += deltaY * 0.001;
      this.group.rotation.offset.y += deltaX * 0.005;
      this.mouse.xPrev = event.clientX;
      this.mouse.yPrev = event.clientY;

      gsap.to(this.group.rotation, {
        x: this.group.rotation.offset.x,
        y: this.group.rotation.offset.y,
        duration: 2,
      });
    }
  }

  onResize() {
    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  animate() {
    const render = () => {
      requestAnimationFrame(render);
      this.renderer.render(this.scene, this.camera);

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.group.rotation.y += 0.003;

      const intersects = this.raycaster.intersectObjects(
        this.group.children.filter(
          (mesh) => mesh.geometry.type === "BoxGeometry"
        )
      );

      this.group.children.forEach((mesh) => (mesh.material.opacity = 0.4));
      gsap.set(this.popupEl, { display: "none" });

      intersects.forEach((intersect) => {
        intersect.object.material.opacity = 1;
        gsap.set(this.popupEl, { display: "block" });
        this.cityName.innerHTML = intersect.object.city;
        this.countryFlag.innerHTML = intersect.object.flag;
      });

      this.renderer.render(this.scene, this.camera);
    };
    render();
  }
}

export function initGlobe() {
  new Globe("globe-canvas");
}
