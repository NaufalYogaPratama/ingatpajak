import { getUserByNikNpwp, getUserVehicles, getUserTaxHistories } from "@/lib/actions";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
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
    const vehicles = vehiclesResult.success ? (vehiclesResult.data || []) : [];

    const historyResult = await getUserTaxHistories(user.id);
    const taxHistories = historyResult.success ? (historyResult.data || []) : [];

    return (
        <HistoryClient
            user={user}
            vehicles={vehicles}
            taxHistories={taxHistories as any}
        />
    );
}
