<script setup lang="ts">
import { eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns'
import type { Period, Range } from '~/types'

const props = defineProps<{
  period: Period
  range: Range
}>()

type DataRecord = {
  date: string
  amount: number
}

const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format

const formatDate = (date: Date): string => {
  return ({
    daily: format(date, 'd MMM'),
    weekly: format(date, 'd MMM'),
    monthly: format(date, 'MMM yyy')
  })[props.period]
}

const data = ref<DataRecord[]>([])

watch([() => props.period, () => props.range], () => {
  const dates = ({
    daily: eachDayOfInterval,
    weekly: eachWeekOfInterval,
    monthly: eachMonthOfInterval
  } as Record<Period, typeof eachDayOfInterval>)[props.period](props.range)

  const min = 1000
  const max = 10000

  data.value = dates.map(date => ({ date: formatDate(date), amount: Math.floor(Math.random() * (max - min + 1)) + min }))
}, { immediate: true })

const total = computed(() => data.value.reduce((acc: number, { amount }) => acc + amount, 0))
</script>

<template>
  <UCard :ui="{ root: 'overflow-visible', body: 'px-0! pt-0! pb-3!' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <UChart
      type="area"
      :data="data"
      index="date"
      :categories="[{ key: 'amount', label: 'Revenue' }]"
      :y-axis="false"
      :format="formatNumber"
      :height="384"
      aria-label="Revenue"
    />
  </UCard>
</template>
