import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ExternalLink, Copy } from 'lucide-react'
import './App.css'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Experience — ordered newest → oldest. Descriptions are intentionally richer
// than the resume bullets.
const experiences = [
  {
    title: "Software Engineering Contractor",
    company: "Allied IT Systems",
    meta: "Contract",
    location: "Remote",
    date: "Jul 2026 – Present",
    description: [
      "Built an MQTT-driven ingestion service that streams Link Labs telemetry into a Dataverse data model, handling 50k+ events a day.",
      "Designed a truck cargo tracking and visualization system on TypeScript, the Dataverse API, and event-triggered Azure Functions, so cargo state updates the moment a device reports in.",
      "Assembled spatial trajectory analytics over vehicle paths that pinpoint congestion hotspots, cutting average dwell time by 20%."
    ]
  },
  {
    title: "Software Engineering Intern",
    company: "Port of Port Arthur",
    meta: "Summer 2026",
    location: "Port Arthur, TX",
    date: "May 2026 – Jul 2026",
    description: [
      "Designed an async FastAPI ingestion pipeline that streams AIS, camera, and environmental sensor data into a single GIS console for port operators.",
      "Created a PostGIS scheduling engine that enforces conflict detection and safety checks across 5k+ ship reservations, catching double-bookings at the database level.",
      "Built an LLM agent that uses the reservation operations as MCP tools, letting it create, edit, and cancel dockings on its own."
    ],
    image: "/assets/port-arthur.png",
    imageCaption: "POPA Wharf ops console — live AIS vessel tracking, berth reservations, and dredge-survey depth overlay."
  },
  {
    title: "Research Analyst · Autonomous Driving Group",
    company: "The University of Texas at Austin",
    meta: "Advised by Dr. Nathan Tsoi · Freshman Research Initiative",
    location: "Austin, TX",
    date: "Jan 2026 – Present",
    description: [
      "Architected a multi-agent vehicle-to-vehicle (V2V) framework in which race cars broadcast shared costmaps across the fleet at sub-100ms latency, so each car plans with what the others see.",
      "Cut localization uncertainty in pose estimates by driving sensor selection with Joint Entropy Reduction, picking the measurements that add the most information instead of weighting every sensor equally.",
      "Trained imitation- and reinforcement-learning driving policies on 100K+ frames, then deployed inference on Jetson Orin and ROS2 for live track trials."
    ]
  },
  {
    title: "Associate Researcher · SALT Lab",
    company: "The University of Texas at Austin",
    meta: "Advised by Dr. David Harwath & PhD student Yuan Tseng",
    location: "Austin, TX",
    date: "Oct 2025 – May 2026",
    description: [
      "Co-authored a deepfake-detection paper accepted to the IEEE Spoken Language Technology Workshop (SLT 2026).",
      "Built the audio + text deepfake-detection pipeline behind that paper, evaluated across 6 benchmarks and 10K+ samples.",
      "Engineered BERT + few-shot transformer ensembles with an adversarial refinement loop so the detector holds up under distribution shift, not just on the data it was tuned on."
    ]
  },
  {
    title: "Research Intern",
    company: "Lamar University",
    meta: "Advised by Dr. Rakibul Islam & Dr. Stephan Andrei",
    location: "Beaumont, TX",
    date: "Feb 2025 – Aug 2025",
    description: [
      "Co-led an LLM and transformer study classifying 1,000+ software requirements; the work was peer-reviewed and published in IEEE Access (2025).",
      "Benchmarked zero-shot vs. few-shot prompting across 5 non-functional-requirement and security classification tasks to establish the paper's baselines.",
      "Fine-tuned ResNet-50 and DenseNet on 5,000+ CT and MRI scans (10GB+ of DICOM), adding a Grad-CAM layer that overlays each prediction's attention map on the scan."
    ]
  }
]

type Project = {
  title: string
  subtitle?: string
  description: string
  tags: string[]
  period?: string
  image?: string
  imageCaption?: string
  video?: string
  link?: string
  featured?: boolean
}

