"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, MapPin } from "lucide-react"

export default function StationsPage() {
  const [stations, setStations] = useState<any[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [rubrics, setRubrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingStation, setEditingStation] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", exam_id: "", rubric_id: "" })
  const supabase = createClient()
  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); const { data: stationsData } = await supabase.from('stations').select('*, exams(name), rubrics(title)'); const { data: examsData } = await supabase.from('exams').select('*').order('name', { ascending: true }); const { data: rubricsData } = await supabase.from('rubrics').select('*').order('title', { ascending: true }); if (stationsData) setStations(stationsData as any); if (examsData) setExams(examsData); if (rubricsData) setRubrics(rubricsData); setLoading(false) }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingStation) { await supabase.from('stations').update(formData).eq('id', editingStation.id) } else { await supabase.from('stations').insert([formData]) }
    setOpen(false); fetchData()
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manajemen Stase</h1><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2" /> Tambah Stase</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingStation ? 'Edit' : 'Tambah'} Stase</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Stase" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Select value={formData.exam_id} onValueChange={(val: string) => setFormData({...formData, exam_id: val})}><SelectTrigger><SelectValue placeholder="Pilih Ujian" /></SelectTrigger><SelectContent>{exams.map(exam => <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>)}</SelectContent></Select>
          <Select value={formData.rubric_id} onValueChange={(val: string) => setFormData({...formData, rubric_id: val})}><SelectTrigger><SelectValue placeholder="Pilih Rubrik" /></SelectTrigger><SelectContent>{rubrics.map(rubric => <SelectItem key={rubric.id} value={rubric.id}>{rubric.title}</SelectItem>)}</SelectContent></Select>
          <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
        </form></DialogContent></Dialog></div>
      <Card><CardContent className="p-0">
        {loading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Nama Stase</TableHead><TableHead>Ujian</TableHead><TableHead>Rubrik</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>{stations.map(station => (<TableRow key={station.id}><TableCell className="flex items-center gap-2 font-medium"><MapPin size={16} />{station.name}</TableCell><TableCell>{station.exams?.name}</TableCell><TableCell>{station.rubrics?.title}</TableCell>
            <TableCell className="text-right flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingStation(station); setFormData({ name: station.name, exam_id: station.exam_id, rubric_id: station.rubric_id }); setOpen(true) }}><Pencil size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Hapus?")) { await supabase.from('stations').delete().eq('id', station.id); fetchData() } }}><Trash2 size={16} /></Button></TableCell></TableRow>))}</TableBody></Table>
        )}
      </CardContent></Card>
    </div>
  )
}
