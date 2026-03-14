"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Car, Calendar as CalendarIcon, Info, ShieldCheck, Mail, MessageSquare, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, Vehicle } from "@prisma/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { id } from "date-fns/locale";
import { toggleNotification, markAsPaid } from "@/lib/actions";

interface CalendarClientProps {
    user: User;
    vehicles: Vehicle[];
}

export default function CalendarClient({ user, vehicles }: CalendarClientProps) {
    // For MVP demonstration, we use October 2023 as the base month because of our seeded data
    const [currentMonth, setCurrentMonth] = useState(new Date(2023, 9, 1)); // October is index 9
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2023, 9, 15));
    const [isPending, startTransition] = useTransition();

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

    // Find vehicle for selected date
    const selectedVehicle = selectedDate
        ? vehicles.find(v => isSameDay(new Date(v.taxDueDate), selectedDate))
        : null;

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">
                            {format(currentMonth, "MMMM yyyy", { locale: id })}
                        </h1>
                        <p className="text-slate-500">Kalender IngatPajak {user.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 border-slate-200" onClick={() => toast("Fitur sinkronisasi akan segera hadir!")}>
                            <RefreshCw className="h-4 w-4 text-slate-500" />
                            Sync Samsat
                        </Button>
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
                            const vehicleOnThisDay = date ? vehicles.find(v => isSameDay(new Date(v.taxDueDate), date)) : null;

                            return (
                                <div
                                    key={i}
                                    onClick={() => { if (date) setSelectedDate(date) }}
                                    className={`min-h-[100px] p-2 bg-white flex flex-col transition-colors ${date ? 'cursor-pointer hover:bg-slate-50' : ''} ${!date ? 'bg-slate-50/50' : 'text-slate-700'} ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/30' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full 
                                            ${vehicleOnThisDay ? 'bg-yellow-400 text-yellow-900' : ''} 
                                            ${isSelected && !vehicleOnThisDay ? 'bg-blue-600 text-white' : ''}
                                        `}>
                                            {date ? date.getDate() : ''}
                                        </span>
                                    </div>

                                    {/* Events List */}
                                    <div className="space-y-1">
                                        {vehicleOnThisDay && (
                                            <div className="text-[10px] md:text-xs font-medium px-2 py-1 md:py-1.5 rounded truncate flex items-center gap-1.5 bg-blue-600 text-white shadow-sm">
                                                <Car className="h-3 w-3 shrink-0" />
                                                Pajak {vehicleOnThisDay.plateNumber}
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
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Jatuh Tempo Kendaraan
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div> Terpilih
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-slate-200"></div> Pajak Lain (Coming Soon)
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

                {/* Selected Vehicle Card */}
                {selectedVehicle ? (
                    <div className="bg-white border rounded-2xl p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden border-yellow-400/50">
                        {/* Decorative Accent */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border-none rounded whitespace-nowrap"><Car className="h-3 w-3 mr-1" /> {selectedVehicle.type}</Badge>
                                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 hover:bg-red-50 rounded whitespace-nowrap">⚠️ Segera</Badge>
                            </div>
                            <span className="text-red-500 font-bold text-sm">
                                {format(new Date(selectedVehicle.taxDueDate), "d MMM", { locale: id })}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-xl text-slate-900">{selectedVehicle.brandModel}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">Plat: {selectedVehicle.plateNumber}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
                                <span className="text-blue-600 font-bold">Total Estimasi</span>
                                <span className="font-bold text-blue-600 text-lg">Rp {selectedVehicle.estimatedCost.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <Button
                            nativeButton={false}
                            render={<a href="https://website.bapenda.jatengprov.go.id/page/new_sakpole" target="_blank" rel="noopener noreferrer" />}
                            className="w-full bg-blue-600 hover:bg-blue-700 h-10 shadow-md shadow-blue-600/20"
                        >
                            Bayar Sekarang (E-Samsat)
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full mt-3 h-10 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all"
                            onClick={() => handleMarkAsPaid(selectedVehicle.id)}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Tandai Lunas
                        </Button>

                        {/* Notifications Section */}
                        <div className="bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 tracking-wider mb-4">NOTIFIKASI:</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm font-medium text-slate-700">WhatsApp</span>
                                    </div>
                                    <Switch
                                        checked={selectedVehicle.isWaActive}
                                        onCheckedChange={(checked) => handleToggle(selectedVehicle.id, "wa", checked)}
                                        disabled={isPending}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">Email</span>
                                    </div>
                                    <Switch
                                        checked={selectedVehicle.isEmailActive}
                                        onCheckedChange={(checked) => handleToggle(selectedVehicle.id, "email", checked)}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border text-center border-slate-200 border-dashed rounded-2xl p-10 text-slate-500 flex flex-col items-center justify-center">
                        <CalendarIcon className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium">Pilih tanggal yang memiliki tanda kuning.</p>
                        {selectedDate && <p className="text-xs text-slate-400 mt-1">{format(selectedDate, "d MMMM yyyy", { locale: id })}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
