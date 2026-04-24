'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { asset } from '@/lib/utils'

export default function ProjectsList() {
  return (
    <section id="work" className="responsive-padding" style={{
      padding: '120px 48px 80px 48px',
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
          marginBottom: '56px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
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

      {/* Project grid — 2 columns desktop, 1 column mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px 40px',
      }}
        className="projects-grid"
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>

    </section>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/work/${project.slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.08,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          cursor: 'pointer',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Thumbnail */}
        <div style={{
          aspectRatio: '16 / 10',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
          transition: 'border-color 0.4s ease',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {project.thumbnail ? (
            <img
              src={asset(project.thumbnail)}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
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
          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
            }}>
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: hovered ? project.color : 'var(--text-primary)',
            transition: 'color 0.4s ease',
            marginBottom: '8px',
          }}>
            {project.title}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '16px',
          }}>
            {project.subtitle}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                color: 'var(--text-muted)',
                padding: '4px 10px',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                letterSpacing: '0.04em',
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
