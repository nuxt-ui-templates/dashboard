<script setup lang="ts">
import { useToast, useFetch, ref, reactive, computed } from '#imports'
import type { User } from '~/types'

const toast = useToast()
const { data: customers, refresh, status } = useFetch<User[]>('/api/customers', {
  lazy: true
})

const selectedCustomer = ref<User | null>(null)
const isEditModalOpen = ref(false)

const editForm = reactive({
  name: '',
  email: '',
  location: '',
  status: 'subscribed' as 'subscribed' | 'unsubscribed' | 'bounced'
})

function openEditModal(customer: User) {
  selectedCustomer.value = customer
  editForm.name = customer.name
  editForm.email = customer.email
  editForm.location = customer.location
  editForm.status = customer.status
  isEditModalOpen.value = true
}

function saveChanges() {
  toast.add({
    title: 'Customer updated',
    description: `${editForm.name} has been updated successfully.`,
    icon: 'i-lucide-check',
    color: 'success'
  })
  isEditModalOpen.value = false
  selectedCustomer.value = null
}

function deleteCustomer(customer: User) {
  toast.add({
    title: 'Customer deleted',
    description: `${customer.name} has been deleted.`,
    icon: 'i-lucide-trash',
    color: 'error'
  })
}

function exportCustomers() {
  toast.add({
    title: 'Export started',
    description: 'Your customer data is being exported.',
    icon: 'i-lucide-download'
  })
}

function sendBulkEmail() {
  toast.add({
    title: 'Email campaign',
    description: 'Bulk email feature coming soon.',
    icon: 'i-lucide-mail'
  })
}

const statusOptions = [
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
  { label: 'Bounced', value: 'bounced' }
]

const customerStats = computed(() => {
  if (!customers.value) return { total: 0, subscribed: 0, unsubscribed: 0, bounced: 0 }
  
  return {
    total: customers.value.length,
    subscribed: customers.value.filter(c => c.status === 'subscribed').length,
    unsubscribed: customers.value.filter(c => c.status === 'unsubscribed').length,
    bounced: customers.value.filter(c => c.status === 'bounced').length
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <UPageCard variant="subtle" class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <UIcon name="i-lucide-users" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted">Total Customers</p>
            <p class="text-2xl font-semibold text-highlighted">{{ customerStats.total }}</p>
          </div>
        </div>
      </UPageCard>
      
      <UPageCard variant="subtle" class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-success/10">
            <UIcon name="i-lucide-user-check" class="size-5 text-success" />
          </div>
          <div>
            <p class="text-sm text-muted">Subscribed</p>
            <p class="text-2xl font-semibold text-highlighted">{{ customerStats.subscribed }}</p>
          </div>
        </div>
      </UPageCard>
      
      <UPageCard variant="subtle" class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-error/10">
            <UIcon name="i-lucide-user-x" class="size-5 text-error" />
          </div>
          <div>
            <p class="text-sm text-muted">Unsubscribed</p>
            <p class="text-2xl font-semibold text-highlighted">{{ customerStats.unsubscribed }}</p>
          </div>
        </div>
      </UPageCard>
      
      <UPageCard variant="subtle" class="p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-warning/10">
            <UIcon name="i-lucide-alert-triangle" class="size-5 text-warning" />
          </div>
          <div>
            <p class="text-sm text-muted">Bounced</p>
            <p class="text-2xl font-semibold text-highlighted">{{ customerStats.bounced }}</p>
          </div>
        </div>
      </UPageCard>
    </div>

    <!-- Quick Actions -->
    <UPageCard title="Quick Actions" description="Common customer management tasks" variant="subtle">
      <div class="flex flex-wrap gap-3 mt-4">
        <UButton
          label="Export All Customers"
          icon="i-lucide-download"
          color="neutral"
          variant="outline"
          class="bg-transparent"
          @click="exportCustomers"
        />
        <UButton
          label="Send Bulk Email"
          icon="i-lucide-mail"
          color="neutral"
          variant="outline"
          class="bg-transparent"
          @click="sendBulkEmail"
        />
        <UButton
          label="Refresh Data"
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          class="bg-transparent"
          :loading="status === 'pending'"
          @click="refresh"
        />
      </div>
    </UPageCard>

    <!-- Customer Cards -->
    <UPageCard title="Customer Overview" description="Quick view and edit customers" variant="subtle">
      <div v-if="status === 'pending'" class="flex items-center justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="size-8 text-muted animate-spin" />
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <div
          v-for="customer in customers"
          :key="customer.id"
          class="flex items-start gap-4 p-4 rounded-lg border border-default bg-default/50 hover:bg-elevated/50 transition-colors"
        >
          <UAvatar
            :src="customer.avatar?.src"
            :alt="customer.name"
            size="lg"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-medium text-highlighted truncate">{{ customer.name }}</p>
                <p class="text-sm text-muted truncate">{{ customer.email }}</p>
              </div>
              <UBadge
                :color="customer.status === 'subscribed' ? 'success' : customer.status === 'bounced' ? 'warning' : 'error'"
                variant="subtle"
                class="capitalize shrink-0"
              >
                {{ customer.status }}
              </UBadge>
            </div>
            <p class="text-sm text-muted mt-1">
              <UIcon name="i-lucide-map-pin" class="size-3 inline-block mr-1" />
              {{ customer.location }}
            </p>
            <div class="flex items-center gap-2 mt-3">
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                icon="i-lucide-pencil"
                label="Edit"
                class="bg-transparent"
                @click="openEditModal(customer)"
              />
              <UButton
                size="xs"
                color="error"
                variant="ghost"
                icon="i-lucide-trash"
                @click="deleteCustomer(customer)"
              />
            </div>
          </div>
        </div>
      </div>
    </UPageCard>

    <!-- Edit Modal -->
    <UModal v-model:open="isEditModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-highlighted">Edit Customer</h3>
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="isEditModalOpen = false"
              />
            </div>
          </template>

          <div class="flex flex-col gap-4">
            <UFormField label="Name">
              <UInput v-model="editForm.name" placeholder="Customer name" />
            </UFormField>
            
            <UFormField label="Email">
              <UInput v-model="editForm.email" type="email" placeholder="customer@example.com" />
            </UFormField>
            
            <UFormField label="Location">
              <UInput v-model="editForm.location" placeholder="City, Country" />
            </UFormField>
            
            <UFormField label="Status">
              <USelect
                v-model="editForm.status"
                :items="statusOptions"
                class="w-full"
              />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                class="bg-transparent"
                @click="isEditModalOpen = false"
              />
              <UButton
                label="Save Changes"
                color="primary"
                @click="saveChanges"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
