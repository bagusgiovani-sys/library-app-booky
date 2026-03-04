import AdminNavbar from "./AdminNavbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="mx-auto px-4 py-6" style={{ maxWidth: '1024px' }}>
        {children}
      </main>
    </div>
  )
}