import * as THREE from "three";
import { useCosmos, type ChapterId } from "@/cosmos/store";

const STAR_VERT = `
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
varying vec3 vColor;
varying float vSeed;
uniform float uTime;
uniform float uPixelRatio;
void main() {
  vColor = aColor;
  vSeed = aSeed;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.78 + 0.22 * sin(uTime * (0.45 + aSeed) + aSeed * 24.0);
  gl_PointSize = aSize * tw * uPixelRatio * (260.0 / max(8.0, -mv.z));
  gl_Position = projectionMatrix * mv;
}
`;

const STAR_FRAG = `
varying vec3 vColor;
varying float vSeed;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  float glow = smoothstep(0.5, 0.0, d);
  float sx = smoothstep(0.5, 0.0, abs(p.x)) * smoothstep(0.04, 0.0, abs(p.y));
  float sy = smoothstep(0.5, 0.0, abs(p.y)) * smoothstep(0.04, 0.0, abs(p.x));
  float spike = (sx + sy) * smoothstep(0.78, 0.95, vSeed);
  float alpha = glow * glow + spike;
  if (alpha < 0.04) discard;
  gl_FragColor = vec4(vColor, clamp(alpha, 0.0, 1.0));
}
`;

type Preset = { p: THREE.Vector3; l: THREE.Vector3 };

function presets(): Record<ChapterId, Preset> {
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  return {
    prologue: { p: v(0, 1.4, 48), l: v(0, 0, 0) },
    dawn: { p: v(7, 0.6, 26), l: v(0, 0, -8) },
    calendar: { p: v(-4, 6, 38), l: v(0, 0, -10) },
    scale: { p: v(0, 0.4, 40), l: v(0, 0, 0) },
    pale: { p: v(10, 2, 28), l: v(0, 0, -6) },
    dust: { p: v(3, -1, 24), l: v(0, 1, -12) },
    worlds: { p: v(-8, 2.2, 34), l: v(4, 0, 0) },
    letter: { p: v(0, 5, 42), l: v(0, 0, 0) },
    end: { p: v(2, 3, 50), l: v(0, 0, -4) },
  };
}

function makeStars(count: number): THREE.Points {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const band = Math.random() < 0.42;
    let x: number;
    let y: number;
    let z: number;
    if (band) {
      const a = Math.random() * Math.PI * 2;
      const rad = 28 + Math.random() * 170;
      x = Math.cos(a) * rad;
      z = Math.sin(a) * rad;
      y = (Math.random() - 0.5) * 16 * Math.random();
    } else {
      const r = 18 + Math.random() ** 0.5 * 230;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      x = r * Math.sin(ph) * Math.cos(th);
      y = r * Math.sin(ph) * Math.sin(th) * 0.7;
      z = r * Math.cos(ph);
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    const roll = Math.random();
    if (roll > 0.93) {
      colors.set([0.62, 0.76, 1], i * 3);
    } else if (roll > 0.78) {
      colors.set([1, 0.84, 0.58], i * 3);
    } else {
      colors.set([0.86, 0.88, 0.95], i * 3);
    }
    sizes[i] = roll > 0.97 ? 3.4 : 0.7 + Math.random() * 1.5;
    seeds[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.computeBoundingSphere();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}

function makeShip(): THREE.Group {
  const group = new THREE.Group();
  const gold = new THREE.MeshBasicMaterial({
    color: 0xe4c48a,
    transparent: true,
    opacity: 0.9,
  });
  const ivory = new THREE.MeshBasicMaterial({
    color: 0xf4efe6,
    transparent: true,
    opacity: 0.55,
  });
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.012, 8, 90), gold);
  ringA.rotation.x = Math.PI / 2.35;
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.008, 8, 70), ivory);
  ringB.rotation.x = Math.PI / 2;
  ringB.rotation.y = 0.7;
  const sail = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.007, 6, 80, Math.PI * 1.15), gold);
  sail.rotation.y = Math.PI / 2;
  sail.rotation.z = 0.35;
  const keel = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), gold);
  keel.scale.set(0.7, 0.28, 2.5);
  const bow = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff6e4 }),
  );
  bow.position.z = 1.15;
  group.add(ringA, ringB, sail, keel, bow);
  group.scale.setScalar(0.72);
  return group;
}

