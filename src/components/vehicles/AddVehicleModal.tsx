"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVehicle } from "@/lib/actions";
import { toast } from "sonner";

export default function AddVehicleModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            plateNumber: formData.get("plateNumber") as string,
            type: formData.get("type") as string,
            brandModel: formData.get("brandModel") as string,
            manufactureYear: parseInt(formData.get("manufactureYear") as string),
            taxDueDate: formData.get("taxDueDate") as string,
            estimatedCost: parseFloat(formData.get("estimatedCost") as string),
        };

        try {
            const result = await addVehicle(data);
            if (result.success) {
                toast.success("Kendaraan berhasil ditambahkan!");
                setOpen(false);
            } else {
                toast.error(result.error || "Gagal menambah kendaraan.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Kendaraan
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
                    <DialogDescription>
                        Masukkan detail kendaraan Anda untuk mulai memantau jadwal pajak.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plateNumber" className="text-right">
                            Plat Nomor
                        </Label>
                        <Input
                            id="plateNumber"
                            name="plateNumber"
                            placeholder="K 1234 AB"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Jenis
                        </Label>
                        <Input
                            id="type"
                            name="type"
                            placeholder="Mobil / Motor"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brandModel" className="text-right">
                            Merk / Model
                        </Label>
                        <Input
                            id="brandModel"
                            name="brandModel"
                            placeholder="Honda Jazz"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="manufactureYear" className="text-right">
                            Tahun
                        </Label>
                        <Input
                            id="manufactureYear"
                            name="manufactureYear"
                            type="number"
                            placeholder="2020"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="taxDueDate" className="text-right">
                            Jatuh Tempo
                        </Label>
                        <Input
                            id="taxDueDate"
                            name="taxDueDate"
                            type="date"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estimatedCost" className="text-right">
                            Estimasi PKB
                        </Label>
                        <Input
                            id="estimatedCost"
                            name="estimatedCost"
                            type="number"
                            placeholder="2500000"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Kendaraan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
