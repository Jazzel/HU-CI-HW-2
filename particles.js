class PS {
  constructor(scene, source, numParticles, particleSize, particlesLife) {
    this.scene = scene;
    this.source = source;
    this.numParticles = numParticles;
    this.particleSize = particleSize;
    this.particles = [];
    this.particlesLife = particlesLife;
    this.particlesLifetime = [];
    this.particlesArray1 = [];
    this.particlesArrayLifetime1 = [];
    this.particlesArray2 = [];
    this.particlesArrayLifetime2 = [];

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
        Math.random() * this.particleSize,
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
    for (let i = 0; i < this.numParticles; i++) {
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
        this.particleSize,
        this.particleSize,
        this.particleSize
      );
      // Assing particle random color
      particle.material.color = this.generateRandomColor();

      this.particlesLifetime.push(Math.random() * this.particlesLife);

      this.particles.push(particle);
    }
    this.scene.add(...this.particles);
  }

  animateWithMouse(x, y) {
    if (this.particles.length === 0) return;
    // Map mouse position to the canvas corodinates
    var mappedX = this.mapRange(x, 0, window.innerWidth, -7, 7);
    var mappedY = this.mapRange(y, 0, window.innerHeight, 4, -4);

    // Update particles position
    this.particles.map((particle, index) => {
      particle.position.x = mappedX + (Math.random() - 0.1) * 2;
      particle.position.y = mappedY + (Math.random() - 0.1) * 2;
    });
  }

  animateRandomlyInCircle() {
    if (this.particles.length === 0) {
      ps.generate();
    }
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

    this.removeDead();
  }

  mapRange(value, min1, max1, min2, max2) {
    return min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
  }

  createWithMouse(x, y) {
    this.initParicleGeometry();
    // Map mouse position to the canvas corodinates
    var mappedX = this.mapRange(x, 0, window.innerWidth, -7, 7);
    var mappedY = this.mapRange(y, 0, window.innerHeight, 4, -4);

    // Create a particle at the mouse position
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: this.generateRandomColor(),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const particle = new THREE.Mesh(this.particleGeometry, particleMaterial);
    particle.position.set(
      mappedX,
      mappedY,
      this.source.z + (Math.random() - 0.5) * 0.5
    );
    particle.scale.set(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5
    );

    this.particlesLifetime.push(Math.random() * this.particlesLife);

    this.particles.push(particle);
    this.scene.add(particle);
  }

  initGravity() {
    this.gravity = new THREE.Vector3(0, -0.1, 0);
    // update particles position and add bounce effect
    this.particles.map((particle, index) => {
      particle.position.add(this.gravity);
      if (particle.position.y < -2) {
        particle.position.y = -2;
        this.particlesLifetime[index] = 0;
      }
    });
  }

  initPartyPopper() {
    this.scene.clear();
    this.particles = [];
    // Creating source object as white square
    const sourceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);

    // Set source position
    source.position.set(0, -4, 0);
    this.scene.add(source);

    this.initParicleGeometry();

    // createParticles
    for (let index = 0; index < this.numParticles; index++) {
      this.createParticle(source, this.particles, this.particlesLifetime);
    }

    setTimeout(() => {
      setInterval(() => {
        // burst the particles like a party popper
        this.particles.map((particle, index) => {
          this.particles[index].position.y += Math.random() * 5;
          this.particles[index].position.x += (Math.random() - 0.5) * 5;
        });
      }, 100);
    }, 1000);
  }

  initDoubleEmitter() {
    this.scene.clear();
    this.particles = [];
    // Source 1
    // Creating source object as white square
    const sourceGeometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMaterial1 = new THREE.MeshBasicMaterial({ color: "white" });
    const source1 = new THREE.Mesh(sourceGeometry1, sourceMaterial1);

    // Set source position
    source1.position.set(-8, -2, 0);
    this.scene.add(source1);

    // Source 2
    // Creating source object as white square
    const sourceGeometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMaterial2 = new THREE.MeshBasicMaterial({ color: "white" });
    const source2 = new THREE.Mesh(sourceGeometry2, sourceMaterial2);

    // Set source position
    source2.position.set(8, -2, 0);
    this.scene.add(source2);

    this.initParicleGeometry();

    // createParticles
    setInterval(() => {
      this.createParticle(
        source1,
        this.particlesArray1,
        this.particlesArrayLifetime1
      );
      this.createParticle(
        source2,
        this.particlesArray2,
        this.particlesArrayLifetime2
      );
    }, 100);
  }

  initEmitterMode() {
    this.particles.length = [];
    // Creating source object as white square
    const sourceGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sourceMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const source = new THREE.Mesh(sourceGeometry, sourceMaterial);

    // Set source position
    source.position.set(0, 0, 0);
    this.scene.add(source);

    this.initParicleGeometry();

    setInterval(() => {
      this.createParticle(source, this.particles, this.particlesLifetime);
    }, 100);

    this.moveParticles();
  }

  collideParticles() {
    for (let i = 0; i < this.particlesArray1.length; i++) {
      for (let j = 0; j < this.particlesArray2.length; j++) {
        if (
          this.particlesArray1[i].position.distanceTo(
            this.particlesArray2[j].position
          ) < 0.5
        ) {
          // rise the particles
          this.particlesArray1[i].position.y += 0.2;
          this.particlesArray2[j].position.y += 0.2;
        }
      }
    }
  }

  moveParticlesForDoubleEmiiter() {
    for (let i = 0; i < this.particlesArray1.length; i++) {
      this.particlesArray1[i].position.x += Math.abs(
        (Math.random() - 0.5) * 0.3
      );
      this.particlesArray1[i].position.y += (Math.random() - 0.5) * 0.2;
    }
    for (let i = 0; i < this.particlesArray2.length; i++) {
      this.particlesArray2[i].position.x += -Math.abs(
        (Math.random() - 0.5) * 0.3
      );
      this.particlesArray2[i].position.y += (Math.random() - 0.5) * 0.2;
    }

    // collideParticles
    this.collideParticles();
    this.removeDead();
  }

  moveParticles() {
    this.particles.map((particle, index) => {
      particle.position.x += (Math.random() - 0.5) * 0.3;
      particle.position.y += (Math.random() - 0.5) * 0.3;
    });
    this.removeDead();
  }

  createParticle(source, particlesArray, particlesLifetime) {
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
    particle.scale.set(this.particleSize, this.particleSize, this.particleSize);

    particlesLifetime.push(Math.random() * 100);

    particlesArray.push(particle);
    this.scene.add(particle);
  }

  toggleParticlesShape() {
    this.geometryType =
      this.geometryType === "SphereGeometry" ? "BoxGeometry" : "SphereGeometry";
  }

  removeDead() {
    this.particles.map((particle, index) => {
      this.particlesLifetime[index] -= 0.1;
      if (this.particlesLifetime[index] < 0) {
        this.scene.remove(particle);
        this.particles.splice(index, 1);
        this.particlesLifetime.splice(index, 1);
      }
    });
  }

  resetLife() {
    this.particlesLifetime = this.particlesLifetime.map(
      () => Math.random() * 100
    );
  }

  remove() {
    this.scene.clear();
    this.particles = [];
  }
}

