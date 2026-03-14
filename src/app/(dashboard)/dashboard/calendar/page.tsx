import { getUserByNikNpwp, getUserVehicles, getCurrentUser, getUserTaxHistories } from "../../../../lib/actions";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const user = await getCurrentUser();

    if (!user) return null;

    const [vehiclesResult, historiesResult] = await Promise.all([
        getUserVehicles(user.id),
        getUserTaxHistories(user.id)
    ]);

    const vehicles = vehiclesResult.success ? (vehiclesResult.data || []) : [];
    const histories = historiesResult.success ? (historiesResult.data || []) : [];

    return (
        <CalendarClient
            user={user}
            vehicles={vehicles}
            taxHistories={histories}
        />
    );
}
