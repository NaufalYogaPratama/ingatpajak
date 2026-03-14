"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

/**
 * Add a new vehicle for the current user
 */
export async function addVehicle(data: {
    plateNumber: string;
    type: string;
    brandModel: string;
    manufactureYear: number;
    taxDueDate: string | Date;
    estimatedCost: number;
}) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const vehicle = await prisma.vehicle.create({
            data: {
                ...data,
                userId: user.id,
                taxDueDate: new Date(data.taxDueDate),
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/history");
        revalidatePath("/dashboard/calendar");

        return { success: true, data: vehicle };
    } catch (error) {
        console.error("Error adding vehicle:", error);
        return { success: false, error: "Gagal menambah kendaraan. Plat nomor mungkin sudah terdaftar." };
    }
}

/**
 * Delete a vehicle owned by the current user
 */
export async function deleteVehicle(vehicleId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        // Verify ownership
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle || vehicle.userId !== user.id) {
            return { success: false, error: "Kendaraan tidak ditemukan atau Anda tidak memiliki akses." };
        }

        // Delete (Note: TaxHistory has ON DELETE CASCADE if configured, otherwise needs manual cleanup)
        // Check schema.prisma to be sure. If not, delete histories first.
        await prisma.taxHistory.deleteMany({
            where: { vehicleId }
        });

        await prisma.vehicle.delete({
            where: { id: vehicleId }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/history");
        revalidatePath("/dashboard/calendar");

        return { success: true };
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return { success: false, error: "Gagal menghapus kendaraan." };
    }
}

/**
 * Upload a tax payment proof to Supabase and update the record
 */
export async function uploadTaxProof(historyId: string, formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "Tidak ada file yang dipilih." };

        // 1. Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${historyId}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("documents")
            .upload(filePath, file);

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return { success: false, error: "Gagal mengunggah file ke storage." };
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("documents")
            .getPublicUrl(filePath);

        // 3. Update Prisma record
        await prisma.taxHistory.update({
            where: { id: historyId },
            data: { proofUrl: publicUrl }
        });

        revalidatePath("/dashboard/history");
        revalidatePath("/dashboard");

        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Error uploading tax proof:", error);
        return { success: false, error: "Terjadi kesalahan saat menyimpan bukti." };
    }
}

/**
 * Mark a vehicle tax as paid, update its due date, and create a history record.
 */
export async function markAsPaid(vehicleId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle || vehicle.userId !== user.id) {
            return { success: false, error: "Kendaraan tidak ditemukan." };
        }

        const currentDueDate = new Date(vehicle.taxDueDate);
        const nextDueDate = new Date(currentDueDate);
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);

        // Transaction to ensure both update and create happen
        await prisma.$transaction([
            // 1. Create Tax History
            prisma.taxHistory.create({
                data: {
                    vehicleId: vehicle.id,
                    taxYear: currentDueDate.getFullYear(),
                    amount: vehicle.estimatedCost,
                    status: "Lunas",
                }
            }),
            // 2. Update Vehicle next due date
            prisma.vehicle.update({
                where: { id: vehicle.id },
                data: {
                    taxDueDate: nextDueDate
                }
            })
        ]);

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/history");
        revalidatePath("/dashboard/calendar");

        return { success: true };
    } catch (error) {
        console.error("Error marking as paid:", error);
        return { success: false, error: "Gagal memperbarui status pembayaran." };
    }
}
