"use client";

import { useEffect, useState, type FormEvent } from "react";
import { defaultHeroProjects, type HeroProject } from "@/lib/hero-projects";

const INQUIRY_EMAIL = "hello@damacii.studio";

type Project = {
  name: string;
  shape: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  href?: string;
  preview?: { eyebrow: string; title: string; footer: string };
};

const projects: Project[] = [
  { name: "BÁEZ", shape: "project-wide project-web", category: "Web Design", imageUrl: "/assets/images/baez-web-design.png", imageAlt: "Báez fashion website design mockup" },
  { name: "BATHROOM INTERIOR", shape: "project-medium project-interior", category: "3D Interior Design", imageUrl: "/assets/images/bathroom-3d-interior.jpg", imageAlt: "3D rendering of a modern bathroom with wood paneling, glass shower, and freestanding tub" },
  { name: "MARKED", shape: "project-content", category: "Content Creation", imageUrl: "/assets/images/marked-content-creation.png", imageAlt: "MARKED fashion campaign poster with a model and red Mark the Moment lettering" },
  { name: "BROWZ BY KRYSTAL", shape: "project-browz", category: "Website", href: "https://browzbykrystal.com/", preview: { eyebrow: "BROWZ BY", title: "KRYSTAL", footer: "browzbykrystal.com" } },
  { name: "SOCIAL LUXX", shape: "project-socialluxx", category: "Web Design + Development", href: "https://www.socialluxx.agency/", preview: { eyebrow: "YOUR NEW SOCIAL MEDIA MANAGER", title: "LET’S CAPTURE YOUR BRAND AND PRESENCE.", footer: "socialluxx.agency" } },
  { name: "FORMED SUPPLY", shape: "project-formed", category: "Website", href: "https://www.formedsupply.com/", imageUrl: "/assets/images/formed-supply-logo.png", imageAlt: "Formed Supply black wordmark on white" },
];

const services = [
  { title: "Web Design", description: "Custom websites designed around your business, brand, and goals." },
  { title: "Web Development", description: "Responsive websites built for desktop, tablet, and mobile." },
  { title: "3D Interior Design", description: "Interior concepts and 3D visualizations that help you explore a space before it is built." },
  { title: "Content Creation", description: "Visual concepts and assets for campaigns, social content, and brand storytelling." },
  { title: "Website Redesign", description: "Modernizing existing websites with improved design, structure, and usability." },
  { title: "Landing Pages", description: "Focused landing pages built for campaigns, services, and lead generation." },
  { title: "Meta Advertising", description: "Facebook and Instagram advertising campaigns built to generate awareness, traffic, leads, or sales." },
  { title: "Ad Creative", description: "Creative assets and messaging designed for digital advertising campaigns." },
];

const process = [
  { title: "Discover", description: "We learn about your goals, audience, and the experience or space you want to create." },
  { title: "Define", description: "We establish the scope, direction, and details that will guide the project." },
  { title: "Design", description: "We develop the concept and refine the visual details with you." },
  { title: "Deliver", description: "We prepare the final work for its next step, whether that is a launch or a presentation." },
];

const studioStats = [
  { value: "20+", label: "WEBSITES BUILT" },
  { value: "5", label: "BRANDING GUIDES" },
  { value: "6", label: "WEB REDESIGNS" },
  { value: "4", label: "ADS MANAGEMENT CLIENTS" },
];

function Arrow() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return <div className="section-label"><span>{number} / {title}</span><span className="label-line" /></div>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <header className={`site-nav ${scrolled ? "is-scrolled" : ""} ${open ? "menu-open" : ""}`}>
    <a className="wordmark" href="#top" aria-label="Damacii Studios, back to top"><img src="/assets/logos/damacii-white-orange.png" width="799" height="157" alt="Damacii Studios" /></a>
    <nav className="desktop-links" aria-label="Main navigation">
      <a href="#studio">About Us</a><a href="#work">Work</a><a href="#services">Services</a><a href="#contact">Contact</a>
    </nav>
    <div className="nav-location"><span>DAMACII STUDIOS</span><span>SAN DIEGO / CALIFORNIA</span></div>
    <div className="nav-actions"><a className="inquiry-link" href="#project-form">Project Inquiry <Arrow /></a><a className="nav-shop" href="/shop">Shop <Arrow /></a><a className="nav-project" href="#project-form">Start a Project</a></div>
    <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><span className="menu-lines"><i /><i /></span></button>
    <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden={!open}>
      {[["About Us", "#studio"], ["Work", "#work"], ["Services", "#services"], ["Shop", "/shop"], ["Contact", "#contact"]].map(([label, href], i) => <a href={href} key={label} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<Arrow /></a>)}
      <p>SAN DIEGO / CALIFORNIA</p>
    </nav>
  </header>;
}