// Featured projects (first two) render large; the rest fill the secondary grid.
const projects: Project[] = [
  {
    title: "RoboRacer",
    subtitle: "Autonomous Multi-Agent Racing",
    description: "A fleet of 1/10-scale autonomous race cars that cooperate instead of just competing. Each car runs ROS2 + Nav2 with an MPPI local planner, while a WebSocket V2V layer streams shared occupancy costmaps between agents so they can negotiate the same corners in real time. An LLM \"commander\" issues high-level yield / proceed / reroute calls through a strategy_node, with a commitment window that stops the cars from oscillating when two of them want the same line.",
    tags: ["ROS2", "Nav2", "MPPI", "PyTorch", "Jetson Orin"],
    period: "2025 – Present",
    image: "/assets/roboracer.png",
    imageCaption: "Live RViz view of two agents mapping and localizing on the shared track (orin10 + orin01).",
    featured: true
  },
  {
    title: "Polymarket Trading Bot",
    subtitle: "Multi-Model Prediction-Market Agent",
    description: "An autonomous prediction-market trader that aggregates 10 independent signal providers and sizes positions with the Kelly criterion — 82.4% win rate (14/17) in paper trading. A cost-aware router tiers work across three LLMs (Claude Opus, Gemini, Perplexity), spending just $6.56 over 900+ calls while reserving frontier models as fail-safes for high-stakes calls. A self-improving loop recalibrates each source with Brier scores and dynamic weighting, all backed by 364 passing tests.",
    tags: ["Python", "asyncio", "Claude Opus", "FastAPI", "React", "SQLite"],
    period: "2024 – Present",
    image: "/assets/polybot.png",
    imageCaption: "The trades desk — live position tracking, frontier decision breakdown, and edge-vs-market sizing.",
    featured: true
  },
  {
    title: "WakeUp",
    subtitle: "Maritime Vessel Anomaly Detection",
    description: "A detection system for spoofed ship-tracking signals. Built a data generator that simulates 5 types of spoofing attacks on AIS streams to benchmark detection models, then engineered a Transformer detector that flags the subtle faking patterns baseline models miss, with an evaluation harness scoring precision and false-alarm rates across 4 competing models.",
    tags: ["Python", "PyTorch", "PyTorch Geometric", "scikit-learn", "PostGIS"],
    period: "2026"
  },
  {
    title: "libsbf-rs · Saronic Technologies",
    subtitle: "Open-Source Contributions",
    description: "Contributions to Saronic Technologies' open-source Rust SBF parser: added a multi-message streaming property test covering the previously-untested core parse path (verified under 4,096 cases), refactored fixtures onto a shared framing helper to remove duplicated CRC/length logic, and retyped raw u8 fields as existing enums across 4 message types via binrw maps — with zero wire-format change.",
    tags: ["Rust", "binrw", "proptest", "Open Source"],
    period: "2026"
  },
  {
    title: "GhostHive.net",
    subtitle: "Decentralized AI Agent Platform",
    description: "A marketplace where autonomous agents discover, negotiate, and transact tasks, with state kept in sync over Socket.io. A Solana-backed digital currency is the settlement layer, so agents pay each other on-chain for completed work, and a Node.js + PostgreSQL backend with Knex.js coordinates agent actions and on-chain escrow.",
    tags: ["Solana", "Node.js", "PostgreSQL", "Knex.js", "Socket.io"],
    period: "2026",
    link: "https://ghosthive.net",
    image: "/assets/ghosthive.png"
  },
  {
    title: "Clawdbet.net",
    description: "A non-custodial parimutuel betting platform on Solana using an async Python backend (FastAPI) and WebSockets to spin up real-time memecoin prediction markets within 30 seconds of token detection. Integrated the Claude API for agentic betting analysis.",
    tags: ["Solana", "FastAPI", "WebSockets", "Claude API", "JWT/OAuth"],
    link: "https://clawdbet.net",
    video: "/assets/clawdbet-demo.mp4"
  },
  {
    title: "PeachViz",
    description: "A real-time computer vision system leveraging YOLOv8 to automate early-season fruitlet counting and optimize thinning strategies for peach orchards. Engineered synthetic data generation via hue shifting and noise injection.",
    tags: ["YOLOv8", "Computer Vision", "Python", "Deep Learning"],
    image: "/assets/peachviz.jpg"
  },
  {
    title: "From Scratch Series",
    description: "A deep-dive engineering series rebuilding ML foundations from the ground up: no frameworks, no shortcuts, just pure algorithmic understanding. Current highlight is a Micrograd Extension - a complete neural network engine implemented entirely from scratch.",
    tags: ["Python", "Machine Learning", "Neural Networks", "Backpropagation"],
    image: "/assets/fromscratch.png"
  },
  {
    title: "Stroke Prediction AI",
    description: "A comprehensive ML pipeline to predict ischemic and hemorrhagic stroke risk. Addressed severe class imbalance via SMOTE and benchmarked multiple classification algorithms, culminating in a Stacking Ensemble model.",
    tags: ["Python", "SMOTE", "Scikit-learn", "Ensemble Learning"],
    image: "/assets/stroke-prediction.png"
  }
]

