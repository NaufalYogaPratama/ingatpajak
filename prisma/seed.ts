import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { mockUser, mockVehicles, mockTaxHistories } from "../src/data/mock";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL }) as any;
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting seeding...");

    // 1. Clean existing data (Optional: use with caution in production)
    // We clean in reverse order of dependencies
    await prisma.taxHistory.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    console.log("Cleaned existing data.");

    // 2. Seed User
    const user = await prisma.user.create({
        data: {
            id: mockUser.id,
            nik_npwp: mockUser.nik, // Using NIK as primary identifier
            name: mockUser.name,
            phone: mockUser.phone,
            email: mockUser.email,
        },
    });
    console.log(`Created user: ${user.name}`);

    // 3. Seed Vehicles
    for (const vehicle of mockVehicles) {
        const createdVehicle = await prisma.vehicle.create({
            data: {
                id: vehicle.id,
                userId: user.id,
                plateNumber: vehicle.plate,
                type: vehicle.type,
                brandModel: `${vehicle.brand} ${vehicle.model}`,
                manufactureYear: vehicle.year,
                taxDueDate: new Date(vehicle.taxDueDate),
                estimatedCost: vehicle.totalEstimation,
                isWaActive: vehicle.notification.whatsapp,
                isEmailActive: vehicle.notification.email,
            },
        });
        console.log(`Created vehicle: ${createdVehicle.plateNumber}`);
    }

    // 4. Seed Tax Histories
    for (const history of mockTaxHistories) {
        const createdHistory = await prisma.taxHistory.create({
            data: {
                id: history.id,
                vehicleId: history.vehicleId,
                taxYear: history.year,
                amount: history.nominalTotal,
                status: history.status,
                proofUrl: history.receiptUrl || null,
            },
        });
        console.log(`Created tax history for vehicle ${history.vehicleId} (Year: ${history.year})`);
    }

    console.log("Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