function Hero() {
  const [heroProjects, setHeroProjects] = useState<HeroProject[]>(defaultHeroProjects);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/hero-projects", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => { if (mounted && Array.isArray(data.projects)) setHeroProjects(data.projects); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const activeProject = heroProjects.find(project => project.id === activeId);
  const titleLines = activeProject?.titleLines ?? ["DAMACII", "CREATIVE", "STUDIO."];

  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className={`hero-media ${activeProject?.imageUrl ? "has-image" : ""} ${activeProject?.imageUrl === "/assets/images/marked-content-creation.png" ? "is-portrait" : ""}`} aria-hidden="true">{activeProject?.imageUrl && <img className="hero-active-image" src={activeProject.imageUrl} alt="" />}{activeProject && <span>{activeProject.name}</span>}</div>
    <div className="hero-topnote"><span>WEB + INTERIOR 3D + CONTENT STUDIO</span><span>SAN DIEGO / CALIFORNIA</span></div>
    <div className="hero-main"><p className="hero-side-note">{activeProject ? activeProject.category : <>WEB DESIGN<br />+ INTERIOR 3D<br />+ CONTENT</>}</p><h1 id="hero-title" className={activeProject ? "project-title" : ""} aria-live="polite">{titleLines.map((line, index) => <span key={`${activeId ?? "default"}-${index}`} className={index === titleLines.length - 1 ? "hero-last" : ""}>{line}</span>)}</h1></div>
    <div className="hero-bottom"><div className="hero-intro"><span className="orange-mark">✳</span><p>{activeProject?.description ?? "We design websites, visualize interiors, and create content that brings ideas into focus."}</p></div><div className="hero-cta"><a className="button button-light" href="#project-form">Start a Project <span>↗</span></a><a className="button button-dark" href="#work">View Our Work <span>↗</span></a></div></div>
    <div className="hero-rail"><div className="hero-stat"><strong>20<span>+</span></strong><span>WEBSITES<br />BUILT</span></div>{heroProjects.map((project, index) => <button className={`hero-preview preview-${["one", "two", "three"][index]} ${project.imageUrl ? "has-image" : ""} ${activeId === project.id ? "is-active" : ""}`} type="button" key={project.id} aria-label={`Show ${project.name} in hero`} aria-pressed={activeId === project.id} onMouseEnter={() => setActiveId(project.id)} onFocus={() => setActiveId(project.id)} onClick={() => setActiveId(project.id)}>{project.imageUrl && <img src={project.imageUrl} alt="" />}<span>{project.name}</span><b>{project.id} / {String(heroProjects.length).padStart(2, "0")}</b></button>)}</div>
  </section>;
}

function IntroSection() {
  return <section className="intro section-pad" id="studio"><SectionLabel number="01" title="WHO WE ARE" /><div className="intro-grid"><h2 className="display-heading reveal">BUILT FOR<br />BRANDS READY<br /><em>TO MOVE.</em></h2><div className="intro-copy reveal"><p>Damacii Studios creates websites, 3D interior designs, and visual content shaped around each client’s goals.</p><p>From digital experiences to interior concepts and campaigns, we focus on clear ideas, thoughtful details, and strong visual direction.</p><a href="#services" className="circle-link" aria-label="Explore our services"><Arrow /></a></div></div></section>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article className={`project-card ${project.shape} reveal`}><a href={project.href ?? "#project-form"} aria-label={project.href ? `Visit ${project.name} website` : `Inquire about ${project.name} style projects`} target={project.href ? "_blank" : undefined} rel={project.href ? "noopener noreferrer" : undefined}><div className={`project-image ${project.imageUrl ? "has-image" : ""}`}>{project.imageUrl ? <img src={project.imageUrl} alt={project.imageAlt ?? project.name} loading="lazy" /> : project.preview ? <div className="project-site-label" aria-hidden="true"><span>{project.preview.eyebrow}</span><strong>{project.preview.title}</strong><small>{project.preview.footer}</small></div> : null}<span className="project-arrow"><Arrow /></span></div><div className="project-meta"><h3>{project.name}</h3><span>{project.category}</span></div></a></article>;
}

