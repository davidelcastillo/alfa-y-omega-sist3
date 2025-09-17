'use client'
import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'


type Props = SelectHTMLAttributes<HTMLSelectElement> & { label?: string }


const Select = forwardRef<HTMLSelectElement, Props>(({ className, label, children, ...props }, ref) => (
    <div>
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <select ref={ref} className={cn('w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all', className)} {...props}>
            {children}
        </select>
    </div>
))
Select.displayName = 'Select'
export default Select