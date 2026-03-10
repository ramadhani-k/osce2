"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, ClipboardCheck, CheckCircle2 } from "lucide-react"

export default function AssessmentPage() {
  const { slug } = useParams(); const router = useRouter(); const supabase = createClient()
  const [exam, setExam] = useState<any>(null); const [stations, setStations] = useState<any[]>([]); const [examiners, setExaminers] = useState<any[]>([]); const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true); const [selectedExaminerId, setSelectedExaminerId] = useState(""); const [selectedStudentId, setSelectedStudentId] = useState(""); const [selectedStationId, setSelectedStationId] = useState("")
  const [step, setStep] = useState<"selection" | "assessment">("selection"); const [scores, setScores] = useState<Record<string, number>>({}); const [submitting, setSubmitting] = useState(false); const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: examData } = await supabase.from('exams').select('*').eq('access_code', slug).single()
      if (examData) {
        setExam(examData)
        const { data: stationsData } = await supabase.from('stations').select('*, rubrics(id, title, rubric_items(*))').eq('exam_id', examData.id)
        const { data: participantsData } = await supabase.from('participants').select('*')
        if (stationsData) setStations(stationsData as any)
        if (participantsData) { setExaminers(participantsData.filter((p:any) => p.role === 'examiner')); setStudents(participantsData.filter((p:any) => p.role === 'student')) }
      }
      setLoading(false)
    }
    fetchData()
  }, [slug])

  const handleStart = () => {
    const station = stations.find(s => s.id === selectedStationId)
    if (station?.rubrics?.rubric_items) {
      const s: Record<string, number> = {}
      station.rubrics.rubric_items.forEach((item:any) => s[item.id] = 0)
      setScores(s); setStep("assessment")
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const station = stations.find(s => s.id === selectedStationId)
    let ts = 0, ms = 0
    station.rubrics.rubric_items.forEach((item:any) => { ts += (scores[item.id] || 0) * item.weight; ms += item.max_scale * item.weight })
    const { error } = await supabase.from('submissions').insert([{ exam_id: exam.id, station_id: selectedStationId, student_id: selectedStudentId, examiner_id: selectedExaminerId, scores, normalized_score: (ts/ms)*100 }])
    if (!error) setSuccessOpen(true)
    setSubmitting(false)
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {step === "selection" ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Penilaian OSCE: {exam?.name}</h1>
          <Card><CardContent className="pt-6 space-y-4">
            <Select onValueChange={setSelectedExaminerId}><SelectTrigger><SelectValue placeholder="Pilih Penguji" /></SelectTrigger><SelectContent>{examiners.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select>
            <Select onValueChange={setSelectedStationId}><SelectTrigger><SelectValue placeholder="Pilih Stase" /></SelectTrigger><SelectContent>{stations.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
            <Select onValueChange={setSelectedStudentId}><SelectTrigger><SelectValue placeholder="Pilih Mahasiswa" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.identifier} - {s.name}</SelectItem>)}</SelectContent></Select>
            <Button className="w-full h-12" disabled={!selectedExaminerId || !selectedStudentId || !selectedStationId} onClick={handleStart}>Mulai Penilaian</Button>
          </CardContent></Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">{stations.find(s => s.id === selectedStationId)?.name}</h2>
          <Card><CardContent className="p-0 divide-y">
            {stations.find(s => s.id === selectedStationId)?.rubrics?.rubric_items.map((item:any, idx:number) => (
              <div key={item.id} className="p-6 space-y-4">
                <p className="font-semibold">{idx+1}. {item.description}</p>
                <div className="flex gap-2">
                  {[...Array(item.max_scale + 1)].map((_, v) => (
                    <Button key={v} variant={scores[item.id] === v ? "default" : "outline"} onClick={() => setScores({...scores, [item.id]: v})}>{v}</Button>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-6"><Button className="w-full h-14 text-xl" onClick={handleSubmit} disabled={submitting}><ClipboardCheck className="mr-2" /> Simpan Penilaian</Button></div>
          </CardContent></Card>
        </div>
      )}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Berhasil!</DialogTitle></DialogHeader><Button onClick={() => { setSuccessOpen(false); setStep("selection"); setSelectedStudentId("") }}>Lanjutkan ke Mahasiswa Berikutnya</Button></DialogContent></Dialog>
    </div>
  )
}
