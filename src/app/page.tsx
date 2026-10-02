"use client";

import { FormEvent, useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Script from "next/script";
import isEmail from "validator/lib/isEmail";
import styles from "./page.module.css";

const recaptchaSiteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "recaptch123";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://api.com/contact";

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

const projects = [
  {
    number: "01",
    title: "Secure file operations",
    description:
      "A Salesforce-to-S3 upload flow for large files, using Apex-generated presigned URLs and Lambda processing. Platform Events keep record updates asynchronous and dependable.",
    stack: ["AWS S3", "Lambda", "Apex", "Platform Events"],
  },
  {
    number: "02",
    title: "Finance automation",
    description:
      "An end-to-end backend pipeline integrated with Zoho Books for invoice creation and management, deployed on AWS App Runner with source-based deployments.",
    stack: ["Python", "REST API", "Zoho Books", "App Runner"],
  },
  {
    number: "03",
    title: "Vartalaap / My project",
    description:
      "My custom RESTful API project for peer-to-peer messaging with a clear path toward WebSockets, group chat, and SMTP-based email verification.",
    stack: ["Flask", "REST API", "SQL", "WebSockets next"],
  },
];

const experience = [
  {
    date: "Jul 2025 - now",
    role: "Software Development Engineer-1",
    company: "1Vendor Platform",
    detail: "Bengaluru, India",
  },
  {
    date: "Dec 2024 - Jun 2025",
    role: "Software Development Engineer Intern",
    company: "1Vendor Platform",
    detail: "Bengaluru, India",
  },
  {
    date: "Dec 2023 - Feb 2024",
    role: "Business Analyst Intern",
    company: "Stubborn Factory",
    detail: "Ranchi, India",
  },
];

const companyWork = [
  {
    title: "Large-file upload platform",
    detail:
      "Built an LWC and Apex presigned-URL flow for direct Amazon S3 uploads, with Lambda processing and Salesforce Platform Events for asynchronous record updates.",
    tools: "Salesforce / Apex / LWC / S3 / Lambda / Platform Events",
  },
  {
    title: "Connected finance workflows",
    detail:
      "Designed an invoice automation pipeline with Zoho Books that improved team efficiency by more than 60%, then deployed it on AWS App Runner with source-based deployments.",
    tools: "Python / REST APIs / Zoho Books / AWS App Runner / CI/CD",
  },
  {
    title: "Scheduling and audience integrations",
    detail:
      "Delivered backend integrations for Cal.com appointment booking and Mailchimp batch audience uploads, including availability checks, contact synchronization, and automated deployments.",
    tools: "Cal.com / Mailchimp / REST APIs / GitHub Actions / AWS OIDC",
  },
  {
    title: "Internal operations portals",
    detail:
      "Built React portals for secure S3 file management and a Cognito-authenticated CRM supporting 5K+ leads and KYC workflows, including third-party identity verification APIs.",
    tools: "React / Amplify / Cognito / S3 / REST APIs / KYC",
  },
  {
    title: "AI product catalogue pipeline",
    detail:
      "Used Amazon Bedrock to generate descriptions for 3K+ products and publish them to WooCommerce through REST API integration, alongside platform hosting and order-processing services.",
    tools: "Amazon Bedrock / WooCommerce / REST APIs / AWS",
  },
];

const blog = [
  {
    role: "Author",
    title:
      "Why We Stopped Passing Files Through Apex and Started Using Presigned S3 URLs",
    publication: "Medium",
    url: "https://medium.com/@barnwalroushan23/why-we-stopped-passing-files-through-apex-and-started-using-presigned-s3-urls-eb43ee5d7d09",
  },
  {
    role: "Co-author",
    title: "Building a Scalable Middleware Architecture with Salesforce & AWS",
    publication: "1Vendor Platform",
    url: "https://1vendorplatform.com/blogs/building-a-scalable-middleware-architecture-with-salesforce-aws",
  },
  {
    role: "Co-author",
    title: "Enabling AI-Powered B2B Catalogue Management at Scale",
    publication: "1Vendor Platform",
    url: "https://1vendorplatform.com/blogs/enabling-ai-powered-b2b-catalogue-management-at-scale",
  },
];

const capabilityGroups = [
  {
    label: "Languages",
    values: "Python / Apex / Java / SQL / JavaScript / HTML / CSS",
  },
  {
    label: "Cloud & infrastructure",
    values: "AWS / S3 / Lambda / App Runner / Amplify / OIDC / CI/CD",
  },
  {
    label: "Frameworks & APIs",
    values:
      "Flask / React / Next.js / REST APIs / WebSockets / Platform Events",
  },
  {
    label: "Platforms & data",
    values:
      "Salesforce / WooCommerce / Zoho Books / Mailchimp / Cal.com / Cognito / KYC",
  },
  {
    label: "Developer tools",
    values:
      "GitHub / GitHub Actions / VS Code / Postman / Jira / Google Analytics",
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return true;
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    return savedTheme ? savedTheme === "dark" : true;
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formStatus, setFormStatus] = useState("");
  const [formError, setFormError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("portfolio-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function updateScrollProgress() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight
        ? (window.scrollY / scrollableHeight) * 100
        : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("");
    setFormError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const contact = String(formData.get("contact") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email) {
      setFormError("Name and email are required.");
      return;
    }
    if (!isEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    const phoneNumber = contact
      ? parsePhoneNumberFromString(contact, "IN")
      : null;
    if (contact && !phoneNumber?.isValid()) {
      setFormError(
        "Please enter a valid phone number, including the country code when needed.",
      );
      return;
    }
    if (!window.grecaptcha) {
      setFormError("Google reCAPTCHA is still loading. Please try again.");
      return;
    }

    const recaptchaToken = await new Promise<string>((resolve, reject) => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(recaptchaSiteKey, { action: "contact_form" })
          .then(resolve)
          .catch(reject);
      });
    });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Recaptcha-Token": recaptchaToken, },
        body: JSON.stringify({
          name,
          email,
          contact: phoneNumber?.number ?? "",
          message,
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      event.currentTarget.reset();
      setFormStatus("Thanks. Your message has been sent.");
    } catch {
      setFormError(
        "The message could not be sent right now. Please try again or email me directly.",
      );
    }
  }

  function scrollToSection(
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) {
    event.preventDefault();
    const target = document.getElementById(sectionId);
    if (!target) return;
    const headerOffset = 88;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
    window.history.replaceState(null, "", `#${sectionId}`);
  }

  return (
    <div className={`${styles.page} ${darkMode ? styles.darkMode : ""}`}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
        strategy="afterInteractive"
      />
      <header className={styles.navbar}>
        <a
          className={styles.wordmark}
          href="#top"
          aria-label="Roushan Barnwal home"
        >
          RB<span>.</span>
        </a>
        <nav
          id="main-navigation"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ""}`}
          aria-label="Main navigation"
        >
          <a
            href="#work"
            onClick={(event) => {
              scrollToSection(event, "work");
              setMenuOpen(false);
            }}
          >
            Work
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#blog" onClick={() => setMenuOpen(false)}>
            Blog
          </a>
          <a
            href="#contact"
            onClick={(event) => {
              scrollToSection(event, "contact");
              setMenuOpen(false);
            }}
          >
            Contact
          </a>
          <a href="mailto:barnwalroushan23@gmail.com" onClick={() => setMenuOpen(false)}>
            Mail
          </a>
        </nav>
        <div className={styles.headerTools}>
          <a
            className={styles.availability}
            href="mailto:barnwalroushan23@gmail.com"
          >
            <span /> Available
          </a>
          <button
            className={styles.themeToggle}
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☼" : "◐"}
          </button>
          <button
            className={styles.menuToggle}
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>
      <div className={styles.scrollProgress} aria-hidden="true">
        <span style={{ width: `${scrollProgress}%` }} />
      </div>

      <main id="top">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Backend engineer / cloud systems</p>
            <h1>Building the quiet systems that keep products moving.</h1>
            <p className={styles.heroText}>
              I&apos;m Roushan, a backend SDE-1 building secure APIs, cloud
              workflows, and reliable integrations across AWS, Salesforce, and
              third-party platforms. I work close to the product, turning
              complex business requirements into backend systems that are
              practical to operate and simple to use.
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryButton}
                href="#selected-work"
                onClick={(event) => scrollToSection(event, "selected-work")}
              >
                See selected work <span>↘</span>
              </a>
            </div>
          </div>
          <div className={styles.heroSignal} aria-label="Current focus">
            <div className={styles.signalTop}>
              <span>current focus</span>
              <span>2026</span>
            </div>
            <div className={styles.signalMark}>
              API
              <br />/ AWS
              <br />/ DATA
              <br />/ SFDC
            </div>
            <p>
              Turning business requirements into resilient, observable backend
              services.
            </p>
          </div>
        </section>

        <section className={styles.metrics} aria-label="Highlights">
          <div>
            <strong>5K+</strong>
            <span>leads supported</span>
          </div>
          <div>
            <strong>60%</strong>
            <span>efficiency gained</span>
          </div>
          <div>
            <strong>3K+</strong>
            <span>products automated</span>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading} id="work">
            <p className={styles.eyebrow}>01 / 1Vendor Platform</p>
            <h2>Work that runs behind the product.</h2>
          </div>
          <div className={styles.companyWorkList}>
            {companyWork.map((item) => (
              <article className={styles.companyWork} key={item.title}>
                <h3>{item.title}</h3>
                <div>
                  <p>{item.detail}</p>
                  <span>{item.tools}</span>
                </div>
              </article>
            ))}
          </div>
          <article className={styles.companyWork}>
            <h3>Commerce systems</h3>
            <div>
              <p>
                Hosted and supported a WooCommerce e-commerce platform on Amazon
                Lightsail, connecting backend order processing and data
                management with the storefront experience.
              </p>
              <span>
                WooCommerce / Amazon Lightsail / Order processing / Data
                management
              </span>
            </div>
          </article>
          <div className={styles.subHeading} id="selected-work">
            <p className={styles.eyebrow}>02 / Selected work</p>
            <h2>Systems with a job to do.</h2>
          </div>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <article className={styles.project} key={project.number}>
                <span className={styles.projectNumber}>{project.number}</span>
                <div className={styles.projectBody}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className={styles.tags}>
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.aboutSection}`}
          id="about"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>03 / The short version</p>
            <h2>Backend-minded, product-aware.</h2>
          </div>
          <div className={styles.aboutGrid}>
            <p className={styles.aboutLead}>
              I like working where product intent meets infrastructure reality:
              designing APIs, shaping asynchronous workflows, and making
              integrations dependable enough to disappear into the experience.
            </p>
            <div className={styles.experienceList}>
              {experience.map((item) => (
                <div
                  className={styles.experienceItem}
                  key={`${item.company}-${item.date}`}
                >
                  <span>{item.date}</span>
                  <div>
                    <strong>{item.role}</strong>
                    <p>
                      {item.company} / {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.capabilityGrid}>
            {capabilityGroups.map((group) => (
              <div className={styles.capability} key={group.label}>
                <span>{group.label}</span>
                <p>{group.values}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.blogSection}`}
          id="blog"
        >
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>04 / Blog</p>
            <h2>Notes from the systems layer.</h2>
          </div>
          <div className={styles.blogList}>
            {blog.map((article) => (
              <a
                className={styles.article}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                key={article.url}
              >
                <span className={styles.articleRole}>{article.role}</span>
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.publication}</p>
                </div>
                <span className={styles.projectArrow}>↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.contactSection} id="contact">
          <p className={styles.eyebrow}>05 / Start a thread</p>
          <h2>Have a backend problem worth solving?</h2>
          <div className={styles.contactGrid}>
            <form
              className={styles.contactForm}
              onSubmit={handleContactSubmit}
              noValidate
            >
              <label>
                <span className={styles.fieldLabel}>
                  Name <b>*</b>
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Alex Morgan"
                />
              </label>
              <label>
                <span className={styles.fieldLabel}>
                  Email <b>*</b>
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="alex@example.com"
                />
              </label>
              <label>
                <span className={styles.fieldLabel}>
                  Contact <small>(optional)</small>
                </span>
                <input
                  name="contact"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                />
              </label>
              <label>
                <span className={styles.fieldLabel}>
                  Message <small>(optional)</small>
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell me briefly what you are building..."
                />
              </label>
              <button type="submit">
                Send message <span>↗</span>
              </button>
              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}
              {formStatus && (
                <p className={styles.formStatus} role="status">
                  {formStatus}
                </p>
              )}
            </form>
            <div>
              <a className={styles.contactLink} href="#contact">
                Let&apos;s talk <span>↘</span>
              </a>
              <a
                className={styles.contactEmail}
                href="mailto:barnwalroushan23@gmail.com"
              >
                barnwalroushan23@gmail.com
              </a>
              <a className={styles.contactPhone} href="tel:+919031776556">
                +91 9031776556
              </a>
              <div className={styles.socials}>
                <a
                  href="https://www.linkedin.com/in/roushan-kumar-barnwal-423251228"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a href="https://github.com/roushan2312" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a href="https://leetcode.com/u/roushan__23" target="_blank" rel="noreferrer">
                  LeetCode ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>Roushan Kumar Barnwal</strong>
          <span>Backend engineer / cloud systems</span>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className={styles.footerMeta}>
          <a href="mailto:barnwalroushan23@gmail.com">
            barnwalroushan23@gmail.com
          </a>
          {/* <span>Built for the web / 2026</span> */}
        </div>
      </footer>
    </div>
  );
}
