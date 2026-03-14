"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw, Car, Calendar as CalendarIcon, Info, ShieldCheck, Mail, MessageSquare, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Vehicle, TaxHistory } from "@prisma/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, setMonth, setYear } from "date-fns";
import { id } from "date-fns/locale";
import { toggleNotification, markAsPaid } from "@/lib/actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CalendarClientProps {
    user: User;
    vehicles: Vehicle[];
    taxHistories: TaxHistory[];
}

export default function CalendarClient({ user, vehicles, taxHistories }: CalendarClientProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isPending, startTransition] = useTransition();

    const userName = user.name || "Wajib Pajak";
    const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "WP";

    // Generate calendar grid
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    // Padding for weeks
    const startDay = getDay(start); // 0 (Sun) to 6 (Sat)
    // Adjust to Monday-start if needed, but standard is Sunday
    // Let's use standard Sunday start for now as per previous mock
    const paddingStart = Array.from({ length: startDay }).map((_, i) => null);

    const calendarDays = [...paddingStart, ...daysInMonth];
    // Pad to 42 cells (6 rows)
    const paddingEnd = Array.from({ length: 42 - calendarDays.length }).map((_, i) => null);
    const fullGrid = [...calendarDays, ...paddingEnd];

    // Find items for selected date
    const selectedVehicles = selectedDate
        ? vehicles.filter(v => isSameDay(new Date(v.taxDueDate), selectedDate))
        : [];

    const selectedHistories = selectedDate
        ? taxHistories.filter(h => isSameDay(new Date(h.createdAt), selectedDate))
        : [];

    const hasEventsOnSelectedDate = selectedVehicles.length > 0 || selectedHistories.length > 0;

    const handleToggle = async (vehicleId: string, type: "wa" | "email", status: boolean) => {
        startTransition(async () => {
            const result = await toggleNotification(vehicleId, type, status);
            if (result.success) {
                toast.success(`Notifikasi ${type.toUpperCase()} diperbarui.`);
            } else {
                toast.error(result.error || "Gagal memperbarui notifikasi.");
            }
        });
    };

    const [isUpdating, setIsUpdating] = useState(false);

    async function handleMarkAsPaid(vehicleId: string) {
        if (!confirm("Apakah Anda yakin ingin menandai pajak ini sebagai lunas?")) return;

        setIsUpdating(true);
        try {
            const result = await markAsPaid(vehicleId);
            if (result.success) {
                toast.success("Status pajak berhasil diperbarui ke tahun depan!");
            } else {
                toast.error(result.error || "Gagal memperbarui status pajak.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6">
            {/* Left Area - Calendar Grid */}
            <div className="flex-1 space-y-4">
                <h1 className="text-2xl md:text-xl text-slate-500 mb-3">
                        Kalender IngatPajak
                    </h1>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        
                        <div className="flex items-center gap-2">
                            <Select
                                value={currentMonth.getMonth().toString()}
                                onValueChange={(value) => value && setCurrentMonth(setMonth(currentMonth, parseInt(value)))}
                            >
                                <SelectTrigger className="w-auto border-none text-3xl font-bold p-0 h-auto focus:ring-0 gap-2">
                                    <span className="flex-1 text-left min-w-[140px]">
                                        {format(currentMonth, "MMMM", { locale: id })}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {[
                                        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                                    ].map((name, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={currentMonth.getFullYear().toString()}
                                onValueChange={(value) => value && setCurrentMonth(setYear(currentMonth, parseInt(value)))}
                            >
                                <SelectTrigger className="w-auto border-none text-3xl font-bold p-0 h-auto focus:ring-0 gap-2">
                                    <span className="flex-1 text-left">
                                        {currentMonth.getFullYear()}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 11 }).map((_, i) => (
                                        <SelectItem key={i} value={(2020 + i).toString()}>
                                            {2020 + i}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* <Button variant="outline" className="gap-2 border-slate-200" onClick={() => toast("Fitur sinkronisasi akan segera hadir!")}>
                            <RefreshCw className="h-4 w-4 text-slate-500" />
                            Sync Samsat
                        </Button> */}
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden shrink-0">
                            <Button
                                variant="ghost"
                                className="rounded-none border-r border-slate-200 px-3 hover:bg-slate-50"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-none px-3 hover:bg-slate-50"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[600px] flex flex-col">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-semibold text-slate-400 text-center uppercase tracking-wider">
                        <div>MIN</div><div>SEN</div><div>SEL</div><div>RAB</div><div>KAM</div><div>JUM</div><div>SAB</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden flex-1 border border-slate-100">
                        {fullGrid.map((date, i) => {
                            const isSelected = date && selectedDate && isSameDay(date, selectedDate);
                            const vehiclesOnThisDay = date ? vehicles.filter(v => isSameDay(new Date(v.taxDueDate), date)) : [];
                            const historiesOnThisDay = date ? taxHistories.filter(h => isSameDay(new Date(h.createdAt), date)) : [];
                            const hasUpcoming = vehiclesOnThisDay.length > 0;
                            const hasPaid = historiesOnThisDay.length > 0;

                            return (
                                <div
                                    key={i}
                                    onClick={() => { if (date) setSelectedDate(date) }}
                                    className={`min-h-[100px] p-2 bg-white flex flex-col transition-colors ${date ? 'cursor-pointer hover:bg-slate-50' : ''} ${!date ? 'bg-slate-50/50' : 'text-slate-700'} ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/30' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1">
                                            <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full 
                                                ${hasUpcoming ? 'bg-yellow-400 text-yellow-900' : ''} 
                                                ${!hasUpcoming && hasPaid ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${isSelected && !hasUpcoming && !hasPaid ? 'bg-blue-600 text-white' : ''}
                                            `}>
                                                {date ? date.getDate() : ''}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {hasUpcoming && <div className="w-2 h-2 rounded-full bg-yellow-400" title="Jatuh Tempo" />}
                                            {hasPaid && <div className="w-2 h-2 rounded-full bg-emerald-500" title="Lunas" />}
                                        </div>
                                    </div>

                                    {/* Events List */}
                                    <div className="space-y-1 overflow-hidden">
                                        {vehiclesOnThisDay.slice(0, 2).map((v, idx) => (
                                            <div key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 bg-blue-600 text-white shadow-sm">
                                                <Car className="h-2.5 w-2.5 shrink-0" />
                                                {v.plateNumber}
                                            </div>
                                        ))}
                                        {historiesOnThisDay.slice(0, 1).map((h, idx) => (
                                            <div key={idx} className="text-[10px] font-medium px-1.5 py-0.5 rounded truncate flex items-center gap-1 bg-emerald-500 text-white shadow-sm">
                                                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                                                Lunas
                                            </div>
                                        ))}
                                        {(vehiclesOnThisDay.length + historiesOnThisDay.length > 3) && (
                                            <div className="text-[9px] text-slate-400 text-center font-bold">
                                                +{vehiclesOnThisDay.length + historiesOnThisDay.length - 3} lainnya
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-500 font-medium px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Jatuh Tempo
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Lunas
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div> Terpilih
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Area - Sidebar Panel */}
            <div className="xl:w-[380px] space-y-6 shrink-0 pb-12">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Detail Pembayaran</h2>
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{vehicles.length} Kendaraan</span>
                </div>

                {/* Selected Area Rendering */}
                {hasEventsOnSelectedDate ? (
                    <div className="space-y-4">
                        {/* Upcoming Taxes */}
                        {selectedVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white border rounded-2xl p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden border-yellow-400/50">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-2">
                                        <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border-none rounded whitespace-nowrap text-[10px]"><Car className="h-3 w-3 mr-1" /> {vehicle.type}</Badge>
                                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 hover:bg-red-50 rounded whitespace-nowrap text-[10px]">⚠️ Segera</Badge>
                                    </div>
                                    <span className="text-red-500 font-bold text-sm">
                                        {format(new Date(vehicle.taxDueDate), "d MMM", { locale: id })}
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <h3 className="font-bold text-xl text-slate-900">{vehicle.brandModel}</h3>
                                    <p className="text-slate-500 text-sm mt-0.5">Plat: {vehicle.plateNumber}</p>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-dashed border-slate-200 mb-6">
                                    <span className="text-blue-600 font-bold">Estimasi</span>
                                    <span className="font-bold text-blue-600 text-lg">Rp {vehicle.estimatedCost.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="space-y-3">
                                    <Button
                                        nativeButton={false}
                                        render={<a href="https://website.bapenda.jatengprov.go.id/page/new_sakpole" target="_blank" rel="noopener noreferrer" />}
                                        className="w-full bg-blue-600 hover:bg-blue-700 h-10 shadow-md shadow-blue-600/20"
                                    >
                                        Bayar Sekarang
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200"
                                        onClick={() => handleMarkAsPaid(vehicle.id)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                        Tandai Lunas
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Payment History */}
                        {selectedHistories.map((history) => {
                            const vehicle = vehicles.find(v => v.id === history.vehicleId);
                            return (
                                <div key={history.id} className="bg-white border rounded-2xl p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden border-emerald-500/30">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                                    <div className="flex justify-between items-center mb-4">
                                        <Badge className="bg-emerald-100 text-emerald-700 border-none rounded whitespace-nowrap text-[10px]"><CheckCircle2 className="h-3 w-3 mr-1" /> Lunas</Badge>
                                        <span className="text-emerald-600 font-bold text-sm">
                                            {format(new Date(history.createdAt), "d MMM yyyy", { locale: id })}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-slate-900">{vehicle?.brandModel || "Kendaraan"}</h3>
                                        <p className="text-slate-500 text-sm mt-0.5">Tahun Pajak: {history.taxYear}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                        <span className="text-slate-500 text-sm">Jumlah Dibayar</span>
                                        <span className="font-bold text-slate-900">Rp {history.amount.toLocaleString('id-ID')}</span>
                                    </div>
                                    {history.proofUrl && (
                                        <Button
                                            variant="ghost"
                                            className="w-full mt-4 text-blue-600 hover:bg-blue-50 text-sm font-semibold"
                                            nativeButton={false}
                                            render={<Link href={history.proofUrl || "#"} target="_blank" rel="noopener noreferrer" />}
                                        >
                                            Lihat Bukti Bayar <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border text-center border-slate-200 border-dashed rounded-2xl p-10 text-slate-500 flex flex-col items-center justify-center">
                        <CalendarIcon className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium">Pilih tanggal untuk melihat detail.</p>
                        {selectedDate && <p className="text-xs text-slate-400 mt-1">{format(selectedDate, "d MMMM yyyy", { locale: id })}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