function makeBang(count: number): { points: THREE.Points; dirs: Float32Array } {
  const positions = new Float32Array(count * 3);
  const dirs = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    dirs[i * 3] = Math.sin(ph) * Math.cos(th);
    dirs[i * 3 + 1] = Math.sin(ph) * Math.sin(th);
    dirs[i * 3 + 2] = Math.cos(ph);
    const warm = Math.random();
    colors.set(warm > 0.5 ? [1, 0.82, 0.55] : [0.75, 0.86, 1], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    sizes[i] = 1.4 + Math.random() * 2.2;
    seeds[i] = Math.random();
  }
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 220);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
    },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.visible = false;
  return { points, dirs };
}

export function mountScene(canvas: HTMLCanvasElement): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobile,
    powerPreference: "high-performance",
  });
  if (!renderer.getContext()) {
    renderer.dispose();
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.7);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 900);
  const cameraPos = new THREE.Vector3(0, 1.4, 48);
  const look = new THREE.Vector3();
  const desired = new THREE.Vector3();
  const desiredLook = new THREE.Vector3();
  const shipOffset = new THREE.Vector3(mobile ? -0.4 : -2.4, mobile ? 1.6 : -0.55, -9);
  const shipWorld = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const ahead = new THREE.Vector3();

  const stars = makeStars(mobile ? 4800 : 11000);
  const starMat = stars.material as THREE.ShaderMaterial;
  scene.add(stars);

  const dust = makeStars(mobile ? 280 : 700);
  dust.scale.setScalar(0.35);
  scene.add(dust);

  const ship = makeShip();
  scene.add(ship);

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(1, 28, 20),
    new THREE.MeshBasicMaterial({ color: 0x9ec9ff }),
  );
  marker.visible = false;
  scene.add(marker);
  const sunGlow = new THREE.PointLight(0xe4c48a, 0, 30);
  scene.add(sunGlow);

  const loader = new THREE.TextureLoader();
  const galaxyTex = loader.load("/cosmos/galaxy.jpg");
  galaxyTex.colorSpace = THREE.SRGBColorSpace;
  const galaxy = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 58),
    new THREE.MeshBasicMaterial({
      map: galaxyTex,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
  );
  galaxy.position.set(0, -4, -90);
  scene.add(galaxy);
  const galaxyMat = galaxy.material as THREE.MeshBasicMaterial;

  const bangCount = mobile ? 900 : 2200;
  const bang = makeBang(bangCount);
  scene.add(bang.points);
  const bangMat = bang.points.material as THREE.ShaderMaterial;

  const chapterPresets = presets();
  let seenBang = 0;
  let bangStart = -1;
  let autoDawn = false;
  let shootLife = -1;
  let nextShoot = 6;
  const shoot = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 0.035),
    new THREE.MeshBasicMaterial({
      color: 0xf4efe6,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
  );
  scene.add(shoot);
  const shootMat = shoot.material as THREE.MeshBasicMaterial;

  const resize = () => {
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();

  const onPointer = (event: PointerEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -((event.clientY / window.innerHeight) * 2 - 1);
    useCosmos.getState().setPointer(x, y);
  };
  window.addEventListener("pointermove", onPointer);
  window.addEventListener("resize", resize);

  let raf = 0;
  let running = true;
  const clock = new THREE.Clock();

  const frame = () => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(0.05, clock.getDelta());
    const time = clock.elapsedTime;
    const state = useCosmos.getState();
    const chapter = state.chapter;

    starMat.uniforms.uTime.value = time;
    starMat.uniforms.uPixelRatio.value = pixelRatio;
    bangMat.uniforms.uTime.value = time;
    bangMat.uniforms.uPixelRatio.value = pixelRatio;

    if (!reduced) {
      const spin = chapter === "scale" ? 0.012 + (1 - state.scale / 9) * 0.03 : 0.008;
      stars.rotation.y += spin * dt * 8;
      dust.rotation.y -= dt * 0.05;
      galaxy.rotation.z += dt * 0.01;
    }

    const preset = chapterPresets[chapter];
    desired.copy(preset.p);
    desiredLook.copy(preset.l);
    if (chapter === "scale") {
      const u = state.scale / 9;
      desired.z = THREE.MathUtils.lerp(8, 86, u);
      desired.y = THREE.MathUtils.lerp(-0.4, 8, u);
    }
    desired.x += state.pointerX * (mobile ? 0.4 : 1.5);
    desired.y += state.pointerY * (mobile ? 0.25 : 0.8);
    const glide = reduced ? 1 : 1 - Math.pow(0.001, dt);
    cameraPos.lerp(desired, glide);
    look.lerp(desiredLook, glide);
    camera.position.copy(cameraPos);
    camera.lookAt(look);

    shipOffset.set(mobile ? -0.35 : -2.35, mobile ? 1.7 : -0.5, -8.5);
    shipOffset.applyQuaternion(camera.quaternion);
    shipWorld.copy(camera.position).add(shipOffset);
    const bob = reduced ? 0 : Math.sin(time * 0.6) * 0.15;
    ship.position.copy(shipWorld);
    ship.position.y += bob;
    camera.getWorldDirection(forward);
    ahead.copy(ship.position).add(forward);
    ship.lookAt(ahead);
    ship.rotateZ(Math.sin(time * 0.35) * 0.15);
    const photo = chapter === "dawn" || chapter === "pale" || chapter === "dust";
    const shipOpacity = photo ? 0.22 : 0.92;
    ship.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial | undefined;
      if (material && "opacity" in material) {
        if (material.userData.base == null) material.userData.base = material.opacity;
        const base = material.userData.base as number;
        material.opacity = THREE.MathUtils.lerp(material.opacity, base * shipOpacity, 0.08);
      }
    });

    const galaxyTarget =
      chapter === "calendar" ? 0.72 : chapter === "scale" && state.scale >= 7 ? 0.6 : 0.18;
    galaxyMat.opacity = THREE.MathUtils.lerp(galaxyMat.opacity, galaxyTarget, 0.04);

    const showEarth = chapter === "scale" && state.scale === 4;
    const showSun = chapter === "scale" && state.scale === 5;
    marker.visible = showEarth || showSun;
    if (showEarth) {
      marker.scale.setScalar(THREE.MathUtils.lerp(marker.scale.x, 0.22, 0.08));
      (marker.material as THREE.MeshBasicMaterial).color.set(0x8eb7e8);
      sunGlow.intensity = THREE.MathUtils.lerp(sunGlow.intensity, 0.4, 0.08);
    } else if (showSun) {
      marker.scale.setScalar(THREE.MathUtils.lerp(marker.scale.x, 1.8, 0.08));
      (marker.material as THREE.MeshBasicMaterial).color.set(0xe8c27a);
      sunGlow.intensity = THREE.MathUtils.lerp(sunGlow.intensity, 4, 0.08);
    } else {
      sunGlow.intensity = THREE.MathUtils.lerp(sunGlow.intensity, 0, 0.08);
    }
    sunGlow.position.copy(marker.position);

    if (chapter === "dawn" && !autoDawn && !reduced) {
      autoDawn = true;
      bangStart = time;
    }
    if (state.bangToken !== seenBang) {
      seenBang = state.bangToken;
      bangStart = time;
    }
    const age = bangStart < 0 ? 99 : time - bangStart;
    if (age >= 0 && age < 6.5) {
      const u = Math.min(1, age / 5.2);
      const ease = 1 - (1 - u) ** 3;
      const fade = age < 0.25 ? age / 0.25 : 1 - (age - 0.25) / 6.2;
      bangMat.opacity = Math.max(0, fade);
      const pos = bang.points.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < bangCount; i += 1) {
        const rad = 0.2 + ease * (16 + (i % 17));
        pos.setXYZ(i, bang.dirs[i * 3] * rad, bang.dirs[i * 3 + 1] * rad, bang.dirs[i * 3 + 2] * rad);
      }
      pos.needsUpdate = true;
      bang.points.visible = true;
    } else if (bang.points.visible) {
      bang.points.visible = false;
    }

    nextShoot -= dt;
    if (!reduced && nextShoot <= 0 && shootLife < 0) {
      nextShoot = 8 + Math.random() * 10;
      shootLife = 0;
      shoot.position.set((Math.random() - 0.5) * 30, 6 + Math.random() * 8, -20 - Math.random() * 30);
      shoot.rotation.z = -0.4 - Math.random() * 0.6;
    }
    if (shootLife >= 0) {
      shootLife += dt;
      const u = shootLife / 1.15;
      shoot.position.x -= dt * 18;
      shoot.position.y -= dt * 7;
      shootMat.opacity = u < 0.2 ? u / 0.2 : Math.max(0, 1 - (u - 0.2) / 0.8);
      if (u >= 1) shootLife = -1;
    }

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", resize);
    stars.geometry.dispose();
    starMat.dispose();
    (dust.geometry as THREE.BufferGeometry).dispose();
    (dust.material as THREE.Material).dispose();
    bang.points.geometry.dispose();
    bangMat.dispose();
    galaxy.geometry.dispose();
    galaxyMat.dispose();
    galaxyTex.dispose();
    shoot.geometry.dispose();
    shootMat.dispose();
    marker.geometry.dispose();
    (marker.material as THREE.Material).dispose();
    ship.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const material = mesh.material as THREE.Material | undefined;
      material?.dispose();
    });
    renderer.dispose();
  };
}