const saveBtn = document.getElementById("save");
const animateRandomly = document.getElementById("animateRandomly");
const animateRandomlyCircle = document.getElementById("animateRandomlyCircle");
const animateWithMouse = document.getElementById("animateWithMouse");
const generateParticles = document.getElementById("generateParticles");
const gravityMode = document.getElementById("gravityMode");
const partyPopperMode = document.getElementById("partyPopperMode");
const emitterMode = document.getElementById("emitterMode");
const doubleEmitterMode = document.getElementById("doubleEmitterMode");

const particleCountSlider = document.getElementById("particleCount");
const particleSizeSlider = document.getElementById("particleSize");
const particleLifespanSlider = document.getElementById("particleLifespan");
const gravityToggler = document.getElementById("gravity");
const resetBtn = document.getElementById("reset");
const particleTypeSelect = document.getElementById("particleType");
const modeText = document.getElementById("modeText");

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

const numParticles = particleCountSlider.value;
const particleSize = particleSizeSlider.value / 10;
const particlesLife = particleLifespanSlider.value;

modeText.innerHTML = "Animate Randomly";
const source = new THREE.Vector3(0, 0, 0);

const ps = new PS(scene, source, numParticles, particleSize, particlesLife);
ps.generate();

// ps.toggleParticlesShape();

// ps.initEmitterMode();

particleCountSlider.addEventListener("change", (e) => {
  ps.numParticles = e.target.value;
  ps.particleSize = particleSizeSlider.value / 10;
  ps.particlesLife = particleLifespanSlider.value;
  ps.remove();
  if (mode !== "doubleEmitterMode") {
    ps.generate();
    animate();
  } else {
    ps.initDoubleEmitter();
  }
});

