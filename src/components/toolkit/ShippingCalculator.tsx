import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ship, Plane, Truck, Clock, DollarSign } from "lucide-react";

const shippingMethods = [
  { id: "sea", label: "Sea Freight", icon: Ship, days: "25-40", costMultiplier: 1 },
  { id: "air", label: "Air Freight", icon: Plane, days: "3-7", costMultiplier: 5 },
  { id: "express", label: "Express Air", icon: Plane, days: "1-3", costMultiplier: 8 },
  { id: "rail", label: "Rail Freight", icon: Truck, days: "18-25", costMultiplier: 1.5 },
];

const regions = [
  { id: "china", label: "China", baseCost: 2.50 },
  { id: "vietnam", label: "Vietnam", baseCost: 2.80 },
  { id: "india", label: "India", baseCost: 3.00 },
  { id: "bangladesh", label: "Bangladesh", baseCost: 3.20 },
  { id: "turkey", label: "Turkey", baseCost: 2.00 },
  { id: "mexico", label: "Mexico", baseCost: 1.50 },
];

export function ShippingCalculator() {
  const [origin, setOrigin] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [results, setResults] = useState<typeof shippingMethods | null>(null);

  const handleCalculate = () => {
    if (!origin || !weight) return;
    
    const region = regions.find(r => r.id === origin);
    if (!region) return;

    const weightNum = parseFloat(weight);
    const volumeNum = parseFloat(volume) || weightNum * 0.006; // Default CBM estimate
    const chargeableWeight = Math.max(weightNum, volumeNum * 167); // Volumetric weight

    setResults(shippingMethods.map(method => ({
      ...method,
      estimatedCost: Math.round(chargeableWeight * region.baseCost * method.costMultiplier),
    })));
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-primary" />
          Shipping Calculator
        </CardTitle>
        <CardDescription>
          Estimate shipping costs and timelines from different regions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Origin Region</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger>
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Volume (CBM) - Optional</Label>
            <Input
              type="number"
              placeholder="e.g., 2.5"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={!origin || !weight}>
          Calculate Shipping Options
        </Button>

        {results && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {results.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.id} className="border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{method.label}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {method.days} days
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-primary">
                          <DollarSign className="w-4 h-4" />
                          {(method as any).estimatedCost?.toLocaleString()}
                        </div>
                        <span className="text-xs text-muted-foreground">estimated</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          * Estimates are approximate and may vary based on carrier, season, and specific requirements.
        </p>
      </CardContent>
    </Card>
  );
}
