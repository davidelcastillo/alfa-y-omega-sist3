import { clsx, type ClassValue } from "clsx"  //hay que hacer npm install clsx
import { twMerge } from "tailwind-merge" //hay que hacer npm install tailwind

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
