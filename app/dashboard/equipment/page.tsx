import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipment } from "@/actions/getEquipment";

export default async function EquipmentPage() {
    const equipment = await getEquipment();

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Equipment Assets</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {equipment.map((item) => (
                    <Card key={item.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.name}
                            </CardTitle>
                            <div className={`w-3 h-3 rounded-full ${item.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.type}</div>
                            <p className="text-xs text-muted-foreground">{item.location}</p>
                        </CardContent>
                    </Card>
                ))}
                {equipment.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">No equipment found.</p>
                )}
            </div>
        </div>
    );
}
