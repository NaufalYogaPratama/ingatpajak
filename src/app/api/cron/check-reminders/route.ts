import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { addDays, isSameDay, startOfDay } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
    // Optional: Check for Cron Secret to prevent unauthorized access
    // if (req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }

    try {
        const today = startOfDay(new Date());
        const daysToCheck = [30, 7, 1];

        // Fetch all vehicles with email notifications enabled
        const vehicles = await prisma.vehicle.findMany({
            where: {
                isEmailActive: true,
                user: {
                    email: { not: null }
                }
            },
            include: {
                user: true
            }
        });

        const results = {
            totalChecked: vehicles.length,
            emailsSent: 0,
            skipped: 0,
            errors: [] as string[]
        };

        for (const vehicle of vehicles) {
            const dueDate = startOfDay(new Date(vehicle.taxDueDate));

            // Check if due date matches any of our thresholds
            const match = daysToCheck.find(days => {
                const targetDate = addDays(today, days);
                return isSameDay(dueDate, targetDate);
            });

            if (match) {
                try {
                    const { data, error } = await resend.emails.send({
                        from: "IngatPajak <onauditing@resend.dev>", // Replace with your verified domain in production
                        to: [vehicle.user.email as string],
                        subject: `[PENTING] Pengingat Pajak Kendaraan: ${vehicle.plateNumber}`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                                <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">Halo, ${vehicle.user.name || "Pemilik Kendaraan"}!</h1>
                                <p style="font-size: 16px; color: #475569; line-height: 1.5;">
                                    Kami ingin menginformasikan bahwa pajak kendaraan Anda akan segera jatuh tempo dalam <strong>${match} hari</strong>.
                                </p>
                                <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
                                    <p style="margin: 0; font-size: 14px; color: #64748b;">Detail Kendaraan:</p>
                                    <p style="margin: 4px 0; font-size: 18px; font-weight: bold; color: #1e293b;">${vehicle.brandModel}</p>
                                    <p style="margin: 4px 0; font-size: 16px; color: #1e293b;">Plat Nomor: ${vehicle.plateNumber}</p>
                                    <p style="margin: 4px 0; font-size: 16px; color: #1e293b;">Estimasi Biaya: Rp ${vehicle.estimatedCost.toLocaleString("id-ID")}</p>
                                </div>
                                <p style="font-size: 16px; color: #475569; line-height: 1.5;">
                                    Segera lakukan pembayaran melalui e-Samsat atau gerai terdekat untuk menghindari denda administratif.
                                </p>
                                <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
                                    &copy; ${new Date().getFullYear()} IngatPajak - Solusi Pintar Kelola Pajak Kendaraan.
                                </div>
                            </div>
                        `,
                    });

                    if (error) {
                        results.errors.push(`Error sending to ${vehicle.user.email}: ${error.message}`);
                    } else {
                        results.emailsSent++;
                    }
                } catch (err: any) {
                    results.errors.push(`System error for ${vehicle.user.email}: ${err.message}`);
                }
            } else {
                results.skipped++;
            }
        }

        return NextResponse.json({ success: true, ...results });
    } catch (error: any) {
        console.error("Cron Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
