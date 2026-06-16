import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Play } from 'lucide-react';
import CursorTrail from './components/CursorTrail';
import FloatingEmojis from './components/FloatingEmojis';

// --- Glitch Effect ---

const triggerSystemGlitch = () => {
  document.body.classList.add('glitch-active');
  setTimeout(() => document.body.classList.remove('glitch-active'), 500);
};

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  tx: number;
  ty: number;
}

const ParticleSystem = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  const triggerScatter = useCallback((e: MouseEvent) => {
    const emojis = ['🎬', '🎥', '⚡', '🤖', '📐', '🚀'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 150;
        
        newParticles.push({
          id: nextId.current++,
          x: e.clientX,
          y: e.clientY,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist
        });
    }

    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, []);

  useEffect(() => {
    window.addEventListener('click', triggerScatter);
    return () => window.removeEventListener('click', triggerScatter);
  }, [triggerScatter]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000]">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{ 
              x: p.x + p.tx, 
              y: p.y + p.ty, 
              scale: 0, 
              opacity: 0 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Utility Components ---

const MonoLabel = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`mono-label ${className}`}>{children}</div>
);

const Reveal = ({ children, delay = 0 }: { children: ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// --- Sections ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4 md:py-6 flex justify-between items-center bg-adnos-offwhite/80 backdrop-blur-md border-b border-black/5">
    <div className="flex items-center gap-4">
      <a className="flex items-center gap-4 group" href="#hero">
        <img
          src="/logo.png"
          alt="ADNOS Logo"
          className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:rotate-6"
        />
        <div className="mono-label font-black text-adnos-black text-[10px] md:text-xs hidden sm:flex bg-white border border-black px-3 py-1.5 items-center gap-2 cursor-pointer hover:border-glitch-red transition-colors">
          ADNOS STUDIOS
        </div>
      </a>
    </div>
    <div className="flex gap-4 md:gap-10 mono-label text-adnos-black text-[10px] md:text-xs">
      <a className="hover:text-glitch-red transition-colors" href="#hero">HOME</a>
      <a className="hover:text-glitch-red transition-colors" href="#vault">WORK</a>
      <a className="hover:text-glitch-red transition-colors" href="#about-team">ABOUT</a>
      <a className="hover:text-glitch-red transition-colors" href="#contact">CONTACT</a>
    </div>
  </nav>
);

const Hero = () => (
  <section className="flex flex-col items-center justify-center relative overflow-hidden bg-adnos-offwhite px-6 pt-40 min-h-[120vh] pb-24" id="hero">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
      <svg className="w-[200vw] md:w-[180vw] h-auto animate-rotate-slow" viewBox="0 0 500 500">
        <path d="M 250, 250 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0" fill="transparent" id="heroPath"></path>
        <text className="fill-adnos-black font-black text-[22px] uppercase font-montserrat">
          <textPath href="#heroPath" startOffset="0%">
            ADNOS — COMMERCIALS — FEATURE FILMS — DOCUMENTARIES — ADNOS — HIGH STAKES CAMPAIGNS — IIT BOMBAY — EXPERIMENTAL —
          </textPath>
        </text>
      </svg>
    </div>
    <div className="relative z-20 text-center max-w-5xl">
      <Reveal>
        <h1 
          className="display-brutalist text-huge -tracking-[0.08em] mb-4 hover:text-glitch-red transition-colors duration-300 cursor-pointer"
          onClick={triggerSystemGlitch}
        >
          ADNOS
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-adnos-black font-black text-2xl md:text-6xl lg:text-7xl leading-[0.9] uppercase max-w-5xl mx-auto font-montserrat">
          IT LOOKS LIKE A CAMPAIGN.
        </p>
      </Reveal>
      <Reveal delay={0.4}>
        <p className="text-adnos-black font-black text-2xl md:text-6xl lg:text-7xl leading-[0.9] uppercase max-w-5xl mx-auto font-montserrat">
          IT FEELS LIKE AN EXPERIENCE.
        </p>
      </Reveal>
      <Reveal delay={0.6}>
        <div className="mt-12 md:mt-16 flex flex-col items-center">
          <span className="mono-label mb-4 animate-bounce opacity-50 text-[10px] md:text-xs">Scroll to experience peak</span>
          <div className="w-px h-16 md:h-24 bg-black/20"></div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Showreel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the mute button from pausing the video
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="bg-adnos-black py-20 md:py-32 px-6 relative" id="showreel">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <Reveal>
            <h2 
              className="display-brutalist text-adnos-offwhite leading-none hover:text-glitch-blue transition-colors duration-300 text-[min(18vw,180px)] md:text-[min(15vw,180px)] cursor-pointer"
              onClick={triggerSystemGlitch}
            >
              REEL TALK
            </h2>
          </Reveal>
          <Reveal>
            <p className="mono-label text-white/50 max-w-sm md:text-right">A SYNTHESIS OF CREATIVE GRIT AND CINEMATIC STORYTELLING.</p>
          </Reveal>
        </div>
        
        <Reveal>
          <div 
            onClick={togglePlay}
            className="relative group border-[1px] border-white/20 aspect-video overflow-hidden bg-black mx-auto shadow-[0_0_50px_rgba(255,255,255,0.1)] border-white/40 border-2 cursor-pointer"
          >
            <div className="film-grain z-10 pointer-events-none"></div>
            
            {/* The Actual Video Element - Note the #t=0.001 trick to force the first frame */}
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              src="/showcase3rd-web.mp4#t=0.001"
              loop
              playsInline
            />

            {/* Dark Overlay & Play Button (Fades out seamlessly when playing) */}
            <div className={`absolute inset-0 z-20 flex items-center justify-center bg-black/40 transition-all duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100 group-hover:bg-black/20'}`}>
              <button className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white flex items-center justify-center text-white hover:bg-glitch-red hover:border-glitch-red transition-all group-hover:scale-110 shadow-lg">
                <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1 md:ml-2" />
              </button>
            </div>

            {/* Mute/Unmute Button (Visible when playing) */}
            {isPlaying && (
              <button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 z-30 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-all hover:scale-105"
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const HorizontalExperience = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: horizontalProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(horizontalProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div ref={scrollRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div style={{ x }} className="flex w-[200vw]">
          {/* PANEL 1: THE TEAM */}
          <section className="w-screen h-screen flex-shrink-0 flex items-center bg-adnos-offwhite px-6 md:px-24">
            <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <MonoLabel className="text-glitch-red mb-4">THE STRIKE TEAM</MonoLabel>
                <h2 
                  className="display-brutalist text-4xl md:text-7xl mb-8 md:mb-12 hover:text-glitch-red transition-colors cursor-pointer"
                  onClick={triggerSystemGlitch}
                >
                  OUR VISION
                </h2>
                <div className="space-y-6 text-sm md:text-xl font-mono leading-relaxed max-w-xl">
                  <p>We are a close-knit team of engineers, designers, and storytellers who met at IIT Bombay and IDC. We built this studio because we were tired of seeing the same boring ads everywhere.</p>
                  <p>We combine our technical brains with our filmmaking hearts to build campaigns that make your customers stop scrolling, pay attention, and remember your name.</p>
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <div className="w-full max-w-md aspect-square border-[20px] border-black flex items-center justify-center p-10 bg-white shadow-[20px_20px_0px_#ff003c] hover:shadow-[20px_20px_0px_#003cff] transition-all duration-500">
                  <img 
                    alt="Core Concept" 
                    className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTuKk2d8diR61H3uLEQ2Oy3vHZCDg52I06FMAKuVdFC3_aCXqor8MSI5qgBqBVK_57ucZeG7vOOCNaIxW1JExjazA6B7xXPhZd5KrV-zmhoRanQ0xgayL7BOycoL5k2ChlRD1yygkZBVLTZL9WRXZjIKJYp2MUfQhCCpO8MUVg0J1Y_x4hWmHcbU1ke8cKvZpNIdOtmxKXMjE25DV4ASGf6cW8DnKEc0WSgp7TcKQTDh7r6Zp7GHsWQBbxzzMDkdRMtf3jLZxJ9yws" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PANEL 2: FOCUS */}
          <section className="w-screen h-screen flex-shrink-0 flex items-center bg-adnos-black text-white px-6 md:px-24">
            <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
              {[
                { id: "01", title: "ADVERTISING", desc: "Bold commercials that capture attention.", color: "glitch-red" },
                { id: "02", title: "CAMPAIGNS", desc: "Creative strategies for brands ready to break the mold.", color: "glitch-blue" },
                { id: "03", title: "FEATURES", desc: "Story-driven filmmaking that connects deeply.", color: "white" },
                { id: "04", title: "DOCS", desc: "Real stories about real people, told with cinematic beauty.", color: "glitch-red" },
              ].map(item => (
                <div key={item.id} className={`border-l border-white/10 p-6 md:p-12 hover:bg-${item.color}/10 transition-colors group`}>
                  <MonoLabel className={`text-${item.color}`}>{item.id}</MonoLabel>
                  <h3 className={`text-2xl md:text-4xl font-black mt-4 mb-6 group-hover:text-${item.color} transition-colors`}>{item.title}</h3>
                  <p className="font-mono text-xs md:text-sm opacity-60">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

const Vault = () => {
  const [showreels, setShowreels] = useState([
    {
      id: "SHOWREEL_01",
      title: "EMOTIVE NARRATIVES",
      desc: "Cinematic Storytelling & Human Connection",
      youtubeId: "Sd9qVmHBxo8", 
    },
    {
      id: "SHOWREEL_02",
      title: "RAW & REAL",
      desc: "Naturally Connecting Emotions Vision",
      youtubeId: "h25Y7PigpDc",
    }
  ]);

  // Track which videos are currently playing in both sections
  const [playingShowreel, setPlayingShowreel] = useState<string | null>(null);
  const [playingProject, setPlayingProject] = useState<string | null>(null);

  const projects = [
    { id: "-M7EEIN9-rM", title: "AMAR | SHORT FILM" },
    { id: "IdSkfCVBvHU", title: "VIRAH | SHORT FILM" },
    { id: "SZGThvBE51Q", title: "DAAKIYA (OST) MUSIC VIDEO" },
    { id: "NaEGGMdlSsM", title: "APP PROMO" }
  ];

  return (
    <section className="bg-adnos-offwhite py-24 md:py-32 px-6 relative z-40 border-t border-black" id="vault">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 md:mb-16">
          <Reveal>
            <h2 
              className="display-brutalist text-section-title hover:text-glitch-red transition-colors mb-4 md:mb-8 cursor-pointer"
              onClick={triggerSystemGlitch}
            >
              PORTFOLIO
            </h2>
          </Reveal>
        </div>

        <div className="mb-20">
          <div className="mb-8 flex items-center justify-between border-b border-black pb-4">
            <MonoLabel className="text-glitch-red text-sm font-bold">Featured Showreels (Interactive)</MonoLabel>
            <MonoLabel className="text-xs opacity-50">Click to Play</MonoLabel>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {showreels.map((reel) => (
              <div 
                key={reel.id} 
                className="relative aspect-video bg-black border border-black overflow-hidden group shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                <div className="film-grain z-10 pointer-events-none" />
                
                {playingShowreel === reel.id ? (
                  <iframe
                    className="absolute inset-0 w-full h-full z-20"
                    src={`https://www.youtube.com/embed/${reel.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={reel.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full cursor-pointer z-20"
                    onClick={() => setPlayingShowreel(reel.id)}
                  >
                    <img 
                      alt={reel.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                      src={`https://img.youtube.com/vi/${reel.youtubeId}/maxresdefault.jpg`} 
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white flex items-center justify-center text-white group-hover:bg-glitch-red group-hover:border-glitch-red transition-all scale-100 md:scale-90 md:group-hover:scale-100">
                        <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                      </button>
                    </div>

                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                      <span className="mono-label text-glitch-red text-[10px] mb-1 font-bold">{reel.id}</span>
                      <h3 className="text-white font-montserrat font-black text-xl md:text-2xl leading-none uppercase tracking-tight">
                        {reel.title}
                      </h3>
                      <p className="text-white/70 font-mono text-xs mt-2">
                        {reel.desc}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between border-b border-black pb-4">
          <MonoLabel className="text-adnos-black text-sm font-bold">Selected Projects</MonoLabel>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-black bg-black">
          {projects.map((item) => (
            <div key={item.id} className="aspect-[4/5] bg-black overflow-hidden relative group border-r border-b border-black">
              {playingProject === item.id ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div 
                  className="absolute inset-0 w-full h-full cursor-pointer"
                  onClick={() => setPlayingProject(item.id)}
                >
                  <img 
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105 w-full h-full object-cover" 
                    src={`https://img.youtube.com/vi/${item.id}/maxresdefault.jpg`} 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full border border-white flex items-center justify-center text-white group-hover:bg-glitch-red group-hover:border-glitch-red transition-all scale-100 md:scale-90 md:group-hover:scale-100">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>
                    </div>
                    <h4 className="text-white text-xl md:text-2xl font-black mt-2 relative z-10 leading-tight">{item.title}</h4>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 md:mt-20 flex justify-center">
          <button className="mono-label px-8 md:px-12 py-4 md:py-5 border border-black hover:bg-black hover:text-white transition-all text-[10px] md:text-xs">
            SEE THE FULL CHAOS
          </button>
        </div>
      </div>
    </section>
  );
};

const Crew = () => (
  <section className="bg-adnos-offwhite py-24 md:py-32 px-6 border-t border-black relative z-30" id="about-team">
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-12 md:mb-16">
        <MonoLabel className="text-glitch-red mb-4">BEHIND THE LENS</MonoLabel>
        <Reveal>
          <h2 
            className="display-brutalist text-section-title hover:text-glitch-red transition-colors cursor-pointer"
            onClick={triggerSystemGlitch}
          >
            OUR CREW
          </h2>
        </Reveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black overflow-hidden">
        {[
          { name: "PRATHMESH SOMVANSHI", role: "FOUNDER AND CREATIVE DIRECTOR", id: "01", img: "/crew/PRATHMESH.jpg" },
          { name: "DEVASISH BEHERA", role: "CO-FOUNDER AND EDITOR", id: "02", img: "/crew/DEVASISH.jpg" },
          { name: "JASHANPREET SINGH", role: "CO-FOUNDER & SOUND DIRECTOR", id: "03", img: "/crew/JASHANPREET.jpg" },
          { name: "AADITYA SHARMA", role: "CO-FOUNDER & DIRECTOR/EDITOR", id: "04", img: "/crew/AADITYA.jpg" },
          { name: "KARTAVYA GUPTA", role: "MANAGER", id: "05", img: "/crew/KARTAVYA.jpg" },
        ].map(member => (
          <div key={member.name} className="bg-adnos-offwhite p-6 md:p-8 group hover:bg-black hover:text-white transition-all border-r border-b border-black">
            <div className="aspect-square bg-adnos-gray mb-6 overflow-hidden border border-black relative">
              <img 
                src={member.img} 
                alt={member.name} 
                className="absolute top-0 left-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute top-4 right-4 text-white/30 font-black text-2xl group-hover:text-white/60 transition-colors pointer-events-none drop-shadow-md z-10">
                {member.id}
              </div>
            </div>
            <h3 className="display-brutalist text-xl md:text-2xl mb-1">{member.name}</h3>
            <MonoLabel className="opacity-60">{member.role}</MonoLabel>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section className="bg-adnos-offwhite py-24 md:py-40 px-6 relative z-30" id="contact">
    <div className="max-w-5xl mx-auto text-center space-y-10 md:space-y-12">
      <Reveal>
        <h2 
          className="display-brutalist text-section-title hover:text-glitch-blue transition-colors cursor-pointer"
          onClick={triggerSystemGlitch}
        >
          LET'S TALK
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-xl md:text-3xl font-black uppercase tracking-tighter max-w-2xl mx-auto font-montserrat">
          IF YOU HAVE A PROJECT (OR JUST WANT TO DISCUSS SCI-FI), WE'RE LISTENING.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex flex-col items-center gap-10 md:gap-12">
          <a
            className="bg-adnos-black text-adnos-offwhite px-10 md:px-16 py-6 md:py-8 font-black uppercase tracking-[0.2em] text-base md:text-xl hover:bg-glitch-red transition-all shadow-[10px_10px_0px_#ff003c] md:shadow-[15px_15px_0px_#ff003c] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
            href="mailto:info.adnosproductions@gmail.com"
          >
            DROP A LINE
          </a>
          <div className="mono-label flex flex-wrap justify-center gap-4 md:gap-10 pt-4 md:pt-8 opacity-60 text-[10px] md:text-xs">
            <a className="hover:opacity-100 hover:text-glitch-red underline decoration-glitch-red underline-offset-4 transition-colors break-all md:break-normal uppercase" href="mailto:info.adnosproductions@gmail.com">info.adnosproductions@gmail.com</a>
            <a className="hover:opacity-100 hover:text-glitch-blue transition-colors" href="https://www.instagram.com/adnosstudios/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
            <a className="hover:opacity-100 hover:text-glitch-red transition-colors" href="https://www.linkedin.com/company/adnos-studios/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-adnos-black text-adnos-offwhite py-20 md:py-32 px-6 relative z-50 border-t border-white/10">
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <h2 
            className="display-brutalist text-4xl md:text-7xl mb-8 hover:text-glitch-blue transition-colors cursor-pointer"
            onClick={triggerSystemGlitch}
          >
            GET IN TOUCH
          </h2>
          <div className="space-y-6">
            <a className="block text-xl md:text-3xl font-black underline decoration-glitch-red underline-offset-8 hover:text-glitch-red transition-colors break-all uppercase" href="mailto:info.adnosproductions@gmail.com">
              INFO.ADNOSPRODUCTIONS@GMAIL.COM
            </a>
            <p className="mono-label opacity-40 text-base md:text-lg">BASED IN MUMBAI, INDIA.</p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-8 mb-12 lg:mb-0">
            <div className="space-y-4">
              <p className="mono-label text-glitch-red">SOCIALS</p>
              <nav className="flex flex-col gap-2 mono-label text-[10px] md:text-xs">
                <a className="hover:text-glitch-blue transition-colors" href="https://www.instagram.com/adnosstudios/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
                <a className="hover:text-glitch-blue transition-colors" href="https://www.linkedin.com/company/adnos-studios/" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
              </nav>
            </div>
          </div>
          <div className="pt-12 md:pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="display-brutalist text-lg md:text-xl leading-none">ADNOS STUDIOS</h3>
              <p className="mono-label text-[9px] md:text-[10px] opacity-30 text-white">
                © 2024 ADNOS PRODUCTIONS PVT LTD. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <main className="relative">
      <div className="film-grain" />
      <CursorTrail />
      <ParticleSystem />
      <FloatingEmojis />
      <Navbar />
      <Hero />
      <Showreel />
      <HorizontalExperience />
      <Vault />
      <Crew />
      <Contact />
      <Footer />
    </main>
  );
}