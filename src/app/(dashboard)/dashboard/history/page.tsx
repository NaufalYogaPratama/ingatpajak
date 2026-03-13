"use client";

import { useState } from "react";
import { Car, Download, FileText, CheckCircle2, History, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockUser, mockVehicles, mockTaxHistories } from "@/data/mock";
import { toast } from "sonner";

export default function HistoryPage() {
    const [selectedVehicle, setSelectedVehicle] = useState("all");

    const filteredHistory = selectedVehicle === "all"
        ? mockTaxHistories
        : mockTaxHistories.filter(h => h.vehicleId === selectedVehicle);

    return (
        <div className="flex flex-col xl:flex-row gap-6">
            {/* Sidebar Navigation for History (Mockup Feature) */}
            <div className="hidden xl:block w-64 shrink-0">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm sticky top-6">
                    <nav className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100">
                            <History className="mr-2 h-4 w-4" />
                            Riwayat
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
                            <Car className="mr-2 h-4 w-4" />
                            Riwayat Kendaraan
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900">
                            <FileText className="mr-2 h-4 w-4" />
                            Arsip STNK/BPKB
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-6 min-w-0">

                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">Selamat Datang, {mockUser.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Car className="h-4 w-4 shrink-0" />
                            <span>Plat Nomor: <span className="font-semibold text-slate-700">{mockVehicles[0].plate}</span></span>
                            <span className="text-slate-300">•</span>
                            <span>Samsat Kudus</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-slate-200" size="sm">
                            Bantuan
                        </Button>
                    </div>
                </div>

                {/* Coming Soon Notice (PPH) */}
                <div className="bg-slate-50 border border-slate-100 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">Fitur PPh Dalam Masa Pengembangan</h3>
                    <p className="text-slate-500 max-w-md text-sm">
                        Modul pajak penghasilan sedang kami perbarui untuk memberikan pengalaman yang lebih baik. Silakan cek kembali nanti.
                    </p>
                </div>

                {/* Vehicle Tax Information Blocks */}
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
                        <Car className="h-5 w-5 text-blue-600" />
                        Informasi Pajak Kendaraan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-slate-100 shadow-sm relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-slate-500 mb-1">Status PKB Tahunan</p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                        <span className="text-2xl font-bold text-emerald-600">AKTIF</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Masa Berlaku STNK: {mockVehicles[0].stnkExpiry}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm relative overflow-hidden group">
                            <CardContent className="p-6">
                                <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-50 rounded-full blur-2xl z-0 transition-opacity"></div>
                                <div className="relative z-10">
                                    <p className="text-sm text-slate-500 mb-1">Jatuh Tempo Pajak</p>
                                    <p className="text-2xl font-bold text-slate-900 mb-4">15 November 2023</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500">{mockVehicles[0].model} ({mockVehicles[0].year})</span>
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-semibold px-1 rounded-sm">PKB</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Estimasi Biaya</p>
                                    <p className="text-2xl font-bold text-slate-900">Rp {mockVehicles[0].totalEstimation.toLocaleString('id-ID')}</p>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 text-right border-t border-slate-100 pt-3">Termasuk SWDKLLJ</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Promo Banner */}
                <div className="bg-blue-600 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md shadow-blue-900/10">
                    {/* Abstract Background Element */}
                    <div className="absolute top-0 right-0 w-64 h-full">
                        <div className="absolute right-0 w-full h-full bg-blue-500 transform skew-x-12 translate-x-10"></div>
                        <div className="absolute right-0 w-full h-full bg-blue-700 transform -skew-x-12 translate-x-20 opacity-50"></div>
                    </div>

                    <div className="relative z-10 flex gap-4 items-start md:items-center">
                        <div className="bg-white/20 p-3 rounded-xl shrink-0 mt-1 md:mt-0">
                            <Car className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">Pemutihan Denda Pajak Kendaraan</h3>
                            <p className="text-blue-100 text-sm max-w-xl pr-4">
                                Program pemutihan denda PKB sedang berlangsung di Kudus hingga akhir tahun. Manfaatkan kesempatan ini segera!
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <Button className="bg-white text-blue-700 hover:bg-slate-50 font-bold px-6 py-5 rounded-xl w-full sm:w-auto" onClick={() => toast("Fitur ini akan segera hadir!")}>
                            Cek Syarat & Ketentuan
                        </Button>
                    </div>
                </div>

                {/* History Table Area */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <Card className="flex-1 border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h3 className="font-bold text-lg text-slate-900">Riwayat Pajak Kendaraan</h3>
                            <Select value={selectedVehicle} onValueChange={(val) => setSelectedVehicle(val ?? "all")}>
                                <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm">
                                    <SelectValue placeholder="Semua Kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kendaraan</SelectItem>
                                    {mockVehicles.map(v => (
                                        <SelectItem key={v.id} value={v.id}>{v.model} ({v.plate})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 p-0 overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-[100px] font-semibold text-slate-600">TAHUN PAJAK</TableHead>
                                        <TableHead className="font-semibold text-slate-600">KENDARAAN</TableHead>
                                        <TableHead className="font-semibold text-slate-600">NOMINAL TOTAL</TableHead>
                                        <TableHead className="font-semibold text-slate-600">STATUS</TableHead>
                                        <TableHead className="w-[80px] text-right font-semibold text-slate-600">BUKTI</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHistory.map((history) => {
                                        const vehicle = mockVehicles.find(v => v.id === history.vehicleId);
                                        return (
                                            <TableRow key={history.id} className="border-slate-100 hover:bg-slate-50/50">
                                                <TableCell className="font-medium text-slate-900">{history.year}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{vehicle?.model}</span>
                                                        <span className="text-xs text-slate-500 mt-0.5">{vehicle?.plate}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-slate-700">Rp {history.nominalTotal.toLocaleString('id-ID')}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${history.status === "Lunas" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                                        {history.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon-sm" className="text-slate-400 hover:text-blue-600" title="Unduh TBPKP" onClick={() => toast("Fitur Unduh TBPKP akan segera hadir!")}>
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {filteredHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                                Tidak ada riwayat untuk kendaraan ini.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    {/* Right Action Widgets */}
                    <div className="lg:w-[320px] shrink-0 space-y-6">
                        <Card className="border-yellow-200 bg-yellow-50/30 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    <h4 className="font-bold text-yellow-900">Pengingat PKB</h4>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-yellow-100 shadow-sm mb-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">HONDA JAZZ RS (K 1234 ABC)</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        Pajak tahunan akan segera jatuh tempo. Hindari denda dengan membayar tepat waktu.
                                    </p>
                                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 px-2 py-1 rounded border border-red-100">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Jatuh Tempo: 15 Nov
                                    </div>
                                </div>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => toast("Fitur ini akan segera hadir!")}>
                                    Bayar Sekarang (E-Samsat)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-slate-400" /> Dokumen Kendaraan
                                </h4>
                            </div>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-50 text-emerald-600 p-2 rounded shrink-0">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">E-TBPKP 2022 (Jazz)</p>
                                            <p className="text-xs text-slate-400 mt-0.5">PDF • 1.2 MB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-blue-600 h-8 w-8 shrink-0" onClick={() => toast("Fitur Unduh akan segera hadir!")}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-50 text-emerald-600 p-2 rounded shrink-0">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">E-TBPKP 2022 (NMAX)</p>
                                            <p className="text-xs text-slate-400 mt-0.5">PDF • 840 KB</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-blue-600 h-8 w-8 shrink-0" onClick={() => toast("Fitur Unduh akan segera hadir!")}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button variant="outline" className="w-full mt-2 text-slate-600 hover:text-blue-600 border-dashed border-slate-300" onClick={() => toast("Fitur ini akan segera hadir!")}>
                                    Lihat Semua Dokumen
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
