import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
  'n-i': () => router.push('/countries/india'),
  'n-b': () => router.push('/countries/bangladesh'),
  'n-c': () => router.push('/countries/china'),
  //'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
})

  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isNotificationsSlideoverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
