// --- Music Player Logic ---
document.addEventListener('DOMContentLoaded', function () {
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const songSelect = document.getElementById('song-select');
  const volumeBar = document.getElementById('volume-bar');
  let isPlaying = false;

  const playPauseIcon = document.getElementById('play-pause-icon');
  const playIconSrc = 'assets/enable-sound.png';
  const pauseIconSrc = 'assets/silent.png';

  function setPlayIcon() {
    playPauseIcon.src = playIconSrc;
    playPauseIcon.alt = 'Play';
    playPauseIcon.style.display = 'block';
  }
  function setPauseIcon() {
    playPauseIcon.src = pauseIconSrc;
    playPauseIcon.alt = 'Pause';
    playPauseIcon.style.display = 'block';
  }

  playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      setPauseIcon();
      isPlaying = true;
    } else {
      audioPlayer.pause();
      setPlayIcon();
      isPlaying = false;
    }
  });

  songSelect.addEventListener('change', (e) => {
    audioPlayer.src = e.target.value;
    if (isPlaying) {
      audioPlayer.play();
      setPauseIcon();
    } else {
      setPlayIcon();
    }
  });

  audioPlayer.addEventListener('ended', () => {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    setPauseIcon();
  });

  volumeBar.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
  });
  audioPlayer.volume = volumeBar.value;
  setPlayIcon();
});

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// --- Mouse Effect Canvas ---
const canvas = document.getElementById('mouse-effect');
const ctx = canvas ? canvas.getContext('2d') : null;
let mouseMoved = false;
const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
}
const params = {
    pointsNumber: 25,
    widthFactor: .3,
    mouseThreshold: .6,
    spring: .4,
    friction: .5
};
const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    }
}
window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});
function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}
if (canvas && ctx) {
  setupCanvas();
  update(0);
  window.addEventListener("resize", setupCanvas);
}
function update(t) {
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
        pointer.y = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    window.requestAnimationFrame(update);
}
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function toggleMouseEffect(show) {
  if (canvas) {
    canvas.style.display = show ? 'block' : 'none';
  }
}
function checkSection() {
  const hash = window.location.hash;
  if (hash === '#home' || hash === '' || hash === '#') {
    toggleMouseEffect(true);
  } else {
    toggleMouseEffect(false);
  }
}
window.addEventListener('DOMContentLoaded', checkSection);
window.addEventListener('hashchange', checkSection);
window.addEventListener('mousemove', function(e) {
  if (canvas && canvas.style.display !== 'none') {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
  }
});

