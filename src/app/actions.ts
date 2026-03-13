"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Fetch a user by nik_npwp (for basic login simulation).
export async function getUserByNikNpwp(nik_npwp: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { nik_npwp }
        });
        return { success: true, data: user };
    } catch (error) {
        console.error("Error fetching user:", error);
        return { success: false, error: "Gagal mengambil data pengguna." };
    }
}

// Fetch all vehicles for a specific user ID.
export async function getUserVehicles(userId: string) {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { userId },
            orderBy: { taxDueDate: 'asc' }
        });
        return { success: true, data: vehicles };
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        return { success: false, error: "Gagal mengambil data kendaraan." };
    }
}

// Fetch the tax history for a specific vehicle ID.
export async function getVehicleTaxHistory(vehicleId: string) {
    try {
        const history = await prisma.taxHistory.findMany({
            where: { vehicleId },
            orderBy: { taxYear: 'desc' }
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Error fetching tax history:", error);
        return { success: false, error: "Gagal mengambil riwayat pajak." };
    }
}

// Update/Toggle the notification settings for a specific vehicle.
export async function toggleNotification(
    vehicleId: string,
    type: "wa" | "email",
    status: boolean
) {
    try {
        const dataToUpdate = type === "wa" ? { isWaActive: status } : { isEmailActive: status };

        const vehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: dataToUpdate
        });

        revalidatePath("/dashboard/calendar");

        return { success: true, data: vehicle };
    } catch (error) {
        console.error(`Error updating ${type} notification:`, error);
        return { success: false, error: "Gagal memperbarui pengaturan notifikasi." };
    }
}
