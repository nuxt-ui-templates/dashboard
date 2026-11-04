import { defineEventHandler } from 'nuxt/server'
import type { Order } from '~/types'

const orders: Order[] = [
  {
    id: 'ORD-9842',
    customer: {
      name: 'Sarah Connor',
      email: 'sarah.c@cyberdyne.io',
      avatar: { src: 'https://i.pravatar.cc/128?u=101' }
    },
    product: 'Enterprise Cloud Suite (Annual)',
    category: 'Cloud Services',
    amount: 4850,
    status: 'completed',
    priority: 'high',
    paymentMethod: 'Credit Card (**** 4242)',
    date: '2026-10-22'
  },
  {
    id: 'ORD-9841',
    customer: {
      name: 'Liam Vance',
      email: 'liam.v@apextech.dev',
      avatar: { src: 'https://i.pravatar.cc/128?u=102' }
    },
    product: 'UI Design System & Component Library',
    category: 'Design',
    amount: 1290,
    status: 'processing',
    priority: 'medium',
    paymentMethod: 'PayPal',
    date: '2026-10-21'
  },
  {
    id: 'ORD-9840',
    customer: {
      name: 'Elena Rostova',
      email: 'elena@novacorp.com',
      avatar: { src: 'https://i.pravatar.cc/128?u=103' }
    },
    product: 'Kubernetes Cluster Architecture Review',
    category: 'Consulting',
    amount: 3200,
    status: 'completed',
    priority: 'high',
    paymentMethod: 'Bank Transfer',
    date: '2026-10-20'
  },
  {
    id: 'ORD-9839',
    customer: {
      name: 'Marcus Brody',
      email: 'marcus@archlabs.co',
      avatar: { src: 'https://i.pravatar.cc/128?u=104' }
    },
    product: 'Developer Pro Workstation Hub',
    category: 'Hardware',
    amount: 899,
    status: 'pending',
    priority: 'low',
    paymentMethod: 'Apple Pay',
    date: '2026-10-19'
  },
  {
    id: 'ORD-9838',
    customer: {
      name: 'Amara Okafor',
      email: 'amara.o@zenith.africa',
      avatar: { src: 'https://i.pravatar.cc/128?u=105' }
    },
    product: 'AI Assistant API Subscription (Team)',
    category: 'Software',
    amount: 2400,
    status: 'completed',
    priority: 'high',
    paymentMethod: 'Credit Card (**** 8831)',
    date: '2026-10-18'
  },
  {
    id: 'ORD-9837',
    customer: {
      name: 'Lucas Silva',
      email: 'lucas@vortex.br',
      avatar: { src: 'https://i.pravatar.cc/128?u=106' }
    },
    product: 'Automated CI/CD Pipeline Setup',
    category: 'Consulting',
    amount: 1750,
    status: 'cancelled',
    priority: 'medium',
    paymentMethod: 'Credit Card (**** 1902)',
    date: '2026-10-17'
  },
  {
    id: 'ORD-9836',
    customer: {
      name: 'Sophia Chen',
      email: 'sophia.c@solardata.sg',
      avatar: { src: 'https://i.pravatar.cc/128?u=107' }
    },
    product: 'Analytics Real-time Dashboard License',
    category: 'Software',
    amount: 980,
    status: 'completed',
    priority: 'low',
    paymentMethod: 'Credit Card (**** 6023)',
    date: '2026-10-16'
  },
  {
    id: 'ORD-9835',
    customer: {
      name: 'Noah Gallagher',
      email: 'noah@dublinventures.ie',
      avatar: { src: 'https://i.pravatar.cc/128?u=108' }
    },
    product: 'Managed Database Cluster (12 Months)',
    category: 'Cloud Services',
    amount: 3600,
    status: 'processing',
    priority: 'high',
    paymentMethod: 'Bank Transfer',
    date: '2026-10-15'
  },
  {
    id: 'ORD-9834',
    customer: {
      name: 'Zoe Martinez',
      email: 'zoe@hyperion.mx',
      avatar: { src: 'https://i.pravatar.cc/128?u=109' }
    },
    product: 'Brand Identity & Web Assets Pack',
    category: 'Design',
    amount: 1450,
    status: 'completed',
    priority: 'medium',
    paymentMethod: 'PayPal',
    date: '2026-10-14'
  },
  {
    id: 'ORD-9833',
    customer: {
      name: 'David Kim',
      email: 'david.kim@seoultech.kr',
      avatar: { src: 'https://i.pravatar.cc/128?u=110' }
    },
    product: 'Multi-region CDN & Security Gateway',
    category: 'Cloud Services',
    amount: 2150,
    status: 'pending',
    priority: 'medium',
    paymentMethod: 'Credit Card (**** 9044)',
    date: '2026-10-13'
  },
  {
    id: 'ORD-9832',
    customer: {
      name: 'Aisha Al-Mansoor',
      email: 'aisha@gulfsync.ae',
      avatar: { src: 'https://i.pravatar.cc/128?u=111' }
    },
    product: 'Zero-Trust Security Audit & Compliance',
    category: 'Consulting',
    amount: 5400,
    status: 'completed',
    priority: 'high',
    paymentMethod: 'Bank Transfer',
    date: '2026-10-12'
  },
  {
    id: 'ORD-9831',
    customer: {
      name: 'Felix Weber',
      email: 'felix@bavariacode.de',
      avatar: { src: 'https://i.pravatar.cc/128?u=112' }
    },
    product: '4K Multi-Monitor Thunderbolt Dock',
    category: 'Hardware',
    amount: 450,
    status: 'completed',
    priority: 'low',
    paymentMethod: 'Credit Card (**** 3321)',
    date: '2026-10-11'
  },
  {
    id: 'ORD-9830',
    customer: {
      name: 'Chloe Tremblay',
      email: 'chloe@montrealsoft.ca',
      avatar: { src: 'https://i.pravatar.cc/128?u=113' }
    },
    product: 'Static Site Generator Enterprise Add-on',
    category: 'Software',
    amount: 720,
    status: 'processing',
    priority: 'low',
    paymentMethod: 'Apple Pay',
    date: '2026-10-10'
  },
  {
    id: 'ORD-9829',
    customer: {
      name: 'Mateo Rossi',
      email: 'mateo@milanotech.it',
      avatar: { src: 'https://i.pravatar.cc/128?u=114' }
    },
    product: 'Full-Stack Performance Optimization',
    category: 'Consulting',
    amount: 2800,
    status: 'cancelled',
    priority: 'medium',
    paymentMethod: 'PayPal',
    date: '2026-10-09'
  },
  {
    id: 'ORD-9828',
    customer: {
      name: 'Hanna Lindqvist',
      email: 'hanna@nordiccloud.se',
      avatar: { src: 'https://i.pravatar.cc/128?u=115' }
    },
    product: 'Encrypted Backup Storage (5TB)',
    category: 'Cloud Services',
    amount: 1100,
    status: 'completed',
    priority: 'medium',
    paymentMethod: 'Credit Card (**** 5510)',
    date: '2026-10-08'
  }
]

export default defineEventHandler(async () => {
  return orders
})
