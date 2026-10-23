import { defineEventHandler } from 'nuxt/server'
import type { Course } from '~/types'

const courses: Course[] = [
  {
    id: 'CRS-501',
    code: 'CS-401',
    title: 'Advanced Full-Stack Nuxt & Vue 3 Masterclass',
    description: 'Master server-side rendering, hybrid caching, reactive UI patterns, and TypeScript with Nuxt 4.',
    instructor: {
      name: 'David Kim',
      avatar: { src: 'https://i.pravatar.cc/128?u=205' }
    },
    category: 'Web Development',
    level: 'Advanced',
    duration: '10 Weeks (40 Hours)',
    lessonsCount: 32,
    studentsCount: 230,
    rating: 4.95,
    price: 349,
    status: 'published'
  },
  {
    id: 'CRS-502',
    code: 'CS-201',
    title: 'Data Structures, Graph Theory & Algorithms',
    description: 'Comprehensive study of asymptotic complexity, trees, graphs, dynamic programming, and network flows.',
    instructor: {
      name: 'Dr. Marcus Vance',
      avatar: { src: 'https://i.pravatar.cc/128?u=201' }
    },
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '12 Weeks (48 Hours)',
    lessonsCount: 40,
    studentsCount: 142,
    rating: 4.9,
    price: 299,
    status: 'published'
  },
  {
    id: 'CRS-503',
    code: 'DSN-101',
    title: 'Design Systems & Modern Figma to Code',
    description: 'Build enterprise design tokens, responsive UI components, and accessible patterns from scratch.',
    instructor: {
      name: 'Prof. Sarah Jenkins',
      avatar: { src: 'https://i.pravatar.cc/128?u=202' }
    },
    category: 'UI/UX Design',
    level: 'Beginner',
    duration: '8 Weeks (32 Hours)',
    lessonsCount: 26,
    studentsCount: 198,
    rating: 4.88,
    price: 249,
    status: 'published'
  },
  {
    id: 'CRS-504',
    code: 'SEC-301',
    title: 'Zero-Trust Architecture & Cloud Security',
    description: 'Hands-on penetration testing, OAuth2 / OIDC deep dive, container isolation, and automated audits.',
    instructor: {
      name: 'Aisha Al-Mansoor',
      avatar: { src: 'https://i.pravatar.cc/128?u=206' }
    },
    category: 'Cybersecurity',
    level: 'Advanced',
    duration: '9 Weeks (36 Hours)',
    lessonsCount: 28,
    studentsCount: 88,
    rating: 4.92,
    price: 399,
    status: 'published'
  },
  {
    id: 'CRS-505',
    code: 'AI-202',
    title: 'Deep Learning & Transformer Foundations',
    description: 'PyTorch implementation of attention mechanisms, fine-tuning LLMs, and multi-modal embedding models.',
    instructor: {
      name: 'Lucas Silva',
      avatar: { src: 'https://i.pravatar.cc/128?u=207' }
    },
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    duration: '11 Weeks (44 Hours)',
    lessonsCount: 35,
    studentsCount: 95,
    rating: 4.75,
    price: 320,
    status: 'published'
  },
  {
    id: 'CRS-506',
    code: 'DAT-305',
    title: 'Distributed Stream Processing with Apache Spark',
    description: 'Real-time analytics pipelines, event-driven architectures, and large-scale data warehousing.',
    instructor: {
      name: 'Dr. Chloe Tremblay',
      avatar: { src: 'https://i.pravatar.cc/128?u=208' }
    },
    category: 'Data Science',
    level: 'Advanced',
    duration: '10 Weeks (40 Hours)',
    lessonsCount: 30,
    studentsCount: 175,
    rating: 4.89,
    price: 360,
    status: 'published'
  },
  {
    id: 'CRS-507',
    code: 'DEV-102',
    title: 'Kubernetes in Practice & Continuous Delivery',
    description: 'Declarative GitOps deployments with ArgoCD, Helm chart management, and production observability.',
    instructor: {
      name: 'Elena Rostova',
      avatar: { src: 'https://i.pravatar.cc/128?u=204' }
    },
    category: 'DevOps & Cloud',
    level: 'Intermediate',
    duration: '6 Weeks (24 Hours)',
    lessonsCount: 20,
    studentsCount: 165,
    rating: 4.82,
    price: 219,
    status: 'draft'
  },
  {
    id: 'CRS-508',
    code: 'MTH-201',
    title: 'Linear Algebra & Probability for Engineers',
    description: 'Eigenvalues, vector spaces, Markov chains, and numerical methods for machine learning.',
    instructor: {
      name: 'Dr. Raymond Zhao',
      avatar: { src: 'https://i.pravatar.cc/128?u=203' }
    },
    category: 'Mathematics',
    level: 'Beginner',
    duration: '12 Weeks (48 Hours)',
    lessonsCount: 38,
    studentsCount: 110,
    rating: 4.79,
    price: 199,
    status: 'published'
  }
]

export default defineEventHandler(async () => {
  return courses
})
