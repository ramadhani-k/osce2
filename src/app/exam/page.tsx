"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardCheck, ArrowRight } from "lucide-react"

export default function ExamEntryPage() {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null)
    const { data, error } = await supabase.from('exams').select('id').eq('access_code', accessCode.toUpperCase()).single()
    if (error || !data) { setError("Access Code tidak valid."); setLoading(false) } else { router.push(`/exam/${accessCode.toUpperCase()}`) }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4"><div className="p-3 bg-primary/10 rounded-full text-primary"><ClipboardCheck size={36} /></div></div>
          <CardTitle className="text-2xl font-bold">Entry Penguji</CardTitle>
          <CardDescription>Masukkan kode akses untuk memulai penilaian OSCE</CardDescription>
        </CardHeader>
        <form onSubmit={handleEntry}>
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            <Input placeholder="Masukkan Kode Akses" value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} className="text-center text-xl h-14" required />
          </CardContent>
          <CardFooter><Button className="w-full h-12 text-lg" type="submit" disabled={loading}>{loading ? "Memvalidasi..." : "Lanjutkan"}<ArrowRight className="ml-2 h-5 w-5" /></Button></CardFooter>
        </form>
      </Card>
    </div>
  )
}
