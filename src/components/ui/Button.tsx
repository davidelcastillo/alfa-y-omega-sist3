'use client'
import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
variant?: 'primary' | 'ghost' | 'outline'
}

export default function Button({ className, variant = 'primary', ...props }: Props) {
const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
const variants = {
primary: 'btn-primary text-white px-6 py-3',
ghost: 'px-6 py-3 text-gray-700 hover:bg-gray-100',
outline: 'px-6 py-3 border-2 border-gray-300 hover:bg-gray-50',
}
return <button className={cn(base, variants[variant], className)} {...props} />

}