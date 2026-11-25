<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const activeTab = ref('all')
const tabs = [
  { label: 'All Sections', value: 'all', icon: 'i-lucide-layout-grid' },
  { label: 'Profile & Identity', value: 'profile', icon: 'i-lucide-user' },
  { label: 'Company & Billing', value: 'company', icon: 'i-lucide-building-2' },
  { label: 'Preferences & Security', value: 'preferences', icon: 'i-lucide-shield-check' },
  { label: 'Advanced Inputs', value: 'advanced', icon: 'i-lucide-sliders-horizontal' }
]

const formSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  jobTitle: z.string().min(2, 'Job title is required'),
  department: z.string().min(1, 'Please select a department'),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters').optional(),
  companyName: z.string().min(2, 'Company name is required'),
  companySize: z.string(),
  website: z.string().url('Must be a valid URL (include https://)').or(z.literal('')),
  billingCycle: z.string(),
  teamSeats: z.number().min(1).max(100),
  storageLimit: z.number().min(10).max(500),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  securityAlerts: z.boolean(),
  twoFactorAuth: z.boolean(),
  notificationFrequency: z.string(),
  timezone: z.string(),
  currency: z.string()
})

type FormData = z.output<typeof formSchema>

const formData = reactive<FormData>({
  fullName: 'Alex Vance',
  email: 'alex.vance@enterprise.com',
  username: 'alexvance',
  jobTitle: 'Senior Product Architect',
  department: 'engineering',
  bio: 'Passionate about distributed web platforms, reactive design systems, and developer ergonomics.',
  companyName: 'Apex Innovations Ltd',
  companySize: '50-200',
  website: 'https://apex.innovations.com',
  billingCycle: 'annual',
  teamSeats: 12,
  storageLimit: 120,
  emailNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  twoFactorAuth: true,
  notificationFrequency: 'realtime',
  timezone: 'UTC+08:00 (Singapore / Bali)',
  currency: 'USD'
})

const isSubmitting = ref(false)
const showPassword = ref(false)
const passwordInput = ref('SuperSecret#2026')
const showJsonPreview = ref(false)
const tags = ref(['Nuxt 4', 'Tailwind v4', 'TypeScript', 'Vue 3'])
const newTagInput = ref('')
const avatarPreview = ref('https://i.pravatar.cc/128?u=42')
const fileInputRef = ref<HTMLInputElement>()

const departments = [
  { label: 'Engineering & Tech', value: 'engineering' },
  { label: 'Product & Design', value: 'product' },
  { label: 'Growth & Marketing', value: 'marketing' },
  { label: 'Finance & Operations', value: 'operations' },
  { label: 'Executive Leadership', value: 'leadership' }
]

const companySizes = [
  { label: '1 - 10 employees (Startup)', value: '1-10' },
  { label: '11 - 50 employees (Early Growth)', value: '11-50' },
  { label: '50 - 200 employees (Mid-Market)', value: '50-200' },
  { label: '200+ employees (Enterprise)', value: '200+' }
]

const notificationFrequencies = [
  { label: 'Real-time Instant', value: 'realtime', description: 'Immediate push notification for every critical activity' },
  { label: 'Daily Digest', value: 'daily', description: 'A consolidated executive summary delivered once daily at 9:00 AM' },
  { label: 'Weekly Overview', value: 'weekly', description: 'Comprehensive weekly analytics report every Monday morning' }
]

const timezones = [
  { label: 'UTC+08:00 (Singapore, Bali, Hong Kong)', value: 'UTC+08:00 (Singapore / Bali)' },
  { label: 'UTC+07:00 (Jakarta, Bangkok, Hanoi)', value: 'UTC+07:00 (Jakarta / Bangkok)' },
  { label: 'UTC+00:00 (London, Dublin, Lisbon)', value: 'UTC+00:00 (London)' },
  { label: 'UTC-05:00 (New York, Toronto, Miami)', value: 'UTC-05:00 (New York)' },
  { label: 'UTC-08:00 (San Francisco, Vancouver)', value: 'UTC-08:00 (San Francisco)' }
]

const currencies = [
  { label: 'USD ($) - US Dollar', value: 'USD' },
  { label: 'EUR (€) - Euro', value: 'EUR' },
  { label: 'IDR (Rp) - Indonesian Rupiah', value: 'IDR' },
  { label: 'GBP (£) - British Pound', value: 'GBP' },
  { label: 'SGD ($) - Singapore Dollar', value: 'SGD' }
]

