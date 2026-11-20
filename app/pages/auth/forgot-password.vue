<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: false,
  alias: ['/auth/reset-password']
})

const toast = useToast()

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type ForgotSchema = z.output<typeof forgotSchema>

const state = reactive<Partial<ForgotSchema>>({
  email: 'alex.vance@enterprise.com'
})

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const resendCountdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

async function onSubmit(event: FormSubmitEvent<ForgotSchema>) {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false
  isSubmitted.value = true

  startResendTimer()

  toast.add({
    title: 'Reset instructions sent',
    description: `A password reset link was dispatched to ${event.data.email}.`,
    color: 'success',
    icon: 'i-lucide-send'
  })
}

function startResendTimer() {
  resendCountdown.value = 30
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value -= 1
    } else if (timer) {
      clearInterval(timer)
    }
  }, 1000)
}

function onResend() {
  if (resendCountdown.value > 0) return
  startResendTimer()
  toast.add({
    title: 'Link re-sent',
    description: 'A new recovery email has been sent.',
    color: 'info',
    icon: 'i-lucide-refresh-cw'
  })
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="rounded-2xl border border-default bg-elevated/20 p-6 sm:p-8 shadow-sm space-y-6">
    <!-- Success Confirmation State -->
    <div
      v-if="isSubmitted"
      class="space-y-5 text-center"
    >
      <div class="size-14 rounded-2xl bg-success/10 text-success mx-auto flex items-center justify-center">
        <UIcon
          name="i-lucide-mail-check"
          class="size-7"
        />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-bold text-highlighted tracking-tight">
          Check your email
        </h2>
        <p class="text-xs text-muted leading-relaxed max-w-sm mx-auto">
          We sent a password reset link to <strong class="text-highlighted font-medium">{{ state.email }}</strong>. Please follow the instructions to reset your password.
        </p>
      </div>

      <div class="p-4 rounded-xl border border-default bg-elevated/30 text-xs text-muted space-y-2">
        <p>Didn't receive the email? Check your spam folder or request a new one.</p>
        <UButton
          :label="resendCountdown > 0 ? `Resend email (${resendCountdown}s)` : 'Resend reset link'"
          :disabled="resendCountdown > 0"
          color="neutral"
          variant="outline"
          size="xs"
          icon="i-lucide-refresh-cw"
          @click="onResend"
        />
      </div>

      <div class="pt-2">
        <UButton
          label="Back to Sign In"
          to="/auth/login"
          color="primary"
          variant="solid"
          block
          icon="i-lucide-arrow-left"
          class="w-full justify-center"
        />
      </div>
    </div>

    <!-- Request Form State -->
    <template v-else>
      <div class="space-y-1.5 text-center">
        <div class="size-12 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
          <UIcon
            name="i-lucide-key-round"
            class="size-6"
          />
        </div>
        <h1 class="text-xl font-bold text-highlighted tracking-tight">
          Forgot your password?
        </h1>
        <p class="text-xs text-muted">
          No worries! Enter your registered email and we'll send you recovery instructions.
        </p>
      </div>

      <UForm
        :schema="forgotSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Email Address"
          name="email"
          required
          hint="We will send a reset link"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="name@company.com"
            icon="i-lucide-mail"
            class="w-full"
          />
        </UFormField>

        <UButton
          label="Send Reset Instructions"
          type="submit"
          color="primary"
          variant="solid"
          block
          icon="i-lucide-send"
          :loading="isSubmitting"
          class="w-full justify-center"
        />
      </UForm>

      <div class="text-center text-xs text-muted pt-2 border-t border-default">
        Remember your password?
        <NuxtLink
          to="/auth/login"
          class="text-primary font-semibold hover:underline ms-1 inline-flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-arrow-left"
            class="size-3"
          />
          Back to sign in
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
