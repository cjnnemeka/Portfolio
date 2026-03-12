'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects'

export default function ProjectsList() {
  return (
    <section id="work" className="responsive-padding" style={{
      padding: '160px 48px 120px 48px',
    }}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '80px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.01em',
        }}>
          Selected Work
        </h2>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
        }}>
          {String(projects.length).padStart(2, '0')} Projects
        </span>
      </motion.div>

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectRow({ project, index }: { project: typeof projects[number]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/work/${project.slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.08,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="responsive-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '64px',
          alignItems: 'center',
          padding: '48px 0',
          paddingLeft: hovered ? '16px' : '0px',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'padding-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Image thumbnail or placeholder */}
        <div style={{
          aspectRatio: '16 / 10',
          backgroundColor: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              draggable={false}
            />
          ) : (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              [{project.title}]
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {/* Index + year */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '16px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 3.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            color: hovered ? project.color : 'var(--text-primary)',
            transition: 'color 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '8px',
          }}>
            {project.title}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '28px',
          }}>
            {project.subtitle}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 400,
                color: hovered ? 'var(--text-secondary)' : 'var(--text-muted)',
                padding: '5px 12px',
                border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
                borderRadius: '100px',
                letterSpacing: '0.04em',
                transition: 'all 0.5s ease',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