function addTag() {
  const trimmed = newTagInput.value.trim()
  if (trimmed && !tags.value.includes(trimmed)) {
    tags.value.push(trimmed)
    newTagInput.value = ''
  }
}

function removeTag(tagToRemove: string) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    avatarPreview.value = URL.createObjectURL(target.files[0])
    toast.add({
      title: 'Avatar uploaded',
      description: 'Your profile image has been updated successfully.',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }
}

async function onSubmit(event: FormSubmitEvent<FormData>) {
  isSubmitting.value = true
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800))
  isSubmitting.value = false

  toast.add({
    title: 'Settings saved successfully',
    description: `Updated form configuration for ${event.data.fullName}.`,
    icon: 'i-lucide-check',
    color: 'success'
  })
}

function onSaveDraft() {
  toast.add({
    title: 'Draft saved',
    description: 'Your form changes have been cached locally.',
    icon: 'i-lucide-bookmark',
    color: 'neutral'
  })
}

function onResetForm() {
  formData.fullName = ''
  formData.email = ''
  formData.username = ''
  formData.jobTitle = ''
  formData.bio = ''
  formData.companyName = ''
  formData.website = ''
  toast.add({
    title: 'Form cleared',
    description: 'All input fields have been reset.',
    icon: 'i-lucide-rotate-ccw',
    color: 'warning'
  })
}
</script>

