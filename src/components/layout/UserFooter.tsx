import { Facebook, Instagram, Linkedin } from 'lucide-react'
import logo from '@/assets/images/Logo.svg'

export default function UserFooter() {
  return (
    <footer className="w-full px-6 py-10 flex flex-col items-center gap-4 text-center"
      style={{ backgroundColor: 'var(--primary-100)' }}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Booky" className="w-8 h-8" />
        <span className="text-xl font-bold" style={{ color: 'var(--primary-300)' }}>Booky</span>
      </div>

      {/* Tagline */}
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.
      </p>

      {/* Social Media */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Follow on Social Media</p>
        <div className="flex items-center gap-3 justify-center">
          {[
            { icon: Facebook, href: '#' },
            { icon: Instagram, href: '#' },
            { icon: Linkedin, href: '#' },
            {
              icon: () => (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              ),
              href: '#',
            },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 transition-colors hover:text-white"
              style={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-300)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-300)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'white'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'
              }}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}