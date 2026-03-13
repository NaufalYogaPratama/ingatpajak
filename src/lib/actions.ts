"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Fetch a user by NIK/NPWP
 */
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

/**
 * Fetch all vehicles owned by a user
 */
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

/**
 * Fetch tax history for a specific vehicle
 */
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

/**
 * Fetch all tax histories across all vehicles for a user
 */
export async function getUserTaxHistories(userId: string) {
    try {
        const history = await prisma.taxHistory.findMany({
            where: {
                vehicle: {
                    userId: userId
                }
            },
            include: {
                vehicle: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return { success: true, data: history };
    } catch (error) {
        console.error("Error fetching user tax histories:", error);
        return { success: false, error: "Gagal mengambil seluruh riwayat pajak." };
    }
}

/**
 * Toggle notification settings for a vehicle
 */
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
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/history");

        return { success: true, data: vehicle };
    } catch (error) {
        console.error(`Error updating ${type} notification:`, error);
        return { success: false, error: "Gagal memperbarui pengaturan notifikasi." };
    }
}
/**
 * Login or Register a user
 */
export async function loginUser(nik_npwp: string, phone: string, email: string) {
    try {
        // Find or create user
        let user = await prisma.user.findUnique({
            where: { nik_npwp }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    nik_npwp,
                    phone,
                    email,
                    name: email.split("@")[0] // Fallback name
                }
            });
        }

        // Create session cookie
        const cookieStore = await cookies();
        cookieStore.set("auth_session", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Gagal melakukan login. Silakan cek data Anda." };
    }
}

/**
 * Logout user
 */
export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_session");
    redirect("/login");
}

/**
 * Get current logged in user
 */
export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("auth_session")?.value;

        if (!userId) return null;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        return user;
    } catch (error) {
        return null;
    }
}
