class PSO {
  constructor(scene, source, numParticles, particleGeometry, particleMaterial) {
    this.scene = scene;
    this.source = source;
    this.numParticles = numParticles;
    this.particleGeometry = particleGeometry;
    this.particleMaterial = particleMaterial;
    this.particles = [];
    this.particlesVelocity = [];
    this.pbest = [];
    this.pbestValue = Infinity;
    this.gbest = [];
    this.gbestValue = Infinity;
    // PSO parameters
    this.c1 = 0.1;
    this.c2 = 0.1;
    this.w = 0.8;
  }

  generate() {
    // Particles
    for (let i = 0; i < numParticles; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        this.source.x + (Math.random() - 0.5) * 10,
        this.source.x + (Math.random() - 0.5) * 10,
        this.source.x + 0
        // (Math.random() - 0.5) * 10,
        // (Math.random() - 0.5) * 10
      );
      this.particles.push(particle);
    }
    this.scene.add(...this.particles);
    // Velocities
    for (let i = 0; i < this.numParticles; i++) {
      this.particlesVelocity.push([
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        // (Math.random() - 0.5) * 0.1
      ]);
    }

    // Personal best
    this.pbest = this.particles;
    this.pbestValue = this.particles.map((particle) =>
      this.fitness(particle.position.x, particle.position.y)
    );
    // Global best
    let gbestIndex = this.pbestValue.indexOf(Math.min(...this.pbestValue));
    this.gbest = this.pbest[gbestIndex];
    this.gbestValue = this.pbestValue[gbestIndex];
  }

  fitness(x, y) {
    return (
      Math.pow(x - this.source.x, 2) +
      Math.pow(y + this.source.y, 2) +
      Math.sin(3 * x + 1.41) +
      Math.sin(4 * y - 1.73)
    );
  }

  optimize() {
    for (let i = 0; i < this.numParticles; i++) {
      const r1 = Math.random();
      const r2 = Math.random();

      this.particlesVelocity[i][0] =
        this.w * this.particlesVelocity[i][0] +
        this.c1 *
          r1 *
          (this.pbest[i].position.x - this.particles[i].position.x) +
        this.c2 * r2 * (this.gbest.position.x - this.particles[i].position.x);

      this.particlesVelocity[i][1] =
        this.w * this.particlesVelocity[i][1] +
        this.c1 *
          r1 *
          (this.pbest[i].position.y - this.particles[i].position.y) +
        this.c2 * r2 * (this.gbest.position.y - this.particles[i].position.y);

      this.particles[i].position.x += this.particlesVelocity[i][0];
      this.particles[i].position.y += this.particlesVelocity[i][1];

      const obj = this.fitness(
        this.particles[i].position.x,
        this.particles[i].position.y
      );

      if (this.pbestValue[i] > obj) {
        this.pbest[i] = this.particles[i];
        this.pbestValue[i] = obj;
      }
    }
    const gbestIndex = this.pbestValue.indexOf(Math.min(...this.pbestValue));
    this.gbest = this.pbest[gbestIndex];
    this.gbestValue = this.pbestValue[gbestIndex];
  }
}

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
canvas.appendChild(renderer.domElement);

const numParticles = 1000;
// radius, widthSegments, heightSegments
const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);

const particleMaterial = new THREE.MeshBasicMaterial({
  color: "white",
  transparent: true,
  opacity: 0.3,
  blending: THREE.AdditiveBlending,
});
const source = new THREE.Vector3(0, 0, 0);

const pso = new PSO(
  scene,
  source,
  numParticles,
  particleGeometry,
  particleMaterial
);
pso.generate();

console.log(
  `PSO found best solution at f(${pso.gbest.position.x}, ${pso.gbest.position.y})=${pso.gbestValue}`
);

const mapPoint = (P, Q, A, B, X) => {
  let alpha, mappingX;
  if (typeof P === "number" && typeof Q === "number" && typeof X === "number") {
    alpha = (X - P) / (Q - P);
  } else {
    alpha = length(subtract(X, P)) / length(subtract(Q, P));
  }

  if (typeof A === "number" && typeof B === "number") {
    mappingX = alpha * B + (1 - alpha) * A;
  } else {
    mappingX = mix(A, B, alpha);
  }

  return mappingX;
};

canvas.addEventListener("mousedown", (e) => {
  var x = e.clientX;
  var y = e.clientY;

  console.log(x, y);

  const updatedX = mapPoint(0, window.innerWidth, -5, 5, x);
  const updatedY = mapPoint(0, window.innerHeight, -5, 5, y);

  console.log(updatedX, updatedY);

  pso.source.x = updatedX;
  pso.source.y = updatedY;
});

function animate() {
  setTimeout(() => {
    requestAnimationFrame(animate);
    pso.optimize();
    renderer.render(scene, camera);
  }, 200);
}
animate();