// --- ABOUT SECTION ANIMATION ---
window.onload = function() {
  const aboutContainer = document.getElementById('about-three-container');
  if (aboutContainer) {
    function getAboutSize() {
      const parent = aboutContainer.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }
      return { width: 340, height: 340 };
    }
    let { width, height } = getAboutSize();
    const scene = new THREE.Scene();
    const logicalHeight = 2.5;
    const logicalWidth = logicalHeight * (width / height);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    aboutContainer.appendChild(renderer.domElement);
    const rows = 12;
    const cols = 10;
    let blockW = logicalWidth / cols;
    let blockH = logicalHeight / rows;
    const blocks = [];
    const loader = new THREE.TextureLoader();
    loader.load('./assets/about-pic1.jpg', function(texture) {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const yFlipped = rows - 1 - y;
          const u0 = x / cols;
          const v0 = 1 - (y + 1) / rows;
          const u1 = (x + 1) / cols;
          const v1 = 1 - y / rows;
          const geometry = new THREE.PlaneGeometry(blockW, blockH, 1, 1);
          const uvs = geometry.attributes.uv;
          uvs.setXY(0, u0, v0);
          uvs.setXY(1, u1, v0);
          uvs.setXY(2, u0, v1);
          uvs.setXY(3, u1, v1);
          uvs.needsUpdate = true;
          const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = -logicalWidth / 2 + blockW / 2 + x * blockW;
          mesh.position.y = logicalHeight / 2 - blockH / 2 - yFlipped * blockH;
          mesh.position.z = 0;
          scene.add(mesh);
          blocks.push({ mesh, x, y: yFlipped, visible: true, glitchOffset: 0 });
        }
      }
      function updateBlockVisibility() {
        for (let i = 0; i < blocks.length; i++) {
          if (Math.random() < 0.10) {
            blocks[i].visible = false;
          } else {
            blocks[i].visible = true;
          }
        }
      }
      setInterval(updateBlockVisibility, 400);
      function updateGlitch() {
        for (let i = 0; i < blocks.length; i++) {
          if (Math.random() < 0.07) {
            blocks[i].glitchOffset = (Math.random() - 0.5) * 0.25;
          } else {
            blocks[i].glitchOffset = 0;
          }
        }
      }
      setInterval(updateGlitch, 120);
      function animateAbout() {
        requestAnimationFrame(animateAbout);
        for (let i = 0; i < blocks.length; i++) {
          const { mesh, x, y, visible, glitchOffset } = blocks[i];
          mesh.visible = visible;
          mesh.position.x = -logicalWidth / 2 + blockW / 2 + x * blockW + glitchOffset;
          mesh.position.y = logicalHeight / 2 - blockH / 2 - y * blockH;
          mesh.position.z = 0;
        }
        renderer.render(scene, camera);
      }
      animateAbout();
    });
    window.addEventListener('resize', () => {
      const size = getAboutSize();
      width = size.width;
      height = size.height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const newLogicalHeight = 2.5;
      const newLogicalWidth = newLogicalHeight * (width / height);
      blockW = newLogicalWidth / cols;
      blockH = newLogicalHeight / rows;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const mesh = blocks[i].mesh;
          mesh.geometry.dispose();
          const geometry = new THREE.PlaneGeometry(blockW, blockH, 1, 1);
          const u0 = x / cols;
          const v0 = 1 - (y + 1) / rows;
          const u1 = (x + 1) / cols;
          const v1 = 1 - y / rows;
          const uvs = geometry.attributes.uv;
          uvs.setXY(0, u0, v0);
          uvs.setXY(1, u1, v0);
          uvs.setXY(2, u0, v1);
          uvs.setXY(3, u1, v1);
          uvs.needsUpdate = true;
          mesh.geometry = geometry;
          mesh.position.x = -newLogicalWidth / 2 + blockW / 2 + x * blockW;
          mesh.position.y = newLogicalHeight / 2 - blockH / 2 - (rows - 1 - y) * blockH;
        }
      }
    });
  }
  const container = document.getElementById('three-container');
  if (!container) return;
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const scene = new THREE.Scene();
  const logicalHeight = 2.5;
  const logicalWidth = logicalHeight * (width / height);
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 3;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  const rows = 12;
  const cols = 10;
  const blockW = logicalWidth / cols;
  const blockH = logicalHeight / rows;
  const blocks = [];
  const loader = new THREE.TextureLoader();
  loader.load('./assets/profile-pic2.jpg', function(texture) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const yFlipped = rows - 1 - y;
        const u0 = x / cols;
        const v0 = 1 - (y + 1) / rows;
        const u1 = (x + 1) / cols;
        const v1 = 1 - y / rows;
        const geometry = new THREE.PlaneGeometry(blockW, blockH, 1, 1);
        const uvs = geometry.attributes.uv;
        uvs.setXY(0, u0, v0);
        uvs.setXY(1, u1, v0);
        uvs.setXY(2, u0, v1);
        uvs.setXY(3, u1, v1);
        uvs.needsUpdate = true;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -logicalWidth / 2 + blockW / 2 + x * blockW;
        mesh.position.y = logicalHeight / 2 - blockH / 2 - yFlipped * blockH;
        mesh.position.z = 0;
        scene.add(mesh);
        blocks.push({ mesh, x, y: yFlipped, visible: true, glitchOffset: 0 });
      }
    }
    let mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    });
    function updateBlockVisibility() {
      for (let i = 0; i < blocks.length; i++) {
        if (Math.random() < 0.10) {
          blocks[i].visible = false;
        } else {
          blocks[i].visible = true;
        }
      }
    }
    setInterval(updateBlockVisibility, 400);
    function updateGlitch() {
      for (let i = 0; i < blocks.length; i++) {
        if (Math.random() < 0.07) {
          blocks[i].glitchOffset = (Math.random() - 0.5) * 0.25;
        } else {
          blocks[i].glitchOffset = 0;
        }
      }
    }
    setInterval(updateGlitch, 120);
    function animate(now) {
      requestAnimationFrame(animate);
      for (let i = 0; i < blocks.length; i++) {
        const { mesh, x, y, visible, glitchOffset } = blocks[i];
        mesh.visible = visible;
        mesh.position.x = -logicalWidth / 2 + blockW / 2 + x * blockW + glitchOffset;
        mesh.position.y = logicalHeight / 2 - blockH / 2 - y * blockH;
        const dx = (x / (cols - 1)) * logicalWidth - logicalWidth / 2 - mouse.x * (logicalWidth / 2);
        const dy = (y / (rows - 1)) * logicalHeight - logicalHeight / 2 - mouse.y * (logicalHeight / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.4 * logicalWidth) {
          const force = (0.4 * logicalWidth - dist) * 0.25;
          mesh.position.z = force * 2;
        } else {
          mesh.position.z = 0;
        }
      }
      renderer.render(scene, camera);
    }
    animate(performance.now());
  });
  window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    const newLogicalHeight = 2.5;
    const newLogicalWidth = newLogicalHeight * (width / height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const mesh = blocks[i].mesh;
        mesh.geometry.dispose();
        const geometry = new THREE.PlaneGeometry(newLogicalWidth / cols, newLogicalHeight / rows, 1, 1);
        const u0 = x / cols;
        const v0 = 1 - (y + 1) / rows;
        const u1 = (x + 1) / cols;
        const v1 = 1 - y / rows;
        const uvs = geometry.attributes.uv;
        uvs.setXY(0, u0, v0);
        uvs.setXY(1, u1, v0);
        uvs.setXY(2, u0, v1);
        uvs.setXY(3, u1, v1);
        uvs.needsUpdate = true;
        mesh.geometry = geometry;
        mesh.position.x = -newLogicalWidth / 2 + (newLogicalWidth / cols) / 2 + x * (newLogicalWidth / cols);
        mesh.position.y = newLogicalHeight / 2 - (newLogicalHeight / rows) / 2 - (rows - 1 - y) * (newLogicalHeight / rows);
      }
    }
  });
};
