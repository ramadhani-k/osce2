import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, ClipboardCheck, LayoutDashboard } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCap className="h-6 w-6" />
          <span>Sistem OSCE</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost" size="sm">Admin Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-slate-900">
            Sistem Penilaian OSCE Professional
          </h1>
          <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Platform penilaian Objective Structured Clinical Examination yang efisien,
            aman, dan mudah digunakan untuk Universitas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/exam">
              <Button size="lg" className="px-8 py-6 text-lg">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Masuk sebagai Penguji
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard Admin
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
