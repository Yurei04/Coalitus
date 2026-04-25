"use client";

import { useState, useEffect, useRef } from "react";
import {
  Brain, HeartPulse, BookOpen, GraduationCap,
  MessageCircle, Zap, BarChart2, Compass,
  ArrowRight, Sparkles, ChevronRight,
  Activity, Layers, Target, Users,
} from "lucide-react";
import { MY_MODELS } from "@/lib/constants";

/* ─────────────────────────────────────────────────────────── */
/*  Constants                                                  */
/* ─────────────────────────────────────────────────────────── */
const WELLBEING_STATES = ["calm", "clarity", "resilience", "balance", "mindfulness", "healing", "growth", "wellness"];
const MODEL_ICONS = [Brain, HeartPulse, BookOpen, GraduationCap];
const STEP_ICONS  = [MessageCircle, Zap, BarChart2, Compass];

/* ─────────────────────────────────────────────────────────── */
/*  useInView                                                  */
/* ─────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─────────────────────────────────────────────────────────── */
/*  Animated counter                                           */
/* ─────────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    const n = parseFloat(target);
    const step = n / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, n);
      setCount(n % 1 !== 0 ? +cur.toFixed(1) : Math.round(cur));
      if (cur >= n) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────── */
/*  Well-being state ticker                                    */
/* ─────────────────────────────────────────────────────────── */
function WellBeingTicker() {
  const [idx, setIdx]     = useState(0);
  const [visible, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % WELLBEING_STATES.length); setVis(true); }, 250);
    }, 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-block min-w-[120px] font-mono font-bold transition-all duration-300"
      style={{ color:"#39ff8e", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-8px)" }}>
      {WELLBEING_STATES[idx]}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Section label                                              */
/* ─────────────────────────────────────────────────────────── */
function SectionLabel({ color, children }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}
      className="mono-font text-[10px] tracking-[0.22em] mb-4 flex items-center gap-2 transition-all duration-500"
      style={{ color, opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-14px)" }}>
      <span className="w-5 h-px inline-block" style={{ background: color }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Animated heading                                           */
/* ─────────────────────────────────────────────────────────── */
function AnimHeading({ gradient, children, size = "clamp(22px,3.5vw,40px)" }) {
  const [ref, inView] = useInView();
  return (
    <h2 ref={ref}
      className="font-extrabold tracking-tight leading-[1.12] transition-all duration-700"
      style={{
        fontSize: size,
        background: gradient,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(22px)",
      }}>
      {children}
    </h2>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Model card                                                 */
/* ─────────────────────────────────────────────────────────── */
function ModelCard({ model, index }) {
  const [hov, setHov]   = useState(false);
  const [ref, inView]   = useInView(0.08);
  const Icon = MODEL_ICONS[index % MODEL_ICONS.length];

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="relative flex flex-col rounded-2xl cursor-default overflow-hidden transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(36px) scale(0.96)",
        transitionDelay: `${index * 90}ms`,
        background: hov ? `${model.color}0c` : "rgba(255,255,255,0.025)",
        border: `1px solid ${hov ? model.color + "50" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hov ? `0 8px 48px ${model.color}15, inset 0 0 40px ${model.color}05` : "none",
      }}>

      {/* glow top strip */}
      <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{ background:`linear-gradient(90deg,transparent,${model.color}70,transparent)`, opacity: hov ? 1 : 0 }} />

      {/* card body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: hov ? `${model.color}22` : `${model.color}10`,
              border: `1px solid ${model.color}30`,
              boxShadow: hov ? `0 0 24px ${model.color}35` : "none",
            }}>
            <Icon size={20} style={{ color: model.color }} strokeWidth={1.8} />
          </div>
          <div className="mono-font text-[9px] px-2 py-1 rounded-full tracking-widest"
            style={{ background:`${model.color}12`, border:`1px solid ${model.color}25`, color: model.color }}>
            {model.badge}
          </div>
        </div>

        <div>
          <div className="text-[15px] font-bold text-white tracking-tight leading-snug mb-1.5">{model.name}</div>
          <div className="text-xs text-white/38 leading-relaxed">{model.description}</div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {model.labels.slice(0, 4).map(l => (
            <span key={l} className="mono-font text-[10px] px-2 py-0.5 rounded-md text-white/38"
              style={{ background:`${model.color}0a`, border:`1px solid ${model.color}18` }}>{l}</span>
          ))}
          {model.labels.length > 4 && (
            <span className="mono-font text-[10px] text-white/20 px-1 py-0.5">+{model.labels.length - 4}</span>
          )}
        </div>
      </div>

      {/* card footer */}
      <div className="px-6 py-3 flex items-center justify-between transition-all duration-300"
        style={{ borderTop:`1px solid ${hov ? model.color+"20" : "rgba(255,255,255,0.04)"}`, background: hov ? `${model.color}06` : "transparent" }}>
        <span className="mono-font text-[10px] text-white/20 tracking-widest">{model.id}</span>
        <a href={model.hfUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 mono-font text-[10px] no-underline transition-colors duration-200"
          style={{ color: hov ? model.color : "rgba(255,255,255,0.2)" }}
          onClick={e => e.stopPropagation()}>
          HuggingFace <ChevronRight size={10} />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Step row (How it works)                                    */
/* ─────────────────────────────────────────────────────────── */
function StepRow({ num, color, title, desc, Icon, index }) {
  const [ref, inView] = useInView(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex gap-4 py-6 px-3 rounded-xl transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(24px)",
        transitionDelay: `${index * 90}ms`,
        background: hov ? "rgba(255,255,255,0.025)" : "transparent",
      }}>
      <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          background:`${color}12`, border:`1px solid ${color}25`,
          boxShadow: hov ? `0 0 20px ${color}30` : "none",
          transform: hov ? "scale(1.1)" : "scale(1)",
        }}>
        <Icon size={18} style={{ color }} strokeWidth={1.8} />
      </div>
      <div>
        <div className="mono-font text-[10px] tracking-[0.1em] mb-1.5" style={{ color }}>{num}</div>
        <div className="text-sm font-bold text-white mb-1.5">{title}</div>
        <div className="text-xs text-white/38 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  About decorative orb                                       */
/* ─────────────────────────────────────────────────────────── */
function AboutDeco() {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref}
      className="hidden md:flex items-center justify-center transition-all duration-1000"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "scale(1) rotate(0deg)" : "scale(0.8) rotate(-12deg)" }}>
      <div className="relative w-56 h-56 flex items-center justify-center">
        {[{ s:220, c:"#39ff8e", spd:20, dash:"dashed" },
          { s:162, c:"#22d3ee", spd:15, dash:"dotted"  },
          { s:104, c:"#a3e635", spd:10, dash:"solid"   }].map(({ s, c, spd, dash }) => (
          <div key={s} className="absolute rounded-full"
            style={{
              width:s, height:s,
              border:`1px ${dash} ${c}`,
              opacity: 0.25,
              animation:`spin-slow ${spd}s linear infinite`,
            }} />
        ))}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center z-10"
          style={{
            background:"rgba(57,255,142,0.1)",
            border:"1px solid rgba(57,255,142,0.38)",
            boxShadow:"0 0 48px rgba(57,255,142,0.25)",
            animation:"pulse-ring 2.6s ease-in-out infinite",
          }}>
          <Brain size={28} style={{ color:"#39ff8e" }} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  HomeView                                                   */
/* ─────────────────────────────────────────────────────────── */
export function HomeView({ onEnter }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;700;800&display=swap');
        .site-font { font-family:'Syne',sans-serif; }
        .mono-font { font-family:'Space Mono',monospace; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes scan      { 0%{left:-35%;} 100%{left:135%;} }
        @keyframes breathe   { 0%,100%{opacity:.4;} 50%{opacity:1;} }
        @keyframes blobDrift { 0%,100%{transform:translate(0,0) scale(1);} 33%{transform:translate(28px,-18px) scale(1.04);} 66%{transform:translate(-18px,14px) scale(.97);} }
        @keyframes spin-slow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes pulse-ring {
          0%  {transform:scale(.95);box-shadow:0 0 0 0 rgba(57,255,142,.4);}
          70% {transform:scale(1);  box-shadow:0 0 0 10px rgba(57,255,142,0);}
          100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(57,255,142,0);}
        }
        @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }

        .fade-up-1{animation:fadeUp .55s ease both;}
        .fade-up-2{animation:fadeUp .60s ease both .07s;}
        .fade-up-3{animation:fadeUp .65s ease both .13s;}
        .fade-up-4{animation:fadeUp .70s ease both .20s;}
        .fade-up-5{animation:fadeUp .75s ease both .28s;}

        .blob1{animation:blobDrift 15s ease-in-out infinite;}
        .blob2{animation:blobDrift 19s ease-in-out infinite reverse;}
        .blob3{animation:blobDrift 23s ease-in-out infinite 5s;}
        .blob4{animation:blobDrift 27s ease-in-out infinite 2s reverse;}

        .breathe{animation:breathe 2.2s ease-in-out infinite;}
        .float  {animation:float 5s ease-in-out infinite;}

        .scan-line::after{
          content:'';
          position:absolute;inset-block:0;left:-35%;width:40%;
          background:linear-gradient(90deg,transparent,#39ff8e,transparent);
          animation:scan 2.4s ease-in-out infinite;
        }

        .btn-primary{
          background:linear-gradient(135deg,#2bde72,#18c4d4);
          box-shadow:0 0 28px rgba(57,255,142,.28);
          transition:all .22s ease;
        }
        .btn-primary:hover{
          background:linear-gradient(135deg,#34f07d,#22d3ee);
          box-shadow:0 0 48px rgba(57,255,142,.55);
          transform:translateY(-2px);
        }
        .btn-primary:active{transform:translateY(0);}

        .btn-ghost{border:1px solid rgba(255,255,255,0.09);transition:all .22s ease;}
        .btn-ghost:hover{border-color:rgba(57,255,142,.35);color:#a3e635!important;background:rgba(57,255,142,0.04);}

        .btn-nav{border:1px solid rgba(57,255,142,0.3);background:rgba(57,255,142,0.08);transition:all .2s;}
        .btn-nav:hover{background:rgba(57,255,142,0.18);box-shadow:0 0 20px rgba(57,255,142,.25);}

        .nav-link{transition:color .2s;}
        .nav-link:hover{color:#39ff8e!important;}

        /* divider between step rows */
        .step-divider + .step-divider { border-top:1px solid rgba(255,255,255,0.045); }
      `}</style>

      <div className="site-font min-h-screen text-[#e2faea] overflow-x-hidden relative">

        {/* ── BACKGROUND ── */}
        <div className="fixed inset-0 -z-20 bg-[#00091d] bg-[radial-gradient(#ffffff22_1px,#00091d_1px)] bg-[size:20px_20px]" />

        {/* colour blobs */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="blob1 absolute -top-56 -left-40 w-[640px] h-[640px] rounded-full opacity-70"
            style={{ background:"radial-gradient(circle,rgba(57,255,142,0.16) 0%,transparent 68%)" }} />
          <div className="blob2 absolute -top-20 -right-48 w-[520px] h-[520px] rounded-full opacity-50"
            style={{ background:"radial-gradient(circle,rgba(34,211,238,0.13) 0%,transparent 65%)" }} />
          <div className="blob3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[640px] h-[500px] rounded-full opacity-40"
            style={{ background:"radial-gradient(circle,rgba(163,230,53,0.11) 0%,transparent 65%)" }} />
          <div className="blob4 absolute top-1/2 -right-20 w-[360px] h-[360px] rounded-full opacity-25"
            style={{ background:"radial-gradient(circle,rgba(251,146,60,0.14) 0%,transparent 65%)" }} />
        </div>

        {/* ──────────────────── NAVBAR ──────────────────── */}
        <nav className="fade-up-1 sticky top-0 z-50 w-full">
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:"rgba(57,255,142,0.12)", border:"1px solid rgba(57,255,142,0.38)", boxShadow:"0 0 12px rgba(57,255,142,0.2)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,2 22,20 2,20" stroke="#39ff8e" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="14" r="2.5" fill="#39ff8e"/>
                </svg>
              </div>
              <span className="text-[13px] font-extrabold tracking-wide"
                style={{ background:"linear-gradient(90deg,#39ff8e,#22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Coalitus Collective
              </span>
            </div>
            <div className="hidden md:flex items-center gap-7">
              {[["About","#about"],["Models","#models"],["How It Works","#how"]].map(([l,h]) => (
                <a key={l} href={h} className="nav-link mono-font text-[11px] text-white/35 no-underline font-medium tracking-widest">{l}</a>
              ))}
              <button onClick={onEnter} className="btn-nav mono-font text-[11px] font-bold text-[#39ff8e] px-4 py-2 rounded-xl cursor-pointer border-0">
                Launch →
              </button>
            </div>
          </div>
        </nav>

        {/* ──────────────────── HERO ──────────────────── */}
        <section className="relative z-10 w-full">
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 pt-20 pb-24 flex flex-col items-center text-center">
            {/* badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ background:"rgba(57,255,142,0.07)", border:"1px solid rgba(57,255,142,0.18)" }}>
              <div className="breathe w-1.5 h-1.5 rounded-full bg-[#39ff8e]" />
              <span className="mono-font text-[10px] text-[rgba(57,255,142,.8)] tracking-[0.15em]">WELL BEING · MENTAL HEALTH · NLP</span>
              <Sparkles size={11} className="text-[#39ff8e] opacity-70" />
            </div>

            {/* headline */}
            <h1 className="fade-up-2 font-extrabold leading-[1.06] tracking-tight mb-5 max-w-3xl"
              style={{ fontSize:"clamp(38px,6vw,76px)" }}>
              <span style={{ background:"linear-gradient(135deg,#d1fae5,#86efac)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                AI that understands
              </span>
              <br />
              <span style={{ background:"linear-gradient(135deg,#39ff8e,#22d3ee)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                your well being.
              </span>
            </h1>

            <p className="fade-up-3 text-[15px] text-white/40 leading-7 max-w-xl mb-3">
              Tracking <WellBeingTicker /> right now — Coalitus Collective layers multiple
              fine-tuned NLP models over every conversation to surface real health intelligence.
            </p>

            {/* scan line */}
            <div className="fade-up-3 scan-line relative w-64 h-px rounded my-8 overflow-hidden"
              style={{ background:"rgba(57,255,142,0.12)" }} />

            {/* CTAs */}
            <div className="fade-up-4 flex flex-wrap items-center gap-3 justify-center">
              <button onClick={onEnter}
                className="btn-primary site-font text-[#020d05] text-sm font-extrabold px-8 py-3.5 rounded-xl cursor-pointer border-none tracking-widest inline-flex items-center gap-2">
                Start chatting <ArrowRight size={15} />
              </button>
              <a href="#about"
                className="btn-ghost site-font text-white/50 text-sm font-semibold px-7 py-3.5 rounded-xl cursor-pointer no-underline tracking-wide inline-flex items-center gap-2">
                Learn more <ChevronRight size={14} />
              </a>
            </div>

            {/* stats */}
            <div className="fade-up-5 w-full max-w-2xl mt-16 pt-10 grid grid-cols-2 md:grid-cols-4 gap-8"
              style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              {[
                { val:"4",   suf:"",  label:"Custom models",      color:"#39ff8e", Icon:Layers   },
                { val:"28",  suf:"",  label:"Health indicators",  color:"#22d3ee", Icon:Activity },
                { val:"3.5", suf:"K", label:"Training convos",    color:"#a3e635", Icon:Users    },
                { val:"4",   suf:"",  label:"NLP ensembles",      color:"#fb923c", Icon:Target   },
              ].map(({ val, suf, label, color, Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <Icon size={14} style={{ color, opacity:.6 }} />
                  <div className="mono-font font-extrabold leading-none" style={{ fontSize:28, color }}>
                    <Counter target={val} suffix={suf} />
                  </div>
                  <div className="text-[10px] text-white/28 tracking-widest uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────── ABOUT ──────────────────── */}
        <section id="about" className="relative z-10 w-full" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel color="#39ff8e">ABOUT</SectionLabel>
              <AnimHeading gradient="linear-gradient(135deg,#ecfdf5,#bbf7d0)" size="clamp(24px,3.5vw,44px)">
                Well Being are data.<br />Let's treat them that way.
              </AnimHeading>
              <p className="text-sm text-white/40 leading-7 mt-5 max-w-lg">
                Coalitus Collective is a mental-health NLP platform that layers multiple fine-tuned
                language models over every conversation. Instead of a single sentiment score, you get
                a living health profile — updated with each message. Built with counselors,
                students, and researchers in mind.
              </p>
            </div>
            <AboutDeco />
          </div>
        </section>

        {/* ──────────────────── MODELS ──────────────────── */}
        <section id="models" className="relative z-10 w-full" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20">
            <SectionLabel color="#22d3ee">OUR MODELS</SectionLabel>
            <AnimHeading gradient="linear-gradient(135deg,#ecfdf5,#7dd3fc)" size="clamp(22px,3.5vw,42px)">
              4 models. Built in-house.<br />Each one purpose-built.
            </AnimHeading>
            {/* 4-col grid, collapses gracefully */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {MY_MODELS.map((m, i) => <ModelCard key={m.id} model={m} index={i} />)}
            </div>
          </div>
        </section>

        {/* ──────────────────── HOW IT WORKS ──────────────────── */}
        <section id="how" className="relative z-10 w-full" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-16 items-start">
            <div className="md:sticky md:top-24">
              <SectionLabel color="#a3e635">HOW IT WORKS</SectionLabel>
              <AnimHeading gradient="linear-gradient(135deg,#ecfdf5,#d9f99d)" size="clamp(22px,3.5vw,42px)">
                Real-time health<br />intelligence, layered.
              </AnimHeading>
              <p className="text-sm text-white/35 leading-7 mt-5 max-w-sm">
                Every message triggers a parallel inference pipeline across all models simultaneously —
                no sequential bottlenecks.
              </p>
            </div>
            <div className="flex flex-col">
              {[
                { num:"01", color:"#39ff8e", title:"You send a message",          desc:"The chat routes your message simultaneously to the AI assistant and the well-being analysis pipeline." },
                { num:"02", color:"#22d3ee", title:"Multi-model analysis fires",   desc:"Up to 4 HuggingFace models run in parallel, each detecting different dimensions of health and topic." },
                { num:"03", color:"#a3e635", title:"Ensemble consensus forms",     desc:"Results aggregate into a weighted consensus score — the sidebar shows individual reads and the combined signal." },
                { num:"04", color:"#fb923c", title:"Triage routes the insight",    desc:"The Triage view classifies what kind of support is needed — anxiety, grief, CBT distortions, and more." },
              ].map(({ num, color, title, desc }, i) => (
                <div key={num} className="step-divider">
                  <StepRow num={num} color={color} title={title} desc={desc} Icon={STEP_ICONS[i]} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────── CTA ──────────────────── */}
        <section className="relative z-10 w-full text-center overflow-hidden" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse 60% 50% at 50% 50%, rgba(57,255,142,0.07) 0%, transparent 70%)" }} />
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-24 relative z-10">
            <AnimHeading gradient="linear-gradient(135deg,#39ff8e,#22d3ee)" size="clamp(28px,4vw,56px)">
              Ready to feel understood?
            </AnimHeading>
            <p className="text-sm text-white/35 mt-4 mb-9">
              Start a conversation and watch the health intelligence unfold in real time.
            </p>
            <button onClick={onEnter}
              className="btn-primary site-font text-[#020d05] text-[15px] font-extrabold px-14 py-4 rounded-2xl cursor-pointer border-none tracking-widest inline-flex items-center gap-2.5">
              Open Coalitus Collective <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* ──────────────────── FOOTER ──────────────────── */}
        <footer className="relative z-10 w-full" style={{ borderTop:"1px solid rgba(57,255,142,0.07)" }}>
          <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between flex-wrap gap-3">
            <span className="mono-font text-[10px] text-white/20 tracking-widest">
              COALITUS COLLECTIVE · WELL BEING AI PLATFORM
            </span>
            <div className="flex gap-2 flex-wrap">
              {MY_MODELS.map((m, i) => {
                const Icon = MODEL_ICONS[i % MODEL_ICONS.length];
                return (
                  <a key={m.id} href={m.hfUrl} target="_blank" rel="noopener noreferrer"
                    className="mono-font text-[10px] text-white/22 no-underline px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all duration-200"
                    style={{ border:"1px solid rgba(255,255,255,0.07)" }}
                    onMouseEnter={e => { e.currentTarget.style.color="#39ff8e"; e.currentTarget.style.borderColor="rgba(57,255,142,0.3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.22)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; }}>
                    <Icon size={10} /> {m.id}
                  </a>
                );
              })}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}