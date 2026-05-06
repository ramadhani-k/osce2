"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, Key } from "lucide-react"
import { useSortableData } from "@/lib/useSortableData"
import { SortableTableHead } from "@/components/ui/sortable-table-head"

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", date: new Date().toISOString().split('T')[0], access_code: "" })
  const supabase = createClient()
  useEffect(() => { fetchExams() }, [])
  const fetchExams = async () => { setLoading(true); const { data } = await supabase.from('exams').select('*').limit(100); if (data) setExams(data); setLoading(false) }

  const { items: sortedExams, requestSort, sortConfig } = useSortableData(exams, { key: 'created_at', direction: 'desc' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingExam) { await supabase.from('exams').update(formData as never).eq('id', editingExam.id) } else { await supabase.from('exams').insert([formData as never]) }
    setOpen(false); fetchExams()
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manajemen Ujian</h1><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2" /> Tambah Ujian</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingExam ? 'Edit' : 'Tambah'} Ujian</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Ujian" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
          <div className="flex gap-2"><Input placeholder="Access Code" value={formData.access_code} onChange={e => setFormData({...formData, access_code: e.target.value})} required /><Button type="button" variant="outline" onClick={() => setFormData({...formData, access_code: Math.random().toString(36).substring(2, 8).toUpperCase()})}><Key size={18} /></Button></div>
          <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
        </form></DialogContent></Dialog></div>
      <Card><CardContent className="p-0">
        {loading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <Table><TableHeader><TableRow>
            <SortableTableHead sortKey="name" sortConfig={sortConfig} requestSort={requestSort}>Nama Ujian</SortableTableHead>
            <SortableTableHead sortKey="date" sortConfig={sortConfig} requestSort={requestSort}>Tanggal</SortableTableHead>
            <SortableTableHead sortKey="access_code" sortConfig={sortConfig} requestSort={requestSort}>Access Code</SortableTableHead>
            <TableHead className="text-right">Aksi</TableHead>
            </TableRow></TableHeader>
          <TableBody>{sortedExams.map(exam => (<TableRow key={exam.id}><TableCell>{exam.name}</TableCell><TableCell>{exam.date}</TableCell><TableCell>{exam.access_code}</TableCell>
            <TableCell className="text-right flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingExam(exam); setFormData({ name: exam.name, date: exam.date, access_code: exam.access_code }); setOpen(true) }}><Pencil size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Hapus?")) { await supabase.from('exams').delete().eq('id', exam.id); fetchExams() } }}><Trash2 size={16} /></Button></TableCell></TableRow>))}</TableBody></Table>
        )}
      </CardContent></Card>
    </div>
  )
}
