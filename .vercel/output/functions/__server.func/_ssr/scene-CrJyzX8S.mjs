import { n as useCosmos } from "./routes-hyV8H3Yk.mjs";
import { _ as SphereGeometry, a as Group, b as Vector3, c as MeshBasicMaterial, d as PointLight, f as Points, g as Sphere, h as ShaderMaterial, i as Clock, l as PerspectiveCamera, m as Scene, n as BufferAttribute, o as MathUtils, p as SRGBColorSpace, r as BufferGeometry, s as Mesh, t as WebGLRenderer, u as PlaneGeometry, v as TextureLoader, y as TorusGeometry } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scene-CrJyzX8S.js
var STAR_VERT = `
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
var STAR_FRAG = `
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
function presets() {
	const v = (x, y, z) => new Vector3(x, y, z);
	return {
		prologue: {
			p: v(0, 1.4, 48),
			l: v(0, 0, 0)
		},
		dawn: {
			p: v(7, .6, 26),
			l: v(0, 0, -8)
		},
		calendar: {
			p: v(-4, 6, 38),
			l: v(0, 0, -10)
		},
		scale: {
			p: v(0, .4, 40),
			l: v(0, 0, 0)
		},
		pale: {
			p: v(10, 2, 28),
			l: v(0, 0, -6)
		},
		dust: {
			p: v(3, -1, 24),
			l: v(0, 1, -12)
		},
		worlds: {
			p: v(-8, 2.2, 34),
			l: v(4, 0, 0)
		},
		letter: {
			p: v(0, 5, 42),
			l: v(0, 0, 0)
		},
		end: {
			p: v(2, 3, 50),
			l: v(0, 0, -4)
		}
	};
}
function makeStars(count) {
	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);
	const sizes = new Float32Array(count);
	const seeds = new Float32Array(count);
	for (let i = 0; i < count; i += 1) {
		const band = Math.random() < .42;
		let x;
		let y;
		let z;
		if (band) {
			const a = Math.random() * Math.PI * 2;
			const rad = 28 + Math.random() * 170;
			x = Math.cos(a) * rad;
			z = Math.sin(a) * rad;
			y = (Math.random() - .5) * 16 * Math.random();
		} else {
			const r = 18 + Math.random() ** .5 * 230;
			const th = Math.random() * Math.PI * 2;
			const ph = Math.acos(2 * Math.random() - 1);
			x = r * Math.sin(ph) * Math.cos(th);
			y = r * Math.sin(ph) * Math.sin(th) * .7;
			z = r * Math.cos(ph);
		}
		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;
		const roll = Math.random();
		if (roll > .93) colors.set([
			.62,
			.76,
			1
		], i * 3);
		else if (roll > .78) colors.set([
			1,
			.84,
			.58
		], i * 3);
		else colors.set([
			.86,
			.88,
			.95
		], i * 3);
		sizes[i] = roll > .97 ? 3.4 : .7 + Math.random() * 1.5;
		seeds[i] = Math.random();
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new BufferAttribute(positions, 3));
	geo.setAttribute("aColor", new BufferAttribute(colors, 3));
	geo.setAttribute("aSize", new BufferAttribute(sizes, 1));
	geo.setAttribute("aSeed", new BufferAttribute(seeds, 1));
	geo.computeBoundingSphere();
	const mat = new ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uPixelRatio: { value: 1 }
		},
		vertexShader: STAR_VERT,
		fragmentShader: STAR_FRAG,
		transparent: true,
		depthWrite: false,
		blending: 2
	});
	return new Points(geo, mat);
}
function makeShip() {
	const group = new Group();
	const gold = new MeshBasicMaterial({
		color: 14992522,
		transparent: true,
		opacity: .9
	});
	const ivory = new MeshBasicMaterial({
		color: 16052198,
		transparent: true,
		opacity: .55
	});
	const ringA = new Mesh(new TorusGeometry(1.15, .012, 8, 90), gold);
	ringA.rotation.x = Math.PI / 2.35;
	const ringB = new Mesh(new TorusGeometry(.78, .008, 8, 70), ivory);
	ringB.rotation.x = Math.PI / 2;
	ringB.rotation.y = .7;
	const sail = new Mesh(new TorusGeometry(1.55, .007, 6, 80, Math.PI * 1.15), gold);
	sail.rotation.y = Math.PI / 2;
	sail.rotation.z = .35;
	const keel = new Mesh(new SphereGeometry(.16, 16, 12), gold);
	keel.scale.set(.7, .28, 2.5);
	const bow = new Mesh(new SphereGeometry(.045, 12, 12), new MeshBasicMaterial({ color: 16774884 }));
	bow.position.z = 1.15;
	group.add(ringA, ringB, sail, keel, bow);
	group.scale.setScalar(.72);
	return group;
}
function makeBang(count) {
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
		colors.set(warm > .5 ? [
			1,
			.82,
			.55
		] : [
			.75,
			.86,
			1
		], i * 3);
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new BufferAttribute(positions, 3));
	geo.setAttribute("aColor", new BufferAttribute(colors, 3));
	const sizes = new Float32Array(count);
	const seeds = new Float32Array(count);
	for (let i = 0; i < count; i += 1) {
		sizes[i] = 1.4 + Math.random() * 2.2;
		seeds[i] = Math.random();
	}
	geo.setAttribute("aSize", new BufferAttribute(sizes, 1));
	geo.setAttribute("aSeed", new BufferAttribute(seeds, 1));
	geo.boundingSphere = new Sphere(new Vector3(), 220);
	const mat = new ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uPixelRatio: { value: 1 }
		},
		vertexShader: STAR_VERT,
		fragmentShader: STAR_FRAG,
		transparent: true,
		depthWrite: false,
		blending: 2
	});
	const points = new Points(geo, mat);
	points.visible = false;
	return {
		points,
		dirs
	};
}
function mountScene(canvas) {
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const mobile = window.matchMedia("(max-width: 760px)").matches;
	const renderer = new WebGLRenderer({
		canvas,
		alpha: true,
		antialias: !mobile,
		powerPreference: "high-performance"
	});
	if (!renderer.getContext()) {
		renderer.dispose();
		return () => {};
	}
	renderer.setClearColor(0, 0);
	const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.7);
	renderer.setPixelRatio(pixelRatio);
	const scene = new Scene();
	const camera = new PerspectiveCamera(52, 1, .1, 900);
	const cameraPos = new Vector3(0, 1.4, 48);
	const look = new Vector3();
	const desired = new Vector3();
	const desiredLook = new Vector3();
	const shipOffset = new Vector3(mobile ? -.4 : -2.4, mobile ? 1.6 : -.55, -9);
	const shipWorld = new Vector3();
	const forward = new Vector3();
	const ahead = new Vector3();
	const stars = makeStars(mobile ? 4800 : 11e3);
	const starMat = stars.material;
	scene.add(stars);
	const dust = makeStars(mobile ? 280 : 700);
	dust.scale.setScalar(.35);
	scene.add(dust);
	const ship = makeShip();
	scene.add(ship);
	const marker = new Mesh(new SphereGeometry(1, 28, 20), new MeshBasicMaterial({ color: 10406399 }));
	marker.visible = false;
	scene.add(marker);
	const sunGlow = new PointLight(14992522, 0, 30);
	scene.add(sunGlow);
	const galaxyTex = new TextureLoader().load("/cosmos/galaxy.jpg");
	galaxyTex.colorSpace = SRGBColorSpace;
	const galaxy = new Mesh(new PlaneGeometry(150, 58), new MeshBasicMaterial({
		map: galaxyTex,
		transparent: true,
		opacity: .2,
		depthWrite: false,
		blending: 2,
		side: 2
	}));
	galaxy.position.set(0, -4, -90);
	scene.add(galaxy);
	const galaxyMat = galaxy.material;
	const bangCount = mobile ? 900 : 2200;
	const bang = makeBang(bangCount);
	scene.add(bang.points);
	const bangMat = bang.points.material;
	const chapterPresets = presets();
	let seenBang = 0;
	let bangStart = -1;
	let autoDawn = false;
	let shootLife = -1;
	let nextShoot = 6;
	const shoot = new Mesh(new PlaneGeometry(7, .035), new MeshBasicMaterial({
		color: 16052198,
		transparent: true,
		opacity: 0,
		depthWrite: false,
		blending: 2,
		side: 2
	}));
	scene.add(shoot);
	const shootMat = shoot.material;
	const resize = () => {
		const w = window.innerWidth;
		const h = Math.max(1, window.innerHeight);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h, false);
	};
	resize();
	const onPointer = (event) => {
		const x = event.clientX / window.innerWidth * 2 - 1;
		const y = -(event.clientY / window.innerHeight * 2 - 1);
		useCosmos.getState().setPointer(x, y);
	};
	window.addEventListener("pointermove", onPointer);
	window.addEventListener("resize", resize);
	let raf = 0;
	let running = true;
	const clock = new Clock();
	const frame = () => {
		if (!running) return;
		raf = requestAnimationFrame(frame);
		if (document.hidden) return;
		const dt = Math.min(.05, clock.getDelta());
		const time = clock.elapsedTime;
		const state = useCosmos.getState();
		const chapter = state.chapter;
		starMat.uniforms.uTime.value = time;
		starMat.uniforms.uPixelRatio.value = pixelRatio;
		bangMat.uniforms.uTime.value = time;
		bangMat.uniforms.uPixelRatio.value = pixelRatio;
		if (!reduced) {
			const spin = chapter === "scale" ? .012 + (1 - state.scale / 9) * .03 : .008;
			stars.rotation.y += spin * dt * 8;
			dust.rotation.y -= dt * .05;
			galaxy.rotation.z += dt * .01;
		}
		const preset = chapterPresets[chapter];
		desired.copy(preset.p);
		desiredLook.copy(preset.l);
		if (chapter === "scale") {
			const u = state.scale / 9;
			desired.z = MathUtils.lerp(8, 86, u);
			desired.y = MathUtils.lerp(-.4, 8, u);
		}
		desired.x += state.pointerX * (mobile ? .4 : 1.5);
		desired.y += state.pointerY * (mobile ? .25 : .8);
		const glide = reduced ? 1 : 1 - Math.pow(.001, dt);
		cameraPos.lerp(desired, glide);
		look.lerp(desiredLook, glide);
		camera.position.copy(cameraPos);
		camera.lookAt(look);
		shipOffset.set(mobile ? -.35 : -2.35, mobile ? 1.7 : -.5, -8.5);
		shipOffset.applyQuaternion(camera.quaternion);
		shipWorld.copy(camera.position).add(shipOffset);
		const bob = reduced ? 0 : Math.sin(time * .6) * .15;
		ship.position.copy(shipWorld);
		ship.position.y += bob;
		camera.getWorldDirection(forward);
		ahead.copy(ship.position).add(forward);
		ship.lookAt(ahead);
		ship.rotateZ(Math.sin(time * .35) * .15);
		const shipOpacity = chapter === "dawn" || chapter === "pale" || chapter === "dust" ? .22 : .92;
		ship.traverse((obj) => {
			const material = obj.material;
			if (material && "opacity" in material) {
				if (material.userData.base == null) material.userData.base = material.opacity;
				const base = material.userData.base;
				material.opacity = MathUtils.lerp(material.opacity, base * shipOpacity, .08);
			}
		});
		const galaxyTarget = chapter === "calendar" ? .72 : chapter === "scale" && state.scale >= 7 ? .6 : .18;
		galaxyMat.opacity = MathUtils.lerp(galaxyMat.opacity, galaxyTarget, .04);
		const showEarth = chapter === "scale" && state.scale === 4;
		const showSun = chapter === "scale" && state.scale === 5;
		marker.visible = showEarth || showSun;
		if (showEarth) {
			marker.scale.setScalar(MathUtils.lerp(marker.scale.x, .22, .08));
			marker.material.color.set(9353192);
			sunGlow.intensity = MathUtils.lerp(sunGlow.intensity, .4, .08);
		} else if (showSun) {
			marker.scale.setScalar(MathUtils.lerp(marker.scale.x, 1.8, .08));
			marker.material.color.set(15254138);
			sunGlow.intensity = MathUtils.lerp(sunGlow.intensity, 4, .08);
		} else sunGlow.intensity = MathUtils.lerp(sunGlow.intensity, 0, .08);
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
			const ease = 1 - (1 - Math.min(1, age / 5.2)) ** 3;
			const fade = age < .25 ? age / .25 : 1 - (age - .25) / 6.2;
			bangMat.opacity = Math.max(0, fade);
			const pos = bang.points.geometry.attributes.position;
			for (let i = 0; i < bangCount; i += 1) {
				const rad = .2 + ease * (16 + i % 17);
				pos.setXYZ(i, bang.dirs[i * 3] * rad, bang.dirs[i * 3 + 1] * rad, bang.dirs[i * 3 + 2] * rad);
			}
			pos.needsUpdate = true;
			bang.points.visible = true;
		} else if (bang.points.visible) bang.points.visible = false;
		nextShoot -= dt;
		if (!reduced && nextShoot <= 0 && shootLife < 0) {
			nextShoot = 8 + Math.random() * 10;
			shootLife = 0;
			shoot.position.set((Math.random() - .5) * 30, 6 + Math.random() * 8, -20 - Math.random() * 30);
			shoot.rotation.z = -.4 - Math.random() * .6;
		}
		if (shootLife >= 0) {
			shootLife += dt;
			const u = shootLife / 1.15;
			shoot.position.x -= dt * 18;
			shoot.position.y -= dt * 7;
			shootMat.opacity = u < .2 ? u / .2 : Math.max(0, 1 - (u - .2) / .8);
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
		dust.geometry.dispose();
		dust.material.dispose();
		bang.points.geometry.dispose();
		bangMat.dispose();
		galaxy.geometry.dispose();
		galaxyMat.dispose();
		galaxyTex.dispose();
		shoot.geometry.dispose();
		shootMat.dispose();
		marker.geometry.dispose();
		marker.material.dispose();
		ship.traverse((obj) => {
			const mesh = obj;
			mesh.geometry?.dispose();
			mesh.material?.dispose();
		});
		renderer.dispose();
	};
}
//#endregion
export { mountScene };
