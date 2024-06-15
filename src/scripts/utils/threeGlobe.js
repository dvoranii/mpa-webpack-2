import * as THREE from "three";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";

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

  scene.add(sphere);
  createStarField();

  camera.position.z = 13;

  function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.003;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}
