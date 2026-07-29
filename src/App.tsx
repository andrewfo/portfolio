import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
    title: "Software Contractor",
    company: "BizPro Software (LLC)",
    meta: "Clients: Allied IT Systems",
    location: "Beaumont, TX",
    date: "Jul 2026 – Present",
    description: [
      "Building a React, TypeScript, and .NET asset-management portal that manages 5,000+ endpoints across 60+ client sites from a single console.",
      "Engineered a Redis-queued webhook integration into PSA/RMM ticketing, processing 1,200 events per minute at sub-90ms p99 latency.",
      "Cut the API error rate 85% (2.1% → 0.3%) through SQL Server query indexing and 88% backend test coverage."
    ]
  },
  {
    title: "Software Engineering Intern",
    company: "Port of Port Arthur",
    meta: "Summer 2026",
    location: "Port Arthur, TX",
    date: "May 2026 – Jul 2026",
    description: [
      "Fused 6 live AIS telemetry streams into a single PostGIS-backed spatial state refreshed at sub-second cadence, so operators can watch 40+ vessels move across the port in real time.",
      "Designed a conflict-safe berth-reservation schema with database-level (btree_gist) exclusion constraints that make double-booking physically impossible — eliminating berth conflicts across 100+ concurrent reservations.",
      "Built a coordinate-crosswalk layer that reconciles 3 independent sensor frames through affine transforms, achieving sub-meter georeferencing so radar, AIS, and camera data all line up on one map — turning raw vessel streams into predictive maritime analytics."
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
      "Architecting a multi-agent vehicle-to-vehicle (V2V) framework in which 1/10-scale race cars broadcast shared occupancy costmaps to one another at sub-100ms latency, so the fleet can cooperatively overtake and avoid collisions on a shared track.",
      "Cut localization uncertainty by 17% by reframing multi-sensor fusion as a Joint Entropy Reduction problem — actively selecting the measurements that add the most information instead of weighting every sensor equally.",
      "Trained neural driving policies on 50K+ logged frames with imitation and reinforcement learning, then deployed quantized inference on NVIDIA Jetson Orin for closed-loop runs on the physical track."
    ]
  },
  {
    title: "Chief Technology Officer & Founder",
    company: "GhostHive",
    meta: "Remote",
    location: "Remote",
    date: "Jan 2026 – Present",
    description: [
      "Founded and built GhostHive.net, a decentralized AI economy where 100+ autonomous agents negotiate and settle real transactions on-chain, moving $2,000+ in Solana value.",
      "Engineered the full backend — Node.js + PostgreSQL with Knex.js migrations and Socket.io — so every agent shares a consistent, real-time view of the world as state changes propagate.",
      "Drove the MVP go-to-market solo, landing a 100+ person waitlist and 3,500+ LinkedIn impressions before the product even launched."
    ]
  },
  {
    title: "Associate Researcher · SALT Lab",
    company: "The University of Texas at Austin",
    meta: "Advised by Dr. David Harwath & Yuan Tseng",
    location: "Austin, TX",
    date: "Oct 2025 – May 2026",
    description: [
      "Co-authored a paper published at the IEEE Spoken Language Technology Workshop (SLT 2026) on detecting AI-generated speech and text.",
      "Built a deepfake-detection pipeline that spans both audio and text and holds 85% accuracy across 6 public benchmarks and 10K+ samples — not just one dataset it was tuned on.",
      "Designed BERT + few-shot transformer ensembles wrapped in an adversarial refinement loop that hunts for the subtle statistical fingerprints synthetic generators leave behind, lifting robustness scores by 35%."
    ]
  },
  {
    title: "Research Intern · NLP & Software Engineering",
    company: "Lamar University",
    meta: "Advised by Dr. Rakibul Islam",
    location: "Beaumont, TX",
    date: "Feb 2025 – Aug 2025",
    description: [
      "Co-led a study that classified 1,000+ real-world software requirements with LLMs and transformer models; the work was peer-reviewed and published in IEEE Access (2025).",
      "Ran a head-to-head of zero-shot vs. few-shot prompting across 5 downstream tasks, reaching 94% F1 on multi-class non-functional-requirement and security classification — concrete evidence that a handful of well-chosen examples beats zero-shot at this scale.",
      "Wrote reusable prompt templates and an evaluation harness so every result reproduces cleanly across 3 different model families instead of being tied to one vendor's API."
    ]
  },
  {
    title: "Machine Learning Engineering Apprentice",
    company: "Lamar University",
    meta: "Advised by Dr. Stephan Andrei",
    location: "Beaumont, TX",
    date: "Feb 2025 – Aug 2025",
    description: [
      "Fine-tuned ResNet-50 and DenseNet architectures on 5,000+ CT and MRI scans for stroke detection, pushing accuracy to 94.2% — an 18-point jump over the project's original baseline.",
      "Built an OpenCV preprocessing pipeline that normalized 10GB+ of raw DICOM imaging from different scanner sources, standardizing contrast and orientation so the models stopped over-fitting to hardware artifacts and false negatives dropped.",
      "Added a Grad-CAM visualization layer that overlays each prediction's attention map onto the scan, giving radiologists an interpretable, second-opinion view rather than an opaque score."
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
    subtitle: "Maritime Vessel Spoofing Detection",
    description: "A detection system for spoofed ship-tracking signals. Built a data generator that simulates 5 distinct types of spoofing attacks on AIS streams, then engineered a Transformer model that flags the subtle ones — raising detection accuracy from 64% to 97% over baselines — with an evaluation harness scoring precision and false-alarm rates across 4 competing models.",
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
    description: "A decentralized AI economy where 100+ autonomous agents discover, negotiate, and settle real transactions on-chain — moving $2,000+ in Solana value through a Solana-backed settlement currency with escrow. Built on a Node.js + PostgreSQL backend with Knex.js migrations and Socket.io for real-time multi-agent state sync.",
    tags: ["Solana", "Node.js", "PostgreSQL", "Knex.js", "Socket.io"],
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
  { title: "Languages", items: ["Python", "Java", "C/C++", "C#", "JavaScript/TypeScript", "SQL", "Bash", "Rust", "Go"] },
  { title: "ML / AI", items: ["PyTorch", "TensorFlow", "Transformers", "LLMs", "NLP", "RAG", "LangChain", "LangGraph", "CrewAI", "OpenCV", "scikit-learn"] },
  { title: "Robotics & Systems", items: ["ROS2", "Nav2", "Gazebo", "MPPI", "SLAM", "Jetson Orin", "CUDA", "IL/RL", "gRPC", "Linux"] },
  { title: "Backend & Data", items: ["Node.js", "FastAPI", "Flask", "PostgreSQL", "PostGIS", "SQL Server", "Redis", "SQLite", "GraphQL", "REST", "WebSockets", "Knex.js"] },
  { title: "Cloud & DevOps", items: ["AWS (EC2, S3, Lambda, RDS)", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD (GitHub Actions)", "Nginx", "Solana"] }
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
    description: "Published at the IEEE Spoken Language Technology Workshop — detecting AI-generated speech and text across audio and text modalities."
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
// Panels
// ---------------------------------------------------------------------------

function AboutPanel({ onViewProjects, onContact }: { onViewProjects: () => void; onContact: () => void }) {
  const { stagger, item } = usePanelVariants()

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      <div className="hero">
        <div className="hero-text">
          <motion.p className="hero-label" variants={item}>
            <span className="dot" aria-hidden="true" />
            Available for opportunities
          </motion.p>

          <motion.h1 className="hero-title" variants={item}>
            Crafting intelligent systems
            <br />
            <em>that work in the real world.</em>
          </motion.h1>

          <motion.p className="hero-lede" variants={item}>
            I'm Andrew Ma, a CS student at <strong>UT Austin</strong> building autonomous systems,
            multi-agent AI, and the research behind them. I work across the full stack of intelligent
            systems — from the autonomy software that lets a fleet of race cars cooperate at speed, to
            the ML research behind detecting AI-generated media, to the backends that keep multi-agent
            applications in sync.
          </motion.p>

          <motion.div className="hero-actions" variants={item}>
            <button className="button primary" onClick={onViewProjects}>View Projects</button>
            <button className="button ghost" onClick={onContact}>Contact Me</button>
          </motion.div>
        </div>

        <motion.figure className="hero-portrait" variants={item}>
          <img src="/assets/andrew.png" alt="Andrew Ma" />
        </motion.figure>
      </div>

      <motion.dl className="stats" variants={item}>
        <div className="stat">
          <dt>IEEE Publications</dt>
          <dd>2</dd>
        </div>
        <div className="stat">
          <dt>Research &amp; Eng Roles</dt>
          <dd>7+</dd>
        </div>
        <div className="stat">
          <dt>GPA at UT Austin</dt>
          <dd>3.3</dd>
        </div>
      </motion.dl>

      <motion.div className="about-education" variants={item}>
        <h2 className="subheading">Education</h2>
        <div className="education-entry">
          <div className="entry-head">
            <h3>B.S. Computer Science, <em>The University of Texas at Austin</em></h3>
            <span className="entry-date">Aug 2025 – May 2029 (Expected)</span>
          </div>
          <p className="entry-meta">GPA 3.3 / 4.0 · Freshman Research Initiative · Autonomous Driving Group · Pi Kappa Alpha Fraternity</p>
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
