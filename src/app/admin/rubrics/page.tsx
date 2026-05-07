"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, FileText, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSortableData } from "@/lib/useSortableData"
import { SortableTableHead } from "@/components/ui/sortable-table-head"

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingRubric, setEditingRubric] = useState<any>(null)
  const [formData, setFormData] = useState({ title: "", description: "" })
  const supabase = createClient()
  useEffect(() => { fetchRubrics() }, [])
  const fetchRubrics = async () => { setLoading(true); const { data } = await supabase.from('rubrics').select('*').limit(100); if (data) setRubrics(data); setLoading(false) }

  const { items: sortedRubrics, requestSort, sortConfig } = useSortableData(rubrics, { key: 'title', direction: 'asc' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRubric) { await supabase.from('rubrics').update(formData as never).eq('id', editingRubric.id) } else { await supabase.from('rubrics').insert([formData as never]) }
    setOpen(false); fetchRubrics()
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manajemen Rubrik</h1><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2" /> Tambah Rubrik</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingRubric ? 'Edit' : 'Tambah'} Rubrik</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Judul Rubrik" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <Input placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
        </form></DialogContent></Dialog></div>
      <Card><CardContent className="p-0">
        {loading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <Table><TableHeader><TableRow>
            <SortableTableHead sortKey="title" sortConfig={sortConfig} requestSort={requestSort}>Judul Rubrik</SortableTableHead>
            <TableHead className="text-right">Aksi</TableHead>
            </TableRow></TableHeader>
          <TableBody>{sortedRubrics.map(rubric => (<TableRow key={rubric.id}><TableCell><Link href={`/admin/rubrics/${rubric.id}`} className="flex items-center gap-2 text-primary hover:underline"><FileText size={16} />{rubric.title}</Link></TableCell>
            <TableCell className="text-right flex justify-end gap-2">
            <Link href={`/admin/rubrics/${rubric.id}`}><Button variant="ghost" size="icon"><ChevronRight size={16} /></Button></Link>
            <Button variant="ghost" size="icon" onClick={() => { setEditingRubric(rubric); setFormData({ title: rubric.title, description: rubric.description || "" }); setOpen(true) }}><Pencil size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Hapus?")) { await supabase.from('rubrics').delete().eq('id', rubric.id); fetchRubrics() } }}><Trash2 size={16} /></Button></TableCell></TableRow>))}</TableBody></Table>
        )}
      </CardContent></Card>
    </div>
  )
}
