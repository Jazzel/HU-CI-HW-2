class PS {
  constructor(scene, source, numParticles) {
    this.scene = scene;
    this.source = source;
    this.numParticles = numParticles;
    this.particles = [];
    this.particlesLifetime = [];
    this.currentColor = 0;
    this.geometryType = "SphereGeometry";
  }

  generateRandomColor() {
    const colors = [
      new THREE.Color("red"),
      new THREE.Color("green"),
      new THREE.Color("blue"),
      new THREE.Color("yellow"),
      new THREE.Color("cyan"),
      new THREE.Color("magenta"),
      new THREE.Color("white"),
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  initParicleGeometry() {
    if (this.geometryType === "SphereGeometry") {
      this.particleGeometry = new THREE.SphereGeometry(
        Math.random() * 0.15,
        4,
        4
      );
    } else if (this.geometryType === "BoxGeometry") {
      this.particleGeometry = new THREE.BoxGeometry(
        Math.random() * 0.1,
        0.2,
        0.2
      );
    } else if (this.geometryType === "WallGeometry") {
      this.particleGeometry = new THREE.BoxGeometry(Math.random() * 0.1, 2, 2);
    } else if (this.geometryType === "DiamondGeometry") {
      this.particleGeometry = new THREE.SphereGeometry(
        Math.random() * 0.2,
        2,
        2
      );
    }
  }

  generate() {
    // Generate particles with random positions
    this.initParicleGeometry();
    for (let i = 0; i < numParticles; i++) {
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: this.generateRandomColor(),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      });

      const particle = new THREE.Mesh(this.particleGeometry, particleMaterial);
      particle.position.set(
        this.source.x + (Math.random() - 0.5) * 2,
        this.source.y + (Math.random() - 0.5) * 2,
        this.source.z + (Math.random() - 0.5) * 4
      );
      // Generate particles with random sizes
      particle.scale.set(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5
      );
      // Assing particle random color
      particle.material.color = this.generateRandomColor();

      this.particlesLifetime.push(Math.random() * 100);

      this.particles.push(particle);
    }
    this.scene.add(...this.particles);
  }

  animateWithMouse(x, y) {
    if (this.particles.length === 0) return;
    // Map mouse position to the canvas corodinates
    x = (x / window.innerWidth) * 2 - 1;
    y = -(y / window.innerHeight) * 2 + 1;

    // Update particles position
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].position.x = x + (Math.random() - 0.5) * 2;
      this.particles[i].position.y = y + (Math.random() - 0.5) * 2;
    }

    console.log(x, y);

    this.removeDead();
  }

  animateRandomlyInCircle() {
    for (let i = 0; i < this.particles.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2;
      this.particles[i].position.x = this.source.x + Math.cos(angle) * radius;
      this.particles[i].position.y = this.source.y + Math.sin(angle) * radius;
    }
  }

  animateRandomly() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].position.x += (Math.random() - 0.5) * 0.1;
      this.particles[i].position.y += (Math.random() - 0.5) * 0.1;
    }
  }

  createWithMouse(x, y) {
    // Map mouse position to the canvas corodinates
    x = (x / window.innerWidth) * 2 - 1;
    y = -(y / window.innerHeight) * 2 + 1;

    // Create a particle at the mouse position
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: this.generateRandomColor(),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(x, y, this.source.z + (Math.random() - 0.5) * 4);
    particle.scale.set(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5
    );
    particle.material.color = this.generateRandomColor();

    this.particlesLifetime.push(Math.random() * 100);

    this.particles.push(particle);
    this.scene.add(particle);
  }

  initGravity() {
    this.gravity = new THREE.Vector3(0, -0.1, 0);
    // update particles position and add bounce effect
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].position.add(this.gravity);
      if (this.particles[i].position.y < -2) {
        this.particles[i].position.y = -2;
        this.particlesLifetime[i] = 0;
      }
    }
  }

  initPartyPopper() {}

  initDoubleEmitter() {}

  initWaterFall() {}

  initEmitterMode() {
    // Creating source object as white square
    const sourceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);

    // Set source position
    source.position.set(0, 0, 0);
    this.scene.add(source);

    this.initParicleGeometry();

    setInterval(() => {
      this.createParticle(source);
    }, 100);

    this.moveParticles();
  }

  moveParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].position.x += Math.abs((Math.random() - 0.5) * 0.1);
      this.particles[i].position.y += Math.abs((Math.random() - 0.5) * 0.1);
    }
    this.removeDead();
  }

  createParticle(source) {
    // Create a particle at the source position
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: this.generateRandomColor(),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const particle = new THREE.Mesh(this.particleGeometry, particleMaterial);
    particle.position.set(
      source.position.x,
      source.position.y,
      source.position.z
    );
    particle.scale.set(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5
    );

    this.particlesLifetime.push(Math.random() * 100);

    this.particles.push(particle);
    this.scene.add(particle);
  }

  toggleParticlesShape() {
    this.geometryType =
      this.geometryType === "SphereGeometry" ? "BoxGeometry" : "SphereGeometry";
  }

  removeDead() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particlesLifetime[i] -= 0.1;
      if (this.particlesLifetime[i] < 0) {
        this.scene.remove(this.particles[i]);
        this.particles.splice(i, 1);
        this.particlesLifetime.splice(i, 1);
        this.particles.length--;
      }
    }
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

const source = new THREE.Vector3(0, 0, 0);

const ps = new PS(scene, source, numParticles);
ps.generate();

// canvas.addEventListener("mousemove", (e) => {
//   const x = e.x;
//   const y = e.y;
//   ps.animateWithMouse(x, y);

//   if (isMouseDown) {
//     ps.createWithMouse(x, y);
//   }
// });

// let isMouseDown = false;
// let [x, y] = [0, 0];

// canvas.addEventListener("mousedown", (e) => {
//   isMouseDown = true;
//   x = e.x;
//   y = e.y;
// });

// canvas.addEventListener("mouseup", (e) => {
//   isMouseDown = false;
//   x = e.x;
//   y = e.y;
// });

// canvas.addEventListener("click", () => {
//   ps.toggleParticlesShape();
//   alert("Particles shape toggled");
// });

// ps.toggleParticlesShape();

// ps.initEmitterMode();

function animate() {
  setTimeout(() => {
    requestAnimationFrame(animate);
    // ps.animateRandomlyInCircle();
    // ps.animateRandomly();
    ps.initGravity();
    //   ps.moveParticles();
    renderer.render(scene, camera);
  }, 80);
}
animate();
