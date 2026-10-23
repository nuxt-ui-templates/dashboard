<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: false,
  alias: ['/auth/sign-in', '/auth/signin']
})

const toast = useToast()
const router = useRouter()

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional()
})

type LoginSchema = z.output<typeof loginSchema>

const state = reactive<Partial<LoginSchema>>({
  email: 'alex.vance@enterprise.com',
  password: 'Password123!',
  remember: true
})

const isSubmitting = ref(false)
const showPassword = ref(false)

async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false

  toast.add({
    title: 'Welcome back!',
    description: `Signed in as ${event.data.email}.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })

  router.push('/')
}

function onSocialLogin(provider: string) {
  toast.add({
    title: `Connecting to ${provider}`,
    description: `Initiating OAuth handshake with ${provider}...`,
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
          name="i-lucide-lock-keyhole"
          class="size-6"
        />
      </div>
      <h1 class="text-xl font-bold text-highlighted tracking-tight">
        Sign in to your account
      </h1>
      <p class="text-xs text-muted">
        Welcome back! Please enter your credentials to continue.
      </p>
    </div>

    <!-- Social Sign In Buttons -->
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
      <span class="text-xs text-muted uppercase font-medium tracking-wider">or email</span>
      <USeparator class="flex-1" />
    </div>

    <!-- Login Form -->
    <UForm
      :schema="loginSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Email Address"
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
        <div class="relative w-full">
          <UInput
            v-model="state.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
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
      </UFormField>

      <div class="flex items-center justify-between text-xs">
        <UCheckbox
          v-model="state.remember"
          label="Remember me"
        />

        <NuxtLink
          to="/auth/forgot-password"
          class="text-primary hover:underline font-medium"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <UButton
        label="Sign In"
        type="submit"
        color="primary"
        variant="solid"
        block
        :loading="isSubmitting"
        class="w-full justify-center"
      />
    </UForm>

    <!-- Quick Demo Tip -->
    <div class="p-3 rounded-lg border border-default/70 bg-elevated/40 text-xs text-muted flex items-start gap-2">
      <UIcon
        name="i-lucide-info"
        class="size-4 text-primary shrink-0 mt-0.5"
      />
      <span>
        Demo credentials: <strong class="text-highlighted">alex.vance@enterprise.com</strong> / <strong class="text-highlighted">Password123!</strong>
      </span>
    </div>

    <div class="text-center text-xs text-muted pt-2 border-t border-default">
      Don't have an account?
      <NuxtLink
        to="/auth/register"
        class="text-primary font-semibold hover:underline ms-1"
      >
        Create an account
      </NuxtLink>
    </div>
  </div>
</template>
