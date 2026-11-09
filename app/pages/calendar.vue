<script setup lang="ts">
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import type { CalendarEvent, EventCategory } from '~/types'

const toast = useToast()

const { data: events } = await useFetch<CalendarEvent[]>('/api/events', {
  lazy: true,
  default: () => []
})

// Current viewed month and year
const todayDate = today(getLocalTimeZone())
const currentYear = ref(todayDate.year)
const currentMonth = ref(todayDate.month) // 1 - 12
const selectedCalendarDate = shallowRef<CalendarDate>(todayDate)

// Active View mode: 'month' | 'week' | 'agenda'
const activeView = ref<'month' | 'agenda'>('month')
const viewOptions = [
  { label: 'Month Grid', value: 'month', icon: 'i-lucide-grid' },
  { label: 'Agenda List', value: 'agenda', icon: 'i-lucide-list-todo' }
]

// Category Filter toggles
const activeCategories = ref<Record<EventCategory, boolean>>({
  meeting: true,
  work: true,
  task: true,
  personal: true,
  reminder: true
})

const categoryMeta: Record<EventCategory, { label: string, color: 'primary' | 'info' | 'warning' | 'success' | 'error', dotColor: string, badgeBg: string }> = {
  meeting: { label: 'Meetings', color: 'primary', dotColor: 'bg-primary', badgeBg: 'bg-primary/10 text-primary border-primary/20' },
  work: { label: 'Work & Projects', color: 'info', dotColor: 'bg-info', badgeBg: 'bg-info/10 text-info border-info/20' },
  task: { label: 'Tasks & Milestones', color: 'warning', dotColor: 'bg-warning', badgeBg: 'bg-warning/10 text-warning border-warning/20' },
  personal: { label: 'Personal & Team', color: 'success', dotColor: 'bg-success', badgeBg: 'bg-success/10 text-success border-success/20' },
  reminder: { label: 'Reminders & Audits', color: 'error', dotColor: 'bg-error', badgeBg: 'bg-error/10 text-error border-error/20' }
}

// Filtered events based on active category checkboxes
const filteredEvents = computed(() => {
  return events.value.filter(e => activeCategories.value[e.category] !== false)
})

// Month name computation
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonthLabel = computed(() => {
  return `${monthNames[currentMonth.value - 1]} ${currentYear.value}`
})

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function goToToday() {
  currentYear.value = todayDate.year
  currentMonth.value = todayDate.month
  selectedCalendarDate.value = todayDate
}

// Watch mini calendar date selection to update month/year
watch(selectedCalendarDate, (newVal) => {
  if (newVal) {
    currentYear.value = newVal.year
    currentMonth.value = newVal.month
  }
})

// Build month grid days
interface DayCell {
  dateStr: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const monthDays = computed<DayCell[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value // 1-12
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay() // 0 = Sun
  const daysInCurrentMonth = new Date(year, month, 0).getDate()
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate()

  const days: DayCell[] = []

  // Today string
  const todayStr = `${todayDate.year}-${String(todayDate.month).padStart(2, '0')}-${String(todayDate.day).padStart(2, '0')}`
  const selectedStr = selectedCalendarDate.value
    ? `${selectedCalendarDate.value.year}-${String(selectedCalendarDate.value.month).padStart(2, '0')}-${String(selectedCalendarDate.value.day).padStart(2, '0')}`
    : ''

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i
    const prevMonthNum = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const dStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    days.push({
      dateStr: dStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedStr
    })
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      dateStr: dStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedStr
    })
  }

  // Next month leading days to complete grid (42 cells: 6 weeks)
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const nextMonthNum = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const dStr = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      dateStr: dStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dStr === todayStr,
      isSelected: dStr === selectedStr
    })
  }

  return days
})

function getEventsForDate(dateStr: string) {
  return filteredEvents.value.filter(e => e.date === dateStr)
}

// Select a day cell
function selectDay(cell: DayCell) {
  const parts = cell.dateStr.split('-').map(Number)
  if (parts[0] && parts[1] && parts[2]) {
    selectedCalendarDate.value = new CalendarDate(parts[0], parts[1], parts[2])
  }
}

// Selected Event Detail Modal / Slideover
const activeEvent = ref<CalendarEvent | null>(null)
const isEventModalOpen = ref(false)

function openEventDetail(event: CalendarEvent) {
  activeEvent.value = event
  isEventModalOpen.value = true
}

// Create New Event
const isNewEventModalOpen = ref(false)
const newEventForm = reactive({
  title: '',
  description: '',
  date: `${todayDate.year}-${String(todayDate.month).padStart(2, '0')}-${String(todayDate.day).padStart(2, '0')}`,
  time: '10:00 AM',
  duration: '1h',
  category: 'meeting' as EventCategory,
  location: 'Virtual Meeting (Google Meet)'
})

