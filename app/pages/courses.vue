<script setup lang="ts">
import type { Course, CourseLevel, CourseStatus } from '~/types'

definePageMeta({
  alias: ['/course', '/courses']
})

const toast = useToast()

const { data: courses } = await useFetch<Course[]>('/api/courses', {
  lazy: true,
  default: () => []
})

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')
const selectedStatus = ref('all')

const isAddModalOpen = ref(false)
const selectedCourse = ref<Course | null>(null)
const isDetailsSlideoverOpen = ref(false)

const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Web Development', value: 'Web Development' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'UI/UX Design', value: 'UI/UX Design' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
  { label: 'Data Science', value: 'Data Science' },
  { label: 'DevOps & Cloud', value: 'DevOps & Cloud' },
  { label: 'Mathematics', value: 'Mathematics' }
]

const levels = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
]

const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    const matchesSearch
      = !searchQuery.value
        || course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || course.code.toLowerCase().includes(searchQuery.value.toLowerCase())
        || course.instructor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || course.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCategory = selectedCategory.value === 'all' || course.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'all' || course.level === selectedLevel.value
    const matchesStatus = selectedStatus.value === 'all' || course.status === selectedStatus.value

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })
})

// Metrics
const totalCourses = computed(() => courses.value.length)
const totalStudents = computed(() => courses.value.reduce((acc, c) => acc + c.studentsCount, 0))
const averageRating = computed(() => {
  if (!courses.value.length) return '0.0'
  const sum = courses.value.reduce((acc, c) => acc + c.rating, 0)
  return (sum / courses.value.length).toFixed(2)
})
const publishedCourses = computed(() => courses.value.filter(c => c.status === 'published').length)

function openCourseDetails(course: Course) {
  selectedCourse.value = course
  isDetailsSlideoverOpen.value = true
}

// Add Course Form State
const newCourse = reactive({
  title: '',
  code: '',
  description: '',
  instructorName: 'David Kim',
  category: 'Web Development',
  level: 'Beginner' as CourseLevel,
  duration: '8 Weeks (32 Hours)',
  lessonsCount: 24,
  price: 199,
  status: 'published' as CourseStatus
})