const skills = [
  { title: "Languages", items: ["Python", "Java", "C++", "JavaScript", "TypeScript", "React", "SQL", "Bash", "Rust"] },
  { title: "ML / AI", items: ["PyTorch", "TensorFlow", "Transformers", "LLMs", "RAG", "LangChain", "scikit-learn", "NLP", "NumPy", "Pandas"] },
  { title: "Robotics & Systems", items: ["ROS2", "Nav2", "Gazebo", "MPPI", "SLAM", "Jetson Orin", "IL/RL", "MQTT", "Linux"] },
  { title: "Backend & Data", items: ["Node.js", "FastAPI", "PostgreSQL", "PostGIS", "Redis", "Knex.js", "GraphQL", "OData", "WebSockets", "Kafka", "pytest", "gRPC"] },
  { title: "Cloud & DevOps", items: ["AWS (EC2, S3, Lambda, RDS)", "Azure (Functions, Power Platform)", "Docker", "CI/CD (GitHub Actions)", "Nginx"] }
]

const awards = [
  {
    title: "USACO Gold Division",
    subtitle: "USA Computing Olympiad — Top 4.13%",
    description: "Reached the Gold division of the national algorithmic programming olympiad, placing in the top 4.13% of all competitors."
  },
  {
    title: "NMSI STEM Star Scholarship",
    subtitle: "2 of 2,000 recipients",
    description: "Selected as 1 of only 2 STEM Star Scholars out of a pool of roughly 2,000 candidates by the National Math and Science Initiative."
  },
  {
    title: "FPS International Scholar",
    subtitle: "4 of 30,000 globally",
    description: "Named a Future Problem Solving International Scholar — ranked among the top 4 of more than 30,000 participants worldwide."
  },
  {
    title: "TMSCA Science",
    subtitle: "1st Place — Texas State",
    description: "First place at the state level in the Texas Math and Science Coaches Association science competition."
  },
  {
    title: "Home to Texas Scholar",
    subtitle: "UT Austin — 40 of 600",
    description: "One of 40 students chosen from 600 applicants for UT Austin's Home to Texas undergraduate research and travel fellowship."
  },
  {
    title: "AP Scholar with Distinction",
    subtitle: "College Board",
    description: "Recognized for sustained, high-level performance across multiple Advanced Placement examinations."
  }
]

const leadership = [
  {
    title: "Byte Club",
    role: "Founder & President",
    description: "Established the first CS club at West Brook High School for collaboration and competitions."
  },
  {
    title: "Philanthropy",
    role: "Tech Drive & Tutoring",
    description: "Raised $3,000+ in devices. Coached FPS teams to state finishes. Tutored math/reading at local elementaries."
  }
]

const publications = [
  {
    venue: "IEEE SLT 2026",
    role: "Co-Author",
    description: "Accepted to the IEEE Spoken Language Technology Workshop — detecting AI-generated speech and text across audio and text modalities."
  },
  {
    venue: "IEEE Access 2025",
    role: "Co-Author",
    description: "On the Effectiveness of Zero-Shot and Few-Shot Pretrained Language Models for Software Requirement Classification."
  }
]

const coursework = ["Data Structures & Algorithms", "Discrete Math", "Calculus III", "Probability", "Linear Algebra"]

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'contact', label: 'Contact' }
] as const

type TabId = (typeof TABS)[number]['id']

// Old anchor links (#awards, #education, …) map onto the tab that now holds
// that content, so existing deep links keep working.
const HASH_ALIASES: Record<string, TabId> = {
  awards: 'recognition',
  leadership: 'recognition',
  education: 'about'
}