<template>
  <UDashboardPanel id="forms" :ui="{ body: 'max-w-6xl mx-auto w-full py-6' }">
    <template #header>
      <UDashboardNavbar title="Forms">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Live Data"
            :icon="showJsonPreview ? 'i-lucide-eye-off' : 'i-lucide-code-2'"
            color="neutral"
            variant="ghost"
            @click="showJsonPreview = !showJsonPreview"
          />

          <UButton
            label="Save Draft"
            icon="i-lucide-bookmark"
            color="neutral"
            variant="outline"
            @click="onSaveDraft"
          />

          <UButton
            label="Save Changes"
            icon="i-lucide-check"
            color="primary"
            variant="solid"
            type="submit"
            form="dashboard-form"
            :loading="isSubmitting"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UTabs
            v-model="activeTab"
            :items="tabs"
            :content="false"
            class="flex-1"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <!-- Live JSON Preview Slideover / Modal / Collapse Banner -->
      <UAlert
        v-if="showJsonPreview"
        title="Live Reactive Form State"
        description="Inspect how Vue reactivity tracks every input field in real time."
        icon="i-lucide-braces"
        color="info"
        variant="subtle"
        class="mb-6"
        :close="true"
        @update:open="showJsonPreview = false"
      >
        <template #description>
          <pre class="mt-3 p-3 rounded-lg bg-elevated/70 text-xs overflow-x-auto max-h-48 font-mono border border-default text-highlighted">{{ JSON.stringify(formData, null, 2) }}</pre>
        </template>
      </UAlert>

      <UForm
        id="dashboard-form"
        :schema="formSchema"
        :state="formData"
        class="space-y-8"
        @submit="onSubmit"
      >
        <!-- Section 1: Profile & Identity -->
        <section v-if="activeTab === 'all' || activeTab === 'profile'" class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-highlighted flex items-center gap-2">
              <UIcon name="i-lucide-user" class="text-primary size-5" />
              Profile & Identity
            </h2>
            <p class="text-sm text-muted">
              Manage your personal credentials, public biography, and display details.
            </p>
          </div>

          <div class="rounded-xl border border-default bg-elevated/20 p-5 sm:p-6 space-y-6">
            <!-- Avatar Upload Area -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-default">
              <div class="flex items-center gap-4">
                <UAvatar
                  :src="avatarPreview"
                  :alt="formData.fullName"
                  size="3xl"
                  class="ring-2 ring-primary/30 shadow-md"
                />
                <div>
                  <h4 class="font-medium text-highlighted">
                    Profile Picture
                  </h4>
                  <p class="text-xs text-muted">
                    PNG, JPG, or WEBP up to 2MB. 400x400px recommended.
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <UButton
                      label="Upload new"
                      size="xs"
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-upload"
                      @click="fileInputRef?.click()"
                    />
                    <UButton
                      label="Remove"
                      size="xs"
                      color="error"
                      variant="ghost"
                      @click="avatarPreview = 'https://i.pravatar.cc/128?u=0'"
                    />
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileChange"
                    >
                  </div>
                </div>
              </div>

              <UBadge
                label="Verified Account"
                color="success"
                variant="subtle"
                icon="i-lucide-shield-check"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <UFormField
                label="Full Name"
                name="fullName"
                required
                hint="Legal identification"
              >
                <UInput
                  v-model="formData.fullName"
                  placeholder="e.g. Alex Vance"
                  icon="i-lucide-user"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                label="Work Email"
                name="email"
                required
                hint="Used for invoices and alerts"
              >
                <UInput
                  v-model="formData.email"
                  type="email"
                  placeholder="alex.vance@enterprise.com"
                  icon="i-lucide-mail"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Username" name="username" required>
                <UInput
                  v-model="formData.username"
                  placeholder="alexvance"
                  icon="i-lucide-at-sign"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Job Title" name="jobTitle" required>
                <UInput
                  v-model="formData.jobTitle"
                  placeholder="e.g. Senior Frontend Engineer"
                  icon="i-lucide-briefcase"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Department / Division" name="department" required>
                <USelect
                  v-model="formData.department"
                  :items="departments"
                  placeholder="Select department"
                  icon="i-lucide-building"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Primary Timezone" name="timezone">
                <USelect
                  v-model="formData.timezone"
                  :items="timezones"
                  placeholder="Select timezone"
                  icon="i-lucide-globe"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              label="Professional Bio"
              name="bio"
              :hint="`${(formData.bio || '').length}/300 characters`"
              description="Brief overview for your profile card and team directories."
            >
              <UTextarea
                v-model="formData.bio"
                placeholder="Write a short summary about your background, expertise, or hobbies..."
                :rows="3"
                autoresize
                class="w-full"
              />
            </UFormField>
          </div>
        </section>

        <!-- Section 2: Company & Billing -->
        <section v-if="activeTab === 'all' || activeTab === 'company'" class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-highlighted flex items-center gap-2">
              <UIcon name="i-lucide-building-2" class="text-primary size-5" />
              Company & Organization
            </h2>
            <p class="text-sm text-muted">
              Organization configuration, team seats allocation, and billing intervals.
            </p>
          </div>

          <div class="rounded-xl border border-default bg-elevated/20 p-5 sm:p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <UFormField label="Company Name" name="companyName" required>
                <UInput
                  v-model="formData.companyName"
                  placeholder="e.g. Acme Corporation"
                  icon="i-lucide-landmark"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Organization Website" name="website">
                <UInput
                  v-model="formData.website"
                  placeholder="https://acme.org"
                  icon="i-lucide-link"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Company Size" name="companySize">
                <USelect
                  v-model="formData.companySize"
                  :items="companySizes"
                  icon="i-lucide-users"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Billing Currency" name="currency">
                <USelect
                  v-model="formData.currency"
                  :items="currencies"
                  icon="i-lucide-circle-dollar-sign"
                  class="w-full"
                />
              </UFormField>
            </div>

            <!-- Team Seats & Storage Sliders -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-default">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-highlighted">Active Team Seats</span>
                  <UBadge :label="`${formData.teamSeats} Members`" color="primary" variant="subtle" />
                </div>
                <USlider
                  v-model="formData.teamSeats"
                  :min="1"
                  :max="100"
                  :step="1"
                />
                <p class="text-xs text-muted">
                  Scales up your per-seat license volume and collaboration permissions.
                </p>
              </div>

              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-highlighted">Cloud Storage Allocation</span>
                  <UBadge :label="`${formData.storageLimit} GB`" color="neutral" variant="subtle" />
                </div>
                <USlider
                  v-model="formData.storageLimit"
                  :min="10"
                  :max="500"
                  :step="10"
                />
                <p class="text-xs text-muted">
                  Encrypted SSD object storage for assets, backups, and user uploads.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Preferences & Security -->
        <section v-if="activeTab === 'all' || activeTab === 'preferences'" class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-highlighted flex items-center gap-2">
              <UIcon name="i-lucide-shield-check" class="text-primary size-5" />
              Preferences & Security Controls
            </h2>
            <p class="text-sm text-muted">
              Configure notification frequencies, security alerts, and multi-factor authentication.
            </p>
          </div>

          <div class="rounded-xl border border-default bg-elevated/20 p-5 sm:p-6 space-y-6">
            <!-- Notification Switches -->
            <div class="divide-y divide-default">
              <div class="flex items-center justify-between py-3">
                <div class="space-y-0.5">
                  <span class="text-sm font-medium text-highlighted">System Email Notifications</span>
                  <p class="text-xs text-muted">
                    Receive transactional updates, invoice receipts, and team invites.
                  </p>
                </div>
                <USwitch v-model="formData.emailNotifications" />
              </div>

              <div class="flex items-center justify-between py-3">
                <div class="space-y-0.5">
                  <span class="text-sm font-medium text-highlighted">Security & Vulnerability Alerts</span>
                  <p class="text-xs text-muted">
                    Instant alert when anomalous logins or privilege changes occur.
                  </p>
                </div>
                <USwitch v-model="formData.securityAlerts" />
              </div>

              <div class="flex items-center justify-between py-3">
                <div class="space-y-0.5">
                  <span class="text-sm font-medium text-highlighted">Two-Factor Authentication (2FA)</span>
                  <p class="text-xs text-muted">
                    Require an authenticator code (TOTP) upon sign-in.
                  </p>
                </div>
                <USwitch v-model="formData.twoFactorAuth" />
              </div>

              <div class="flex items-center justify-between py-3">
                <div class="space-y-0.5">
                  <span class="text-sm font-medium text-highlighted">Product & Marketing Updates</span>
                  <p class="text-xs text-muted">
                    Monthly digest of new features, webinars, and developer changelogs.
                  </p>
                </div>
                <USwitch v-model="formData.marketingEmails" />
              </div>
            </div>

            <!-- Radio Group: Frequency -->
            <div class="pt-4 border-t border-default space-y-3">
              <span class="text-sm font-medium text-highlighted">Notification Cadence</span>
              <URadioGroup
                v-model="formData.notificationFrequency"
                :items="notificationFrequencies"
              />
            </div>
          </div>
        </section>

        <!-- Section 4: Advanced Inputs & Controls Showcase -->
        <section v-if="activeTab === 'all' || activeTab === 'advanced'" class="space-y-4">
          <div>
            <h2 class="text-lg font-semibold text-highlighted flex items-center gap-2">
              <UIcon name="i-lucide-sliders-horizontal" class="text-primary size-5" />
              Interactive Components & Inputs
            </h2>
            <p class="text-sm text-muted">
              Rich control widgets including tags, password toggles, and multi-state selectors.
            </p>
          </div>

          <div class="rounded-xl border border-default bg-elevated/20 p-5 sm:p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Password with Show/Hide toggle -->
              <UFormField label="API Secret / Password" hint="Click eye icon to reveal">
                <div class="relative w-full">
                  <UInput
                    v-model="passwordInput"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Enter password..."
                    icon="i-lucide-key"
                    class="w-full"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-highlighted focus:outline-none"
                    @click="showPassword = !showPassword"
                  >
                    <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
                  </button>
                </div>
              </UFormField>

              <!-- Tags / Skill list with dynamic add -->
              <UFormField label="Associated Technology Tags" hint="Press enter to add">
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <UInput
                      v-model="newTagInput"
                      placeholder="Add tag (e.g. Docker, GraphQL)..."
                      icon="i-lucide-tag"
                      class="flex-1"
                      @keydown.enter.prevent="addTag"
                    />
                    <UButton
                      label="Add"
                      icon="i-lucide-plus"
                      color="neutral"
                      variant="outline"
                      @click="addTag"
                    />
                  </div>
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <UBadge
                      v-for="tag in tags"
                      :key="tag"
                      :label="tag"
                      color="primary"
                      variant="subtle"
                      class="cursor-pointer group flex items-center gap-1"
                    >
                      <span>{{ tag }}</span>
                      <UIcon
                        name="i-lucide-x"
                        class="size-3 group-hover:text-error transition-colors"
                        @click.stop="removeTag(tag)"
                      />
                    </UBadge>
                  </div>
                </div>
              </UFormField>
            </div>
          </div>
        </section>

        <!-- Bottom Form Actions -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-default">
          <div class="flex items-center gap-2">
            <UButton
              label="Reset Form"
              color="error"
              variant="ghost"
              icon="i-lucide-rotate-ccw"
              @click="onResetForm"
            />
          </div>

          <div class="flex items-center gap-3">
            <UButton
              label="Save Draft"
              color="neutral"
              variant="outline"
              icon="i-lucide-bookmark"
              @click="onSaveDraft"
            />

            <UButton
              label="Save Changes"
              color="primary"
              variant="solid"
              icon="i-lucide-check"
              type="submit"
              :loading="isSubmitting"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UDashboardPanel>
</template>
