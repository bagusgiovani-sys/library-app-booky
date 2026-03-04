import { useState, useEffect } from 'react'
import banner1 from '@/assets/images/Banner1.svg'

const banners = [banner1]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      <img
        src={banners[current]}
        alt="Banner"
        className="w-full h-40 md:h-84 object-cover transition-all duration-500"
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: i === current ? 'var(--primary-300)' : 'white',
              opacity: i === current ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  )
}