function createEvent() {
  if (!newEventForm.title.trim()) {
    toast.add({
      title: 'Title required',
      description: 'Please provide a title for the event.',
      color: 'warning'
    })
    return
  }

  const created: CalendarEvent = {
    id: `evt-${Date.now()}`,
    title: newEventForm.title,
    description: newEventForm.description,
    date: newEventForm.date,
    time: newEventForm.time,
    duration: newEventForm.duration,
    category: newEventForm.category,
    location: newEventForm.location,
    attendees: [
      { name: 'You', avatar: { src: 'https://i.pravatar.cc/128?u=42' } }
    ]
  }

  events.value.push(created)
  isNewEventModalOpen.value = false

  // Reset form
  newEventForm.title = ''
  newEventForm.description = ''

  toast.add({
    title: 'Event Scheduled',
    description: `"${created.title}" added to your calendar.`,
    color: 'success',
    icon: 'i-lucide-calendar-check'
  })
}

// Sorted Agenda events (Chronological)
const agendaEvents = computed(() => {
  return [...filteredEvents.value].sort((a, b) => a.date.localeCompare(b.date))
})

// Upcoming 5 events
const upcomingEvents = computed(() => {
  const todayStr = `${todayDate.year}-${String(todayDate.month).padStart(2, '0')}-${String(todayDate.day).padStart(2, '0')}`
  return [...events.value]
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4)
})
</script>

