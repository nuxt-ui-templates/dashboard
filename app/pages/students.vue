<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'
import type { Student, StudentStatus } from '~/types'

definePageMeta({
  alias: ['/student', '/students']
})

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const { data: students, status: fetchStatus } = await useFetch<Student[]>('/api/students', {
  lazy: true,
  default: () => []
})

const searchQuery = ref('')
const selectedMajor = ref('all')
const selectedStatus = ref('all')

const isAddModalOpen = ref(false)
const selectedStudent = ref<Student | null>(null)
const isDetailsSlideoverOpen = ref(false)

const majors = [
  { label: 'All Majors', value: 'all' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Software Engineering', value: 'Software Engineering' },
  { label: 'UI/UX Design', value: 'UI/UX Design' },
  { label: 'Data Science', value: 'Data Science' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
  { label: 'Cloud Computing', value: 'Cloud Computing' }
]

const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Graduated', value: 'graduated' },
  { label: 'Inactive', value: 'inactive' }
]

const filteredStudents = computed(() => {
  return students.value.filter((student) => {
    const matchesSearch
      = !searchQuery.value
        || student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || student.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        || student.id.toLowerCase().includes(searchQuery.value.toLowerCase())
        || student.major.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesMajor = selectedMajor.value === 'all' || student.major === selectedMajor.value
    const matchesStatus = selectedStatus.value === 'all' || student.status === selectedStatus.value

    return matchesSearch && matchesMajor && matchesStatus
  })
})

// Metrics
const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'active').length)
const averageGpa = computed(() => {
  if (!students.value.length) return '0.00'
  const sum = students.value.reduce((acc, s) => acc + s.gpa, 0)
  return (sum / students.value.length).toFixed(2)
})
const averageAttendance = computed(() => {
  if (!students.value.length) return '0%'
  const sum = students.value.reduce((acc, s) => acc + s.attendanceRate, 0)
  return `${Math.round(sum / students.value.length)}%`
})

function openStudentDetails(student: Student) {
  selectedStudent.value = student
  isDetailsSlideoverOpen.value = true
}

function contactStudent(email: string) {
  if (import.meta.client) {
    window.location.href = `mailto:${email}`
  }
}

function getRowItems(row: Row<Student>) {
  return [
    {
      type: 'label',
      label: 'Student Actions'
    },
    {
      label: 'View Academic Record',
      icon: 'i-lucide-file-text',
      onSelect() {
        openStudentDetails(row.original)
      }
    },
    {
      label: 'Send Notification',
      icon: 'i-lucide-bell',
      onSelect() {
        toast.add({
          title: 'Notification Queued',
          description: `Direct message sent to ${row.original.name}.`,
          color: 'info'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Remove Student',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        const idx = students.value.findIndex(s => s.id === row.original.id)
        if (idx !== -1) {
          students.value.splice(idx, 1)
          toast.add({
            title: 'Student Removed',
            description: `${row.original.name} was removed from the roster.`,
            color: 'error'
          })
        }
      }
    }
  ]
}

const columns: TableColumn<Student>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs font-semibold text-primary' }, row.original.id)
  },
  {
    accessorKey: 'name',
    header: 'Student Name',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3 py-1 cursor-pointer', onClick: () => openStudentDetails(row.original) }, [
        h(UAvatar, { ...row.original.avatar, size: 'md' }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted text-sm hover:underline' }, row.original.name),
          h('p', { class: 'text-xs text-muted' }, row.original.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'major',
    header: 'Major & Grade',
    cell: ({ row }) => {
      return h('div', undefined, [
        h('p', { class: 'text-sm font-medium text-highlighted' }, row.original.major),
        h('p', { class: 'text-xs text-muted' }, row.original.grade)
      ])
    }
  },
  {
    accessorKey: 'gpa',
    header: 'GPA',
    cell: ({ row }) => {
      const gpa = row.original.gpa
      const color = gpa >= 3.8 ? 'success' : gpa >= 3.5 ? 'primary' : 'warning'
      return h(UBadge, { color, variant: 'subtle', class: 'font-bold' }, () => `${gpa.toFixed(2)} / 4.0`)
    }
  },
  {
    accessorKey: 'attendanceRate',
    header: 'Attendance',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'text-xs font-semibold text-highlighted w-9' }, `${row.original.attendanceRate}%`)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusMap: Record<StudentStatus, { color: 'success' | 'info' | 'error', label: string }> = {
        active: { color: 'success', label: 'Active' },
        graduated: { color: 'info', label: 'Graduated' },
        inactive: { color: 'error', label: 'Inactive' }
      }
      const st = statusMap[row.original.status]
      return h(UBadge, { color: st.color, variant: 'subtle', class: 'capitalize text-xs font-medium' }, () => st.label)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'text-right' }, [
        h(UDropdownMenu, { items: getRowItems(row), content: { align: 'end' } }, () =>
          h(UButton, { icon: 'i-lucide-more-horizontal', color: 'neutral', variant: 'ghost', size: 'xs' })
        )
      ])
    }
  }
]

