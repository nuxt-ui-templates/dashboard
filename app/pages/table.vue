<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import type { Order, OrderStatus } from '~/types'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const { data: orders, status, refresh } = await useFetch<Order[]>('/api/orders', {
  lazy: true,
  default: () => []
})

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref('all')
const columnVisibility = ref()
const rowSelection = ref<Record<string, boolean>>({})

const isAddModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)
const isDetailsSlideoverOpen = ref(false)

const pagination = ref({
  pageIndex: 0,
  pageSize: 8
})

const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Cloud Services', value: 'Cloud Services' },
  { label: 'Software', value: 'Software' },
  { label: 'Consulting', value: 'Consulting' },
  { label: 'Design', value: 'Design' },
  { label: 'Hardware', value: 'Hardware' }
]

const statuses = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' }
]

// Filtered data based on search, status, and category
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchesSearch
      = !searchQuery.value
        || order.id.toLowerCase().includes(searchQuery.value.toLowerCase())
        || order.customer.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || order.customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
        || order.product.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus
      = selectedStatus.value === 'all' || order.status === selectedStatus.value

    const matchesCategory
      = selectedCategory.value === 'all' || order.category === selectedCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})

// Metrics
const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0)
})

const completedCount = computed(() => orders.value.filter(o => o.status === 'completed').length)
const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending' || o.status === 'processing').length)

function openOrderDetails(order: Order) {
  selectedOrder.value = order
  isDetailsSlideoverOpen.value = true
}

