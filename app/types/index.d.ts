import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled'
export type OrderPriority = 'high' | 'medium' | 'low'

export interface Order {
  id: string
  customer: {
    name: string
    email: string
    avatar: AvatarProps
  }
  product: string
  category: string
  amount: number
  status: OrderStatus
  priority: OrderPriority
  paymentMethod: string
  date: string
}

export type EventCategory = 'meeting' | 'task' | 'reminder' | 'work' | 'personal'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  duration?: string
  category: EventCategory
  location?: string
  attendees?: Array<{
    name: string
    avatar: AvatarProps
  }>
}
