<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-default p-4 sm:p-6 lg:p-8 relative selection:bg-primary selection:text-white">
    <!-- Subtle aesthetic background glow -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-primary/10 blur-3xl opacity-60" />
      <div class="absolute -bottom-40 right-1/4 size-80 rounded-full bg-primary/5 blur-3xl opacity-40" />
    </div>

    <!-- Header: Logo & Return Action -->
    <header class="flex items-center justify-between w-full max-w-5xl mx-auto">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 font-bold text-highlighted text-base hover:opacity-90 transition-opacity"
      >
        <div class="size-8 rounded-lg bg-primary text-inverted flex items-center justify-center shadow-xs">
          <UIcon
            name="i-lucide-layout-dashboard"
            class="size-5 text-white"
          />
        </div>
        <span>Nuxt Dashboard</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <UButton
          label="Back to Dashboard"
          to="/"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          size="sm"
        />

        <UColorModeButton size="sm" />
      </div>
    </header>

    <!-- Main Content: Pure Centered Auth Card -->
    <main class="w-full max-w-md mx-auto my-auto py-8">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="text-center text-xs text-muted py-4">
      <p>&copy; 2026 Nuxt Dashboard. All rights reserved.</p>
    </footer>
  </div>
</template>
