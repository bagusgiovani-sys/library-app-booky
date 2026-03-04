import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search' }: SearchBarProps) {
  return (
    <>
      <style>{`
        .searchbar-wrapper {
          width: 100%;
        }
        @media (min-width: 768px) {
          .searchbar-wrapper {
            width: 50%;
            min-width: 200px;
          }
        }
      `}</style>
      <div className="searchbar-wrapper" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: 'white', borderRadius: '999px',
        padding: '10px 16px', border: '1px solid #e5e7eb',
      }}>
        <Search size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, fontSize: '14px', background: 'transparent',
            outline: 'none', border: 'none', color: '#374151',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </>
  )
}