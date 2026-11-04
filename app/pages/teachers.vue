<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'
import type { Teacher, TeacherStatus } from '~/types'

definePageMeta({
  alias: ['/teacher', '/teachers']
})

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()

const { data: teachers, status: fetchStatus } = await useFetch<Teacher[]>('/api/teachers', {
  lazy: true,
  default: () => []
})

const searchQuery = ref('')
const selectedDepartment = ref('all')
const selectedStatus = ref('all')
const viewMode = ref<'grid' | 'table'>('grid')

const isAddModalOpen = ref(false)
const selectedTeacher = ref<Teacher | null>(null)
const isDetailsSlideoverOpen = ref(false)

const departments = [
  { label: 'All Departments', value: 'all' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Software Engineering', value: 'Software Engineering' },
  { label: 'Design & Media', value: 'Design & Media' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
  { label: 'Data Science', value: 'Data Science' },
  { label: 'Mathematics', value: 'Mathematics' }
]

const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on_leave' },
  { label: 'Inactive', value: 'inactive' }
]

const filteredTeachers = computed(() => {
  return teachers.value.filter((teacher) => {
    const matchesSearch
      = !searchQuery.value
        || teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || teacher.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        || teacher.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
        || teacher.department.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesDept = selectedDepartment.value === 'all' || teacher.department === selectedDepartment.value
    const matchesStatus = selectedStatus.value === 'all' || teacher.status === selectedStatus.value

    return matchesSearch && matchesDept && matchesStatus
  })
})

// Metrics
const totalTeachers = computed(() => teachers.value.length)
const activeTeachers = computed(() => teachers.value.filter(t => t.status === 'active').length)
const averageRating = computed(() => {
  if (!teachers.value.length) return '0.0'
  const sum = teachers.value.reduce((acc, t) => acc + t.rating, 0)
  return (sum / teachers.value.length).toFixed(1)
})
const totalStudentsTaught = computed(() => {
  return teachers.value.reduce((acc, t) => acc + t.totalStudents, 0)
})

function openTeacherDetails(teacher: Teacher) {
  selectedTeacher.value = teacher
  isDetailsSlideoverOpen.value = true
}

function sendEmail(email: string) {
  if (import.meta.client) {
    window.location.href = `mailto:${email}`
  }
}

function getRowItems(row: Row<Teacher>) {
  return [
    {
      type: 'label',
      label: 'Instructor Actions'
    },
    {
      label: 'View Profile',
      icon: 'i-lucide-user',
      onSelect() {
        openTeacherDetails(row.original)
      }
    },
    {
      label: 'Send Email',
      icon: 'i-lucide-mail',
      onSelect() {
        sendEmail(row.original.email)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete Instructor',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        const idx = teachers.value.findIndex(t => t.id === row.original.id)
        if (idx !== -1) {
          teachers.value.splice(idx, 1)
          toast.add({
            title: 'Instructor Removed',
            description: `${row.original.name} has been removed.`,
            color: 'error'
          })
        }
      }
    }
  ]
}

const columns: TableColumn<Teacher>[] = [
  {
    accessorKey: 'name',
    header: 'Instructor',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3 py-1 cursor-pointer', onClick: () => openTeacherDetails(row.original) }, [
        h(UAvatar, { ...row.original.avatar, size: 'md' }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted text-sm hover:underline' }, row.original.name),
          h('p', { class: 'text-xs text-muted' }, row.original.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => h('span', { class: 'text-sm font-medium text-highlighted' }, row.original.department)
  },
  {
    accessorKey: 'subject',
    header: 'Specialization',
    cell: ({ row }) => h('span', { class: 'text-xs text-muted' }, row.original.subject)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusMap: Record<TeacherStatus, { color: 'success' | 'warning' | 'error', label: string }> = {
        active: { color: 'success', label: 'Active' },
        on_leave: { color: 'warning', label: 'On Leave' },
        inactive: { color: 'error', label: 'Inactive' }
      }
      const st = statusMap[row.original.status]
      return h(UBadge, { color: st.color, variant: 'subtle', class: 'capitalize text-xs' }, () => st.label)
    }
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-1 text-sm font-medium text-highlighted' }, [
        h('span', { class: 'text-warning font-bold' }, '★'),
        h('span', row.original.rating.toFixed(1))
      ])
    }
  },
  {
    accessorKey: 'totalStudents',
    header: 'Students',
    cell: ({ row }) => h('span', { class: 'text-xs font-semibold text-highlighted' }, row.original.totalStudents)
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

// Add Teacher Form State
const newTeacher = reactive({
  name: '',
  email: '',
  department: 'Computer Science',
  subject: '',
  phone: '',
  experienceYears: 5,
  bio: ''
})

function addTeacher() {
  if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
    toast.add({
      title: 'Incomplete Information',
      description: 'Please fill in name, email, and subject.',
      color: 'warning'
    })
    return
  }

  const created: Teacher = {
    id: `TCH-${Math.floor(100 + Math.random() * 900)}`,
    name: newTeacher.name,
    email: newTeacher.email,
    avatar: { src: `https://i.pravatar.cc/128?u=${Math.floor(Math.random() * 90)}` },
    department: newTeacher.department,
    subject: newTeacher.subject,
    phone: newTeacher.phone || '+1 (555) 000-0000',
    status: 'active',
    rating: 5.0,
    totalStudents: 0,
    totalCourses: 1,
    experienceYears: Number(newTeacher.experienceYears),
    bio: newTeacher.bio || 'New faculty member.'
  }

  teachers.value.unshift(created)
  isAddModalOpen.value = false

  newTeacher.name = ''
  newTeacher.email = ''
  newTeacher.subject = ''
  newTeacher.phone = ''
  newTeacher.bio = ''

  toast.add({
    title: 'Instructor Added',
    description: `${created.name} was successfully registered.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <UDashboardPanel id="teachers-panel">
    <template #header>
      <UDashboardNavbar title="Teachers">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              label="Add Teacher"
              icon="i-lucide-user-plus"
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
              Total Faculty Members
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ totalTeachers }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <UIcon name="i-lucide-graduation-cap" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Active Instructors
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ activeTeachers }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <UIcon name="i-lucide-check-circle-2" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Average Student Rating
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ averageRating }} / 5.0
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
            <UIcon name="i-lucide-star" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Students Taught
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ totalStudentsTaught }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
            <UIcon name="i-lucide-users" class="size-5" />
          </div>
        </div>
      </div>

      <!-- Filter & View Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search teachers by name, subject, or email..."
            class="w-full sm:w-80"
          />

          <USelect
            v-model="selectedDepartment"
            :items="departments"
            placeholder="Department"
            class="w-48"
          />

          <USelect
            v-model="selectedStatus"
            :items="statuses"
            placeholder="Status"
            class="w-36"
          />
        </div>

        <!-- View Mode Switcher -->
        <div class="flex items-center gap-1 border border-default rounded-lg p-0.5 bg-elevated/20">
          <UButton
            icon="i-lucide-layout-grid"
            color="neutral"
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            size="xs"
            aria-label="Grid View"
            @click="viewMode = 'grid'"
          />
          <UButton
            icon="i-lucide-list"
            color="neutral"
            :variant="viewMode === 'table' ? 'solid' : 'ghost'"
            size="xs"
            aria-label="Table View"
            @click="viewMode = 'table'"
          />
        </div>
      </div>

      <!-- Grid Cards View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          class="rounded-xl border border-default bg-elevated/20 p-5 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
          @click="openTeacherDetails(teacher)"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <UAvatar
                :src="teacher.avatar.src"
                :alt="teacher.name"
                size="xl"
                class="ring-2 ring-primary/20"
              />

              <UBadge
                :label="teacher.status === 'active' ? 'Active' : teacher.status === 'on_leave' ? 'On Leave' : 'Inactive'"
                :color="teacher.status === 'active' ? 'success' : teacher.status === 'on_leave' ? 'warning' : 'error'"
                variant="subtle"
                size="xs"
              />
            </div>

            <div>
              <h4 class="font-bold text-highlighted text-base group-hover:text-primary transition-colors">
                {{ teacher.name }}
              </h4>
              <p class="text-xs text-muted">
                {{ teacher.department }}
              </p>
            </div>

            <div class="p-2.5 rounded-lg border border-default bg-elevated/40 text-xs space-y-1">
              <div class="flex justify-between">
                <span class="text-muted">Subject:</span>
                <span class="font-medium text-highlighted truncate max-w-[150px]">{{ teacher.subject }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted">Experience:</span>
                <span class="font-medium text-highlighted">{{ teacher.experienceYears }} Years</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-default flex items-center justify-between text-xs">
            <div class="flex items-center gap-1 font-semibold text-highlighted">
              <span class="text-warning font-bold">★</span>
              <span>{{ teacher.rating.toFixed(1) }}</span>
              <span class="text-muted font-normal">({{ teacher.totalStudents }} students)</span>
            </div>

            <UButton
              label="Profile"
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-right"
              @click.stop="openTeacherDetails(teacher)"
            />
          </div>
        </div>
      </div>

      <!-- Table View -->
      <UTable
        v-else
        :data="filteredTeachers"
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

      <!-- Add Teacher Modal -->
      <UModal
        v-model:open="isAddModalOpen"
        title="Register New Instructor"
        description="Add a new faculty member and assign their teaching specialization."
      >
        <template #body>
          <div class="space-y-4">
            <UFormField label="Full Name" required>
              <UInput v-model="newTeacher.name" placeholder="e.g. Dr. Jane Foster" icon="i-lucide-user" />
            </UFormField>

            <UFormField label="Academic Email" required>
              <UInput
                v-model="newTeacher.email"
                type="email"
                placeholder="j.foster@academy.edu"
                icon="i-lucide-mail"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Department" required>
                <USelect v-model="newTeacher.department" :items="departments.filter(d => d.value !== 'all')" />
              </UFormField>

              <UFormField label="Experience (Years)">
                <UInput
                  v-model="newTeacher.experienceYears"
                  type="number"
                  min="1"
                  placeholder="5"
                />
              </UFormField>
            </div>

            <UFormField label="Primary Subject / Specialization" required>
              <UInput v-model="newTeacher.subject" placeholder="e.g. Quantum Computing" icon="i-lucide-book-open" />
            </UFormField>

            <UFormField label="Phone Number">
              <UInput v-model="newTeacher.phone" placeholder="+1 (555) 000-0000" icon="i-lucide-phone" />
            </UFormField>

            <UFormField label="Academic Biography">
              <UTextarea v-model="newTeacher.bio" placeholder="Brief background, publications, or research areas..." :rows="3" />
            </UFormField>

            <div class="flex justify-end gap-2 pt-3 border-t border-default">
              <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                @click="isAddModalOpen = false"
              />
              <UButton
                label="Add Teacher"
                color="primary"
                variant="solid"
                icon="i-lucide-check"
                @click="addTeacher"
              />
            </div>
          </div>
        </template>
      </UModal>

      <!-- Teacher Detail Slideover -->
      <USlideover
        v-model:open="isDetailsSlideoverOpen"
        :title="selectedTeacher?.name || 'Instructor Details'"
        description="Faculty profile and academic statistics"
      >
        <template #body>
          <div v-if="selectedTeacher" class="space-y-6">
            <div class="flex items-center gap-4 p-4 rounded-xl border border-default bg-elevated/30">
              <UAvatar :src="selectedTeacher.avatar.src" size="3xl" class="ring-2 ring-primary/30" />
              <div>
                <h3 class="font-bold text-highlighted text-lg">
                  {{ selectedTeacher.name }}
                </h3>
                <p class="text-xs text-muted">
                  {{ selectedTeacher.department }}
                </p>
                <UBadge
                  :label="selectedTeacher.status"
                  :color="selectedTeacher.status === 'active' ? 'success' : 'warning'"
                  variant="subtle"
                  class="mt-1 capitalize text-xs"
                />
              </div>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Biography
              </h4>
              <p class="text-sm text-highlighted leading-relaxed p-3 rounded-lg border border-default bg-elevated/20">
                {{ selectedTeacher.bio }}
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Teaching Stats
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Courses Taught
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedTeacher.totalCourses }}
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Total Students
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedTeacher.totalStudents }}
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Rating
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedTeacher.rating }} ★
                  </p>
                </div>
                <div class="p-3 rounded-lg border border-default bg-elevated/20 text-center">
                  <p class="text-xs text-muted">
                    Experience
                  </p>
                  <p class="text-xl font-bold text-highlighted mt-0.5">
                    {{ selectedTeacher.experienceYears }} Yrs
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-default">
              <UButton
                label="Send Email Message"
                icon="i-lucide-mail"
                color="primary"
                variant="solid"
                class="w-full justify-center"
                @click="sendEmail(selectedTeacher.email)"
              />
            </div>
          </div>
        </template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>
