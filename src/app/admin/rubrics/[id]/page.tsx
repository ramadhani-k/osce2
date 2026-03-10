"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, ArrowLeft } from "lucide-react"

export default function RubricDetailsPage() {
  const { id } = useParams(); const router = useRouter(); const supabase = createClient()
  const [rubric, setRubric] = useState<any>(null); const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true); const [open, setOpen] = useState(false); const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({ description: "", weight: 1.0, max_scale: 3, order_index: 0 })
  useEffect(() => { fetchRubricAndItems() }, [id])
  const fetchRubricAndItems = async () => { setLoading(true); const { data: rubricData } = await supabase.from('rubrics').select('*').eq('id', id).single(); const { data: itemsData } = await supabase.from('rubric_items').select('*').eq('rubric_id', id).order('order_index', { ascending: true }); if (rubricData) setRubric(rubricData); if (itemsData) setItems(itemsData); setLoading(false) }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) { await supabase.from('rubric_items').update(formData).eq('id', editingItem.id) } else { await supabase.from('rubric_items').insert([{ ...formData, rubric_id: id as string, order_index: items.length }]) }
    setOpen(false); fetchRubricAndItems()
  }
  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft size={20} /></Button><h1 className="text-3xl font-bold">{rubric?.title}</h1></div>
      <div className="flex justify-between items-center"><h2 className="text-xl font-semibold">Item Rubrik</h2><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus className="mr-2" /> Tambah Item</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Item</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Langkah Kerja" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4"><Input type="number" step="0.1" placeholder="Bobot" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} required /><Input type="number" placeholder="Skala Max" value={formData.max_scale} onChange={e => setFormData({...formData, max_scale: parseInt(e.target.value)})} required /></div>
          <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
        </form></DialogContent></Dialog></div>
      <Card><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead className="w-16">No</TableHead><TableHead>Deskripsi</TableHead><TableHead className="text-center">Bobot</TableHead><TableHead className="text-center">Max</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>{items.map((item, idx) => (<TableRow key={item.id}><TableCell className="text-center">{idx + 1}</TableCell><TableCell>{item.description}</TableCell><TableCell className="text-center">{item.weight}</TableCell><TableCell className="text-center">{item.max_scale}</TableCell>
            <TableCell className="text-right flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setFormData({ description: item.description, weight: item.weight, max_scale: item.max_scale, order_index: item.order_index }); setOpen(true) }}><Pencil size={16} /></Button>
            <Button variant="ghost" size="icon" onClick={async () => { if(confirm("Hapus?")) { await supabase.from('rubric_items').delete().eq('id', item.id); fetchRubricAndItems() } }}><Trash2 size={16} /></Button></TableCell></TableRow>))}</TableBody></Table>
      </CardContent></Card>
    </div>
  )
}