function createCourse() {
  if (!newCourse.title || !newCourse.code) {
    toast.add({
      title: 'Incomplete Details',
      description: 'Please provide a course code and title.',
      color: 'warning'
    })
    return
  }

  const created: Course = {
    id: `CRS-${Math.floor(500 + Math.random() * 500)}`,
    code: newCourse.code,
    title: newCourse.title,
    description: newCourse.description || 'A comprehensive training curriculum designed by expert faculty.',
    instructor: {
      name: newCourse.instructorName,
      avatar: { src: `https://i.pravatar.cc/128?u=${Math.floor(Math.random() * 100)}` }
    },
    category: newCourse.category,
    level: newCourse.level,
    duration: newCourse.duration,
    lessonsCount: Number(newCourse.lessonsCount),
    studentsCount: 0,
    rating: 5.0,
    price: Number(newCourse.price),
    status: newCourse.status
  }

  courses.value.unshift(created)
  isAddModalOpen.value = false

  newCourse.title = ''
  newCourse.code = ''
  newCourse.description = ''

  toast.add({
    title: 'Course Created',
    description: `"${created.title}" was published to the curriculum catalog.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <UDashboardPanel id="courses-panel">
    <template #header>
      <UDashboardNavbar title="Courses">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              label="Create Course"
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
              Total Curriculums
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ totalCourses }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <UIcon name="i-lucide-book-open" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Active Enrollments
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ totalStudents }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
            <UIcon name="i-lucide-users" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Average Course Score
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ averageRating }} ★
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
            <UIcon name="i-lucide-star" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Published Courses
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ publishedCourses }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <UIcon name="i-lucide-check-circle" class="size-5" />
          </div>
        </div>
      </div>

      <!-- Filters & Category Controls -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search courses by title, code, or instructor..."
            class="w-full sm:w-80"
          />

          <USelect
            v-model="selectedCategory"
            :items="categories"
            placeholder="Category"
            class="w-48"
          />

          <USelect
            v-model="selectedLevel"
            :items="levels"
            placeholder="Level"
            class="w-36"
          />

          <USelect
            v-model="selectedStatus"
            :items="statuses"
            placeholder="Status"
            class="w-36"
          />
        </div>
      </div>

      <!-- Courses Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="rounded-xl border border-default bg-elevated/20 p-5 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
          @click="openCourseDetails(course)"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-elevated text-primary">
                {{ course.code }}
              </span>

              <div class="flex items-center gap-1.5">
                <UBadge
                  :label="course.level"
                  :color="course.level === 'Beginner' ? 'success' : course.level === 'Intermediate' ? 'info' : 'warning'"
                  variant="subtle"
                  size="xs"
                />

                <UBadge
                  :label="course.status"
                  :color="course.status === 'published' ? 'primary' : 'neutral'"
                  variant="outline"
                  size="xs"
                  class="capitalize"
                />
              </div>
            </div>

            <div>
              <h3 class="font-bold text-highlighted text-base group-hover:text-primary transition-colors line-clamp-1">
                {{ course.title }}
              </h3>
              <p class="text-xs text-muted line-clamp-2 mt-1">
                {{ course.description }}
              </p>
            </div>

            <div class="flex items-center gap-2.5 pt-2 border-t border-default/70">
              <UAvatar
                :src="course.instructor.avatar.src"
                :alt="course.instructor.name"
                size="sm"
              />
              <div class="text-xs">
                <span class="text-muted">Instructor: </span>
                <span class="font-medium text-highlighted">{{ course.instructor.name }}</span>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 p-2 rounded-lg bg-elevated/30 border border-default text-center text-xs">
              <div>
                <span class="text-muted block text-[10px]">Lessons</span>
                <span class="font-semibold text-highlighted">{{ course.lessonsCount }}</span>
              </div>
              <div>
                <span class="text-muted block text-[10px]">Students</span>
                <span class="font-semibold text-highlighted">{{ course.studentsCount }}</span>
              </div>
              <div>
                <span class="text-muted block text-[10px]">Rating</span>
                <span class="font-semibold text-highlighted flex items-center justify-center gap-0.5">
                  <span class="text-warning text-xs">★</span>
                  {{ course.rating.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-default flex items-center justify-between">
            <span class="text-base font-bold text-highlighted">
              ${{ course.price }}
            </span>

            <UButton
              label="Syllabus"
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-chevron-right"
              @click.stop="openCourseDetails(course)"
            />
          </div>
        </div>
      </div>

      <!-- Create Course Modal -->
      <UModal
        v-model:open="isAddModalOpen"
        title="Create New Course Curriculum"
        description="Configure academic course syllabus and instructor allocation."
      >
        <template #body>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-3">
              <UFormField label="Code" required>
                <UInput v-model="newCourse.code" placeholder="e.g. CS-301" />
              </UFormField>

              <UFormField label="Category" class="col-span-2" required>
                <USelect v-model="newCourse.category" :items="categories.filter(c => c.value !== 'all')" />
              </UFormField>
            </div>

            <UFormField label="Course Title" required>
              <UInput v-model="newCourse.title" placeholder="e.g. Modern Full-Stack Vue Engineering" icon="i-lucide-book-open" />
            </UFormField>

            <UFormField label="Course Description">
              <UTextarea v-model="newCourse.description" placeholder="Learning objectives, prerequisite knowledge..." :rows="3" />
            </UFormField>

            <div class="grid grid-cols-3 gap-3">
              <UFormField label="Target Level">
                <USelect
                  v-model="newCourse.level"
                  :items="[
                    { label: 'Beginner', value: 'Beginner' },
                    { label: 'Intermediate', value: 'Intermediate' },
                    { label: 'Advanced', value: 'Advanced' }
                  ]"
                />
              </UFormField>

              <UFormField label="Total Lessons">
                <UInput
                  v-model="newCourse.lessonsCount"
                  type="number"
                  min="1"
                  placeholder="24"
                />
              </UFormField>

              <UFormField label="Tuition Price ($)">
                <UInput
                  v-model="newCourse.price"
                  type="number"
                  min="0"
                  placeholder="199"
                />
              </UFormField>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-default">
              <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                @click="isAddModalOpen = false"
              />
              <UButton
                label="Publish Course"
                color="primary"
                variant="solid"
                icon="i-lucide-check"
                @click="createCourse"
              />
            </div>
          </div>
        </template>
      </UModal>

      <!-- Course Details Slideover -->
      <USlideover
        v-model:open="isDetailsSlideoverOpen"
        :title="selectedCourse?.title || 'Course Curriculum'"
        description="Syllabus overview and enrollment analytics"
      >
        <template #body>
          <div v-if="selectedCourse" class="space-y-6">
            <div class="p-4 rounded-xl border border-default bg-elevated/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {{ selectedCourse.code }}
                </span>
                <span class="text-xl font-bold text-highlighted">${{ selectedCourse.price }}</span>
              </div>
              <h3 class="font-bold text-highlighted text-lg">
                {{ selectedCourse.title }}
              </h3>
              <p class="text-xs text-muted leading-relaxed">
                {{ selectedCourse.description }}
              </p>
            </div>

            <div class="space-y-2">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Instructor
              </h4>
              <div class="p-3 rounded-lg border border-default bg-elevated/20 flex items-center gap-3">
                <UAvatar :src="selectedCourse.instructor.avatar.src" size="lg" />
                <div>
                  <p class="font-medium text-highlighted">
                    {{ selectedCourse.instructor.name }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ selectedCourse.category }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Course Specifications
              </h4>
              <div class="p-3 rounded-lg border border-default bg-elevated/20 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted">Target Level:</span>
                  <span class="text-highlighted font-medium">{{ selectedCourse.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Duration:</span>
                  <span class="text-highlighted">{{ selectedCourse.duration }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Lectures / Modules:</span>
                  <span class="text-highlighted">{{ selectedCourse.lessonsCount }} Lessons</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Enrolled Students:</span>
                  <span class="text-highlighted font-semibold">{{ selectedCourse.studentsCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Average Rating:</span>
                  <span class="font-semibold text-warning">★ {{ selectedCourse.rating }}</span>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-default space-y-2">
              <UButton
                label="Enroll Now"
                icon="i-lucide-graduation-cap"
                color="primary"
                variant="solid"
                class="w-full justify-center"
                @click="toast.add({ title: 'Enrollment confirmed', description: `Enrolled into ${selectedCourse.code}`, color: 'success' })"
              />
            </div>
          </div>
        </template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>
