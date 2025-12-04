const Wrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`wrapper ${className}`}>
      {children}
    </div>
  )
}

export default Wrapper;