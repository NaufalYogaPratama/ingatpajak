"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, MessageSquare, Smartphone, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/actions";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const nik = formData.get("nik") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;

        try {
            const result = await loginUser(nik, phone, email);
            if (result.success) {
                toast.success("Login berhasil!");
                router.push("/dashboard");
            } else {
                toast.error(result.error || "Gagal login.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left side - Branding (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 opacity-90 z-0"></div>
                {/* Decorative Graphic/Pattern Placeholder */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="bg-white text-blue-600 font-bold p-1.5 rounded-lg text-2xl flex items-center justify-center w-10 h-10 shadow-sm">
                            <span className="text-yellow-400 font-black">!</span>P
                        </div>
                        <span className="text-2xl font-bold">ingat</span>
                        <span className="text-2xl font-bold text-yellow-400 -ml-1">pajak.</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 mt-16 max-w-lg">
                        Kelola pajak menjadi lebih mudah & aman bersama IngatPajak!
                    </h1>

                    <p className="text-blue-100 text-lg max-w-md">
                        Ayo cari tahu informasi lengkap seputar perpajakan dan pastikan anda tidak terlewat membayar pajak!
                    </p>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex gap-4 items-center">
                        <div className="bg-yellow-400/20 text-yellow-400 rounded-full p-2">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Data Terenkripsi</p>
                            <p className="text-sm text-blue-200">Keamanan setara bank untuk data NPWP Anda</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4 ml-2">
                        <div className="w-6 h-1 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-1 bg-blue-400 rounded-full"></div>
                        <div className="w-2 h-1 bg-blue-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex flex-col flex-1 justify-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-white relative">
                <div className="w-full max-w-md mx-auto">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-12">
                        <div className="bg-blue-600 text-white font-bold p-1.5 rounded-lg text-xl flex items-center justify-center w-8 h-8 shadow-sm">
                            <span className="text-yellow-400 font-black">!</span>P
                        </div>
                        <span className="text-xl font-bold text-blue-600">ingat</span>
                        <span className="text-xl font-bold text-yellow-500 -ml-1">Pajak.</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h2>
                        <p className="text-slate-500 text-base">Masuk untuk mengakses dashboard pajak Anda.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="nik" className="text-sm font-medium text-slate-700">NIK / NPWP</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <Input
                                    id="nik"
                                    name="nik"
                                    placeholder="Masukkan 16 digit NIK atau 15 digit NPWP"
                                    className="pl-10 h-12 bg-slate-50/50 border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Nomor HP Aktif</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <Smartphone className="h-4 w-4" />
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Contoh: 08123456789"
                                    className="pl-10 h-12 bg-slate-50/50 border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="pl-10 h-12 bg-slate-50/50 border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? "Memproses..." : "Masuk / Daftar"}
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-slate-400">Atau masuk dengan</span>
                            </div>
                        </div>

                        <Button type="button" variant="outline" className="w-full h-12 text-slate-600 border-slate-200 hover:bg-slate-50 font-medium">
                            <MessageSquare className="mr-2 h-4 w-4 text-slate-500" />
                            Login via Kode OTP
                        </Button>
                    </form>

                    <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 pb-4">
                        <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-sm text-blue-900 mb-1">PRIVASI TERJAMIN</p>
                            <p className="text-xs text-blue-700/80 leading-relaxed">
                                IngatPajak menjamin kerahasiaan data pribadi Anda sesuai regulasi yang berlaku. Data hanya digunakan untuk keperluan verifikasi pajak.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 right-8 left-8 flex justify-center lg:justify-end gap-6 text-xs text-slate-500">
                    <Link href="#" className="hover:text-blue-600 transition-colors">Bantuan</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Syarat & Ketentuan</Link>
                </div>
            </div>
        </div>
    );
}
