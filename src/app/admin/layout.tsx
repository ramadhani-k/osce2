"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ClipboardList, MapPin, GraduationCap, FileText, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Ujian", href: "/admin/exams", icon: ClipboardList },
  { name: "Peserta", href: "/admin/participants", icon: Users },
  { name: "Rubrik", href: "/admin/rubrics", icon: FileText },
  { name: "Stase", href: "/admin/stations", icon: MapPin },
  { name: "Rekap Nilai", href: "/admin/recap", icon: GraduationCap },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const handleLogout = async () => { await supabase.auth.signOut(); router.push("/login"); router.refresh() }
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary"><GraduationCap className="h-6 w-6" /><span>Admin OSCE</span></div>
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <X /> : <Menu />}</Button>
      </header>
      <aside className={cn("bg-slate-900 text-white w-full md:w-64 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-6 hidden md:flex items-center gap-2 font-bold text-xl border-b border-slate-800"><GraduationCap className="h-8 w-8 text-primary" /><span>Admin OSCE</span></div>
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", pathname === item.href ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
              <item.icon className="h-5 w-5" /><span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800"><Button variant="ghost" className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white gap-3 px-4 py-3" onClick={handleLogout}><LogOut className="h-5 w-5" /><span>Keluar</span></Button></div>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
    </div>
  )
}
