interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[380px] md:max-w-7xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  )
}