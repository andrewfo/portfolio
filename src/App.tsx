import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ExternalLink, Copy, Code, Database, Brain, Cpu, Cloud, GraduationCap, FileText, ArrowDown, Trophy, Users, Heart } from 'lucide-react'
import './App.css'

// Animation variants
const easeOutCubic = [0.22, 1, 0.36, 1] as const

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutCubic as unknown as [number, number, number, number] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutCubic as unknown as [number, number, number, number] }
  }
}

// Section wrapper with scroll animations
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Counter animation component
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = target / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// Data
// Experience timeline — ordered oldest → newest (left → right on the rail).
// Descriptions are intentionally richer than the resume bullets.
const experiences = [
  {
    short: "ML Engineering",
    title: "Machine Learning Engineering Apprentice",
    company: "Lamar University",
    advisor: "Advised by Dr. Stephan Andrei",
    location: "Beaumont, TX",
    date: "Feb 2025 – Aug 2025",
    dateShort: "Feb '25",
    description: [
      "Fine-tuned ResNet-50 and DenseNet architectures on 5,000+ CT and MRI scans for stroke detection, pushing accuracy to 94.2% — an 18-point jump over the project's original baseline.",
      "Built an OpenCV preprocessing pipeline that normalized 10GB+ of raw DICOM imaging from different scanner sources, standardizing contrast and orientation so the models stopped over-fitting to hardware artifacts and false negatives dropped.",
      "Added a Grad-CAM visualization layer that overlays each prediction's attention map onto the scan, giving radiologists an interpretable, second-opinion view rather than an opaque score."
    ]
  },
  {
    short: "NLP Research",
    title: "Research Intern · NLP & Software Engineering",
    company: "Lamar University",
    advisor: "Advised by Dr. Rakibul Islam",
    location: "Beaumont, TX",
    date: "Feb 2025 – Aug 2025",
    dateShort: "Feb '25",
    description: [
      "Co-led a study that classified 1,000+ real-world software requirements with LLMs and transformer models; the work was peer-reviewed and published in IEEE Access (2025).",
      "Ran a head-to-head of zero-shot vs. few-shot prompting across 5 downstream tasks, reaching 94% F1 on multi-class non-functional-requirement and security classification — concrete evidence that a handful of well-chosen examples beats zero-shot at this scale.",
      "Wrote reusable prompt templates and an evaluation harness so every result reproduces cleanly across 3 different model families instead of being tied to one vendor's API."
    ]
  },
  {
    short: "SALT Lab",
    title: "Associate Researcher · SALT Lab",
    company: "The University of Texas at Austin",
    advisor: "Advised by Dr. David Harwath & Yuan Tseng",
    location: "Austin, TX",
    date: "Oct 2025 – Present",
    dateShort: "Oct '25",
    description: [
      "Co-authored a paper accepted to the IEEE Spoken Language Technology Workshop (SLT 2026) on detecting AI-generated speech and text.",
      "Built a deepfake-detection pipeline that spans both audio and text and holds 85% accuracy across 6 public benchmarks and 10K+ samples — not just one dataset it was tuned on.",
      "Designed BERT + few-shot transformer ensembles wrapped in an adversarial refinement loop that hunts for the subtle statistical fingerprints synthetic generators leave behind, lifting robustness scores by 35%."
    ]
  },
  {
    short: "Autonomous Racing",
    title: "Research Analyst · Autonomous Driving Group",
    company: "The University of Texas at Austin",
    advisor: "Freshman Research Initiative",
    location: "Austin, TX",
    date: "Jan 2026 – Present",
    dateShort: "Jan '26",
    description: [
      "Architecting a multi-agent vehicle-to-vehicle (V2V) framework in which 1/10-scale race cars broadcast shared occupancy costmaps to one another at sub-100ms latency, so the fleet can cooperatively overtake and avoid collisions on a shared track.",
      "Cut localization uncertainty by 17% by reframing multi-sensor fusion as a Joint Entropy Reduction problem — actively selecting the measurements that add the most information instead of weighting every sensor equally.",
      "Trained neural driving policies on 50K+ logged frames with imitation and reinforcement learning, then deployed quantized inference on NVIDIA Jetson Orin for closed-loop runs on the physical track."
    ]
  },
  {
    short: "GhostHive",
    title: "Chief Technology Officer & Founder",
    company: "GhostHive",
    advisor: "Remote",
    location: "Remote",
    date: "Jan 2026 – Present",
    dateShort: "Jan '26",
    description: [
      "Founded and built GhostHive.net, a decentralized AI economy where 100+ autonomous agents negotiate and settle real transactions on-chain, moving $2,000+ in Solana value.",
      "Engineered the full backend — Node.js + PostgreSQL with Knex.js migrations and Socket.io — so every agent shares a consistent, real-time view of the world as state changes propagate.",
      "Drove the MVP go-to-market solo, landing a 100+ person waitlist and 3,500+ LinkedIn impressions before the product even launched."
    ]
  },
  {
    short: "Port of Port Arthur",
    title: "Software Engineering Intern",
    company: "Port of Port Arthur",
    advisor: "Incoming · Summer 2026",
    location: "Port Arthur, TX",
    date: "May 2026 – Aug 2026",
    dateShort: "May '26",
    description: [
      "Fusing 3+ live AIS telemetry streams into a single PostGIS-backed spatial state refreshed at sub-second cadence, so operators can watch 40+ vessels move across the port in real time.",
      "Designing a conflict-safe berth-reservation schema with database-level exclusion constraints that make double-booking physically impossible — eliminating berth conflicts across 100+ concurrent reservations.",
      "Building a coordinate-crosswalk layer that reconciles 3 independent sensor frames through affine transforms, achieving sub-meter georeferencing so radar, AIS, and camera data all line up on one map."
    ],
    image: "/assets/port-arthur.png",
    imageCaption: "POPA Wharf ops console — live AIS vessel tracking, berth reservations, and dredge-survey depth overlay."
  }
]

