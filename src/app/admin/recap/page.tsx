"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileSpreadsheet } from "lucide-react"
import * as XLSX from 'xlsx'

export default function RecapPage() {
  const [exams, setExams] = useState<any[]>([])
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [stations, setStations] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  useEffect(() => { const fetchExams = async () => { const { data } = await supabase.from('exams').select('*').order('date', { ascending: false }); if (data) setExams(data) }; fetchExams() }, [])
  useEffect(() => {
    if (selectedExamId) {
      const fetchRecapData = async () => {
        setLoading(true)
        const { data: stationsData } = await supabase.from('stations').select('*').eq('exam_id', selectedExamId).order('name', { ascending: true })
        const { data: submissionsData } = await supabase.from('submissions').select('*, student:participants!submissions_student_id_fkey(name, identifier)').eq('exam_id', selectedExamId)
        const { data: studentsData } = await supabase.from('participants').select('*').eq('role', 'student').order('name', { ascending: true })
        if (stationsData) setStations(stationsData); if (submissionsData) setSubmissions(submissionsData); if (studentsData) setStudents(studentsData);
        setLoading(false)
      }
      fetchRecapData()
    }
  }, [selectedExamId])
  const getScore = (studentId: string, stationId: string) => {
    const submission = submissions.find(s => s.student_id === studentId && s.station_id === stationId)
    return submission ? submission.normalized_score.toFixed(2) : "-"
  }
  const exportToExcel = () => {
    const selectedExam = exams.find(e => e.id === selectedExamId)
    if (!selectedExam) return
    const header = ["No", "NIM", "Nama Mahasiswa", ...stations.map(s => s.name), "Rata-rata"]
    const rows = students.map((student, index) => {
      let totalScore = 0; let count = 0
      const stationScores = stations.map(s => { const score = getScore(student.id, s.id); if (score !== "-") { totalScore += parseFloat(score); count++ }; return score })
      return [index + 1, student.identifier, student.name, ...stationScores, count > 0 ? (totalScore / count).toFixed(2) : "-"]
    })
    const ws = XLSX.utils.aoa_to_sheet([["REKAP NILAI OSCE"], ["Ujian:", selectedExam.name], [], header, ...rows])
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai"); XLSX.writeFile(wb, `Rekap_Nilai.xlsx`)
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rekap Nilai</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedExamId} onValueChange={setSelectedExamId}><SelectTrigger className="w-[300px]"><SelectValue placeholder="Pilih Ujian" /></SelectTrigger><SelectContent>{exams.map(e => (<SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>))}</SelectContent></Select>
          <Button variant="outline" disabled={!selectedExamId || loading} onClick={exportToExcel} className="gap-2"><FileSpreadsheet size={18} /> Export Excel</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        {loading ? <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div> : (
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>No</TableHead><TableHead>NIM</TableHead><TableHead>Nama Mahasiswa</TableHead>{stations.map(s => (<TableHead key={s.id}>{s.name}</TableHead>))}<TableHead>Rata-rata</TableHead></TableRow></TableHeader>
          <TableBody>{students.map((student, index) => {
            let totalScore = 0; let count = 0
            return (<TableRow key={student.id}><TableCell>{index + 1}</TableCell><TableCell>{student.identifier}</TableCell><TableCell>{student.name}</TableCell>
              {stations.map(s => { const score = getScore(student.id, s.id); if (score !== "-") { totalScore += parseFloat(score); count++ }; return <TableCell key={s.id}>{score}</TableCell> })}
              <TableCell>{count > 0 ? (totalScore / count).toFixed(2) : "-"}</TableCell></TableRow>)
          })}</TableBody></Table></div>
        )}
      </CardContent></Card>
    </div>
  )
}
