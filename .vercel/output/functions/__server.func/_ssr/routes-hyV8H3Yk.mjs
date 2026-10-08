import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Menu, n as VolumeX, r as Volume2, t as X } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-hyV8H3Yk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var useCosmos = create((set) => ({
	chapter: "prologue",
	scale: 4,
	bangToken: 0,
	pointerX: 0,
	pointerY: 0,
	sound: false,
	setChapter: (chapter) => set({ chapter }),
	setScale: (scale) => set({ scale }),
	replayBang: () => set((s) => ({ bangToken: s.bangToken + 1 })),
	setPointer: (pointerX, pointerY) => set({
		pointerX,
		pointerY
	}),
	setSound: (sound) => set({ sound })
}));
var ctx = null;
var master = null;
function ensure() {
	if (ctx || typeof window === "undefined") return;
	const Ctx = window.AudioContext || window.webkitAudioContext;
	if (!Ctx) return;
	ctx = new Ctx();
	master = ctx.createGain();
	master.gain.value = 0;
	master.connect(ctx.destination);
	const low = ctx.createOscillator();
	low.type = "sine";
	low.frequency.value = 55;
	const lowGain = ctx.createGain();
	lowGain.gain.value = .2;
	low.connect(lowGain).connect(master);
	const fifth = ctx.createOscillator();
	fifth.type = "sine";
	fifth.frequency.value = 82.5;
	const fifthGain = ctx.createGain();
	fifthGain.gain.value = .07;
	fifth.connect(fifthGain).connect(master);
	const air = ctx.createOscillator();
	air.type = "sine";
	air.frequency.value = 196;
	const airGain = ctx.createGain();
	airGain.gain.value = .012;
	air.connect(airGain).connect(master);
	const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
	const noise = ctx.createBufferSource();
	noise.buffer = buffer;
	noise.loop = true;
	const filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = 420;
	const noiseGain = ctx.createGain();
	noiseGain.gain.value = .035;
	noise.connect(filter).connect(noiseGain).connect(master);
	low.start();
	fifth.start();
	air.start();
	noise.start();
	const drift = () => {
		if (!ctx) return;
		filter.frequency.setTargetAtTime(220 + Math.random() * 500, ctx.currentTime, 2.4);
		window.setTimeout(drift, 5e3);
	};
	drift();
}
function fade(value, seconds) {
	if (!ctx || !master) return;
	master.gain.cancelScheduledValues(ctx.currentTime);
	master.gain.setTargetAtTime(value, ctx.currentTime, seconds);
}
function enableSound() {
	ensure();
	ctx?.resume();
	useCosmos.getState().setSound(true);
}
function bindAmbience() {
	return useCosmos.subscribe((state, prev) => {
		if (prev && state.sound === prev.sound) return;
		if (!state.sound) {
			fade(0, .2);
			return;
		}
		ensure();
		ctx?.resume();
		fade(.16, .7);
	});
}
var DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function fa(value) {
	return String(value).replace(/\d/g, (d) => DIGITS[Number(d)] ?? d);
}
var MONTHS = [
	"ژانویه",
	"فوریه",
	"مارس",
	"آوریل",
	"مه",
	"ژوئن",
	"ژوئیه",
	"اوت",
	"سپتامبر",
	"اکتبر",
	"نوامبر",
	"دسامبر"
];
var MONTH_DAYS = [
	31,
	28,
	31,
	30,
	31,
	30,
	31,
	31,
	30,
	31,
	30,
	31
];
var COSMIC_YEAR = 13.8;
function tFromAgo(billionYearsAgo) {
	return Math.min(1, Math.max(0, 1 - billionYearsAgo / COSMIC_YEAR));
}
function pad(n) {
	return String(n).padStart(2, "0");
}
function momentLabel(t) {
	const x = Math.min(Math.max(t, 0), .999999) * 365;
	let dayIndex = Math.floor(x);
	const frac = x - dayIndex;
	let month = 0;
	while (month < 11 && dayIndex >= MONTH_DAYS[month]) {
		dayIndex -= MONTH_DAYS[month];
		month += 1;
	}
	const dom = dayIndex + 1;
	const clock = () => {
		const secs = Math.floor(frac * 86400);
		const h = Math.floor(secs / 3600);
		const m = Math.floor(secs % 3600 / 60);
		const s = secs % 60;
		return `${fa(pad(h))}:${fa(pad(m))}:${fa(pad(s))}`;
	};
	if (month === 0 && dom === 1 || month === 11 && dom === 31) return `${fa(dom)} ${MONTHS[month]}، ${clock()}`;
	return `${fa(dom)} ${MONTHS[month]}`;
}
var NAV = [
	{
		id: "prologue",
		label: "آغاز"
	},
	{
		id: "dawn",
		label: "نخستین نور"
	},
	{
		id: "calendar",
		label: "تقویم"
	},
	{
		id: "scale",
		label: "مقیاس"
	},
	{
		id: "pale",
		label: "نقطه‌ی آبی"
	},
	{
		id: "dust",
		label: "غبار ستاره"
	},
	{
		id: "worlds",
		label: "جهان‌های ممکن"
	},
	{
		id: "letter",
		label: "نامه"
	},
	{
		id: "end",
		label: "فرجام"
	}
];
var ORDER = NAV.map((item) => item.id);
var EVENTS = [
	{
		id: "bang",
		t: tFromAgo(13.8),
		title: "مهبانگ",
		body: "فضا و زمان از این‌جا شروع می‌شوند. همه‌چیز — هر کهکشان، هر قاشق، هر خاطره‌ای که بعدها ساخته خواهد شد — در حجمی کوچک‌تر از یک اتم جمع است."
	},
	{
		id: "light",
		t: tFromAgo(13.8 - 38e4 / 1e9),
		title: "نخستین نور",
		body: "جهان به اندازه‌ی کافی خنک و رقیق شده تا نور بتواند سفر کند. همان نور، امروز از همه‌ی جهت‌ها به ما می‌رسد؛ نقشه‌ی کودکیِ کیهان."
	},
	{
		id: "stars",
		t: tFromAgo(13.6),
		title: "نخستین ستاره‌ها",
		body: "تاریکیِ هیدروژن می‌شکند. نخستین کوره‌ها روشن می‌شوند و شروع می‌کنند عنصر بسازند. بدون آن‌ها، بعدها دستی وجود نمی‌داشت که این سطر را لمس کند."
	},
	{
		id: "galaxy",
		t: tFromAgo(11),
		title: "راه شیری",
		body: "ابرِ ستاره‌ها دیگر بی‌شکل نیست. صدها میلیارد خورشید، آرام، دور یک مرکز می‌چرخند. یکی از بازوهای کوچکش، خیلی بعد، خانه‌ی ما می‌شود."
	},
	{
		id: "earth",
		t: tFromAgo(4.54),
		title: "زایش زمین",
		body: "از قرصِ غبارِ دور یک ستاره‌ی جوان، سنگی با آهنِ مذاب زاده می‌شود. هنوز نه اقیانوسی، نه ماهی، نه نامی."
	},
	{
		id: "life",
		t: tFromAgo(3.7),
		title: "زندگی",
		body: "در آبِ گرم، شیمی کاری را تکرار می‌کند که دیگر رهایش نمی‌کند: خودش را می‌سازد. از این‌جا به بعد، کیهان فقط فیزیک نیست. کیهان حافظه دارد."
	},
	{
		id: "air",
		t: tFromAgo(2.4),
		title: "هوای تازه",
		body: "باکتری‌ها آسمان را عوض می‌کنند. اکسیژن، که برای خیلی از آن‌ها سم است، انباشته می‌شود — و راه را برای تنفس، و برای آتش، باز می‌کند."
	},
	{
		id: "cambrian",
		t: tFromAgo(.538),
		title: "انفجار گونه‌ها",
		body: "برای بیشترِ سال، زندگی ساده بود. حالا چشم و صدف و دندان وارد صحنه می‌شوند. جهان برای اولین بار دیده می‌شود."
	},
	{
		id: "dinos",
		t: tFromAgo(.233),
		title: "دایناسورها",
		body: "بیش از صد و شصت میلیون سال، زمین مالِ آن‌هاست. در مقیاسِ این تقویم، فقط چند روز."
	},
	{
		id: "impact",
		t: tFromAgo(.066),
		title: "سایه‌ی بلند",
		body: "سنگی از آسمان می‌رسد و خورشید را کم‌رنگ می‌کند. از آن سایه، پرنده‌ها و پستانداران کوچک بیرون می‌آیند — و خیلی بعد، ما."
	},
	{
		id: "us",
		t: tFromAgo(3e-4),
		title: "انسان",
		body: "گونه‌ای که می‌تواند به بالا نگاه کند و بپرسد این بالا چیست. حدود دوازده دقیقه به نیمه‌شب مانده؛ و همین گونه، ابزار و آتش و قصه را با هم دارد."
	},
	{
		id: "writing",
		t: tFromAgo(5e-6),
		title: "تاریخِ نوشته",
		body: "همه‌ی امپراتوری‌ها، همه‌ی کتاب‌ها، همه‌ی جنگ‌ها و همه‌ی لالایی‌ها در چند ثانیه‌ی آخرِ این سال جا می‌شوند. ما خیلی دیر آمده‌ایم، و دقیقاً برای همین، وقتِ تلف کردن نداریم."
	}
];
function eventAt(t) {
	let current = EVENTS[0];
	for (const event of EVENTS) if (event.t <= t + 1e-6) current = event;
	return current;
}
var SCALES = [
	{
		label: "هسته‌ی اتم",
		size: "چند فمتومتر",
		line: "این‌جا «جامد» فقط یک استعاره است. تقریباً همه‌ی آنچه لمس می‌کنی، خالی است."
	},
	{
		label: "مولکول آب",
		size: "کمتر از یک نانومتر",
		line: "دو هیدروژن، یک اکسیژن. شکلِ رود، ابر، و اشک."
	},
	{
		label: "سلول",
		size: "حدود یک‌صدم میلی‌متر",
		line: "شهری زنده، با دیوار و کتابخانه و کارخانه، کوچک‌تر از نقطه‌ی پایان این سطر."
	},
	{
		label: "انسان",
		size: "حدود دو متر",
		line: "مقیاسی که درد را می‌فهمد و آسمان را اندازه می‌گیرد. تو این‌جایی."
	},
	{
		label: "زمین",
		size: "حدود دوازده‌هزار و هفتصد کیلومتر",
		line: "تنها جایی که می‌دانیم باران می‌بارد و کسی زیر آن شعر می‌گوید."
	},
	{
		label: "خورشید",
		size: "حدود یک‌میلیون و چهارصد هزار کیلومتر",
		line: "یک ستاره‌ی معمولی در حومه‌ی کهکشان. برای ما، تفاوتِ شب و روز."
	},
	{
		label: "سامانه‌ی خورشیدی",
		size: "چند ساعت نوری",
		line: "هشت جهان، صدها قمر، و قرصی از غبار که هنوز سیاره می‌زاید."
	},
	{
		label: "راه شیری",
		size: "حدود صد هزار سال نوری",
		line: "صدها میلیارد خورشید. ما روی بازوی کوچکِ شکارچی نشسته‌ایم."
	},
	{
		label: "خوشه‌ی کهکشان‌ها",
		size: "ده‌ها میلیون سال نوری",
		line: "راه شیری این‌جا یک دانه است. خودِ خوشه هم، جایی، دانه است."
	},
	{
		label: "جهانِ قابل مشاهده",
		size: "حدود نود و سه میلیارد سال نوری",
		line: "افق. فراتر از آن، نور هنوز وقت نکرده به ما برسد. و ما، همین‌جا، داریم به آن فکر می‌کنیم."
	}
];
var ELEMENTS = [
	{
		id: "c",
		name: "کربن",
		where: "قلبِ ستاره‌های متوسط",
		line: "ستونِ هر مولکولی که خودش را زنده می‌نامد. در لایه‌های بیرونیِ غول‌های سرخ پخته و با بادِ ستاره به فضا سپرده می‌شود."
	},
	{
		id: "n",
		name: "نیتروژن",
		where: "چرخه‌های هسته‌ایِ ستاره‌های خورشیدمانند",
		line: "در هوایی که همین حالا فرو می‌دهی هست، و در بازهای دی‌ان‌ای. هدیه‌ی ستاره‌هایی آرام‌تر از آن‌هایی که می‌ترکند."
	},
	{
		id: "o",
		name: "اکسیژن",
		where: "ستاره‌های سنگین",
		line: "پیش از خورشید ساخته شده. هر نفست، وامِ ستاره‌ای است که دیگر نیست."
	},
	{
		id: "ca",
		name: "کلسیم",
		where: "انفجارِ ستاره‌های سنگین",
		line: "استخوان‌هایت غبارِ یک ابرنواخترند که آرام شده و شکلِ قامت گرفته."
	},
	{
		id: "fe",
		name: "آهن",
		where: "واپسین سوخت، لحظه‌ی پیش از فروپاشی",
		line: "وقتی ستاره به آهن می‌رسد، دیگر از همجوشی سودی نمی‌برد. فرو می‌ریزد، و آهن در خونِ تو هنوز همان داستان را حمل می‌کند."
	},
	{
		id: "au",
		name: "طلا",
		where: "برخوردِ ستاره‌های نوترونی",
		line: "از خشونتی چنان دور آمده که حالا، آرام، دورِ مچِ کسی حلقه می‌شود."
	}
];
var WORLDS = [
	{
		id: "ocean",
		title: "دریای دو خورشید",
		src: "/cosmos/ocean.jpg",
		alt: "اقیانوسی بیگانه در گرگ‌ومیش، با خورشیدی طلایی بر افق و ستاره‌ای سپید در آسمان",
		kicker: "کمربندِ غروب",
		line: "یک سو همیشه روز، یک سو همیشه شب.",
		body: "میان دو ستاره، سیاره‌ای آبی در قفلِ گرانشی مانده است. روزِ جاودان آب را می‌جوشاند و شبِ جاودان آن را سنگ می‌کند. اگر زندگی این‌جا باشد، در نوارِ باریکِ غروب است؛ جایی که موج هنوز مایع است و نور، مهربان. شاید موجوداتش هرگز کلمه‌ای برای «ظهر» نداشته باشند. فقط برای این رنگ، که نه طلاست و نه خاکستر."
	},
	{
		id: "ice",
		title: "شیشه‌ی یخ",
		src: "/cosmos/ice.jpg",
		alt: "صخره‌های بلند یخی با نور سبزآبی از شکاف‌ها، و غولی گازی در آسمان سیاه",
		kicker: "اقیانوسِ ندیده",
		line: "خورشید به این آب نمی‌رسد. کششِ سیاره‌ی مادر چرا.",
		body: "قمرِ یک غولِ گازی. پوسته‌ای از یخ به ضخامت کیلومترها، و زیر آن اقیانوسی که هرگز سپیده‌دم را ندیده. گرمایش از جزرومد می‌آید؛ از کشمکشِ همیشگی با سیاره‌ای که آسمان را پر کرده. اگر آن پایین چشمی باشد، آسمانش سقفِ یخ است و ستاره‌اش، ترک‌هایی که گه‌گاه نور پس می‌دهند."
	},
	{
		id: "forest",
		title: "جنگلِ شب‌تاب",
		src: "/cosmos/forest.jpg",
		alt: "درختان غول‌پیکر شب‌تاب در دره‌ای مه‌آلود، زیر سیاره‌ای حلقه‌دار",
		kicker: "شبی که تمام نمی‌شود",
		line: "این‌جا برگ‌ها خودشان چراغ‌اند.",
		body: "قمری در سایه‌ی دائمیِ یک غول. فتوسنتز با نورِ کمِ حلقه‌ها و با درخششِ خودِ بافت‌ها کار می‌کند. شب، تنها فصل است. جنگل آهسته نفس می‌کشد و کفِ دره از مهی روشن است، انگار کهکشان تصمیم گرفته روی زمین دراز بکشد. کسی که این‌جا به دنیا بیاید، روز را فقط از قصه‌ها می‌شناسد."
	},
	{
		id: "desert",
		title: "کویرِ حلقه‌ها",
		src: "/cosmos/desert.jpg",
		alt: "تل‌های شنی زیر آسمانی که حلقه‌ای یخی مثل پلی نقره‌ای از افق تا افق کشیده شده",
		kicker: "شب، روشن‌تر از ماه",
		line: "شن، شیشه‌ی یک برخوردِ کهن است.",
		body: "بیابانی از سیلیسِ آب‌شده، یادگارِ ضربه‌ای که سیاره را تقریباً از هم درید. شب‌ها حلقه‌ای از یخ از این سو تا آن سوی آسمان کشیده می‌شود؛ روشن‌تر از هر ماهی که زمین به خود دیده. سایه‌ها این‌جا کوتاه نمی‌شوند. فقط نقره‌ای‌اند. و باد، روی شیشه، صدایی مثل ساز دارد."
	}
];
var SEED_LETTERS = [
	"ما غبارِ روشنِ ستاره‌های مرده‌ایم.",
	"هنوز وقت هست که مهربان باشیم.",
	"به بالا نگاه کن؛ آن‌جا خانه‌ی بزرگ‌تر ماست."
];
var PLATES = {
	dawn: "/cosmos/dawn.jpg",
	calendar: "/cosmos/galaxy.jpg",
	pale: "/cosmos/pale.jpg",
	dust: "/cosmos/nova.jpg"
};
var CX = 180;
var CY = 136;
var R = 112;
function arcPoint(t) {
	const theta = (16 + t * 148) * Math.PI / 180;
	return [CX + Math.cos(theta) * R, CY - Math.sin(theta) * R];
}
function arcPath(t0, t1) {
	const steps = 28;
	let d = "";
	for (let i = 0; i <= steps; i += 1) {
		const [x, y] = arcPoint(t0 + (t1 - t0) * i / steps);
		d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
	}
	return d;
}
function Calendar() {
	const [t, setT] = (0, import_react.useState)(0);
	const drag = (0, import_react.useRef)(false);
	const current = eventAt(t);
	const label = momentLabel(t);
	const [hx, hy] = arcPoint(t);
	const tFromClient = (svg, clientX, clientY) => {
		const rect = svg.getBoundingClientRect();
		const x = (clientX - rect.left) / rect.width * 360;
		const y = (clientY - rect.top) / rect.height * 160;
		let best = 0;
		let bestD = Infinity;
		for (let i = 0; i <= 90; i += 1) {
			const guess = i / 90;
			const [px, py] = arcPoint(guess);
			const dx = px - x;
			const dy = py - y;
			const dist = dx * dx + dy * dy;
			if (dist < bestD) {
				bestD = dist;
				best = guess;
			}
		}
		return best;
	};
	const jump = (dir) => {
		if (dir > 0) {
			const forward = EVENTS.find((event) => event.t > t + 8e-4);
			setT(forward ? forward.t : .999);
			return;
		}
		const backward = [...EVENTS].reverse().find((event) => event.t < t - 8e-4);
		setT(backward ? backward.t : 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "touch-none",
				role: "slider",
				tabIndex: 0,
				"aria-valuemin": 0,
				"aria-valuemax": 1e3,
				"aria-valuenow": Math.round(t * 1e3),
				"aria-valuetext": `${label}، ${current.title}`,
				"aria-label": "تقویم کیهانی",
				onPointerDown: (event) => {
					event.currentTarget.focus();
				},
				onKeyDown: (event) => {
					const key = event.key;
					if (key === "ArrowLeft" || key === "ArrowUp") {
						event.preventDefault();
						setT((value) => Math.min(.999, value + (event.shiftKey ? .02 : .002)));
					} else if (key === "ArrowRight" || key === "ArrowDown") {
						event.preventDefault();
						setT((value) => Math.max(0, value - (event.shiftKey ? .02 : .002)));
					} else if (key === "Home") {
						event.preventDefault();
						setT(0);
					} else if (key === "End") {
						event.preventDefault();
						setT(.999);
					} else if (key === "PageDown") {
						event.preventDefault();
						jump(1);
					} else if (key === "PageUp") {
						event.preventDefault();
						jump(-1);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 360 160",
					className: "w-full text-gold",
					onPointerDown: (event) => {
						drag.current = true;
						event.currentTarget.setPointerCapture(event.pointerId);
						setT(tFromClient(event.currentTarget, event.clientX, event.clientY));
					},
					onPointerMove: (event) => {
						if (!drag.current) return;
						setT(tFromClient(event.currentTarget, event.clientX, event.clientY));
					},
					onPointerUp: () => {
						drag.current = false;
					},
					onPointerCancel: () => {
						drag.current = false;
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: arcPath(0, 1),
							fill: "none",
							stroke: "currentColor",
							strokeOpacity: "0.28",
							strokeWidth: "2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: arcPath(0, t),
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2.4"
						}),
						EVENTS.map((item) => {
							const [x, y] = arcPoint(item.t);
							const on = item.id === current.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: x,
								cy: y,
								r: on ? 4.5 : 2.4,
								fill: on ? "currentColor" : "var(--color-fg)"
							}, item.id);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: hx,
							cy: hy,
							r: "8",
							fill: "var(--color-bg)",
							stroke: "currentColor",
							strokeWidth: "2"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex justify-between text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "آغاز" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اکنون" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-gold",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "display text-4xl text-fg",
				children: current.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-fg md:text-lg",
				"aria-live": "polite",
				children: current.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "chip",
					onClick: () => jump(-1),
					children: "لحظه‌ی قبل"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "chip",
					onClick: () => jump(1),
					children: "لحظه‌ی بعد"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: EVENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "chip",
					"aria-pressed": item.id === current.id,
					onClick: () => setT(item.t),
					children: item.title
				}, item.id))
			})
		]
	});
}
function Scale() {
	const scale = useCosmos((s) => s.scale);
	const setScale = useCosmos((s) => s.setScale);
	const stop = SCALES[scale] ?? SCALES[4];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto size-56 md:size-64",
				"aria-hidden": "true",
				children: [SCALES.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-opacity duration-300 ${index === scale ? "border-gold" : "border-gold/30"}`,
					style: {
						width: `${(index + 1) / SCALES.length * 100}%`,
						height: `${(index + 1) / SCALES.length * 100}%`,
						opacity: index <= scale ? 1 : .28
					}
				}, index)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-gold",
				children: stop.size
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "display text-4xl text-fg",
				children: stop.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-fg md:text-lg",
				children: stop.line
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				role: "group",
				"aria-label": "مقیاس‌ها",
				children: SCALES.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "chip",
					"aria-pressed": index === scale,
					onClick: () => setScale(index),
					children: item.label
				}, item.label))
			})
		]
	});
}
function Elements() {
	const [id, setId] = (0, import_react.useState)(ELEMENTS[0].id);
	const note = ELEMENTS.find((item) => item.id === id) ?? ELEMENTS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				role: "group",
				"aria-label": "عنصرها",
				children: ELEMENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "chip",
					"aria-pressed": item.id === id,
					onClick: () => setId(item.id),
					children: item.name
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-gold",
				children: note.where
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-base text-fg md:text-lg",
				children: note.line
			})
		]
	});
}
function Worlds() {
	const [open, setOpen] = (0, import_react.useState)(null);
	const closeRef = (0, import_react.useRef)(null);
	const titleId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		if (!open) return;
		closeRef.current?.focus();
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(null);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKey);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-8 grid gap-4 sm:grid-cols-2",
			children: WORLDS.map((world) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "group relative aspect-video w-full overflow-hidden rounded-card text-start",
				onClick: () => setOpen(world),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: world.src,
						alt: world.alt,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute inset-x-0 bottom-0 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-gold",
							children: world.kicker
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "display block text-3xl text-fg",
							children: world.title
						})]
					})
				]
			}) }, world.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "این تصویرها پرتره‌ی خیال‌اند، نه عکسِ تلسکوپ."
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 md:items-center",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			onClick: () => setOpen(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-h-svh w-full overflow-y-auto md:max-w-3xl",
				onClick: (event) => event.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: open.src,
					alt: "",
					className: "aspect-video w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-bg px-5 py-6 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gold",
							children: open.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							id: titleId,
							className: "display text-4xl text-fg",
							children: open.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-gold",
							children: open.line
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-base text-fg md:text-lg",
							children: open.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							ref: closeRef,
							type: "button",
							className: "btn mt-6",
							onClick: () => setOpen(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-4",
								"aria-hidden": "true"
							}), "بازگشت"]
						})
					]
				})]
			})
		}) : null
	] });
}
var LETTER_KEY = "shabpeyma-letters";
function readLetters() {
	try {
		const raw = localStorage.getItem(LETTER_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => typeof item === "string").slice(0, 16);
	} catch {
		return [];
	}
}
function Letter() {
	const [text, setText] = (0, import_react.useState)("");
	const [mine, setMine] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMine(readLetters());
		setReady(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8",
		onSubmit: (event) => {
			event.preventDefault();
			const clean = text.replace(/\s+/g, " ").trim().slice(0, 120);
			if (clean.length < 2) {
				setNote("حداقل یک جمله‌ی کوتاه بنویس.");
				return;
			}
			const next = [clean, ...mine.filter((item) => item !== clean)].slice(0, 16);
			setMine(next);
			try {
				localStorage.setItem(LETTER_KEY, JSON.stringify(next));
			} catch {
				setNote("جمله همین‌جا ماند، ولی مرورگر اجازه‌ی ذخیره‌اش را نداد.");
				setText("");
				return;
			}
			setText("");
			setNote("نشست میان ستاره‌ها. فقط روی همین دستگاه می‌ماند — و همین هم کم نیست.");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm text-muted",
				htmlFor: "cosmic-letter",
				children: "جمله‌ات"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "cosmic-letter",
				className: "field mt-2",
				maxLength: 120,
				value: text,
				placeholder: "یک جمله برای تاریکیِ روشن",
				onChange: (event) => setText(event.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "btn mt-4",
				children: "بسپار به بادبان"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 min-h-6 text-sm text-gold",
				"aria-live": "polite",
				children: note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-3",
				children: [ready ? mine.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 size-1.5 shrink-0 rounded-full bg-gold",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
				}, line)) : null, SEED_LETTERS.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-3 size-1.5 shrink-0 rounded-full bg-gold/70",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
				}, line))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: ready ? `${fa(mine.length)} جمله‌ی تو، و سه جمله‌ای که پیش از تو رسیده‌اند.` : "سه جمله، پیش از تو این‌جا بوده‌اند."
			})
		]
	});
}
function SoundButton() {
	const sound = useCosmos((s) => s.sound);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "icon-btn",
		"aria-pressed": sound,
		"aria-label": sound ? "خاموش کردن صدا" : "روشن کردن صدای فضا",
		onClick: () => {
			if (useCosmos.getState().sound) useCosmos.getState().setSound(false);
			else enableSound();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative size-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
				className: `absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${sound ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"}`,
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {
				className: `absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${sound ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"}`,
				"aria-hidden": "true"
			})]
		})
	});
}
function Chrome() {
	const chapter = useCosmos((s) => s.chapter);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "fixed inset-x-0 top-0 z-40 border-b border-gold/15 bg-bg/55 px-4 py-3 backdrop-blur-md md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#prologue",
					className: "text-lg font-medium text-fg",
					children: "شب‌پیما"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-4 lg:flex",
					"aria-label": "فصل‌ها",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `#${item.id}`,
						className: item.id === chapter ? "text-sm text-gold" : "text-sm text-muted",
						"aria-current": item.id === chapter ? "true" : void 0,
						children: item.label
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "icon-btn lg:hidden",
						"aria-expanded": open,
						"aria-label": open ? "بستن فصل‌ها" : "فصل‌ها",
						onClick: () => setOpen((value) => !value),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "mt-3 flex flex-col lg:hidden",
			"aria-label": "فصل‌ها",
			children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `#${item.id}`,
				className: "flex min-h-11 items-center text-fg",
				onClick: () => setOpen(false),
				children: item.label
			}, item.id))
		}) : null]
	});
}
function Plates() {
	const chapter = useCosmos((s) => s.chapter);
	const active = PLATES[chapter];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none fixed inset-0 z-0",
		"aria-hidden": "true",
		children: [Object.entries(PLATES).map(([id, src]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			loading: id === "dawn" ? "eager" : "lazy",
			className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${chapter === id ? "opacity-100" : "opacity-0"}`
		}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `scrim absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}` })]
	});
}
function Progress() {
	(0, import_react.useEffect)(() => {
		const bar = document.getElementById("voyage-progress");
		if (!bar) return;
		let raf = 0;
		const loop = () => {
			const root = document.documentElement;
			const max = root.scrollHeight - root.clientHeight;
			const p = max > 0 ? root.scrollTop / max : 0;
			bar.style.transform = `scaleX(${p})`;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed inset-x-0 bottom-0 z-40 h-0.5 bg-gold/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "voyage-progress",
			className: "progress-bar h-full bg-gold",
			style: { transform: "scaleX(0)" }
		})
	});
}
function Next({ id }) {
	const next = ORDER[ORDER.indexOf(id) + 1];
	if (!next) return null;
	const label = NAV.find((item) => item.id === next)?.label ?? "ادامه";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		className: "btn mt-8",
		href: `#${next}`,
		children: label
	});
}
function Block({ id, kicker, title, children, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		"data-chapter": id,
		className: "flex min-h-svh items-center px-5 py-28 md:px-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: wide ? "w-full max-w-5xl" : "w-full max-w-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gold",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "display mt-1 text-4xl text-fg md:text-5xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-4 text-base text-fg md:text-lg",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Next, { id })
			]
		})
	});
}
function Experience() {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => bindAmbience(), []);
	(0, import_react.useEffect)(() => {
		const nodes = document.querySelectorAll("[data-chapter]");
		const visible = /* @__PURE__ */ new Map();
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const id = entry.target.getAttribute("data-chapter");
				if (id) visible.set(id, entry.intersectionRect.height);
			}
			let best = "prologue";
			let score = 0;
			for (const [id, height] of visible) if (height > score) {
				score = height;
				best = id;
			}
			if (score > 48) useCosmos.getState().setChapter(best);
		}, { threshold: [
			0,
			.08,
			.16,
			.28,
			.45,
			.7,
			1
		] });
		nodes.forEach((node) => observer.observe(node));
		return () => observer.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let cleanup = () => {};
		let cancel = false;
		import("./scene-CrJyzX8S.mjs").then((mod) => {
			if (cancel) return;
			cleanup = mod.mountScene(canvas);
		});
		return () => {
			cancel = true;
			cleanup();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plates, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "pointer-events-none fixed inset-0 z-[1] h-svh w-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette pointer-events-none fixed inset-0 z-[2]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grain pointer-events-none fixed inset-0 z-[2]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chrome, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "prologue",
						"data-chapter": "prologue",
						className: "flex min-h-svh items-end px-5 pt-28 pb-16 md:items-center md:px-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gold",
									children: "سفری در زمان، مکان، و جهان‌های ممکن"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "display text-5xl text-fg md:text-7xl",
									children: "شب‌پیما"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-lg text-lg text-fg md:text-xl",
									children: "همه‌چیز از یک سکوتِ داغ آغاز شد. بعد نور آمد، بعد ستاره، بعد ما — که حالا می‌توانیم به عقب نگاه کنیم و بپرسیم از کجا آمده‌ایم."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-lg text-base text-muted",
									children: "بادبانِ شب جلوتر از تو حرکت می‌کند. تقویم را با دست بچرخان، از اندازه‌ی خودت تا لبه‌ی جهان برو، و اگر خواستی یک جمله را میان ستاره‌ها جا بگذار."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "btn mt-8",
									href: "#dawn",
									children: "سوار بادبان شو"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "bob mt-10 text-sm text-muted",
									children: "به پایین، به سمتِ نخستین نور"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "dawn",
						kicker: "سیزده میلیارد و هشتصد میلیون سال پیش",
						title: "وقتی هیچ‌چیز، همه‌چیز شد",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "در نخستین لحظه، کیهان کوچک‌تر از نقطه‌ای بود که این جمله را تمام می‌کند. نه فضایی بیرون از آن بود و نه زمانی پیش از آن. بعد، در کسری از ثانیه، گسترده‌تر از هر فاصله‌ای شد که ذهن بتواند بی‌آن‌که بترسد تصور کند." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "سیصد و هشتاد هزار سال بعد، مهِ داغ رقیق شد و نور برای اولین بار توانست سفر کند. همان نور هنوز از همه‌ی جهت‌ها به ما می‌رسد؛ پژواکِ تولد." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "و چند صد میلیون سال بعد، نخستین ستاره‌ها در تاریکیِ هیدروژن روشن شدند. هر اتمِ کربن در دستت، هر اتمِ آهن در خونت، در دلِ یکی از همین کوره‌ها پخته شد." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => useCosmos.getState().replayBang(),
								children: "یک بار دیگر، نور"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "calendar",
						kicker: "اگر کیهان یک سال باشد",
						title: "تقویمِ همه‌چیز",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "نیمه‌شبِ اولِ ژانویه، آغاز است. همین حالا، آخرین لحظه‌ی سی‌ویکمِ دسامبر. بیشترِ سال، کیهان تنهاست با ستاره‌ها. زمین تازگیِ پاییز را دارد. و همه‌ی تاریخِ نوشته‌ی انسان در چند ثانیه‌ی آخر جا می‌شود." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "کمان را بکش، یا نامِ یک عصر را لمس کن."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "scale",
						kicker: "از هسته تا افق",
						title: "جایی میانِ هیچ و همه‌چیز",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "از هسته‌ی اتم تا لبه‌ی جهانِ قابلِ مشاهده، حدود چهل مرتبه‌ی بزرگی فاصله است. تو جایی در میانه‌ای. نه در مرکز — مرکزی در کار نیست — در تنها مقیاسی که می‌تواند به این پرسش فکر کند." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "آسمان با انتخابِ تو نزدیک می‌شود یا عقب می‌رود."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "pale",
						kicker: "از فاصله‌ی شش میلیارد کیلومتر",
						title: "آن نقطه‌ی کمرنگ",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "در سال ۱۹۹۰، از کناره‌ی سامانه‌ی خورشیدی، دوربینی برگشت و به خانه نگاه کرد. زمین، در میان یک پرتوِ پراکنده‌ی آفتاب، چیزی نبود جز یک نقطه‌ی آبیِ کمرنگ." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "روی همان نقطه، هر کسی که دوستش داشته‌ای راه رفته است. هر زبانی آن‌جا ساخته شده. هر پرچمی آن‌جا برافراشته و تا شده. از این فاصله، خط‌های روی نقشه دیده نمی‌شوند — چون از اول هم، بیشتر از یک توافقِ شکننده نبودند." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اگر این تصویر وظیفه‌ای داشته باشد، این است: به ما یادآوری کند که خانه کوچک است، و مهربانی تنها فناوریِ واقعاً ضروریِ ماست." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "dust",
						kicker: "مصالحِ یک نفر",
						title: "آنچه در سینه‌ات می‌تپد",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "کلسیمِ استخوانت در انفجارِ ستاره‌های سنگین ساخته شد. آهنِ خونت هم. اکسیژنی که همین حالا فرو می‌دهی، هدیه‌ی ستاره‌هایی است که پیش از خورشید مرده‌اند." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "پس وقتی می‌گویی «من»، داری از یک کهکشان حرف می‌زنی که لحظه‌ای تصمیم گرفته خودش را ببیند." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Elements, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "worlds",
						wide: true,
						kicker: "پرتره‌هایی که هنوز سلام نشده‌اند",
						title: "جهان‌های ممکن",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "در کهکشان ما، شمارِ سیاره‌ها از ستاره‌ها بیشتر است. بیشترشان را هرگز نخواهیم دید. اما می‌توانیم، با آنچه از فیزیک می‌دانیم، تصور کنیم آن‌جا شب چگونه می‌گذرد." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "این همان کاری است که علم، پیش از رسیدنِ ابزار، همیشه کرده: خیالِ دقیق." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Worlds, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						id: "letter",
						kicker: "صندوقِ پستی ندارد",
						title: "یک جمله برای تاریکیِ روشن",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "کیهان نامه‌ها را جواب نمی‌دهد. اما نوشتن مالِ ماست. اگر فقط یک جمله اجازه‌ی سفر داشته باشد — جمله‌ای که بخواهی جایی میان ستاره‌ها بماند — چه می‌نویسی؟" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Letter, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						id: "end",
						"data-chapter": "end",
						className: "flex min-h-svh items-center px-5 py-28 md:px-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full max-w-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gold",
									children: "پایانِ صفحه، نه پایانِ سفر"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "display mt-1 text-4xl text-fg md:text-5xl",
									children: "چراغ را پایین نیاور"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 space-y-4 text-base text-fg md:text-lg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "سفر تمام نمی‌شود. فقط این صفحه به ته می‌رسد." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "امشب اگر آسمان صاف بود، یک ستاره را انتخاب کن. لازم نیست نامش را بدانی. همان که چشم، بی‌دلیل، رویش مکث می‌کند. برای یک نفر نگه‌اش دار — کسی که دوستش داری، یا کسی که دیگر نیست." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ما غبارِ ستاره‌ایم، بله. اما غباری که می‌تواند عاشق شود، و این، در همه‌ی کیهان، هنوز کمیاب‌ترین چیز است." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "btn mt-8",
									href: "#prologue",
									children: "بازگشت به آغاز"
								})
							]
						})
					})
				]
			})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Experience, {});
}
//#endregion
export { useCosmos as n, routes_exports as t };