function getRowItems(row: Row<Order>) {
  return [
    {
      type: 'label',
      label: 'Order Actions'
    },
    {
      label: 'View Order Details',
      icon: 'i-lucide-file-text',
      onSelect() {
        openOrderDetails(row.original)
      }
    },
    {
      label: 'Copy Order ID',
      icon: 'i-lucide-copy',
      onSelect() {
        navigator.clipboard.writeText(row.original.id)
        toast.add({
          title: 'Copied to clipboard',
          description: `${row.original.id} copied successfully.`
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Mark as Completed',
      icon: 'i-lucide-check-circle-2',
      onSelect() {
        row.original.status = 'completed'
        toast.add({
          title: 'Status Updated',
          description: `Order ${row.original.id} set to completed.`,
          color: 'success'
        })
      }
    },
    {
      label: 'Cancel Order',
      icon: 'i-lucide-ban',
      color: 'warning',
      onSelect() {
        row.original.status = 'cancelled'
        toast.add({
          title: 'Order Cancelled',
          description: `Order ${row.original.id} was marked as cancelled.`,
          color: 'warning'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete Order',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        const index = orders.value.findIndex(o => o.id === row.original.id)
        if (index !== -1) {
          orders.value.splice(index, 1)
          toast.add({
            title: 'Order Deleted',
            description: `Order ${row.original.id} was removed.`,
            color: 'error'
          })
        }
      }
    }
  ]
}

const columns: TableColumn<Order>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => {
      return h(
        'button',
        {
          class: 'font-mono text-xs font-semibold text-primary hover:underline focus:outline-none cursor-pointer',
          onClick: () => openOrderDetails(row.original)
        },
        row.original.id
      )
    }
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3 py-1' }, [
        h(UAvatar, {
          ...row.original.customer.avatar,
          size: 'md'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted text-sm' }, row.original.customer.name),
          h('p', { class: 'text-xs text-muted' }, row.original.customer.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'product',
    header: 'Product / Service',
    cell: ({ row }) => {
      return h('div', { class: 'max-w-xs truncate' }, [
        h('p', { class: 'text-sm font-medium text-highlighted truncate' }, row.original.product),
        h('span', { class: 'text-xs text-muted' }, row.original.category)
      ])
    }
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Amount',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      return h(
        'span',
        { class: 'font-semibold text-highlighted' },
        `$${row.original.amount.toLocaleString('en-US')}`
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusConfig: Record<OrderStatus, { color: 'success' | 'warning' | 'error' | 'info', label: string }> = {
        completed: { color: 'success', label: 'Completed' },
        processing: { color: 'info', label: 'Processing' },
        pending: { color: 'warning', label: 'Pending' },
        cancelled: { color: 'error', label: 'Cancelled' }
      }
      const conf = statusConfig[row.original.status]
      return h(UBadge, {
        variant: 'subtle',
        color: conf.color,
        class: 'capitalize text-xs font-medium'
      }, () => conf.label)
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return h('span', { class: 'text-xs text-muted' }, row.original.date)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-more-horizontal',
              color: 'neutral',
              variant: 'ghost',
              size: 'xs'
            })
        )
      )
    }
  }
]

// New Order Form State
const newOrder = reactive({
  customerName: '',
  customerEmail: '',
  product: '',
  category: 'Cloud Services',
  amount: 500,
  priority: 'medium' as const,
  status: 'processing' as const
})

function createNewOrder() {
  if (!newOrder.customerName || !newOrder.customerEmail || !newOrder.product) {
    toast.add({
      title: 'Incomplete form',
      description: 'Please fill in customer and product information.',
      color: 'warning'
    })
    return
  }

  const generatedId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`
  const created: Order = {
    id: generatedId,
    customer: {
      name: newOrder.customerName,
      email: newOrder.customerEmail,
      avatar: { src: `https://i.pravatar.cc/128?u=${Math.floor(Math.random() * 80)}` }
    },
    product: newOrder.product,
    category: newOrder.category,
    amount: Number(newOrder.amount),
    status: newOrder.status,
    priority: newOrder.priority,
    paymentMethod: 'Credit Card',
    date: new Date().toISOString().split('T')[0]!
  }

  orders.value.unshift(created)
  isAddModalOpen.value = false

  // Reset
  newOrder.customerName = ''
  newOrder.customerEmail = ''
  newOrder.product = ''

  toast.add({
    title: 'Order Created',
    description: `New order ${generatedId} was added to the list.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}

function exportCsv() {
  const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Product', 'Category', 'Amount', 'Status', 'Date']
  const rows = filteredOrders.value.map(o => [
    o.id,
    `"${o.customer.name}"`,
    o.customer.email,
    `"${o.product}"`,
    o.category,
    o.amount,
    o.status,
    o.date
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  toast.add({
    title: 'CSV Exported',
    description: `Exported ${filteredOrders.value.length} orders successfully.`,
    color: 'success'
  })
}

function deleteSelectedRows() {
  const selectedKeys = Object.keys(rowSelection.value).filter(k => rowSelection.value[k])
  const count = selectedKeys.length
  if (count === 0) return

  // Filter out selected
  orders.value = orders.value.filter((_, idx) => !rowSelection.value[idx])
  rowSelection.value = {}

  toast.add({
    title: 'Selected Orders Deleted',
    description: `Successfully deleted ${count} selected order(s).`,
    color: 'error'
  })
}
</script>

<template>
  <UDashboardPanel id="table-panel">
    <template #header>
      <UDashboardNavbar title="Table">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Refresh"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            :loading="status === 'pending'"
            @click="refresh"
          />

          <UButton
            label="Export CSV"
            icon="i-lucide-download"
            color="neutral"
            variant="outline"
            @click="exportCsv"
          />

          <UButton
            label="New Order"
            icon="i-lucide-plus"
            color="primary"
            variant="solid"
            @click="isAddModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Metric Highlights Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Total Settled Revenue
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              ${{ totalRevenue.toLocaleString('en-US') }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <UIcon name="i-lucide-dollar-sign" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Total Orders
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ orders.length }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
            <UIcon name="i-lucide-shopping-cart" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Completed Orders
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ completedCount }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <UIcon name="i-lucide-check-circle" class="size-5" />
          </div>
        </div>

        <div class="p-4 rounded-xl border border-default bg-elevated/20 flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-muted">
              Active / In Progress
            </p>
            <h3 class="text-xl font-bold text-highlighted mt-1">
              {{ pendingCount }}
            </h3>
          </div>
          <div class="size-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
            <UIcon name="i-lucide-clock" class="size-5" />
          </div>
        </div>
      </div>

      <!-- Filters & Actions Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px] max-w-xl">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search orders, customers, products..."
            class="w-full sm:w-72"
          />

          <USelect
            v-model="selectedStatus"
            :items="statuses"
            placeholder="Filter Status"
            icon="i-lucide-filter"
            class="w-36"
          />

          <USelect
            v-model="selectedCategory"
            :items="categories"
            placeholder="Category"
            icon="i-lucide-tag"
            class="w-40"
          />
        </div>

        <div class="flex items-center gap-2">
          <!-- Bulk actions when rows are selected -->
          <UButton
            v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            label="Delete Selected"
            color="error"
            variant="subtle"
            icon="i-lucide-trash"
            @click="deleteSelectedRows"
          >
            <template #trailing>
              <UKbd>{{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}</UKbd>
            </template>
          </UButton>

          <!-- Column Visibility Selector -->
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Columns"
              color="neutral"
              variant="outline"
              icon="i-lucide-sliders-horizontal"
            />
          </UDropdownMenu>
        </div>
      </div>

      <!-- Main Tanstack / Nuxt UI Table -->
      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        :data="filteredOrders"
        :columns="columns"
        :loading="status === 'pending'"
        class="shrink-0"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2.5 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r text-xs uppercase tracking-wider text-muted font-semibold',
          td: 'border-b border-default py-2',
          separator: 'h-0'
        }"
      />

      <!-- Table Footer & Pagination -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-xs text-muted">
          Showing {{ table?.tableApi?.getPaginationRowModel().rows.length || 0 }} of
          {{ filteredOrders.length }} order(s).
          <span v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
            ({{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }} selected)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="filteredOrders.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>

      <!-- Add Order Modal -->
      <UModal
        v-model:open="isAddModalOpen"
        title="Create New Order"
        description="Add a new customer order and allocate invoice details."
      >
        <template #body>
          <div class="space-y-4">
            <UFormField label="Customer Name" required>
              <UInput v-model="newOrder.customerName" placeholder="e.g. Maya Lin" icon="i-lucide-user" />
            </UFormField>

            <UFormField label="Customer Email" required>
              <UInput
                v-model="newOrder.customerEmail"
                type="email"
                placeholder="maya.lin@enterprise.com"
                icon="i-lucide-mail"
              />
            </UFormField>

            <UFormField label="Product / Service" required>
              <UInput v-model="newOrder.product" placeholder="e.g. Cloud Infrastructure Setup" icon="i-lucide-box" />
            </UFormField>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Category">
                <USelect
                  v-model="newOrder.category"
                  :items="categories.filter(c => c.value !== 'all')"
                />
              </UFormField>

              <UFormField label="Amount ($)" required>
                <UInput
                  v-model="newOrder.amount"
                  type="number"
                  min="1"
                  placeholder="500"
                  icon="i-lucide-dollar-sign"
                />
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Initial Status">
                <USelect
                  v-model="newOrder.status"
                  :items="[
                    { label: 'Completed', value: 'completed' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Pending', value: 'pending' }
                  ]"
                />
              </UFormField>

              <UFormField label="Priority">
                <USelect
                  v-model="newOrder.priority"
                  :items="[
                    { label: 'High', value: 'high' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Low', value: 'low' }
                  ]"
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
                label="Create Order"
                color="primary"
                variant="solid"
                icon="i-lucide-plus"
                @click="createNewOrder"
              />
            </div>
          </div>
        </template>
      </UModal>

      <!-- Order Details Slideover -->
      <USlideover
        v-model:open="isDetailsSlideoverOpen"
        :title="`Order ${selectedOrder?.id || ''}`"
        description="Complete breakdown and customer transaction history"
      >
        <template #body>
          <div v-if="selectedOrder" class="space-y-6">
            <!-- Header card -->
            <div class="p-4 rounded-xl border border-default bg-elevated/30 flex items-center justify-between">
              <div>
                <p class="text-xs text-muted uppercase font-semibold">
                  Total Amount
                </p>
                <h2 class="text-2xl font-bold text-highlighted mt-0.5">
                  ${{ selectedOrder.amount.toLocaleString('en-US') }}
                </h2>
              </div>
              <UBadge
                :label="selectedOrder.status"
                :color="selectedOrder.status === 'completed' ? 'success' : selectedOrder.status === 'processing' ? 'info' : selectedOrder.status === 'pending' ? 'warning' : 'error'"
                variant="subtle"
                class="capitalize text-sm font-semibold"
              />
            </div>

            <!-- Customer Info -->
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Customer Details
              </h4>
              <div class="p-3 rounded-lg border border-default flex items-center gap-3">
                <UAvatar :src="selectedOrder.customer.avatar.src" size="lg" />
                <div>
                  <p class="font-medium text-highlighted">
                    {{ selectedOrder.customer.name }}
                  </p>
                  <p class="text-xs text-muted">
                    {{ selectedOrder.customer.email }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Product & Payment info -->
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted tracking-wider">
                Item & Delivery
              </h4>
              <div class="space-y-2 text-sm divide-y divide-default rounded-lg border border-default p-3">
                <div class="flex justify-between py-1.5">
                  <span class="text-muted">Product</span>
                  <span class="font-medium text-highlighted">{{ selectedOrder.product }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-muted">Category</span>
                  <span class="font-medium text-highlighted">{{ selectedOrder.category }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-muted">Priority</span>
                  <span class="font-medium capitalize text-highlighted">{{ selectedOrder.priority }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-muted">Payment Method</span>
                  <span class="font-medium text-highlighted">{{ selectedOrder.paymentMethod }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                  <span class="text-muted">Order Date</span>
                  <span class="font-medium text-highlighted">{{ selectedOrder.date }}</span>
                </div>
              </div>
            </div>

            <!-- Actions inside slideover -->
            <div class="space-y-2 pt-4 border-t border-default">
              <UButton
                label="Copy Invoice Link"
                icon="i-lucide-share-2"
                color="neutral"
                variant="outline"
                class="w-full justify-center"
                @click="toast.add({ title: 'Link copied', description: 'Invoice URL copied to clipboard.' })"
              />
              <UButton
                v-if="selectedOrder.status !== 'completed'"
                label="Mark Order Completed"
                icon="i-lucide-check"
                color="success"
                variant="solid"
                class="w-full justify-center"
                @click="selectedOrder.status = 'completed'; toast.add({ title: 'Order Completed', color: 'success' })"
              />
            </div>
          </div>
        </template>
      </USlideover>
    </template>
  </UDashboardPanel>
</template>