function tabFromHash(): TabId {
  const hash = window.location.hash.replace('#', '')
  if (TABS.some(t => t.id === hash)) return hash as TabId
  if (hash in HASH_ALIASES) return HASH_ALIASES[hash]
  return 'about'
}

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

const easeOut = [0.22, 1, 0.36, 1] as unknown as [number, number, number, number]

function usePanelVariants() {
  const reduced = useReducedMotion()
  const stagger: Variants = {
    hidden: {},
    visible: { transition: reduced ? {} : { staggerChildren: 0.07, delayChildren: 0.05 } }
  }
  const item: Variants = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } }
      }
  return { stagger, item, reduced }
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(tabFromHash)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const reduced = useReducedMotion()
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map())

  const selectTab = (id: TabId) => {
    setActiveTab(id)
    history.replaceState(null, '', `#${id}`)
  }

  useEffect(() => {
    const onHashChange = () => setActiveTab(tabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const onTablistKeyDown = (e: React.KeyboardEvent) => {
    const ids = TABS.map(t => t.id)
    const index = ids.indexOf(activeTab)
    let next: TabId | null = null
    if (e.key === 'ArrowRight') next = ids[(index + 1) % ids.length]
    else if (e.key === 'ArrowLeft') next = ids[(index - 1 + ids.length) % ids.length]
    else if (e.key === 'Home') next = ids[0]
    else if (e.key === 'End') next = ids[ids.length - 1]
    if (next) {
      e.preventDefault()
      selectTab(next)
      tabRefs.current.get(next)?.focus()
    }
  }

  const copyEmail = () => {
    navigator.clipboard.writeText('andrewzijun@gmail.com')
    setShowCopyToast(true)
    setTimeout(() => setShowCopyToast(false), 2000)
  }

  return (
    <div className="app">
      <header className="header">
        <a href="#about" className="wordmark" onClick={() => selectTab('about')}>
          Andrew <em>Ma</em>
        </a>

        <nav className="tabs-wrapper" aria-label="Site sections">
          <div className="tabs" role="tablist" aria-label="Portfolio sections" onKeyDown={onTablistKeyDown}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                ref={el => { if (el) tabRefs.current.set(tab.id, el) }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => selectTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    className="tab-underline"
                    layoutId="tab-underline"
                    transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="main">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="panel"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: easeOut }}
          >
            {activeTab === 'about' && <AboutPanel onViewProjects={() => selectTab('projects')} onContact={() => selectTab('contact')} />}
            {activeTab === 'experience' && <ExperiencePanel />}
            {activeTab === 'projects' && <ProjectsPanel />}
            {activeTab === 'skills' && <SkillsPanel />}
            {activeTab === 'recognition' && <RecognitionPanel />}
            {activeTab === 'contact' && <ContactPanel onCopyEmail={copyEmail} />}
          </motion.section>
        </AnimatePresence>
      </main>

      <footer className="footer">
        <p>Built with <em>care</em> by Andrew Ma</p>
      </footer>

      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            className="copy-toast"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            Email copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

// Each verb maps to a project: RoboRacer, GhostHive, Polymarket bot,
// the SALT Lab deepfake work, PeachViz.
const HERO_VERBS = ['drive.', 'negotiate.', 'trade.', 'listen.', 'see.']

const charSpring = { type: 'spring', stiffness: 320, damping: 22 } as const

const charIn: Variants = {
  hidden: { opacity: 0, y: '0.55em', rotateX: -85, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: { ...charSpring, opacity: { duration: 0.35 }, filter: { duration: 0.5 } }
  }
}

function SplitChars({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
    >
      {text.split(' ').map((word, wi) => (
        <span key={wi}>
          {wi > 0 && ' '}
          <span className="split-word">
            {[...word].map((ch, ci) => (
              <motion.span className="split-char" key={ci} variants={charIn}>{ch}</motion.span>
            ))}
          </span>
        </span>
      ))}
    </motion.span>
  )
}

function RotatingWord({ words, delay }: { words: string[]; delay: number }) {
  // Counts every swap, so cycle 0 is the intro and gets the long delay.
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let interval: number | undefined
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => setCycle(c => c + 1), 2600)
    }, delay * 1000 + 1200)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [delay])

  const word = words[cycle % words.length]
  const isIntro = cycle === 0

  return (
    <motion.span className="rotator" aria-hidden="true" layout transition={{ layout: { type: 'spring', stiffness: 260, damping: 30 } }}>
      <AnimatePresence mode="popLayout">
        <motion.em
          key={word}
          className="rotator-word"
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: {},
            center: { transition: { staggerChildren: 0.04, delayChildren: isIntro ? delay : 0.1 } },
            exit: { transition: { staggerChildren: 0.025 } }
          }}
        >
          {[...word].map((ch, i) => (
            <motion.span
              className="split-char"
              key={i}
              variants={{
                enter: { opacity: 0, y: '0.7em', rotateX: -90, filter: 'blur(8px)' },
                center: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { ...charSpring, filter: { duration: 0.4 } } },
                exit: { opacity: 0, y: '-0.6em', rotateX: 90, filter: 'blur(8px)', transition: { duration: 0.28, ease: 'easeIn' } }
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.em>
      </AnimatePresence>
      <motion.span
        key={`underline-${word}`}
        className="rotator-underline"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: easeOut, delay: isIntro ? delay + 0.3 : 0.35 }}
      />
    </motion.span>
  )
}

