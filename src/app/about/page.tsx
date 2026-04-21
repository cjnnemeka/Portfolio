'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px 120px 48px' }}>
          {/* Hero flex: text left, photo right */}
          <div className="responsive-flex" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '64px',
            marginBottom: '48px',
          }}>
            {/* Title block — line-by-line reveal */}
            <div style={{ flex: 1 }}>
              <div style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    color: 'var(--text-primary)',
                  }}
                >
                  Michael Ihenacho
                </motion.h1>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3rem, 7vw, 6rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    color: 'var(--text-primary)',
                  }}
                >
                  Product Designer.
                </motion.h1>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.25rem',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  marginTop: '24px',
                  maxWidth: '600px',
                  lineHeight: 1.5,
                }}
              >
                I design and build production software. Not prototypes — real systems with real users, real business logic, and real revenue impact.
              </motion.p>
            </div>

            {/* Photo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="responsive-photo"
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-card)',
                border: '2px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <img
                src="/images/pfp/michael.jpeg"
                alt="Michael Ihenacho"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%', borderRadius: '12px' }}
              />
            </motion.div>
          </div>

          {/* Metadata row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="responsive-grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              paddingTop: '32px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Citizenship', value: 'EU Citizen (Italian Passport)', accent: true },
              { label: 'Location', value: 'US → Ireland', accent: false },
              { label: 'Availability', value: 'Immediately', accent: false },
            ].map((item) => (
              <div key={item.label}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: item.accent ? 'var(--accent)' : 'var(--text-primary)',
                  lineHeight: 1.4,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ━━━ ABOUT BLOCKS ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            {/* Block 1: WHO I AM */}
            <motion.div variants={staggerChild} style={{ maxWidth: '720px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '16px',
              }}>
                Who I Am
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
              }}>
                I&rsquo;m a product designer who also builds. I use AI tools like Claude Code to go from design to working software, which means I can prototype, test, and ship without waiting on a dev team. NoelX is the best example. I designed the product, built the frontend and backend, integrated the AI pipeline, and deployed it. It&rsquo;s live at noelx.co.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginTop: '24px',
              }}>
                NoelX is the case for &ldquo;can this person ship a full product end-to-end for a real market?&rdquo; Keel is the case for &ldquo;can this person read where the discipline is going and stake out a thesis before the category consolidates?&rdquo; Two different questions. Both need answers.
              </p>
            </motion.div>

            {/* Block 2: HOW I WORK */}
            <motion.div variants={staggerChild} style={{ maxWidth: '720px', marginTop: '56px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '16px',
              }}>
                How I Work
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
              }}>
                I usually start by figuring out what&rsquo;s actually going wrong before I open Figma. Talking to stakeholders, looking at where users drop off, understanding what the business needs. Then I move fast. I like working closely with engineers and staying involved through shipping, not handing off a file and disappearing. The projects in my portfolio cover patient scheduling, fleet operations, trade promotion management, and AI-powered outreach systems. Different domains, but the common thread is complex workflows where small design decisions have real consequences.
              </p>
            </motion.div>

            {/* Block 3: WHAT I'M LOOKING FOR */}
            <motion.div variants={staggerChild} style={{ maxWidth: '720px', marginTop: '56px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '16px',
              }}>
                What I&rsquo;m Looking For
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
              }}>
                A product design role in Western Europe where I can take ownership of real problems and work closely with a team that cares about what they ship. I have an Italian passport, so no work permit or sponsorship needed. Available to start within a few weeks.
              </p>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          margin: '120px 0',
        }} />

        {/* ━━━ SKILLS & TOOLS ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '24px',
              }}>
                Skills & Tools
              </p>
            </motion.div>

            <motion.div
              variants={staggerChild}
              whileHover={{
                y: -4,
                borderColor: 'var(--border-hover)',
                transition: { duration: 0.3 }
              }}
              className="responsive-grid-2 about-skills-card"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '48px',
                padding: '48px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                cursor: 'default',
                transition: 'border-color 0.3s ease',
              }}
            >
              {/* Design column */}
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                }}>
                  Design
                </h3>
                {[
                  'Product Design & Strategy',
                  'UI/UX Design (Figma, FigJam)',
                  'Design Systems',
                  'User Research & Testing (Maze, Hotjar)',
                  'Information Architecture',
                  'Data Visualization',
                  'Prototyping & Interaction Design',
                  'Accessibility (WCAG 2.1)',
                ].map((skill, i, arr) => (
                  <p key={skill} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    {skill}
                  </p>
                ))}
              </div>

              {/* Engineering column */}
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '24px',
                }}>
                  Development & AI Tools
                </h3>
                {[
                  'Next.js / React (AI-assisted)',
                  'Node.js / Express',
                  'PostgreSQL',
                  'Tailwind CSS',
                  'Claude Code / Cursor',
                  'Anthropic API',
                  'Twilio Integration',
                  'Stripe Integration',
                  'Vercel / Hetzner (Deployment)',
                  'Git / GitHub',
                ].map((skill, i, arr) => (
                  <p key={skill} style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    {skill}
                  </p>
                ))}
              </div>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: 'var(--border)',
          margin: '120px 0',
        }} />

        {/* ━━━ EXPERIENCE ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '24px',
              }}>
                Experience
              </p>
            </motion.div>

            {[
              {
                year: '2024–Present',
                role: 'Product Designer & Developer (Contract)',
                context: 'NoelX — AI-powered patient recovery system',
                description: 'Contracted to design and build the full product from zero. Live at noelx.co.',
              },
              {
                year: '2023–2024',
                role: 'Product Designer',
                context: 'Private client — Patient booking platform',
                description: 'Redesigned patient intake and scheduling flows for a multi-location physiotherapy practice in Texas.',
              },
              {
                year: '2022–2023',
                role: 'Product Designer',
                context: 'Private client — Fleet operations dashboard',
                description: 'Designed real-time tracking dashboard and reporting interface for a regional fleet logistics company.',
              },
            ].map((entry, i, arr) => (
              <motion.div
                key={entry.year}
                variants={staggerChild}
                className="about-exp-row"
                style={{
                  display: 'flex',
                  gap: '48px',
                  padding: '32px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <p className="about-exp-year" style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  width: '200px',
                  flexShrink: 0,
                  letterSpacing: '0.04em',
                }}>
                  {entry.year}
                </p>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}>
                    {entry.role}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                  }}>
                    {entry.context}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 300,
                    color: 'var(--text-muted)',
                  }}>
                    {entry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </section>

      </main>
      <Footer />
    </>
  )
}
