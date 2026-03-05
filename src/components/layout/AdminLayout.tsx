import AdminNavbar from "./AdminNavbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main>
        {children}
      </main>
    </div>
  )
}