// Add Student Form State
const newStudent = reactive({
  name: '',
  email: '',
  major: 'Computer Science',
  grade: 'Freshman (Year 1)',
  gpa: 3.8
})

function enrollStudent() {
  if (!newStudent.name || !newStudent.email) {
    toast.add({
      title: 'Incomplete Details',
      description: 'Please provide full name and student email.',
      color: 'warning'
    })
    return
  }

  const created: Student = {
    id: `STD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: newStudent.name,
    email: newStudent.email,
    avatar: { src: `https://i.pravatar.cc/128?u=${Math.floor(Math.random() * 100)}` },
    grade: newStudent.grade,
    major: newStudent.major,
    enrollmentDate: new Date().toISOString().split('T')[0]!,
    status: 'active',
    gpa: Number(newStudent.gpa),
    attendanceRate: 100,
    coursesCount: 4
  }

  students.value.unshift(created)
  isAddModalOpen.value = false

  newStudent.name = ''
  newStudent.email = ''

  toast.add({
    title: 'Student Enrolled',
    description: `${created.name} successfully enrolled with ID ${created.id}.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

function exportCsv() {
  const headers = ['ID', 'Name', 'Email', 'Major', 'Grade', 'GPA', 'Attendance', 'Status']
  const rows = filteredStudents.value.map(s => [
    s.id,
    `"${s.name}"`,
    s.email,
    `"${s.major}"`,
    `"${s.grade}"`,
    s.gpa,
    `${s.attendanceRate}%`,
    s.status
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const link = document.createElement('a')
  link.setAttribute('href', encodeURI(csvContent))
  link.setAttribute('download', `students-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast.add({
    title: 'CSV Downloaded',
    description: `Exported ${filteredStudents.value.length} student records.`,
    color: 'success'
  })
}
</script>

<template>
  <UDashboardPanel id="students-panel">
    <template #header>
      <UDashboardNavbar title="Students">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              label="Export CSV"
              icon="i-lucide-download"
              color="neutral"
              variant="outline"
              @click="exportCsv"
            />
            <UButton
              label="Enroll Student"
              icon="i-lucide-plus"
              color="primary"
              variant="solid"
              @click="isAddModalOpen = true"
            />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Metric Highlights Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Total Enrolled
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ totalStudents }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <UIcon name="i-lucide-users" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Active Scholars
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ activeStudents }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <UIcon name="i-lucide-user-check" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Average GPA
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ averageGpa }} / 4.0
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
            <UIcon name="i-lucide-award" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Attendance Rate
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ averageAttendance }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
            <UIcon name="i-lucide-calendar-check" class="size-5" />
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search student by name, ID, or major..."
            class="w-full sm:w-80"
          />

          <USelect
            v-model="selectedMajor"
            :items="majors"
            placeholder="Major"
            class="w-48"
          />

          <USelect
            v-model="selectedStatus"
            :items="statuses"
            placeholder="Status"
            class="w-36"
          />
        </div>
      </div>

      <!-- Main Students Tanstack Table -->
      <UTable
        :data="filteredStudents"
        :columns="columns"
        :loading="fetchStatus === 'pending'"
        class="shrink-0"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2.5 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r text-xs uppercase tracking-wider text-muted font-semibold',
          td: 'border-b border-default py-2',
          separator: 'h-0'
        }"
      />

      <!-- Enroll Student Modal -->
      <UModal
        v-model:open="isAddModalOpen"
        title="Enroll New Student"
        description="Register a new academic learner and configure enrollment details."
      >
        <template #body>
          <div class="space-y-4">
            <UFormField label="Full Name" required>
              <UInput v-model="newStudent.name" placeholder="e.g. Maya Lin" icon="i-lucide-user" />
            </UFormField>

            <UFormField label="Student Email" required>
              <UInput
                v-model="newStudent.email"
                type="email"
                placeholder="m.lin@student.edu"
                icon="i-lucide-mail"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Academic Major" required>
                <USelect v-model="newStudent.major" :items="majors.filter(m => m.value !== 'all')" />
              </UFormField>

              <UFormField label="Current Class / Grade">
                <USelect
                  v-model="newStudent.grade"
                  :items="[
                    { label: 'Freshman (Year 1)', value: 'Freshman (Year 1)' },
                    { label: 'Sophomore (Year 2)', value: 'Sophomore (Year 2)' },
                    { label: 'Junior (Year 3)', value: 'Junior (Year 3)' },
                    { label: 'Senior (Year 4)', value: 'Senior (Year 4)' }
                  ]"
                />
              </UFormField>
            </div>

            <UFormField label="Starting GPA (0.00 - 4.00)">
              <UInput
                v-model="newStudent.gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.8"
              />
            </UFormField>

            <div class="flex justify-end gap-2 pt-3 border-t border-default">
              <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                @click="isAddModalOpen = false"
              />
              <UButton
                label="Complete Enrollment"
                color="primary"
                variant="solid"
                icon="i-lucide-check"
                @click="enrollStudent"
              />
            </div>
          </div>
        </template>
      </UModal>

      <!-- Student Detail Slideover -->
      <USlideover
        v-model:open="isDetailsSlideoverOpen"
        :title="selectedStudent?.name || 'Academic Record'"
        description="Comprehensive student profile and academic metrics"
      >
        <template #body>
          <div v-if="selectedStudent" class="space-y-6">
            <div class="flex items-center gap-4 p-4 rounded-xl border border-default bg-elevated/30">
              <UAvatar :src="selectedStudent.avatar.src" size="3xl" class="ring-2 ring-primary/30" />
              <div>
                <h3 class="font-bold text-highlighted text-lg">
                  {{ selectedStudent.name }}
                </h3>
                <p class="text-xs text-muted">
                  {{ selectedStudent.id }} • {{ selectedStudent.major }}
                </p>
                <UBadge
                  :label="selectedStudent.status"
                  :color="selectedStudent.status === 'active' ? 'success' : 'info'"
                  variant="subtle"
                  class="mt-1 capitalize text-xs"
                />
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Academic Overview
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Cumulative GPA
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedStudent.gpa.toFixed(2) }}
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Attendance
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedStudent.attendanceRate }}%
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Active Courses
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedStudent.coursesCount }}
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Standing
                  </p>
                  <p class="text-xs font-bold text-success mt-1.5 uppercase">
                    Dean's List
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Enrollment Information
              </h4>
              <div class="p-3 rounded-lg border border-default bg-elevated/20 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted">Student ID:</span>
                  <span class="font-mono text-highlighted">{{ selectedStudent.id }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Year / Grade:</span>
                  <span class="text-highlighted font-medium">{{ selectedStudent.grade }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Enrolled Since:</span>
                  <span class="text-highlighted">{{ selectedStudent.enrollmentDate }}</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-default">
              <UButton
                label="Contact Student"
                icon="i-lucide-mail"
                color="primary"
                variant="solid"
                class="w-full justify-center"
                @click="contactStudent(selectedStudent.email)"
              />
            </div>
          </div>
        </template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>
