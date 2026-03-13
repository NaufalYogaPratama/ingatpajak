import { getUserByNikNpwp, getUserVehicles } from "@/lib/actions";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
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

    return (
        <CalendarClient
            user={user}
            vehicles={vehicles}
        />
    );
}