// Featured projects (first two) render large; the rest fill the secondary grid.
type Project = {
  title: string
  subtitle?: string
  description: string
  tags: string[]
  period?: string
  images?: string[]
  imageCaption?: string
  image?: string
  video?: string
  link?: string
  featured?: boolean
}
const projects: Project[] = [
  {
    title: "RoboRacer",
    subtitle: "Autonomous Multi-Agent Racing",
    description: "A fleet of 1/10-scale autonomous race cars that cooperate instead of just competing. Each car runs ROS2 + Nav2 with an MPPI local planner, while a WebSocket V2V layer streams shared occupancy costmaps between agents so they can negotiate the same corners in real time. An LLM \"commander\" issues high-level yield / proceed / reroute calls through a strategy_node, with a commitment window that stops the cars from oscillating when two of them want the same line.",
    tags: ["ROS2", "Nav2", "MPPI", "PyTorch", "Jetson Orin"],
    period: "2025 – Present",
    images: ["/assets/roboracer.png"],
    imageCaption: "Live RViz view of two agents mapping and localizing on the shared track (orin10 + orin01).",
    featured: true
  },
  {
    title: "Polymarket Trading Bot",
    subtitle: "Multi-Model Prediction-Market Agent",
    description: "An autonomous prediction-market trader that aggregates 10 independent signal providers and sizes positions with the Kelly criterion — 82.4% win rate (14/17) in paper trading. A cost-aware router tiers work across three LLMs (Claude Opus, Gemini, Perplexity), spending just $6.56 over 900+ calls while reserving frontier models as fail-safes for high-stakes calls. A self-improving loop recalibrates each source with Brier scores and dynamic weighting, all backed by 364 passing tests.",
    tags: ["Python", "asyncio", "Claude Opus", "FastAPI", "React", "SQLite"],
    period: "2024 – Present",
    images: ["/assets/polybot.png"],
    imageCaption: "The trades desk — live position tracking, frontier decision breakdown, and edge-vs-market sizing.",
    featured: true
  },
  {
    title: "GhostHive.net",
    description: "A decentralized AI economy where 100+ autonomous agents negotiate and settle real transactions on-chain, moving $2,000+ in Solana value. Built on a Node.js + PostgreSQL backend with Knex.js migrations and Socket.io for real-time multi-agent state sync.",
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

const skills = {
  languages: ["Python", "Java", "C/C++", "JavaScript/TypeScript", "SQL", "Bash", "Rust", "Go"],
  aiml: ["PyTorch", "TensorFlow", "Transformers", "LLMs", "RAG", "LangGraph", "CrewAI", "OpenCV", "scikit-learn"],
  robotics: ["ROS2", "Nav2", "Gazebo", "MPPI", "SLAM", "Jetson Orin", "CUDA", "IL/RL", "gRPC", "Linux"],
  backend: ["Node.js", "FastAPI", "Flask", "PostgreSQL", "PostGIS", "Redis", "SQLite", "GraphQL", "REST", "WebSockets", "Knex.js"],
  cloud: ["AWS (EC2, S3, Lambda, RDS)", "GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Nginx", "Solana"]
}

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

const navItems = ['About', 'Experience', 'Projects', 'Skills', 'Contact']

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Copy email
  const copyEmail = () => {
    navigator.clipboard.writeText('andrewzijun@gmail.com')
    setShowCopyToast(true)
    setTimeout(() => setShowCopyToast(false), 2000)
  }

  return (
    <>
      {/* Ambient backdrop — the "GlassEffectContainer": gives every glass
          surface soft color + light to refract instead of flat black. */}
      <div className="ambient" aria-hidden="true" />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-content">
              <motion.div
                className="loading-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Andrew<span style={{ color: '#e63946' }}>.</span>
              </motion.div>
              <div className="loading-bar">
                <motion.div
                  className="loading-progress"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="app">
        {/* Navigation */}
        <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="container nav-container">
            <a href="#" className="nav-logo">A<span>.</span></a>

            {/* Morphing glass highlight glides between links via a shared
                layoutId — the web translation of glassEffectID + @Namespace. */}
            <div className="nav-links" onMouseLeave={() => setHoveredNav(null)}>
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nav-link"
                  onMouseEnter={() => setHoveredNav(item)}
                >
                  {hoveredNav === item && (
                    <motion.span
                      className="nav-glass-pill"
                      layoutId="nav-glass-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {item}
                </a>
              ))}
            </div>

            <a href="#contact" className="nav-cta">Get in Touch</a>

            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              <motion.div
                className="hero-label"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.6 }}
              >
                <span className="dot"></span>
                Available for opportunities
              </motion.div>

              <motion.h1 className="hero-name">
                {"Andrew Ma".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="char"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 2.5 + i * 0.05,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.6 }}
              >
                CS Student at <span className="highlight">UT Austin</span> building autonomous systems, multi-agent AI, and the research behind them
              </motion.p>

              <motion.div
                className="hero-cta-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2, duration: 0.6 }}
              >
                <a href="#projects" className="hero-cta primary">
                  View Projects <ArrowDown size={18} />
                </a>
                <a href="#contact" className="hero-cta secondary">
                  Contact Me
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="hero-accent"></div>

          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.6 }}
          >
            <span>SCROLL</span>
            <div className="scroll-indicator-line"></div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="about">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>About Me</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Crafting intelligent systems<br />that work in the real world
              </motion.h2>
            </AnimatedSection>

            <div className="about-grid">
              <AnimatedSection className="about-text">
                <motion.p variants={fadeInUp}>
                  I'm a Computer Science student at UT Austin who works across the full stack of intelligent systems — from the autonomy software that lets a fleet of race cars cooperate at speed, to the ML research behind detecting AI-generated media, to the backends that keep multi-agent applications in sync.
                </motion.p>
              </AnimatedSection>

              <AnimatedSection className="about-stats">
                <motion.div className="stat-card" variants={scaleIn}>
                  <div className="stat-number"><AnimatedCounter target={2} /></div>
                  <div className="stat-label">IEEE Publications</div>
                </motion.div>
                <motion.div className="stat-card" variants={scaleIn}>
                  <div className="stat-number"><AnimatedCounter target={6} suffix="+" /></div>
                  <div className="stat-label">Research &amp; Eng Roles</div>
                </motion.div>
                <motion.div className="stat-card" variants={scaleIn}>
                  <div className="stat-number">3.3</div>
                  <div className="stat-label">GPA at UT Austin</div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="experience">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Experience</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Where I've contributed
              </motion.h2>
              <motion.p className="section-subtitle" variants={fadeInUp}>
                Research, robotics, and engineering across AI and autonomous systems — hover any point to expand it
              </motion.p>
            </AnimatedSection>

            <ExperienceTimeline experiences={experiences} />
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Projects</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                What I've built
              </motion.h2>
              <motion.p className="section-subtitle" variants={fadeInUp}>
                From blockchain platforms to computer vision systems
              </motion.p>
            </AnimatedSection>

            <div className="projects-grid">
              {/* Featured Projects - Side by Side */}
              <div className="featured-projects-row">
                {projects.slice(0, 2).map((project) => (
                  <AnimatedSection key={project.title}>
                    <motion.div className="project-featured project-featured-half" variants={scaleIn}>
                      <div className="project-featured-inner project-featured-stacked">
                        {project.images && (
                          <figure className="project-image-wrapper">
                            <img src={project.images[0]} alt={project.title} loading="lazy" />
                            {project.imageCaption && (
                              <figcaption className="project-image-caption">{project.imageCaption}</figcaption>
                            )}
                          </figure>
                        )}
                        <div className="project-featured-content">
                          <span className="project-label">
                            Featured Project{project.period ? ` · ${project.period}` : ''}
                          </span>
                          <h3 className="project-title">{project.title}</h3>
                          {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                          <p className="project-description">{project.description}</p>
                          <div className="project-tags">
                            {project.tags.map(tag => (
                              <span key={tag} className="project-tag">{tag}</span>
                            ))}
                          </div>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                              Visit Site <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Other Projects */}
              <div className="projects-secondary">
                {projects.slice(2).map((project, index) => (
                  <ProjectCard key={index} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="skills">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Skills</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Technologies I work with
              </motion.h2>
            </AnimatedSection>

            <AnimatedSection className="skills-grid">
              <motion.div className="skill-category" variants={scaleIn}>
                <div className="skill-category-icon"><Code /></div>
                <h3 className="skill-category-title">Languages</h3>
                <div className="skill-list">
                  {skills.languages.map(skill => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={scaleIn}>
                <div className="skill-category-icon"><Brain /></div>
                <h3 className="skill-category-title">ML / AI</h3>
                <div className="skill-list">
                  {skills.aiml.map(skill => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={scaleIn}>
                <div className="skill-category-icon"><Cpu /></div>
                <h3 className="skill-category-title">Robotics & Systems</h3>
                <div className="skill-list">
                  {skills.robotics.map(skill => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={scaleIn}>
                <div className="skill-category-icon"><Database /></div>
                <h3 className="skill-category-title">Backend & Data</h3>
                <div className="skill-list">
                  {skills.backend.map(skill => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div className="skill-category" variants={scaleIn}>
                <div className="skill-category-icon"><Cloud /></div>
                <h3 className="skill-category-title">Cloud & DevOps</h3>
                <div className="skill-list">
                  {skills.cloud.map(skill => (
                    <span key={skill} className="skill-item">{skill}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Awards Section */}
        <section id="awards" className="awards">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Awards</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Recognition & Achievements
              </motion.h2>
            </AnimatedSection>

            <AnimatedSection className="awards-grid">
              {awards.map((award, index) => (
                <motion.div key={index} className="award-card" variants={scaleIn}>
                  <div className="award-icon"><Trophy /></div>
                  <h3 className="award-title">{award.title}</h3>
                  <p className="award-subtitle">{award.subtitle}</p>
                  <p className="award-description">{award.description}</p>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* Leadership Section */}
        <section id="leadership" className="leadership">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Leadership</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Community & Impact
              </motion.h2>
            </AnimatedSection>

            <AnimatedSection className="leadership-grid">
              {leadership.map((item, index) => (
                <motion.div key={index} className="leadership-card" variants={scaleIn}>
                  <div className="leadership-icon">{index === 0 ? <Users /> : <Heart />}</div>
                  <h3 className="leadership-title">{item.title}</h3>
                  <p className="leadership-role">{item.role}</p>
                  <p className="leadership-description">{item.description}</p>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="education">
          <div className="container">
            <AnimatedSection>
              <motion.span className="section-label" variants={fadeInUp}>Education</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Academic background
              </motion.h2>
            </AnimatedSection>

            <AnimatedSection className="education-grid">
              <motion.div className="education-card" variants={scaleIn}>
                <div className="education-icon"><GraduationCap /></div>
                <h3 className="education-title">B.S. Computer Science</h3>
                <p className="education-school">The University of Texas at Austin</p>
                <p className="education-details">Aug 2025 – May 2029 (Expected) &nbsp;|&nbsp; GPA: 3.3 / 4.0</p>
              </motion.div>

              <motion.div className="education-card" variants={scaleIn}>
                <div className="education-icon"><Users /></div>
                <h3 className="education-title">Involvement</h3>
                <p className="education-school">On & Off Campus</p>
                <p className="education-details">Freshman Research Initiative · Autonomous Driving Group · Pi Kappa Alpha Fraternity</p>
              </motion.div>

              <motion.div className="education-card" variants={scaleIn}>
                <div className="education-icon"><FileText /></div>
                <h3 className="education-title">IEEE SLT 2026</h3>
                <p className="education-school">Co-Author</p>
                <p className="education-details">Accepted to the IEEE Spoken Language Technology Workshop — detecting AI-generated speech and text across audio and text modalities.</p>
              </motion.div>

              <motion.div className="education-card" variants={scaleIn}>
                <div className="education-icon"><FileText /></div>
                <h3 className="education-title">IEEE Access 2025</h3>
                <p className="education-school">Co-Author</p>
                <p className="education-details">On the Effectiveness of Zero-Shot and Few-Shot Pretrained Language Models for Software Requirement Classification.</p>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <AnimatedSection className="contact-content">
              <motion.span className="section-label" variants={fadeInUp}>Contact</motion.span>
              <motion.h2 className="section-title" variants={fadeInUp}>
                Let's work together
              </motion.h2>
              <motion.p className="contact-description" variants={fadeInUp}>
                I'm always open to discussing new projects, research opportunities, or partnerships.
              </motion.p>

              <motion.button
                className="contact-email"
                onClick={copyEmail}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail />
                andrewzijun@gmail.com
                <Copy size={18} />
              </motion.button>

              <motion.div className="contact-socials" variants={fadeInUp}>
                <a href="https://github.com/andrewfo" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Github />
                </a>
                <a href="https://linkedin.com/in/andrew-ma23" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Linkedin />
                </a>
                <a href="https://andrewma.net" target="_blank" rel="noopener noreferrer" className="social-link">
                  <Globe />
                </a>
              </motion.div>
            </AnimatedSection>
          </div>
          <div className="contact-accent"></div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>Built with <span>passion</span> by Andrew Ma</p>
          </div>
        </footer>
      </div>

      {/* Copy Toast */}
      <AnimatePresence>
        {showCopyToast && (
          <motion.div
            className="copy-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Email copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Horizontal Experience Timeline
// A single-screen rail of dots; hovering/focusing a node morphs a glass glow to
// it and crossfades its (expanded) detail into the panel above.
type Experience = (typeof experiences)[number]

function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  // Default to the current flagship role (Autonomous Driving Group).
  const [active, setActive] = useState(3)
  const current = experiences[active]

  return (
    <div className="exp-timeline">
      <div className="exp-detail glass">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: easeOutCubic as unknown as [number, number, number, number] }}
          >
            <div className="exp-detail-head">
              <div className="exp-detail-headings">
                <h3 className="exp-detail-title">{current.title}</h3>
                <p className="exp-detail-company">{current.company}</p>
                <p className="exp-detail-meta">{current.advisor} · {current.location}</p>
              </div>
              <span className="exp-detail-date">{current.date}</span>
            </div>
            <ul className="exp-detail-list">
              {current.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            {'image' in current && current.image && (
              <figure className="exp-detail-image">
                <img src={current.image} alt={current.title} loading="lazy" />
                {'imageCaption' in current && current.imageCaption && (
                  <figcaption>{current.imageCaption}</figcaption>
                )}
              </figure>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="exp-rail" role="tablist" aria-label="Experience timeline">
        <div className="exp-rail-line" aria-hidden="true" />
        {experiences.map((exp, i) => (
          <button
            key={exp.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`exp-node ${i === active ? 'active' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <span className="exp-node-dot">
              {i === active && (
                <motion.span
                  className="exp-node-glow"
                  layoutId="exp-active-glow"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </span>
            <span className="exp-node-label">
              <span className="exp-node-role">{exp.short}</span>
              <span className="exp-node-date">{exp.dateShort}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Project Card Component
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className="project-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    >
      {project.video ? (
        <div className="project-card-image">
          <video className="project-video" autoPlay muted loop playsInline src={project.video} />
        </div>
      ) : project.image && (
        <div className="project-card-image">
          <img src={project.image} alt={project.title} loading="lazy" />
        </div>
      )}
      <div className="project-card-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
            Visit Site <ExternalLink size={18} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default App
