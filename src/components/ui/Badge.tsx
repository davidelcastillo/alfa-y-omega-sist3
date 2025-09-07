export default function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>{children}</span>
}
