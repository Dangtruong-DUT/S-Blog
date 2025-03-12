import { ReactNode } from 'react'

export interface MenuItem {
    to?: string
    title: string
    separate?: boolean
    icon?: ReactNode
    code?: string
    children?: {
        title: string
        menuItems: MenuItem[]
    }
}
