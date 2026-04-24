interface PageHeaderProps {
  title: string
  className?: string
}

export function PageHeader({ title, className = '' }: PageHeaderProps) {
  return (
    <h1 className={`text-text-heading text-2xl font-bold ${className}`}>
      {title}
    </h1>
  )
}
