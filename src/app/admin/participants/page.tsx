"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2, UserPlus } from "lucide-react"

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", identifier: "", role: "student" as "student" | "examiner" })
  const supabase = createClient()
  useEffect(() => { fetchParticipants() }, [])
  const fetchParticipants = async () => { setLoading(true); const { data } = await supabase.from('participants').select('*').order('name', { ascending: true }); if (data) setParticipants(data); setLoading(false) }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingParticipant) { await supabase.from('participants').update(formData).eq('id', editingParticipant.id) } else { await supabase.from('participants').insert([formData]) }
    setOpen(false); fetchParticipants()
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Manajemen Peserta</h1><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><UserPlus className="mr-2" /> Tambah Peserta</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingParticipant ? 'Edit' : 'Tambah'} Peserta</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Nama Lengkap" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input placeholder="NIM / NIP / NIK" value={formData.identifier} onChange={e => setFormData({...formData, identifier: e.target.value})} required />
          <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}><SelectTrigger><SelectValue placeholder="Pilih Peran" /></SelectTrigger><SelectContent><SelectItem value="student">Mahasiswa</SelectItem><SelectItem value="examiner">Penguji / Dosen</SelectItem></SelectContent></Select>
          <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
        </form></DialogContent></Dialog></div>
      <Card><CardContent className="p-0">
        {loading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>NIM/NIP</TableHead><TableHead>Peran</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>{participants.map(p => (<TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell>{p.identifier}</TableCell><TableCell>{p.role}</TableCell>
            <TableCell className="text-right flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingParticipant(p); setFormData({ name: p.name, identifier: p.identifier, role: p.role }); setOpen(true) }}><Pencil size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Hapus?")) { await supabase.from('participants').delete().eq('id', p.id); fetchParticipants() } }}><Trash2 size={16} /></Button></TableCell></TableRow>))}</TableBody></Table>
        )}
      </CardContent></Card>
    </div>
  )
}
