import { defineEventHandler } from 'nuxt/server'
import type { Teacher } from '~/types'

const teachers: Teacher[] = [
  {
    id: 'TCH-001',
    name: 'Dr. Marcus Vance',
    email: 'm.vance@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=201' },
    department: 'Computer Science',
    subject: 'Algorithms & Data Structures',
    phone: '+1 (555) 234-5671',
    status: 'active',
    rating: 4.9,
    totalStudents: 142,
    totalCourses: 4,
    experienceYears: 12,
    bio: 'Former principal researcher at MIT. Specializes in computational complexity and distributed databases.'
  },
  {
    id: 'TCH-002',
    name: 'Prof. Sarah Jenkins',
    email: 's.jenkins@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=202' },
    department: 'Design & Media',
    subject: 'UI/UX & Human-Centered Design',
    phone: '+1 (555) 345-6782',
    status: 'active',
    rating: 4.8,
    totalStudents: 198,
    totalCourses: 5,
    experienceYears: 9,
    bio: 'Lead designer with a decade of agency experience. Author of Modern Interface Design Guidelines.'
  },
  {
    id: 'TCH-003',
    name: 'Dr. Raymond Zhao',
    email: 'r.zhao@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=203' },
    department: 'Mathematics',
    subject: 'Advanced Linear Algebra & Statistics',
    phone: '+1 (555) 456-7893',
    status: 'active',
    rating: 4.7,
    totalStudents: 110,
    totalCourses: 3,
    experienceYears: 15,
    bio: 'Passionate mathematician focusing on probabilistic models and statistical learning theory.'
  },
  {
    id: 'TCH-004',
    name: 'Elena Rostova',
    email: 'e.rostova@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=204' },
    department: 'Software Engineering',
    subject: 'Cloud Architecture & DevOps',
    phone: '+1 (555) 567-8904',
    status: 'on_leave',
    rating: 4.9,
    totalStudents: 165,
    totalCourses: 4,
    experienceYears: 8,
    bio: 'Certified Kubernetes architect and open source contributor to cloud-native orchestrators.'
  },
  {
    id: 'TCH-005',
    name: 'David Kim',
    email: 'd.kim@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=205' },
    department: 'Computer Science',
    subject: 'Full-Stack Web Development',
    phone: '+1 (555) 678-9015',
    status: 'active',
    rating: 4.9,
    totalStudents: 230,
    totalCourses: 6,
    experienceYears: 7,
    bio: 'Vue, Nuxt, and TypeScript enthusiast. Dedicated to teaching state-of-the-art web engineering.'
  },
  {
    id: 'TCH-006',
    name: 'Aisha Al-Mansoor',
    email: 'a.mansoor@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=206' },
    department: 'Cybersecurity',
    subject: 'Network Defense & Cryptography',
    phone: '+1 (555) 789-0126',
    status: 'active',
    rating: 4.8,
    totalStudents: 88,
    totalCourses: 3,
    experienceYears: 11,
    bio: 'Certified ethical hacker and information security advisor for fintech enterprises.'
  },
  {
    id: 'TCH-007',
    name: 'Lucas Silva',
    email: 'l.silva@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=207' },
    department: 'Artificial Intelligence',
    subject: 'Machine Learning & Neural Networks',
    phone: '+1 (555) 890-1237',
    status: 'inactive',
    rating: 4.6,
    totalStudents: 95,
    totalCourses: 2,
    experienceYears: 6,
    bio: 'AI practitioner researching transformer architectures and efficient computer vision pipelines.'
  },
  {
    id: 'TCH-008',
    name: 'Dr. Chloe Tremblay',
    email: 'c.tremblay@academy.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=208' },
    department: 'Data Science',
    subject: 'Big Data Processing & Analytics',
    phone: '+1 (555) 901-2348',
    status: 'active',
    rating: 4.9,
    totalStudents: 175,
    totalCourses: 4,
    experienceYears: 10,
    bio: 'Data scientist who specializes in real-time stream processing with Apache Spark and Kafka.'
  }
]

export default defineEventHandler(async () => {
  return teachers
})
