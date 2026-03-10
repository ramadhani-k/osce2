import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Users, MapPin, GraduationCap } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { title: "Total Ujian", value: "0", icon: ClipboardList, color: "text-blue-600" },
    { title: "Total Peserta", value: "0", icon: Users, color: "text-green-600" },
    { title: "Total Stase", value: "0", icon: MapPin, color: "text-purple-600" },
    { title: "Hasil Penilaian", value: "0", icon: GraduationCap, color: "text-orange-600" },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-slate-500">Selamat datang di panel administrasi Sistem OSCE.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