function SelectedWork() {
  return <section className="work section-pad" id="work"><SectionLabel number="02" title="SELECTED WORK" /><div className="section-heading-row"><h2 className="display-heading reveal">SELECTED<br /><em>PROJECTS.</em></h2><p>Web design, 3D interiors, and content creation by Damacii Studios.</p></div><div className="work-grid">{projects.map(project => <ProjectCard project={project} key={project.name} />)}</div><a className="text-link" href="#project-form">HAVE A PROJECT IN MIND? <Arrow /></a></section>;
}

function ServicesList() {
  return <section className="services section-pad" id="services"><SectionLabel number="03" title="WHAT WE DO" /><div className="services-heading"><h2 className="display-heading reveal">ONE STUDIO.<br /><em>WEB, 3D + CONTENT.</em></h2></div><div className="service-list">{services.map((service, index) => <a className="service-row reveal" href="#project-form" key={service.title} aria-label={`Inquire about ${service.title}`}><span className="service-index">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><Arrow /></a>)}</div></section>;
}

function Stats() {
  return <section className="stats stats-multi section-pad" aria-label="Studio work at a glance"><div className="stats-grid">{studioStats.map(stat => <div className="stat-item reveal" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></section>;
}

function ProcessSection() {
  return <section className="process section-pad" id="process"><SectionLabel number="04" title="HOW WE WORK" /><div className="process-head"><h2 className="display-heading reveal">FROM IDEA<br /><em>TO DELIVERY.</em></h2><p>A clear process from the first conversation to finished creative work.</p></div><div className="process-grid">{process.map((step, index) => <div className="process-step reveal" key={step.title}><span>0{index + 1} / 04</span><strong>0{index + 1}</strong><h3>{step.title}</h3><p>{step.description}</p></div>)}</div></section>;
}

function Testimonial() {
  return <section className="statement section-pad"><SectionLabel number="05" title="OUR APPROACH" /><div className="statement-grid"><h2>DESIGN SHOULD<br /><em>HAVE A PURPOSE.</em></h2><p>Whether we are shaping a website or visualizing an interior, every design choice should help people understand and connect with the idea.</p></div></section>;
}

function ProjectInquiryForm() {
  const [handoffStarted, setHandoffStarted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const name = get("name");
    const body = [
      `Name: ${name}`,
      `Business / Company: ${get("company") || "Not provided"}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone") || "Not provided"}`,
      `Current website: ${get("website") || "Not provided"}`,
      `Project type: ${get("projectType") || "Not sure yet"}`,
      `Estimated budget: ${get("budget") || "Not specified"}`,
      `Desired timeline: ${get("timeline") || "Not specified"}`,
      "",
      "About the project:",
      get("details"),
    ].join("\n");
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setHandoffStarted(true);
  }

  return <div className="inquiry" id="project-form">
    <div className="inquiry-intro"><span>01 / THE BRIEF</span><h3>TELL US<br />WHAT YOU’RE<br /><em>BUILDING.</em></h3><p>Give us a little information about your project and we’ll take it from there.</p><span className="inquiry-note">PROJECT INQUIRY / DAMACII STUDIOS</span></div>
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="form-field"><span>Name <b>*</b></span><input name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={100} /></label>
        <label className="form-field"><span>Business / Company</span><input name="company" type="text" autoComplete="organization" placeholder="Your business name" maxLength={120} /></label>
      </div>
      <div className="form-row">
        <label className="form-field"><span>Email <b>*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={160} /></label>
        <label className="form-field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" maxLength={30} /></label>
      </div>
      <div className="form-row">
        <label className="form-field"><span>Current Website (if applicable)</span><input name="website" type="text" inputMode="url" autoComplete="url" placeholder="yourwebsite.com" maxLength={200} /></label>
        <label className="form-field"><span>Project Type</span><select name="projectType" defaultValue=""><option value="" disabled>Select a project type</option><option>New Website</option><option>Website Redesign</option><option>Landing Page</option><option>Meta Advertising</option><option>Ad Creative</option><option>3D Interior Design</option><option>Content Creation</option><option>Not Sure Yet</option></select></label>
      </div>
      <label className="form-field form-message"><span>Tell Us About Your Project <b>*</b></span><textarea name="details" placeholder="What are you looking to build?" rows={5} required maxLength={2000} /></label>
      <div className="form-row">
        <label className="form-field"><span>Estimated Budget</span><input name="budget" type="text" placeholder="Your estimated range" maxLength={80} /></label>
        <label className="form-field"><span>Desired Timeline</span><select name="timeline" defaultValue=""><option value="" disabled>Select a timeline</option><option>As soon as possible</option><option>1–3 months</option><option>3–6 months</option><option>6+ months</option><option>Flexible / exploring</option></select></label>
      </div>
      <div className="form-actions"><p>This opens your email app with your answers ready to review and send to {INQUIRY_EMAIL}.</p><button className="button form-submit" type="submit">Send Project <span>↗</span></button></div>
      {handoffStarted && <p className="form-status" role="status">Your email app should open with the completed inquiry. Review it there and send when ready.</p>}
    </form>
  </div>;
}

function CTASection() {
  return <section className="contact section-pad" id="contact"><SectionLabel number="06" title="START SOMETHING" /><div className="contact-top"><p>HAVE A PROJECT IN MIND?</p><img src="/assets/logos/damacii-white-orange.png" width="799" height="157" alt="" aria-hidden="true" /></div><h2 className="display-heading reveal">LET’S BUILD<br />SOMETHING<br /><em>WORTH VISITING.</em></h2><p className="contact-description reveal">Tell us about your website, interior 3D design, or content project. We’d love to hear what you have in mind.</p><div className="contact-bottom reveal"><a className="button button-light contact-button" href="#project-form">Start a Project <span>↗</span></a><a className="email-link" href={`mailto:${INQUIRY_EMAIL}`}>{INQUIRY_EMAIL}</a></div><ProjectInquiryForm /><div className="marquee" aria-hidden="true"><div>DAMACII STUDIOS <span>✳</span> WEB DESIGN <span>✳</span> INTERIOR 3D <span>✳</span> CONTENT CREATION <span>✳</span> DAMACII STUDIOS <span>✳</span> WEB DESIGN <span>✳</span> INTERIOR 3D <span>✳</span> CONTENT CREATION <span>✳</span></div></div></section>;
}

function Footer() {
  return <footer className="footer section-pad"><div className="footer-grid"><div className="reveal"><span className="footer-label">DAMACII STUDIOS</span><p>WEB DESIGN + INTERIOR 3D + CONTENT</p></div><nav className="footer-nav reveal" aria-label="Footer navigation"><a href="#top">Home</a><a href="#work">Work</a><a href="#services">Services</a><a href="#process">Process</a><a href="#contact">Contact</a></nav></div><img className="footer-wordmark" src="/assets/logos/damacii-white-orange.png" width="799" height="157" alt="Damacii Studios" /><div className="footer-bottom"><span>© 2026 DAMACII STUDIOS</span><span>ALL RIGHTS RESERVED</span><a href="#top">BACK TO TOP ↑</a></div></footer>;
}

export function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return <div className="site-shell"><a className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-black" href="#main-content">Skip to content</a><Navbar /><main id="main-content"><Hero /><IntroSection /><SelectedWork /><ServicesList /><Stats /><ProcessSection /><Testimonial /><CTASection /></main><Footer /></div>;
}
