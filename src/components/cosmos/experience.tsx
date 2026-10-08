import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { bindAmbience, enableSound } from "@/cosmos/audio";
import { NAV, ORDER, PLATES } from "@/cosmos/content";
import { useCosmos, type ChapterId } from "@/cosmos/store";
import { Calendar, Elements, Letter, Scale, Worlds } from "@/components/cosmos/panels";

function SoundButton() {
  const sound = useCosmos((s) => s.sound);
  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={sound}
      aria-label={sound ? "خاموش کردن صدا" : "روشن کردن صدای فضا"}
      onClick={() => {
        if (useCosmos.getState().sound) useCosmos.getState().setSound(false);
        else enableSound();
      }}
    >
      <span className="relative size-5">
        <Volume2
          className={`absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${sound ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"}`}
          aria-hidden="true"
        />
        <VolumeX
          className={`absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${sound ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"}`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

function Chrome() {
  const chapter = useCosmos((s) => s.chapter);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-gold/15 bg-bg/55 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="flex items-center justify-between gap-3">
        <a href="#prologue" className="text-lg font-medium text-fg">
          شب‌پیما
        </a>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="فصل‌ها">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={item.id === chapter ? "text-sm text-gold" : "text-sm text-muted"}
              aria-current={item.id === chapter ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SoundButton />
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-expanded={open}
            aria-label={open ? "بستن فصل‌ها" : "فصل‌ها"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="mt-3 flex flex-col lg:hidden" aria-label="فصل‌ها">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex min-h-11 items-center text-fg"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Plates() {
  const chapter = useCosmos((s) => s.chapter);
  const active = PLATES[chapter];
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {(Object.entries(PLATES) as [ChapterId, string][]).map(([id, src]) => (
        <img
          key={id}
          src={src}
          alt=""
          loading={id === "dawn" ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${chapter === id ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className={`scrim absolute inset-0 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}

function Progress() {
  useEffect(() => {
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
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-0.5 bg-gold/20">
      <div id="voyage-progress" className="progress-bar h-full bg-gold" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

function Next({ id }: { id: ChapterId }) {
  const index = ORDER.indexOf(id);
  const next = ORDER[index + 1];
  if (!next) return null;
  const label = NAV.find((item) => item.id === next)?.label ?? "ادامه";
  return (
    <a className="btn mt-8" href={`#${next}`}>
      {label}
    </a>
  );
}

function Block({
  id,
  kicker,
  title,
  children,
  wide,
}: {
  id: ChapterId;
  kicker: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} data-chapter={id} className="flex min-h-svh items-center px-5 py-28 md:px-16">
      <div className={wide ? "w-full max-w-5xl" : "w-full max-w-xl"}>
        <p className="text-sm text-gold">{kicker}</p>
        <h2 className="display mt-1 text-4xl text-fg md:text-5xl">{title}</h2>
        <div className="mt-5 space-y-4 text-base text-fg md:text-lg">{children}</div>
        <Next id={id} />
      </div>
    </section>
  );
}

export function Experience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => bindAmbience(), []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-chapter]");
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-chapter");
          if (id) visible.set(id, entry.intersectionRect.height);
        }
        let best: ChapterId = "prologue";
        let score = 0;
        for (const [id, height] of visible) {
          if (height > score) {
            score = height;
            best = id as ChapterId;
          }
        }
        if (score > 48) useCosmos.getState().setChapter(best);
      },
      { threshold: [0, 0.08, 0.16, 0.28, 0.45, 0.7, 1] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup = () => {};
    let cancel = false;
    void import("@/cosmos/scene").then((mod) => {
      if (cancel) return;
      cleanup = mod.mountScene(canvas);
    });
    return () => {
      cancel = true;
      cleanup();
    };
  }, []);

  return (
    <div className="relative">
      <Plates />
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[1] h-svh w-full" />
      <div className="vignette pointer-events-none fixed inset-0 z-[2]" />
      <div className="grain pointer-events-none fixed inset-0 z-[2]" />
      <Chrome />
      <Progress />
      <main className="relative z-10">
        <section
          id="prologue"
          data-chapter="prologue"
          className="flex min-h-svh items-end px-5 pt-28 pb-16 md:items-center md:px-16"
        >
          <div className="w-full max-w-2xl">
            <p className="text-sm text-gold">سفری در زمان، مکان، و جهان‌های ممکن</p>
            <h1 className="display text-5xl text-fg md:text-7xl">شب‌پیما</h1>
            <p className="mt-2 max-w-lg text-lg text-fg md:text-xl">
              همه‌چیز از یک سکوتِ داغ آغاز شد. بعد نور آمد، بعد ستاره، بعد ما — که حالا می‌توانیم به عقب
              نگاه کنیم و بپرسیم از کجا آمده‌ایم.
            </p>
            <p className="mt-4 max-w-lg text-base text-muted">
              بادبانِ شب جلوتر از تو حرکت می‌کند. تقویم را با دست بچرخان، از اندازه‌ی خودت تا لبه‌ی جهان برو، و
              اگر خواستی یک جمله را میان ستاره‌ها جا بگذار.
            </p>
            <a className="btn mt-8" href="#dawn">
              سوار بادبان شو
            </a>
            <p className="bob mt-10 text-sm text-muted">به پایین، به سمتِ نخستین نور</p>
          </div>
        </section>

        <Block id="dawn" kicker="سیزده میلیارد و هشتصد میلیون سال پیش" title="وقتی هیچ‌چیز، همه‌چیز شد">
          <p>
            در نخستین لحظه، کیهان کوچک‌تر از نقطه‌ای بود که این جمله را تمام می‌کند. نه فضایی بیرون از آن بود و
            نه زمانی پیش از آن. بعد، در کسری از ثانیه، گسترده‌تر از هر فاصله‌ای شد که ذهن بتواند بی‌آن‌که
            بترسد تصور کند.
          </p>
          <p>
            سیصد و هشتاد هزار سال بعد، مهِ داغ رقیق شد و نور برای اولین بار توانست سفر کند. همان نور هنوز از
            همه‌ی جهت‌ها به ما می‌رسد؛ پژواکِ تولد.
          </p>
          <p>
            و چند صد میلیون سال بعد، نخستین ستاره‌ها در تاریکیِ هیدروژن روشن شدند. هر اتمِ کربن در دستت، هر
            اتمِ آهن در خونت، در دلِ یکی از همین کوره‌ها پخته شد.
          </p>
          <button type="button" className="btn" onClick={() => useCosmos.getState().replayBang()}>
            یک بار دیگر، نور
          </button>
        </Block>

        <Block id="calendar" kicker="اگر کیهان یک سال باشد" title="تقویمِ همه‌چیز">
          <p>
            نیمه‌شبِ اولِ ژانویه، آغاز است. همین حالا، آخرین لحظه‌ی سی‌ویکمِ دسامبر. بیشترِ سال، کیهان تنهاست
            با ستاره‌ها. زمین تازگیِ پاییز را دارد. و همه‌ی تاریخِ نوشته‌ی انسان در چند ثانیه‌ی آخر جا می‌شود.
          </p>
          <p className="text-muted">کمان را بکش، یا نامِ یک عصر را لمس کن.</p>
          <Calendar />
        </Block>

        <Block id="scale" kicker="از هسته تا افق" title="جایی میانِ هیچ و همه‌چیز">
          <p>
            از هسته‌ی اتم تا لبه‌ی جهانِ قابلِ مشاهده، حدود چهل مرتبه‌ی بزرگی فاصله است. تو جایی در میانه‌ای.
            نه در مرکز — مرکزی در کار نیست — در تنها مقیاسی که می‌تواند به این پرسش فکر کند.
          </p>
          <p className="text-muted">آسمان با انتخابِ تو نزدیک می‌شود یا عقب می‌رود.</p>
          <Scale />
        </Block>

        <Block id="pale" kicker="از فاصله‌ی شش میلیارد کیلومتر" title="آن نقطه‌ی کمرنگ">
          <p>
            در سال ۱۹۹۰، از کناره‌ی سامانه‌ی خورشیدی، دوربینی برگشت و به خانه نگاه کرد. زمین، در میان یک پرتوِ
            پراکنده‌ی آفتاب، چیزی نبود جز یک نقطه‌ی آبیِ کمرنگ.
          </p>
          <p>
            روی همان نقطه، هر کسی که دوستش داشته‌ای راه رفته است. هر زبانی آن‌جا ساخته شده. هر پرچمی آن‌جا
            برافراشته و تا شده. از این فاصله، خط‌های روی نقشه دیده نمی‌شوند — چون از اول هم، بیشتر از یک توافقِ
            شکننده نبودند.
          </p>
          <p>
            اگر این تصویر وظیفه‌ای داشته باشد، این است: به ما یادآوری کند که خانه کوچک است، و مهربانی تنها
            فناوریِ واقعاً ضروریِ ماست.
          </p>
        </Block>

        <Block id="dust" kicker="مصالحِ یک نفر" title="آنچه در سینه‌ات می‌تپد">
          <p>
            کلسیمِ استخوانت در انفجارِ ستاره‌های سنگین ساخته شد. آهنِ خونت هم. اکسیژنی که همین حالا فرو می‌دهی،
            هدیه‌ی ستاره‌هایی است که پیش از خورشید مرده‌اند.
          </p>
          <p>پس وقتی می‌گویی «من»، داری از یک کهکشان حرف می‌زنی که لحظه‌ای تصمیم گرفته خودش را ببیند.</p>
          <Elements />
        </Block>

        <Block id="worlds" wide kicker="پرتره‌هایی که هنوز سلام نشده‌اند" title="جهان‌های ممکن">
          <p>
            در کهکشان ما، شمارِ سیاره‌ها از ستاره‌ها بیشتر است. بیشترشان را هرگز نخواهیم دید. اما می‌توانیم، با
            آنچه از فیزیک می‌دانیم، تصور کنیم آن‌جا شب چگونه می‌گذرد.
          </p>
          <p>این همان کاری است که علم، پیش از رسیدنِ ابزار، همیشه کرده: خیالِ دقیق.</p>
          <Worlds />
        </Block>

        <Block id="letter" kicker="صندوقِ پستی ندارد" title="یک جمله برای تاریکیِ روشن">
          <p>
            کیهان نامه‌ها را جواب نمی‌دهد. اما نوشتن مالِ ماست. اگر فقط یک جمله اجازه‌ی سفر داشته باشد — جمله‌ای
            که بخواهی جایی میان ستاره‌ها بماند — چه می‌نویسی؟
          </p>
          <Letter />
        </Block>

        <section id="end" data-chapter="end" className="flex min-h-svh items-center px-5 py-28 md:px-16">
          <div className="w-full max-w-xl">
            <p className="text-sm text-gold">پایانِ صفحه، نه پایانِ سفر</p>
            <h2 className="display mt-1 text-4xl text-fg md:text-5xl">چراغ را پایین نیاور</h2>
            <div className="mt-5 space-y-4 text-base text-fg md:text-lg">
              <p>سفر تمام نمی‌شود. فقط این صفحه به ته می‌رسد.</p>
              <p>
                امشب اگر آسمان صاف بود، یک ستاره را انتخاب کن. لازم نیست نامش را بدانی. همان که چشم، بی‌دلیل،
                رویش مکث می‌کند. برای یک نفر نگه‌اش دار — کسی که دوستش داری، یا کسی که دیگر نیست.
              </p>
              <p>
                ما غبارِ ستاره‌ایم، بله. اما غباری که می‌تواند عاشق شود، و این، در همه‌ی کیهان، هنوز کمیاب‌ترین
                چیز است.
              </p>
            </div>
            <a className="btn mt-8" href="#prologue">
              بازگشت به آغاز
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