particleSizeSlider.addEventListener("change", (e) => {
  ps.particleSize = e.target.value / 10;
  ps.numParticles = particleCountSlider.value;
  ps.particlesLife = particleLifespanSlider.value;
  ps.remove();
  if (mode !== "doubleEmitterMode") {
    ps.generate();
    animate();
  } else {
    ps.initDoubleEmitter();
  }
});

particleLifespanSlider.addEventListener("change", (e) => {
  ps.particlesLife = e.target.value;
  ps.particleSize = particleSizeSlider.value / 10;
  ps.numParticles = particleCountSlider.value;
  ps.remove();
  if (mode !== "doubleEmitterMode") {
    ps.generate();
    animate();
  } else {
    ps.initDoubleEmitter();
  }
});

gravityToggler.addEventListener("change", (e) => {
  if (e.target.checked) {
    mode = "gravityMode";
  } else {
    mode = "animateRandomly";
    ps.remove();
    ps.generate();
    animate();
  }
});

resetBtn.addEventListener("click", (e) => {
  ps.particlesLife = e.target.value;
  ps.particleSize = particleSizeSlider.value / 10;
  ps.numParticles = particleCountSlider.value;
  ps.resetLife();
  ps.remove();
  if (mode !== "doubleEmitterMode") {
    ps.generate();
    animate();
  } else {
    ps.initDoubleEmitter();
  }
});

particleTypeSelect.addEventListener("change", (e) => {
  if (e.target.value === "Sphere") {
    ps.geometryType = "SphereGeometry";
  } else if (e.target.value === "Cube") {
    ps.geometryType = "BoxGeometry";
  } else if (e.target.value === "Wall") {
    ps.geometryType = "WallGeometry";
  } else if (e.target.value === "Diamond") {
    ps.geometryType = "DiamondGeometry";
  }

  ps.remove();
  if (mode !== "doubleEmitterMode") {
    ps.generate();
    animate();
  } else {
    ps.initDoubleEmitter();
  }
});

let mode = "animateRandomly";
let isMouseDown = false;
let [x, y] = [0, 0];

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (animateRandomly.checked) {
    mode = "animateRandomly";
    modeText.innerHTML = "Animate Randomly";
  }
  if (animateRandomlyCircle.checked) {
    mode = "animateRandomlyCircle";
    modeText.innerHTML = "Animate Randomly in Circle";
  }
  if (animateWithMouse.checked) {
    mode = "animateWithMouse";
    modeText.innerHTML = "Animate With Mouse Drag";
    ps.removeDead();
  }
  if (generateParticles.checked) {
    ps.remove();
    mode = "generateParticles";
    modeText.innerHTML = "Generate Particles on Mouse Click";
  }
  if (partyPopperMode.checked) {
    mode = "partyPopperMode";
    modeText.innerHTML = "Party Popper Mode (click reset to replay animation)";
    ps.initPartyPopper();
  }

  if (emitterMode.checked) {
    mode = "emitterMode";
    modeText.innerHTML = "Emitter Mode";
    ps.remove();
    ps.initEmitterMode();
  }
  if (doubleEmitterMode.checked) {
    mode = "doubleEmitterMode";
    modeText.innerHTML = "Double Emitter Mode (with collide effect)";
    ps.remove();
    ps.initDoubleEmitter();
  }

  $("#modelId").modal("hide");
});

function animate() {
  setTimeout(() => {
    requestAnimationFrame(animate);
    if (mode === "animateRandomly") {
      ps.animateRandomly();
    } else if (mode === "animateRandomlyCircle") {
      ps.animateRandomlyInCircle();
    } else if (mode === "animateWithMouse") {
      canvas.addEventListener("mousemove", (e) => {
        const x = e.x;
        const y = e.y;
        ps.animateWithMouse(x, y);
      });
    } else if (mode === "generateParticles") {
      canvas.addEventListener("mousedown", (e) => {
        isMouseDown = true;
      });

      canvas.addEventListener("mouseup", (e) => {
        isMouseDown = false;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (isMouseDown) {
          ps.createWithMouse(e.x, e.y);
        }
      });
    } else if (mode === "gravityMode") {
      ps.initGravity();
    } else if (mode === "emitterMode") {
      ps.moveParticles();
    } else if (mode === "doubleEmitterMode") {
      ps.moveParticlesForDoubleEmiiter();
    }
    renderer.render(scene, camera);
  }, 80);
}
animate();
