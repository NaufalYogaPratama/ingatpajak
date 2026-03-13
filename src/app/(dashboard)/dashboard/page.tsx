import Link from "next/link";
import { ArrowRight, Calendar as CalendarIcon, Lightbulb, PenTool, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNewsArticles } from "@/data/mock";
import { getUserByNikNpwp, getUserVehicles } from "@/lib/actions";
import { Vehicle } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function DashboardPage() {
    // Basic simulation of a logged-in user using the seeded NIK
    const seededNik = "3319012345678901";
    const userResult = await getUserByNikNpwp(seededNik);
    const user = userResult.success ? userResult.data : null;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-slate-500">Gagal memuat data pengguna. Silakan coba lagi nanti.</p>
            </div>
        );
    }

    const vehiclesResult = await getUserVehicles(user.id);
    const vehicles = vehiclesResult.success ? vehiclesResult.data : [];

    const firstName = user.name?.split(" ")[0] || "Pengguna";

    // Find the vehicle with the nearest tax due date
    const today = new Date();
    const upcomingVehicles = (vehicles || [])
        .filter((v: Vehicle) => new Date(v.taxDueDate) >= today)
        .sort((a: Vehicle, b: Vehicle) => new Date(a.taxDueDate).getTime() - new Date(b.taxDueDate).getTime());

    const nextDueVehicle = upcomingVehicles[0];
    const daysUntilDue = nextDueVehicle
        ? Math.ceil((new Date(nextDueVehicle.taxDueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const formattedDueDate = nextDueVehicle
        ? format(new Date(nextDueVehicle.taxDueDate), "d MMMM yyyy", { locale: id })
        : null;

    return (
        <div className="space-y-8">
            {/* Greeting & Alert Banner */}
            <section>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                        Selamat Pagi, {firstName}!
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-slate-600 leading-relaxed max-w-2xl">
                            {nextDueVehicle ? (
                                <>
                                    Jangan lupa, batas waktu pelaporan <span className="font-semibold text-blue-600">Pajak Kendaraan ({nextDueVehicle.plateNumber})</span> tinggal <span className="bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5 rounded">{daysUntilDue} hari lagi</span>. Mari laporkan tepat waktu untuk kemajuan Kudus.
                                </>
                            ) : (
                                "Semua pajak kendaraan Anda terpantau aman. Terima kasih telah tertib administrasi!"
                            )}
                        </p>
                        <div className="flex gap-3 shrink-0">
                            <Button nativeButton={false} render={<Link href="/dashboard/calendar" />} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                                <PenTool className="h-4 w-4" />
                                Lapor Sekarang
                            </Button>
                            <Button nativeButton={false} render={<Link href="/dashboard/history" />} variant="outline" className="flex items-center gap-2 border-slate-200">
                                <CalendarIcon className="h-4 w-4" />
                                Riwayat
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Calendar Widget */}
                <div className="space-y-6">
                    <Card className="border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-base">Kalender Pajak</CardTitle>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                {format(today, "MMMM yyyy", { locale: id })}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-4 flex-1 flex flex-col">
                            {/* Mini Calendar Grid (Static Mock - Placeholder for future implementation) */}
                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                                <div className="text-slate-400 font-medium py-1">M</div>
                                <div className="text-slate-400 font-medium py-1">S</div>
                                <div className="text-slate-400 font-medium py-1">S</div>
                                <div className="text-slate-400 font-medium py-1">R</div>
                                <div className="text-slate-400 font-medium py-1">K</div>
                                <div className="text-slate-400 font-medium py-1">J</div>
                                <div className="text-slate-400 font-medium py-1">S</div>

                                {/* Placeholder dates for current month visualization */}
                                {Array.from({ length: 21 }).map((_, i) => (
                                    <div key={i} className={`py-1.5 ${i === 14 ? 'bg-blue-600 text-white rounded-md font-medium shadow-sm' : 'text-slate-300'}`}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Alert Widget */}
                            {nextDueVehicle && (
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 flex gap-3 mb-4">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-800">Batas Setor Pajak</p>
                                        <p className="text-xs text-yellow-600 mt-0.5">{formattedDueDate}</p>
                                    </div>
                                </div>
                            )}

                            {/* Trivia Widget */}
                            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 mb-4">
                                <div className="flex gap-3 mb-2">
                                    <div className="bg-white p-1.5 rounded-md shadow-sm h-fit">
                                        <Lightbulb className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-purple-900">Tahukah Anda?</h4>
                                        <p className="text-xs text-purple-700 leading-relaxed mt-1">
                                            Membayar pajak tepat waktu membantu pembangunan fasilitas umum di Kudus.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-purple-200/50">
                                    <span className="text-[10px] text-purple-500 uppercase font-semibold tracking-wider">Trivia Pajak</span>
                                    <Link href="#" className="text-xs text-purple-700 font-medium hover:underline">Pelajari Lebih Lanjut</Link>
                                </div>
                            </div>

                            <div className="mt-auto pt-2">
                                <Button nativeButton={false} render={<Link href="/dashboard/calendar" />} variant="ghost" className="w-full justify-center bg-blue-50 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                                    Lihat Jadwal Lengkap <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - News & Info */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                            Berita & Info Pajak Terbaru
                        </h2>
                        <Link href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Main Article 1 */}
                        <Card className="overflow-hidden border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                            <div className="h-40 bg-[#74b3a7] relative p-4 flex items-end">
                                <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 border-none">
                                    {mockNewsArticles[0].category}
                                </Badge>
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <div className="w-24 h-24 rounded-full border-4 border-white/50 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/50"></div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <CalendarIcon className="h-3 w-3 text-yellow-500" />
                                    {mockNewsArticles[0].date}
                                </div>
                                <h3 className="font-bold text-slate-900 leading-tight mb-2">
                                    {mockNewsArticles[0].title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                                    {mockNewsArticles[0].description}
                                </p>
                                <Link href="#" className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-800 self-start mt-auto">
                                    Baca Selengkapnya <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Coming Soon Card */}
                        <Card className="overflow-hidden border-slate-100 shadow-sm flex flex-col bg-slate-50/50 justify-center items-center text-center p-6 min-h-[300px]">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                <PenTool className="h-8 w-8" />
                            </div>
                            <Badge variant="outline" className="mb-4 bg-yellow-50 text-yellow-700 border-yellow-200">
                                Coming Soon
                            </Badge>
                            <h3 className="font-bold text-slate-900 mb-2">Panduan Pajak Penghasilan</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">
                                Fitur edukasi perpajakan lanjutan sedang dalam masa pengembangan. Nantikan update selanjutnya!
                            </p>
                        </Card>
                    </div>

                    {/* Horizontal Article */}
                    <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="sm:w-2/5 bg-[#fac7b6] p-6 flex flex-col relative shrink-0">
                                <Badge className="self-start bg-purple-600 hover:bg-purple-700 mb-6 relative z-10 border-none">
                                    {mockNewsArticles[1].category}
                                </Badge>
                                <div className="m-auto w-32 h-40 bg-slate-900 rounded-xl p-2 relative shadow-lg">
                                    <div className="w-full h-full bg-white rounded-md overflow-hidden relative">
                                        <div className="mt-4 px-2 space-y-1">
                                            <div className="h-1 bg-slate-200 w-1/2 rounded-full"></div>
                                            <div className="h-0.5 bg-slate-100 w-full rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 sm:p-6 flex flex-col justify-center sm:w-3/5">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <CalendarIcon className="h-3 w-3 text-yellow-500" />
                                    {mockNewsArticles[1].date}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2">
                                    {mockNewsArticles[1].title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                                    {mockNewsArticles[1].description}
                                </p>
                                <Link href="#" className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-800">
                                    Baca Selengkapnya <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