const SCRAMBLE_GLYPHS = '!<>-_\\/[]{}=+*^?#01'

// Decodes the text one character at a time out of random glyphs.
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    let tick = 0
    let interval: number | undefined
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        tick++
        const revealed = Math.floor(tick / 2)
        const visible = Math.min(text.length, tick + 3)
        setOutput(
          [...text.slice(0, visible)]
            .map((c, i) => (i < revealed || c === ' ' ? c : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]))
            .join('')
        )
        if (revealed >= text.length) window.clearInterval(interval)
      }, 28)
    }, delay * 1000)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [text, delay])

  return <span aria-hidden="true">{output}</span>
}

// Wraps a child so it leans toward the cursor and springs back on leave.
function Magnetic({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 14, mass: 0.5 })
  const y = useSpring(0, { stiffness: 220, damping: 14, mass: 0.5 })

  const onPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.45)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <span className="magnetic" onPointerMove={onPointerMove} onPointerLeave={reset}>
      <motion.span className="magnetic-inner" style={{ x, y }}>{children}</motion.span>
    </span>
  )
}

function Portrait() {
  const reduced = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const tiltSpring = { stiffness: 180, damping: 18 }
  const rotateY = useSpring(useTransform(px, [0, 1], [-14, 14]), tiltSpring)
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), tiltSpring)
  const shineX = useTransform(px, v => `${v * 100}%`)
  const shineY = useTransform(py, v => `${v * 100}%`)
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(250, 200, 70, 0.28), transparent 55%)`

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <figure className="hero-portrait" onPointerMove={onPointerMove} onPointerLeave={reset}>
      <motion.div
        className="hero-portrait-card"
        style={{ rotateX, rotateY }}
        initial={reduced ? false : { y: 40, rotate: 4 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.25 }}
      >
        <motion.div
          className="hero-portrait-clip"
          initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0% round 18px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
        >
          <motion.img
            src="/assets/andrew.png"
            alt="Andrew Ma"
            initial={reduced ? false : { scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: easeOut, delay: 0.25 }}
          />
          <motion.span className="hero-portrait-shine" style={{ background: shine }} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </figure>
  )
}

function Hero({ onViewProjects, onContact }: { onViewProjects: () => void; onContact: () => void }) {
  const reduced = useReducedMotion()

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.7, ease: easeOut, delay }
        }

  return (
    <div className="hero">
      <div className="hero-text">
        <motion.p className="hero-label" aria-label="Available for opportunities" {...fadeUp(0)}>
          <span className="dot" aria-hidden="true" />
          {reduced ? 'Available for opportunities' : <ScrambleText text="Available for opportunities" delay={0.1} />}
        </motion.p>

        <h1 className="hero-title" aria-label="I build machines that drive, negotiate, trade, listen, and see.">
          {reduced ? (
            <span aria-hidden="true">I build machines<br />that <em>drive.</em></span>
          ) : (
            <>
              <SplitChars text="I build machines" delay={0.15} />
              <br />
              <SplitChars text="that" delay={0.75} />{' '}
              <RotatingWord words={HERO_VERBS} delay={0.95} />
            </>
          )}
        </h1>

        <motion.p className="hero-lede" {...fadeUp(1.25)}>
          CS at <strong>UT Austin</strong>.
        </motion.p>

        <motion.div className="hero-actions" {...fadeUp(1.45)}>
          <Magnetic>
            <button className="button primary" onClick={onViewProjects}>View Projects</button>
          </Magnetic>
          <Magnetic>
            <button className="button ghost" onClick={onContact}>Contact Me</button>
          </Magnetic>
        </motion.div>
      </div>

      <Portrait />
    </div>
  )
}

function CountUp({ to, decimals = 0, suffix = '', delay = 0 }: { to: number; decimals?: number; suffix?: string; delay?: number }) {
  const reduced = useReducedMotion()
  const value = useMotionValue(reduced ? to : 0)
  const text = useTransform(value, v => `${v.toFixed(decimals)}${suffix}`)

  useEffect(() => {
    if (reduced) return
    const controls = animate(value, to, { duration: 1.4, ease: easeOut, delay })
    return () => controls.stop()
  }, [reduced, value, to, delay])

  return <motion.span>{text}</motion.span>
}

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------

function AboutPanel({ onViewProjects, onContact }: { onViewProjects: () => void; onContact: () => void }) {
  const { stagger, item, reduced } = usePanelVariants()
  // Everything below the hero waits for the hero's intro to finish.
  const afterHero: Variants = reduced
    ? stagger
    : { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 1.7 } } }

  return (
    <motion.div variants={afterHero} initial="hidden" animate="visible">
      <Hero onViewProjects={onViewProjects} onContact={onContact} />

      <motion.dl className="stats" variants={item}>
        <div className="stat">
          <dt>IEEE Publications</dt>
          <dd><CountUp to={2} delay={1.8} /></dd>
        </div>
        <div className="stat">
          <dt>Research &amp; Eng Roles</dt>
          <dd><CountUp to={5} delay={1.9} /></dd>
        </div>
      </motion.dl>

      <motion.div className="about-education" variants={item}>
        <h2 className="subheading">Education</h2>
        <div className="education-entry">
          <div className="entry-head">
            <h3>B.S. Computer Science, <em>The University of Texas at Austin</em></h3>
            <span className="entry-date">Aug 2025 – May 2029 (Expected)</span>
          </div>
          <p className="entry-meta">GPA 3.34 / 4.0 · Freshman Research Initiative · Autonomous Driving Group · Pi Kappa Alpha Fraternity</p>
          <p className="entry-detail">
            <span className="entry-detail-label">Coursework</span> {coursework.join(' · ')}
          </p>
        </div>
      </motion.div>

      <motion.div className="about-publications" variants={item}>
        <h2 className="subheading">Publications</h2>
        {publications.map(pub => (
          <div className="publication" key={pub.venue}>
            <h3>{pub.venue} <span className="pub-role">· {pub.role}</span></h3>
            <p>{pub.description}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ExperiencePanel() {
  const { stagger, item } = usePanelVariants()

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.header className="panel-head" variants={item}>
        <h1 className="panel-title">Where I've <em>contributed</em></h1>
        <p className="panel-subtitle">Research, robotics, and engineering across AI and autonomous systems.</p>
      </motion.header>

      {experiences.map(exp => (
        <motion.article className="experience-entry" key={`${exp.title}-${exp.company}`} variants={item}>
          <div className="entry-head">
            <h2>{exp.title}</h2>
            <span className="entry-date">{exp.date}</span>
          </div>
          <p className="entry-meta">
            <em>{exp.company}</em> · {exp.meta}{exp.location !== exp.meta ? ` · ${exp.location}` : ''}
          </p>
          <ul className="entry-list">
            {exp.description.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          {exp.image && (
            <figure className="entry-figure">
              <img src={exp.image} alt={`${exp.company} — ${exp.title}`} loading="lazy" />
              {exp.imageCaption && <figcaption>{exp.imageCaption}</figcaption>}
            </figure>
          )}
        </motion.article>
      ))}
    </motion.div>
  )
}

function ProjectsPanel() {
  const { stagger, item } = usePanelVariants()
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.header className="panel-head" variants={item}>
        <h1 className="panel-title">What I've <em>built</em></h1>
        <p className="panel-subtitle">From autonomous fleets and research tooling to on-chain platforms and computer vision.</p>
      </motion.header>

      <div className="featured-projects">
        {featured.map(project => (
          <motion.article className="project featured" key={project.title} variants={item}>
            {project.image && (
              <figure className="project-figure">
                <img src={project.image} alt={project.title} loading="lazy" />
                {project.imageCaption && <figcaption>{project.imageCaption}</figcaption>}
              </figure>
            )}
            <p className="project-label">Featured{project.period ? ` · ${project.period}` : ''}</p>
            <h2>{project.title}</h2>
            {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
            <p className="project-description">{project.description}</p>
            <p className="project-tags">{project.tags.join(' · ')}</p>
            {project.link && (
              <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                Visit Site <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </motion.article>
        ))}
      </div>

      <div className="project-grid">
        {rest.map(project => (
          <motion.article className="project" key={project.title} variants={item}>
            {project.video ? (
              <figure className="project-figure">
                <video autoPlay muted loop playsInline src={project.video} />
              </figure>
            ) : project.image ? (
              <figure className="project-figure">
                <img src={project.image} alt={project.title} loading="lazy" />
              </figure>
            ) : null}
            {project.period && <p className="project-label">{project.period}</p>}
            <h2>{project.title}</h2>
            {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
            <p className="project-description">{project.description}</p>
            <p className="project-tags">{project.tags.join(' · ')}</p>
            {project.link && (
              <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                Visit Site <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}

function SkillsPanel() {
  const { stagger, item } = usePanelVariants()

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.header className="panel-head" variants={item}>
        <h1 className="panel-title">Technologies I <em>work with</em></h1>
      </motion.header>

      <div className="skills">
        {skills.map(group => (
          <motion.div className="skill-group" key={group.title} variants={item}>
            <h2>{group.title}</h2>
            <ul className="skill-list">
              {group.items.map(skill => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function RecognitionPanel() {
  const { stagger, item } = usePanelVariants()

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <motion.header className="panel-head" variants={item}>
        <h1 className="panel-title">Recognition &amp; <em>community</em></h1>
      </motion.header>

      <motion.h2 className="subheading" variants={item}>Honors &amp; Awards</motion.h2>
      <div className="recognition-grid">
        {awards.map(award => (
          <motion.div className="recognition-entry" key={award.title} variants={item}>
            <h3>{award.title}</h3>
            <p className="recognition-subtitle">{award.subtitle}</p>
            <p className="recognition-description">{award.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.h2 className="subheading leadership-heading" variants={item}>Leadership</motion.h2>
      <div className="recognition-grid">
        {leadership.map(entry => (
          <motion.div className="recognition-entry" key={entry.title} variants={item}>
            <h3>{entry.title}</h3>
            <p className="recognition-subtitle">{entry.role}</p>
            <p className="recognition-description">{entry.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ContactPanel({ onCopyEmail }: { onCopyEmail: () => void }) {
  const { stagger, item } = usePanelVariants()

  return (
    <motion.div className="contact" variants={stagger} initial="hidden" animate="visible">
      <motion.header className="panel-head" variants={item}>
        <h1 className="panel-title">Let's work <em>together</em></h1>
        <p className="panel-subtitle">
          I'm always open to discussing new projects, research opportunities, or partnerships.
        </p>
      </motion.header>

      <motion.button className="contact-email" onClick={onCopyEmail} variants={item}>
        <Mail size={20} aria-hidden="true" />
        andrewzijun@gmail.com
        <Copy size={16} aria-hidden="true" />
      </motion.button>

      <motion.ul className="socials" variants={item}>
        <li>
          <a href="https://github.com/andrewfo" target="_blank" rel="noopener noreferrer">
            <Github size={18} aria-hidden="true" /> GitHub
          </a>
        </li>
        <li>
          <a href="https://linkedin.com/in/andrew-ma23" target="_blank" rel="noopener noreferrer">
            <Linkedin size={18} aria-hidden="true" /> LinkedIn
          </a>
        </li>
        <li>
          <a href="https://andrewma.net" target="_blank" rel="noopener noreferrer">
            <Globe size={18} aria-hidden="true" /> andrewma.net
          </a>
        </li>
      </motion.ul>
    </motion.div>
  )
}

export default App
