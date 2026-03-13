"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Car, Check, Calendar as CalendarIcon, Info, ShieldCheck, Mail, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { mockUser, mockVehicles, mockCalendarEvents } from "@/data/mock";

// Mock calendar grid data for October 2023
const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 6; // Starts on Sunday Oct 1 (day 6 index) to pad September
    if (day <= 0) return { day: 30 + day, isCurrentMonth: false, events: [] };
    if (day > 31) return { day: day - 31, isCurrentMonth: false, events: [] };

    // Attach events
    const dateStr = `2023-10-${day.toString().padStart(2, '0')}T00:00:00Z`;
    const events = mockCalendarEvents.filter(e => e.date === dateStr);

    return { day, isCurrentMonth: true, events };
});

export default function CalendarPage() {
    const [waToggle, setWaToggle] = useState(true);
    const [emailToggle, setEmailToggle] = useState(true);
    const [selectedDate, setSelectedDate] = useState<number | null>(15); // Default to the 15th

    // Find the primary event for the selected date to show in the right panel
    const selectedDateObj = selectedDate ? calendarDays.find(d => d.day === selectedDate && d.isCurrentMonth) : null;
    const selectedEvent = selectedDateObj?.events.length ? selectedDateObj.events[0] : null;
    const selectedVehicle = selectedEvent ? mockVehicles.find(v => v.id === selectedEvent.vehicleId) : null;

    return (
        <div className="flex flex-col xl:flex-row gap-6">
            {/* Left Area - Calendar Grid */}
            <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Oktober 2023</h1>
                        <p className="text-slate-500">Kalender IngatPajak {mockUser.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 border-slate-200" onClick={() => toast("Fitur ini akan segera hadir!")}>
                            <RefreshCw className="h-4 w-4 text-slate-500" />
                            Sync Samsat
                        </Button>
                        <div className="flex border border-slate-200 rounded-lg overflow-hidden shrink-0">
                            <Button variant="ghost" className="rounded-none border-r border-slate-200 px-3 hover:bg-slate-50">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="rounded-none px-3 hover:bg-slate-50">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[600px] flex flex-col">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-4 mb-4 text-sm font-semibold text-slate-400 text-center uppercase tracking-wider">
                        <div>SEN</div><div>SEL</div><div>RAB</div><div>KAM</div><div>JUM</div><div>SAB</div><div>MIN</div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-xl overflow-hidden flex-1 border border-slate-100">
                        {calendarDays.map((date, i) => (
                            <div
                                key={i}
                                onClick={() => { if (date.isCurrentMonth) setSelectedDate(date.day) }}
                                className={`min-h-[100px] p-2 bg-white flex flex-col transition-colors ${date.isCurrentMonth ? 'cursor-pointer hover:bg-slate-50' : ''} ${!date.isCurrentMonth ? 'text-slate-300' : 'text-slate-700'} ${selectedDate === date.day && date.isCurrentMonth ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/30' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${date.events.some(e => e.type === 'Jatuh Tempo') && date.isCurrentMonth ? 'bg-yellow-400 text-yellow-900' : ''} ${selectedDate === date.day && date.isCurrentMonth && !date.events.some(e => e.type === 'Jatuh Tempo') ? 'bg-blue-600 text-white' : ''}`}>
                                        {date.day}
                                    </span>
                                </div>

                                {/* Events List */}
                                <div className="space-y-1">
                                    {date.events.map((event, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-[10px] md:text-xs font-medium px-2 py-1 md:py-1.5 rounded truncate flex items-center gap-1.5
                          ${event.type === 'Jatuh Tempo' && event.vehicleId === 'v2' ? 'bg-blue-600 text-white shadow-sm' : ''}
                          ${event.type === 'Jatuh Tempo' && event.vehicleId === 'v3' ? 'bg-slate-100 text-slate-700 border border-slate-200' : ''}
                          ${event.type === 'Pajak Lain' ? 'bg-transparent text-slate-400 border border-slate-200 border-dashed' : ''}
                        `}
                                        >
                                            {event.type === 'Jatuh Tempo' && event.vehicleId === 'v2' && <Car className="h-3 w-3 shrink-0" />}
                                            {event.type === 'Jatuh Tempo' && event.vehicleId === 'v3' && <Car className="h-3 w-3 shrink-0" />}
                                            {event.title.split(' ')[0]} {event.title.split(' ')[1]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-500 font-medium px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div> Jatuh Tempo Kendaraan
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600"></div> Aktif Hari Ini
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full border-2 border-slate-200"></div> Pajak Lain (Coming Soon)
                        </div>
                    </div>
                </div>

                {/* Footer Links (From Mockup) */}
                <div className="flex gap-6 text-sm text-slate-500 font-medium pt-4 pb-8">
                    <Link href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
                </div>
            </div>

            {/* Right Area - Sidebar Panel */}
            <div className="xl:w-[380px] space-y-6 shrink-0 pb-12">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Kendaraan Anda</h2>
                    <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">2 Unit</span>
                </div>

                {/* Tax Other Card (Placeholder) */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-slate-400 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
                    <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="bg-white text-slate-400 border-slate-200">PPh 21</Badge>
                        <span className="text-xs">10 Okt</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1">PPH Final UMKM (0.5%)</h3>
                    <p className="text-sm">Pajak penghasilan bulanan UMKM.</p>
                </div>

                {/* Selected Vehicle Card */}
                {selectedVehicle ? (
                    <div className="bg-white border rounded-2xl p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden border-yellow-400/50">
                        {/* Decorative Accent */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border-none rounded whitespace-nowrap"><Car className="h-3 w-3 mr-1" /> Mobil</Badge>
                                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 hover:bg-red-50 rounded whitespace-nowrap">⚠️ Segera</Badge>
                            </div>
                            <span className="text-red-500 font-bold text-sm">{selectedDate} Okt</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-xl text-slate-900">{selectedVehicle.model}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">Plat: {selectedVehicle.plate}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">PKB Pokok</span>
                                <span className="font-semibold text-slate-700">Rp {selectedVehicle.pkbPokok.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">SWDKLLJ</span>
                                <span className="font-semibold text-slate-700">Rp {selectedVehicle.swdkllj.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200">
                                <span className="text-blue-600 font-bold">Total Estimasi</span>
                                <span className="font-bold text-blue-600 text-lg">Rp {selectedVehicle.totalEstimation.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-6 h-12 shadow-md shadow-blue-600/20" onClick={() => toast("Fitur ini akan segera hadir!")}>
                            Bayar via e-Samsat Jateng
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
                                    <div className="relative">
                                        {Switch ? (
                                            <Switch checked={waToggle} onCheckedChange={setWaToggle} className="data-[state=checked]:bg-blue-600" />
                                        ) : (
                                            <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${waToggle ? 'bg-blue-600' : 'bg-slate-200'}`} onClick={() => setWaToggle(!waToggle)}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-1 ${waToggle ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">Centang / Email</span>
                                    </div>
                                    <div className="relative">
                                        {Switch ? (
                                            <Switch checked={emailToggle} onCheckedChange={setEmailToggle} className="data-[state=checked]:bg-blue-600" />
                                        ) : (
                                            <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${emailToggle ? 'bg-blue-600' : 'bg-slate-200'}`} onClick={() => setEmailToggle(!emailToggle)}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-1 ${emailToggle ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border text-center border-slate-200 border-dashed rounded-2xl p-10 text-slate-500 flex flex-col items-center justify-center">
                        <CalendarIcon className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-sm font-medium">Tidak ada tagihan kendaraan pada tanggal ini.</p>
                        <p className="text-xs text-slate-400 mt-1">Pilih tanggal yang memiliki tanda kuning.</p>
                    </div>
                )}

                {/* Promotion Widget */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer mt-8">
                    <div className="flex gap-4">
                        <div className="bg-blue-600 text-white p-2.5 rounded-lg h-fit shadow-sm group-hover:bg-blue-700 transition-colors">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Biro Jasa Terpercaya?</h4>
                            <p className="text-xs text-blue-800/80 leading-relaxed mb-3">
                                Kami bermitra dengan biro jasa resmi di Kudus untuk pengurusan STNK.
                            </p>
                            <Link href="#" className="text-xs font-bold text-blue-600 flex items-center hover:text-blue-800">
                                Lihat Daftar Mitra <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
