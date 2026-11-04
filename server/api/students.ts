import { defineEventHandler } from 'nuxt/server'
import type { Student } from '~/types'

const students: Student[] = [
  {
    id: 'STD-1041',
    name: 'Maya Lin',
    email: 'maya.lin@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=301' },
    grade: 'Senior (Year 4)',
    major: 'Computer Science',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gpa: 3.92,
    attendanceRate: 98,
    coursesCount: 5
  },
  {
    id: 'STD-1042',
    name: 'Liam Gallagher',
    email: 'liam.g@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=302' },
    grade: 'Junior (Year 3)',
    major: 'Software Engineering',
    enrollmentDate: '2024-09-01',
    status: 'active',
    gpa: 3.75,
    attendanceRate: 94,
    coursesCount: 4
  },
  {
    id: 'STD-1043',
    name: 'Sophia Martinez',
    email: 'sophia.m@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=303' },
    grade: 'Sophomore (Year 2)',
    major: 'UI/UX Design',
    enrollmentDate: '2025-09-01',
    status: 'active',
    gpa: 3.88,
    attendanceRate: 96,
    coursesCount: 5
  },
  {
    id: 'STD-1044',
    name: 'Ethan Hunt',
    email: 'ethan.h@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=304' },
    grade: 'Senior (Year 4)',
    major: 'Cybersecurity',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gpa: 3.65,
    attendanceRate: 91,
    coursesCount: 4
  },
  {
    id: 'STD-1045',
    name: 'Amara Okafor',
    email: 'amara.okafor@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=305' },
    grade: 'Freshman (Year 1)',
    major: 'Data Science',
    enrollmentDate: '2026-09-01',
    status: 'active',
    gpa: 4.0,
    attendanceRate: 100,
    coursesCount: 6
  },
  {
    id: 'STD-1046',
    name: 'Noah Patel',
    email: 'noah.p@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=306' },
    grade: 'Junior (Year 3)',
    major: 'Artificial Intelligence',
    enrollmentDate: '2024-09-01',
    status: 'active',
    gpa: 3.82,
    attendanceRate: 95,
    coursesCount: 5
  },
  {
    id: 'STD-1047',
    name: 'Zoe Kravitz',
    email: 'zoe.k@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=307' },
    grade: 'Senior (Year 4)',
    major: 'Computer Science',
    enrollmentDate: '2022-09-01',
    status: 'graduated',
    gpa: 3.95,
    attendanceRate: 97,
    coursesCount: 0
  },
  {
    id: 'STD-1048',
    name: 'Felix Chen',
    email: 'felix.c@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=308' },
    grade: 'Sophomore (Year 2)',
    major: 'Information Systems',
    enrollmentDate: '2025-09-01',
    status: 'inactive',
    gpa: 2.85,
    attendanceRate: 72,
    coursesCount: 2
  },
  {
    id: 'STD-1049',
    name: 'Hanna Weber',
    email: 'hanna.w@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=309' },
    grade: 'Freshman (Year 1)',
    major: 'Software Engineering',
    enrollmentDate: '2026-09-01',
    status: 'active',
    gpa: 3.91,
    attendanceRate: 99,
    coursesCount: 5
  },
  {
    id: 'STD-1050',
    name: 'Mateo Rossi',
    email: 'mateo.r@student.edu',
    avatar: { src: 'https://i.pravatar.cc/128?u=310' },
    grade: 'Junior (Year 3)',
    major: 'Cloud Computing',
    enrollmentDate: '2024-09-01',
    status: 'active',
    gpa: 3.68,
    attendanceRate: 93,
    coursesCount: 4
  }
]

export default defineEventHandler(async () => {
  return students
})
