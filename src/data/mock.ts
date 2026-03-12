export interface User {
    id: string;
    name: string;
    nik: string;
    npwp: string;
    phone: string;
    email: string;
}

export interface Vehicle {
    id: string;
    type: "Mobil" | "Motor";
    brand: string;
    model: string;
    year: number;
    plate: string;
    pkbStatus: "AKTIF" | "MATI";
    stnkExpiry: number;
    taxDueDate: string; // ISO date string
    pkbPokok: number;
    swdkllj: number;
    totalEstimation: number;
    notification: {
        whatsapp: boolean;
        email: boolean;
    };
}

export interface TaxHistory {
    id: string;
    year: number;
    vehicleId: string;
    nominalTotal: number;
    status: "Lunas" | "Belum Lunas";
    receiptUrl?: string;
    paymentDate?: string;
}

export interface CalendarEvent {
    id: string;
    date: string; // ISO date string
    type: "Jatuh Tempo" | "Pajak Lain" | "Info";
    title: string;
    description: string;
    vehicleId?: string;
}

export interface NewsArticle {
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
    imageUrl?: string;
    url: string;
}

// ==========================================
// MOCK DATA INSTANCES
// ==========================================

export const mockUser: User = {
    id: "u1",
    name: "Nabil Subagja",
    nik: "3319012345678901",
    npwp: "123456789012345",
    phone: "08123456789",
    email: "nabil@example.com",
};

export const mockVehicles: Vehicle[] = [
    {
        id: "v1",
        type: "Mobil",
        brand: "Honda",
        model: "Jazz RS",
        year: 2018,
        plate: "K 1234 ABC",
        pkbStatus: "AKTIF",
        stnkExpiry: 2027,
        taxDueDate: "2023-11-15T00:00:00Z",
        pkbPokok: 3307000,
        swdkllj: 143000,
        totalEstimation: 3450000,
        notification: {
            whatsapp: true,
            email: true,
        },
    },
    {
        id: "v2",
        type: "Mobil",
        brand: "Daihatsu",
        model: "Gran Max Blind Van",
        year: 2020,
        plate: "K 1234 XY",
        pkbStatus: "AKTIF",
        stnkExpiry: 2025,
        taxDueDate: "2023-10-15T00:00:00Z",
        pkbPokok: 1250000,
        swdkllj: 143000,
        totalEstimation: 1393000,
        notification: {
            whatsapp: true,
            email: true,
        },
    },
    {
        id: "v3",
        type: "Motor",
        brand: "Yamaha",
        model: "NMAX",
        year: 2021,
        plate: "K 5678 XY",
        pkbStatus: "AKTIF",
        stnkExpiry: 2026,
        taxDueDate: "2023-10-20T00:00:00Z",
        pkbPokok: 415000,
        swdkllj: 35000,
        totalEstimation: 450000,
        notification: {
            whatsapp: false,
            email: true,
        },
    },
];

export const mockTaxHistories: TaxHistory[] = [
    {
        id: "th1",
        year: 2022,
        vehicleId: "v1", // Honda Jazz RS
        nominalTotal: 3450000,
        status: "Lunas",
        receiptUrl: "/docs/E-TBPKP_2022_Jazz.pdf",
        paymentDate: "2022-11-10T00:00:00Z",
    },
    {
        id: "th2",
        year: 2022,
        vehicleId: "v3", // Yamaha NMAX
        nominalTotal: 450000,
        status: "Lunas",
        receiptUrl: "/docs/E-TBPKP_2022_NMAX.pdf",
        paymentDate: "2022-10-18T00:00:00Z",
    },
    {
        id: "th3",
        year: 2021,
        vehicleId: "v1", // Honda Jazz RS
        nominalTotal: 3350000,
        status: "Lunas",
        receiptUrl: "/docs/E-TBPKP_2021_Jazz.pdf",
        paymentDate: "2021-11-12T00:00:00Z",
    },
];

export const mockCalendarEvents: CalendarEvent[] = [
    {
        id: "ce1",
        date: "2023-10-15T00:00:00Z",
        type: "Jatuh Tempo",
        title: "Pajak Mobil Gran Max",
        description: "Jatuh tempo pembayaran PKB Gran Max Blind Van",
        vehicleId: "v2",
    },
    {
        id: "ce2",
        date: "2023-10-20T00:00:00Z",
        type: "Jatuh Tempo",
        title: "Pajak Motor NMAX",
        description: "Jatuh tempo pembayaran PKB Yamaha NMAX",
        vehicleId: "v3",
    },
    {
        id: "ce3",
        date: "2023-10-10T00:00:00Z",
        type: "Pajak Lain",
        title: "PPH Final UMKM (0.5%)",
        description: "Pajak penghasilan bulanan UMKM.",
    },
];

export const mockNewsArticles: NewsArticle[] = [
    {
        id: "n1",
        title: "Sosialisasi Pajak Kendaraan Pribadi Kudus 2023",
        date: "10 Okt 2023",
        category: "Lokal Kudus",
        description: "Pemerintah Kabupaten Kudus mengadakan sosialisasi mengenai pembaruan tarif pajak...",
        url: "#",
    },
    {
        id: "n2",
        title: "Digitalisasi Pajak: Mudah Bayar Pajak Kendaraan",
        date: "05 Okt 2023",
        category: "Digital",
        description: "Tak perlu antre lagi di Samsat. Pelajari bagaimana sistem online dapat menghemat waktu berharga Anda.",
        url: "#",
    },
];
