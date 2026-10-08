import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  ELEMENTS,
  EVENTS,
  SCALES,
  SEED_LETTERS,
  WORLDS,
  eventAt,
  fa,
  momentLabel,
  type World,
} from "@/cosmos/content";
import { useCosmos } from "@/cosmos/store";

const CX = 180;
const CY = 136;
const R = 112;

function arcPoint(t: number): [number, number] {
  const theta = ((16 + t * 148) * Math.PI) / 180;
  return [CX + Math.cos(theta) * R, CY - Math.sin(theta) * R];
}

function arcPath(t0: number, t1: number): string {
  const steps = 28;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const [x, y] = arcPoint(t);
    d += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

export function Calendar() {
  const [t, setT] = useState(0);
  const drag = useRef(false);
  const current = eventAt(t);
  const label = momentLabel(t);
  const [hx, hy] = arcPoint(t);

  const tFromClient = (svg: SVGSVGElement, clientX: number, clientY: number) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 360;
    const y = ((clientY - rect.top) / rect.height) * 160;
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

  const jump = (dir: 1 | -1) => {
    if (dir > 0) {
      const forward = EVENTS.find((event) => event.t > t + 0.0008);
      setT(forward ? forward.t : 0.999);
      return;
    }
    const backward = [...EVENTS].reverse().find((event) => event.t < t - 0.0008);
    setT(backward ? backward.t : 0);
  };

  return (
    <div className="mt-8">
      <div
        className="touch-none"
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={1000}
        aria-valuenow={Math.round(t * 1000)}
        aria-valuetext={`${label}، ${current.title}`}
        aria-label="تقویم کیهانی"
        onPointerDown={(event) => {
          event.currentTarget.focus();
        }}
        onKeyDown={(event) => {
          const key = event.key;
          if (key === "ArrowLeft" || key === "ArrowUp") {
            event.preventDefault();
            setT((value) => Math.min(0.999, value + (event.shiftKey ? 0.02 : 0.002)));
          } else if (key === "ArrowRight" || key === "ArrowDown") {
            event.preventDefault();
            setT((value) => Math.max(0, value - (event.shiftKey ? 0.02 : 0.002)));
          } else if (key === "Home") {
            event.preventDefault();
            setT(0);
          } else if (key === "End") {
            event.preventDefault();
            setT(0.999);
          } else if (key === "PageDown") {
            event.preventDefault();
            jump(1);
          } else if (key === "PageUp") {
            event.preventDefault();
            jump(-1);
          }
        }}
      >
        <svg
          viewBox="0 0 360 160"
        className="w-full text-gold"
          onPointerDown={(event) => {
            drag.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setT(tFromClient(event.currentTarget, event.clientX, event.clientY));
          }}
          onPointerMove={(event) => {
            if (!drag.current) return;
            setT(tFromClient(event.currentTarget, event.clientX, event.clientY));
          }}
          onPointerUp={() => {
            drag.current = false;
          }}
          onPointerCancel={() => {
            drag.current = false;
          }}
        >
          <path d={arcPath(0, 1)} fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
          <path d={arcPath(0, t)} fill="none" stroke="currentColor" strokeWidth="2.4" />
          {EVENTS.map((item) => {
            const [x, y] = arcPoint(item.t);
            const on = item.id === current.id;
            return (
              <circle
                key={item.id}
                cx={x}
                cy={y}
                r={on ? 4.5 : 2.4}
                fill={on ? "currentColor" : "var(--color-fg)"}
              />
            );
          })}
          <circle cx={hx} cy={hy} r="8" fill="var(--color-bg)" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-sm text-muted">
        <span>آغاز</span>
        <span>اکنون</span>
      </div>
      <p className="mt-6 text-sm text-gold">{label}</p>
      <h3 className="display text-4xl text-fg">{current.title}</h3>
      <p className="mt-2 text-base text-fg md:text-lg" aria-live="polite">
        {current.body}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="chip" onClick={() => jump(-1)}>
          لحظه‌ی قبل
        </button>
        <button type="button" className="chip" onClick={() => jump(1)}>
          لحظه‌ی بعد
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {EVENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={item.id === current.id}
            onClick={() => setT(item.t)}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Scale() {
  const scale = useCosmos((s) => s.scale);
  const setScale = useCosmos((s) => s.setScale);
  const stop = SCALES[scale] ?? SCALES[4];

  return (
    <div className="mt-8">
      <div className="relative mx-auto size-56 md:size-64" aria-hidden="true">
        {SCALES.map((_, index) => (
          <span
            key={index}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-opacity duration-300 ${index === scale ? "border-gold" : "border-gold/30"}`}
            style={{
              width: `${((index + 1) / SCALES.length) * 100}%`,
              height: `${((index + 1) / SCALES.length) * 100}%`,
              opacity: index <= scale ? 1 : 0.28,
            }}
          />
        ))}
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
      </div>
      <p className="mt-6 text-sm text-gold">{stop.size}</p>
      <h3 className="display text-4xl text-fg">{stop.label}</h3>
      <p className="mt-2 text-base text-fg md:text-lg">{stop.line}</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="مقیاس‌ها">
        {SCALES.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="chip"
            aria-pressed={index === scale}
            onClick={() => setScale(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Elements() {
  const [id, setId] = useState(ELEMENTS[0].id);
  const note = ELEMENTS.find((item) => item.id === id) ?? ELEMENTS[0];
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="عنصرها">
        {ELEMENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={item.id === id}
            onClick={() => setId(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-gold">{note.where}</p>
      <p className="mt-1 text-base text-fg md:text-lg">{note.line}</p>
    </div>
  );
}

export function Worlds() {
  const [open, setOpen] = useState<World | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {WORLDS.map((world) => (
          <li key={world.id}>
            <button
              type="button"
              className="group relative aspect-video w-full overflow-hidden rounded-card text-start"
              onClick={() => setOpen(world)}
            >
              <img
                src={world.src}
                alt={world.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4">
                <span className="block text-sm text-gold">{world.kicker}</span>
                <span className="display block text-3xl text-fg">{world.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted">این تصویرها پرتره‌ی خیال‌اند، نه عکسِ تلسکوپ.</p>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 md:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(null)}
        >
          <div
            className="relative max-h-svh w-full overflow-y-auto md:max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={open.src} alt="" className="aspect-video w-full object-cover" />
            <div className="bg-bg px-5 py-6 md:px-8">
              <p className="text-sm text-gold">{open.kicker}</p>
              <h3 id={titleId} className="display text-4xl text-fg">
                {open.title}
              </h3>
              <p className="mt-2 text-gold">{open.line}</p>
              <p className="mt-3 text-base text-fg md:text-lg">{open.body}</p>
              <button ref={closeRef} type="button" className="btn mt-6" onClick={() => setOpen(null)}>
                <X className="size-4" aria-hidden="true" />
                بازگشت
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const LETTER_KEY = "shabpeyma-letters";

function readLetters(): string[] {
  try {
    const raw = localStorage.getItem(LETTER_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string").slice(0, 16);
  } catch {
    return [];
  }
}

export function Letter() {
  const [text, setText] = useState("");
  const [mine, setMine] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMine(readLetters());
    setReady(true);
  }, []);

  return (
    <form
      className="mt-8"
      onSubmit={(event) => {
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
      }}
    >
      <label className="block text-sm text-muted" htmlFor="cosmic-letter">
        جمله‌ات
      </label>
      <input
        id="cosmic-letter"
        className="field mt-2"
        maxLength={120}
        value={text}
        placeholder="یک جمله برای تاریکیِ روشن"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit" className="btn mt-4">
        بسپار به بادبان
      </button>
      <p className="mt-3 min-h-6 text-sm text-gold" aria-live="polite">
        {note}
      </p>
      <ul className="mt-4 space-y-3">
        {ready
          ? mine.map((line) => (
              <li key={line} className="flex items-start gap-3 text-fg">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))
          : null}
        {SEED_LETTERS.map((line) => (
          <li key={line} className="flex items-start gap-3 text-muted">
            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        {ready ? `${fa(mine.length)} جمله‌ی تو، و سه جمله‌ای که پیش از تو رسیده‌اند.` : "سه جمله، پیش از تو این‌جا بوده‌اند."}
      </p>
    </form>
  );
}
