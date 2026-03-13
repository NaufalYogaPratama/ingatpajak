import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { getUserByNikNpwp } from "@/lib/actions";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Basic simulation of a logged-in user using the seeded NIK
    const seededNik = "3319012345678901";
    const userResult = await getUserByNikNpwp(seededNik);
    const user = userResult.success ? userResult.data : null;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-slate-500">Gagal memuat data pengguna.</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar />
            <div className="flex w-full flex-col">
                <Topbar user={user} />
                <main className="flex-1 p-6 md:p-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
