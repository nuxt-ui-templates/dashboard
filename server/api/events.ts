import { defineEventHandler } from 'nuxt/server'
import type { CalendarEvent } from '~/types'

const events: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Quarterly Sprint Review & Demo',
    description: 'Present the latest feature deliverables to stakeholders and review key OKR metrics.',
    date: '2026-10-23',
    time: '10:00 AM',
    duration: '1h 30m',
    category: 'meeting',
    location: 'Conference Room Alpha / Google Meet',
    attendees: [
      { name: 'Sarah Connor', avatar: { src: 'https://i.pravatar.cc/128?u=101' } },
      { name: 'Elena Rostova', avatar: { src: 'https://i.pravatar.cc/128?u=103' } },
      { name: 'David Kim', avatar: { src: 'https://i.pravatar.cc/128?u=110' } }
    ]
  },
  {
    id: 'evt-2',
    title: '1:1 with Engineering Lead',
    description: 'Bi-weekly performance check-in and career development discussion.',
    date: '2026-10-23',
    time: '02:30 PM',
    duration: '45m',
    category: 'work',
    location: 'Meeting Room 4',
    attendees: [
      { name: 'Liam Vance', avatar: { src: 'https://i.pravatar.cc/128?u=102' } }
    ]
  },
  {
    id: 'evt-3',
    title: 'Design System & Token Polish',
    description: 'Review Tailwind v4 theme variables, dark mode contrast tokens, and responsive utilities.',
    date: '2026-10-24',
    time: '11:00 AM',
    duration: '2h',
    category: 'task',
    location: 'Figma & Huddle',
    attendees: [
      { name: 'Zoe Martinez', avatar: { src: 'https://i.pravatar.cc/128?u=109' } },
      { name: 'Lucas Silva', avatar: { src: 'https://i.pravatar.cc/128?u=106' } }
    ]
  },
  {
    id: 'evt-4',
    title: 'Security & Penetration Test Review',
    description: 'Audit report review with external security researchers. Review zero-trust access logs.',
    date: '2026-10-26',
    time: '03:00 PM',
    duration: '1h',
    category: 'reminder',
    location: 'Virtual Room',
    attendees: [
      { name: 'Aisha Al-Mansoor', avatar: { src: 'https://i.pravatar.cc/128?u=111' } }
    ]
  },
  {
    id: 'evt-5',
    title: 'Nuxt 4 Production Migration',
    description: 'Deploy the new edge runtime configuration and monitor canary traffic.',
    date: '2026-10-28',
    time: '09:30 AM',
    duration: '3h',
    category: 'work',
    location: 'DevOps War Room',
    attendees: [
      { name: 'Marcus Brody', avatar: { src: 'https://i.pravatar.cc/128?u=104' } },
      { name: 'Noah Gallagher', avatar: { src: 'https://i.pravatar.cc/128?u=108' } }
    ]
  },
  {
    id: 'evt-6',
    title: 'Q4 Product Marketing Launch Sync',
    description: 'Finalize press release, social media scheduling, and customer announcement emails.',
    date: '2026-10-30',
    time: '01:00 PM',
    duration: '1h',
    category: 'meeting',
    location: 'Main Auditorium',
    attendees: [
      { name: 'Amara Okafor', avatar: { src: 'https://i.pravatar.cc/128?u=105' } },
      { name: 'Sophia Chen', avatar: { src: 'https://i.pravatar.cc/128?u=107' } }
    ]
  },
  {
    id: 'evt-7',
    title: 'Team Retrospective & Monthly Social',
    description: 'Celebrate monthly wins and discuss continuous improvements over team coffee.',
    date: '2026-11-02',
    time: '04:00 PM',
    duration: '1h 30m',
    category: 'personal',
    location: 'Town Square Lounge',
    attendees: [
      { name: 'Felix Weber', avatar: { src: 'https://i.pravatar.cc/128?u=112' } },
      { name: 'Chloe Tremblay', avatar: { src: 'https://i.pravatar.cc/128?u=113' } }
    ]
  },
  {
    id: 'evt-8',
    title: 'Cloud Database Sharding Architecture',
    description: 'Discuss PostgreSQL connection pooling and read-replica distribution strategies.',
    date: '2026-11-05',
    time: '11:30 AM',
    duration: '1h 15m',
    category: 'meeting',
    location: 'Virtual Hangout',
    attendees: [
      { name: 'Hanna Lindqvist', avatar: { src: 'https://i.pravatar.cc/128?u=115' } }
    ]
  }
]

export default defineEventHandler(async () => {
  return events
})
