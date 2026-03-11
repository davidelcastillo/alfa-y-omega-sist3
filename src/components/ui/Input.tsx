'use client'
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'


type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }


const Input = forwardRef<HTMLInputElement, Props>(({ className, label, hint, ...props }, ref) => (
<div>
{label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
<input ref={ref} className={cn('w-full px-4 py-3 border-2 border-gray-200 rounded-xl input-focus transition-all', className)} {...props} />
{hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
</div>
))
Input.displayName = 'Input'
export default Input