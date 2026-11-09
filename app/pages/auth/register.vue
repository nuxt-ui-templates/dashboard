<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: false,
  alias: ['/auth/sign-up', '/auth/signup']
})

const toast = useToast()
const router = useRouter()

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  terms: z.boolean().refine(val => val === true, 'You must accept terms')
})

type RegisterSchema = z.output<typeof registerSchema>

const state = reactive<Partial<RegisterSchema>>({
  name: '',
  email: '',
  password: '',
  terms: false
})

const isSubmitting = ref(false)
const showPassword = ref(false)

const passwordStrength = computed(() => {
  const pwd = state.password || ''
  if (!pwd) return { score: 0, label: 'None', color: 'bg-muted' }
  let score = 0
  if (pwd.length >= 8) score += 1
  if (/[A-Z]/.test(pwd)) score += 1
  if (/[0-9]/.test(pwd)) score += 1
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1

  if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-error' }
  if (score <= 2) return { score: 50, label: 'Fair', color: 'bg-warning' }
  if (score <= 3) return { score: 75, label: 'Good', color: 'bg-info' }
  return { score: 100, label: 'Strong', color: 'bg-success' }
})

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false

  toast.add({
    title: 'Account created!',
    description: `Welcome to Nuxt Dashboard, ${event.data.name}!`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })

  router.push('/')
}

function onSocialLogin(provider: string) {
  toast.add({
    title: `Connecting to ${provider}`,
    description: `Initiating OAuth registration with ${provider}...`,
    color: 'neutral',
    icon: 'i-lucide-loader'
  })
}
</script>

<template>
  <div class="rounded-2xl border border-default bg-elevated/20 p-6 sm:p-8 shadow-sm space-y-6">
    <div class="space-y-1.5 text-center">
      <div class="size-12 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
        <UIcon
          name="i-lucide-user-plus"
          class="size-6"
        />
      </div>
      <h1 class="text-xl font-bold text-highlighted tracking-tight">
        Create a new account
      </h1>
      <p class="text-xs text-muted">
        Start your 14-day free trial. No credit card required.
      </p>
    </div>

    <!-- Social Sign Up -->
    <div class="grid grid-cols-2 gap-3">
      <UButton
        label="Google"
        icon="i-simple-icons-google"
        color="neutral"
        variant="outline"
        class="justify-center"
        @click="onSocialLogin('Google')"
      />
      <UButton
        label="GitHub"
        icon="i-simple-icons-github"
        color="neutral"
        variant="outline"
        class="justify-center"
        @click="onSocialLogin('GitHub')"
      />
    </div>

    <div class="flex items-center gap-3">
      <USeparator class="flex-1" />
      <span class="text-xs text-muted uppercase font-medium tracking-wider">or with email</span>
      <USeparator class="flex-1" />
    </div>

    <!-- Registration Form -->
    <UForm
      :schema="registerSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Full Name"
        name="name"
        required
      >
        <UInput
          v-model="state.name"
          placeholder="e.g. Alex Vance"
          icon="i-lucide-user"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Work Email"
        name="email"
        required
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="name@company.com"
          icon="i-lucide-mail"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Password"
        name="password"
        required
      >
        <div class="space-y-2">
          <div class="relative w-full">
            <UInput
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="At least 8 characters"
              icon="i-lucide-lock"
              class="w-full"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-highlighted focus:outline-none"
              @click="showPassword = !showPassword"
            >
              <UIcon
                :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="size-4"
              />
            </button>
          </div>

          <!-- Strength Meter Bar -->
          <div
            v-if="state.password"
            class="space-y-1 pt-1"
          >
            <div class="h-1.5 w-full bg-elevated rounded-full overflow-hidden flex">
              <div
                class="h-full transition-all duration-300 rounded-full"
                :class="passwordStrength.color"
                :style="{ width: `${passwordStrength.score}%` }"
              />
            </div>
            <div class="flex justify-between text-[11px] text-muted">
              <span>Password strength:</span>
              <span class="font-medium text-highlighted">{{ passwordStrength.label }}</span>
            </div>
          </div>
        </div>
      </UFormField>

      <UFormField name="terms">
        <UCheckbox
          v-model="state.terms"
          label="I agree to the Terms of Service and Privacy Policy"
        />
      </UFormField>

      <UButton
        label="Create Account"
        type="submit"
        color="primary"
        variant="solid"
        block
        :loading="isSubmitting"
        class="w-full justify-center"
      />
    </UForm>

    <div class="text-center text-xs text-muted pt-2 border-t border-default">
      Already have an account?
      <NuxtLink
        to="/auth/login"
        class="text-primary font-semibold hover:underline ms-1"
      >
        Sign in
      </NuxtLink>
    </div>
  </div>
</template>
