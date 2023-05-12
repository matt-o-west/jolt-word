import { useEffect, useState } from 'react'

const useMobileDetect = () => {
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Ensure window is defined (this code is running on the client)
      if (typeof window !== 'undefined') {
        setMobile(window.innerWidth <= 425)
      }
    }

    // Initial check
    checkMobile()

    // Listen for window resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default useMobileDetect
