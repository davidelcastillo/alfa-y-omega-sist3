'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'btn-primary text-white',
        ghost: 'text-gray-700 hover:bg-gray-100',
        outline: 'border-2 border-gray-300 hover:bg-gray-50',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'h-8 px-3 py-2 text-sm rounded-lg',
        lg: 'h-12 px-8 py-4 text-base rounded-2xl',
        icon: 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export default Button