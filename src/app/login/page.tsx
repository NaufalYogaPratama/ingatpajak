"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, MessageSquare, Smartphone, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestOtp, verifyOtp } from "@/lib/actions";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"IDENTIFY" | "OTP_VERIFY">("IDENTIFY");
    const [nik, setNik] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const nikValue = formData.get("nik") as string;
        const emailValue = formData.get("email") as string;

        try {
            const result = await requestOtp(nikValue, emailValue);
            if (result.success) {
                setNik(nikValue);
                setEmail(emailValue);
                setStep("OTP_VERIFY");
                toast.success("Kode OTP telah dikirim ke email Anda.");
            } else {
                toast.error(result.error || "Gagal mengirim OTP.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await verifyOtp(nik, otp);
            if (result.success) {
                toast.success("Login berhasil!");
                router.push("/dashboard");
            } else {
                toast.error(result.error || "Gagal memverifikasi OTP.");
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
                        <span className="text-2xl font-bold text-yellow-400 -ml-1">Pajak.</span>
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

                    {step === "IDENTIFY" ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h2>
                                <p className="text-slate-500 text-base">Masukkan NIK dan Email untuk menerima kode OTP.</p>
                            </div>

                            <form key="identify-form" onSubmit={handleRequestOtp} className="space-y-5">
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
                                            value={nik}
                                            onChange={(e) => setNik(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Utama</Label>
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Verifikasi OTP</h2>
                                <p className="text-slate-500 text-base flex flex-col">
                                    <span>Kode telah dikirim ke:</span>
                                    <span className="font-semibold text-slate-900">{email}</span>
                                </p>
                            </div>

                            <form key="otp-form" onSubmit={handleVerifyOtp} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium text-slate-700">6 Digit Kode OTP</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="otp"
                                            name="otp"
                                            placeholder="000000"
                                            maxLength={6}
                                            className="pl-10 h-12 bg-slate-50/50 border-slate-200 tracking-[0.5em] font-mono text-lg"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading ? "Memverifikasi..." : "Verifikasi & Masuk"}
                                </Button>

                                <button
                                    type="button"
                                    className="w-full text-sm text-blue-600 font-medium hover:underline py-2"
                                    onClick={() => setStep("IDENTIFY")}
                                >
                                    Ganti NIK / Email
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-sm text-blue-900 mb-1">PRIVASI TERJAMIN</p>
                            <p className="text-xs text-blue-700/80 leading-relaxed">
                                IngatPajak menjamin kerahasiaan data pribadi Anda. OTP dikirimkan secara langsung ke email anda untuk keamanan tambahan.
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
