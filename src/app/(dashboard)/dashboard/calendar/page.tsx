import { getUserByNikNpwp, getUserVehicles, getCurrentUser } from "@/lib/actions";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const user = await getCurrentUser();

    if (!user) return null;

    const vehiclesResult = await getUserVehicles(user.id);
    const vehicles = vehiclesResult.success ? (vehiclesResult.data || []) : [];

    return (
        <CalendarClient
            user={user}
            vehicles={vehicles}
        />
    );
}