<template>
  <UDashboardPanel id="calendar-panel" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar title="Calendar">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <!-- Navigation Controls: Month & Year -->
        <template #default>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-semibold text-highlighted min-w-36">
              {{ currentMonthLabel }}
            </h2>

            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-chevron-left"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Previous month"
                @click="prevMonth"
              />
              <UButton
                label="Today"
                color="neutral"
                variant="outline"
                size="xs"
                @click="goToToday"
              />
              <UButton
                icon="i-lucide-chevron-right"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Next month"
                @click="nextMonth"
              />
            </div>
          </div>
        </template>

        <template #right>
          <div class="flex items-center gap-2">
            <UTabs
              v-model="activeView"
              :items="viewOptions"
              :content="false"
              size="xs"
            />

            <UButton
              label="New Event"
              icon="i-lucide-plus"
              color="primary"
              variant="solid"
              @click="isNewEventModalOpen = true"
            />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col lg:flex-row h-full divide-y lg:divide-y-0 lg:divide-x divide-default">
        <!-- Left Sidebar: Mini Calendar & Filters -->
        <aside class="w-full lg:w-80 p-5 space-y-6 shrink-0 bg-elevated/10">
          <!-- Mini Interactive Calendar -->
          <div class="rounded-xl border border-default p-2 bg-elevated/30 flex justify-center">
            <UCalendar
              v-model="selectedCalendarDate"
              class="w-full"
            />
          </div>

          <!-- Category Filters -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase text-muted tracking-wider">
              Calendars & Tags
            </h3>
            <div class="space-y-2">
              <div
                v-for="(meta, cat) in categoryMeta"
                :key="cat"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-elevated/40 transition-colors cursor-pointer"
                @click="activeCategories[cat] = !activeCategories[cat]"
              >
                <div class="flex items-center gap-2.5">
                  <span class="size-2.5 rounded-full" :class="meta.dotColor" />
                  <span class="text-sm font-medium text-highlighted">{{ meta.label }}</span>
                </div>
                <UCheckbox
                  :model-value="activeCategories[cat]"
                  @click.stop
                  @update:model-value="(val) => activeCategories[cat] = !!val"
                />
              </div>
            </div>
          </div>

          <!-- Upcoming Events Preview -->
          <div class="space-y-3 pt-3 border-t border-default">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase text-muted tracking-wider">
                Upcoming Schedule
              </h3>
              <UBadge
                :label="`${upcomingEvents.length}`"
                size="xs"
                variant="subtle"
                color="neutral"
              />
            </div>

            <div class="space-y-2">
              <div
                v-for="evt in upcomingEvents"
                :key="evt.id"
                class="p-2.5 rounded-lg border border-default bg-elevated/20 hover:border-primary/50 transition-all cursor-pointer space-y-1"
                @click="openEventDetail(evt)"
              >
                <div class="flex items-center justify-between gap-1">
                  <span class="text-xs font-semibold text-highlighted truncate">{{ evt.title }}</span>
                  <span class="size-2 rounded-full shrink-0" :class="categoryMeta[evt.category].dotColor" />
                </div>
                <div class="flex items-center justify-between text-[11px] text-muted">
                  <span>{{ evt.date }}</span>
                  <span>{{ evt.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main View Area -->
        <main class="flex-1 flex flex-col p-4 sm:p-6 overflow-auto">
          <!-- Month Grid View -->
          <div v-if="activeView === 'month'" class="flex-1 flex flex-col rounded-xl border border-default bg-elevated/10 overflow-hidden shadow-sm">
            <!-- Day Headers (Sun - Sat) -->
            <div class="grid grid-cols-7 border-b border-default bg-elevated/50 text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <!-- Calendar Cells Grid -->
            <div class="grid grid-cols-7 grid-rows-6 flex-1 divide-x divide-y divide-default">
              <div
                v-for="cell in monthDays"
                :key="cell.dateStr"
                class="min-h-[95px] sm:min-h-[110px] p-1.5 sm:p-2 flex flex-col transition-colors group relative cursor-pointer"
                :class="[
                  cell.isCurrentMonth ? 'bg-transparent' : 'bg-elevated/20 opacity-40',
                  cell.isSelected ? 'ring-2 ring-primary inset-0 z-10' : 'hover:bg-elevated/30'
                ]"
                @click="selectDay(cell)"
              >
                <!-- Day Number & Indicator -->
                <div class="flex items-center justify-between mb-1">
                  <span
                    class="size-6 rounded-full flex items-center justify-center text-xs font-medium"
                    :class="[
                      cell.isToday
                        ? 'bg-primary text-white font-bold shadow-sm'
                        : cell.isCurrentMonth ? 'text-highlighted' : 'text-muted'
                    ]"
                  >
                    {{ cell.dayNumber }}
                  </span>

                  <!-- Event count pill if crowded on small screens -->
                  <span
                    v-if="getEventsForDate(cell.dateStr).length > 2"
                    class="text-[10px] text-muted font-medium sm:hidden"
                  >
                    +{{ getEventsForDate(cell.dateStr).length }}
                  </span>
                </div>

                <!-- Event Badges / Pills inside cell -->
                <div class="space-y-1 overflow-y-auto max-h-[75px] flex-1">
                  <div
                    v-for="evt in getEventsForDate(cell.dateStr)"
                    :key="evt.id"
                    class="text-[11px] font-medium px-1.5 py-0.5 rounded truncate border transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                    :class="categoryMeta[evt.category].badgeBg"
                    @click.stop="openEventDetail(evt)"
                  >
                    <span class="size-1.5 rounded-full shrink-0" :class="categoryMeta[evt.category].dotColor" />
                    <span class="truncate">{{ evt.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Agenda / List View -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-default">
              <h3 class="text-sm font-semibold text-highlighted">
                All Scheduled Events ({{ agendaEvents.length }})
              </h3>
              <span class="text-xs text-muted">Chronological order</span>
            </div>

            <div class="space-y-3">
              <div
                v-for="evt in agendaEvents"
                :key="evt.id"
                class="p-4 rounded-xl border border-default bg-elevated/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                @click="openEventDetail(evt)"
              >
                <div class="flex items-start gap-3.5">
                  <div class="size-10 rounded-xl flex items-center justify-center shrink-0 border" :class="categoryMeta[evt.category].badgeBg">
                    <UIcon name="i-lucide-calendar" class="size-5" />
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h4 class="font-semibold text-highlighted text-sm">
                        {{ evt.title }}
                      </h4>
                      <UBadge
                        :label="categoryMeta[evt.category].label"
                        :color="categoryMeta[evt.category].color"
                        variant="subtle"
                        size="xs"
                      />
                    </div>

                    <p v-if="evt.description" class="text-xs text-muted line-clamp-1">
                      {{ evt.description }}
                    </p>

                    <div class="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                      <span class="flex items-center gap-1">
                        <UIcon name="i-lucide-calendar" class="size-3.5" />
                        {{ evt.date }}
                      </span>
                      <span v-if="evt.time" class="flex items-center gap-1">
                        <UIcon name="i-lucide-clock" class="size-3.5" />
                        {{ evt.time }} ({{ evt.duration || '1h' }})
                      </span>
                      <span v-if="evt.location" class="flex items-center gap-1">
                        <UIcon name="i-lucide-map-pin" class="size-3.5" />
                        {{ evt.location }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center">
                  <div v-if="evt.attendees?.length" class="flex -space-x-1.5 overflow-hidden">
                    <UAvatar
                      v-for="(att, i) in evt.attendees"
                      :key="i"
                      :src="att.avatar.src"
                      :alt="att.name"
                      size="xs"
                      class="ring-2 ring-default"
                    />
                  </div>

                  <UButton
                    label="Details"
                    size="xs"
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-chevron-right"
                    @click.stop="openEventDetail(evt)"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Event Details Modal -->
      <UModal
        v-model:open="isEventModalOpen"
        :title="activeEvent?.title || 'Event Details'"
        description="Event breakdown, attendees, and scheduling information."
      >
        <template #body>
          <div v-if="activeEvent" class="space-y-5">
            <div class="flex items-center justify-between p-3 rounded-lg border border-default bg-elevated/40">
              <div class="flex items-center gap-2">
                <span class="size-3 rounded-full" :class="categoryMeta[activeEvent.category].dotColor" />
                <span class="font-medium text-highlighted capitalize">{{ categoryMeta[activeEvent.category].label }}</span>
              </div>
              <UBadge :label="activeEvent.time || 'All Day'" color="primary" variant="subtle" />
            </div>

            <p v-if="activeEvent.description" class="text-sm text-highlighted leading-relaxed">
              {{ activeEvent.description }}
            </p>

            <div class="space-y-2 text-sm divide-y divide-default border border-default rounded-lg p-3">
              <div class="flex justify-between py-1.5">
                <span class="text-muted">Date</span>
                <span class="font-medium text-highlighted">{{ activeEvent.date }}</span>
              </div>
              <div class="flex justify-between py-1.5">
                <span class="text-muted">Duration</span>
                <span class="font-medium text-highlighted">{{ activeEvent.duration || '1 Hour' }}</span>
              </div>
              <div v-if="activeEvent.location" class="flex justify-between py-1.5">
                <span class="text-muted">Location / Link</span>
                <span class="font-medium text-primary">{{ activeEvent.location }}</span>
              </div>
            </div>

            <!-- Attendees -->
            <div v-if="activeEvent.attendees?.length" class="space-y-2">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Attendees
              </h4>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="(att, idx) in activeEvent.attendees"
                  :key="idx"
                  class="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-default bg-elevated/30"
                >
                  <UAvatar :src="att.avatar.src" size="xs" />
                  <span class="text-xs font-medium text-highlighted">{{ att.name }}</span>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-default">
              <UButton
                label="Close"
                color="neutral"
                variant="subtle"
                @click="isEventModalOpen = false"
              />
              <UButton
                label="Delete Event"
                color="error"
                variant="ghost"
                icon="i-lucide-trash"
                @click="events = events.filter(e => e.id !== activeEvent?.id); isEventModalOpen = false; toast.add({ title: 'Event removed', color: 'error' })"
              />
            </div>
          </div>
        </template>
      </UModal>

      <!-- Create New Event Modal -->
      <UModal
        v-model:open="isNewEventModalOpen"
        title="Schedule New Event"
        description="Add a meeting, task, or team milestone to your dashboard calendar."
      >
        <template #body>
          <div class="space-y-4">
            <UFormField label="Event Title" required>
              <UInput
                v-model="newEventForm.title"
                placeholder="e.g. Weekly Strategy Sync"
                icon="i-lucide-calendar"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Category">
                <USelect
                  v-model="newEventForm.category"
                  :items="[
                    { label: 'Meeting', value: 'meeting' },
                    { label: 'Work', value: 'work' },
                    { label: 'Task', value: 'task' },
                    { label: 'Personal', value: 'personal' },
                    { label: 'Reminder', value: 'reminder' }
                  ]"
                />
              </UFormField>

              <UFormField label="Date (YYYY-MM-DD)" required>
                <UInput
                  v-model="newEventForm.date"
                  type="date"
                  icon="i-lucide-calendar-days"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Start Time">
                <UInput
                  v-model="newEventForm.time"
                  placeholder="e.g. 10:00 AM"
                  icon="i-lucide-clock"
                />
              </UFormField>

              <UFormField label="Duration">
                <UInput
                  v-model="newEventForm.duration"
                  placeholder="e.g. 1h 30m"
                  icon="i-lucide-hourglass"
                />
              </UFormField>
            </div>

            <UFormField label="Location or Meeting Link">
              <UInput
                v-model="newEventForm.location"
                placeholder="e.g. Conference Room B or Google Meet"
                icon="i-lucide-map-pin"
              />
            </UFormField>

            <UFormField label="Description">
              <UTextarea
                v-model="newEventForm.description"
                placeholder="Brief agenda or instructions for participants..."
                :rows="2"
              />
            </UFormField>

            <div class="flex justify-end gap-2 pt-3 border-t border-default">
              <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                @click="isNewEventModalOpen = false"
              />
              <UButton
                label="Schedule Event"
                color="primary"
                variant="solid"
                icon="i-lucide-check"
                @click="createEvent"
              />
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
