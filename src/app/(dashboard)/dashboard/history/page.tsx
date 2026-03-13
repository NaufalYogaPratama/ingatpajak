import { getUserByNikNpwp, getUserVehicles, getUserTaxHistories, getCurrentUser } from "@/lib/actions";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
    const user = await getCurrentUser();

    if (!user) return null;

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
