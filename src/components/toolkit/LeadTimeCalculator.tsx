import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";

const productComplexity = [
  { id: "simple", label: "Simple (basic items)", productionDays: 14 },
  { id: "moderate", label: "Moderate (some customization)", productionDays: 21 },
  { id: "complex", label: "Complex (heavy customization)", productionDays: 35 },
  { id: "custom", label: "Fully Custom Design", productionDays: 45 },
];

const shippingOptions = [
  { id: "sea", label: "Sea Freight", days: 30 },
  { id: "air", label: "Air Freight", days: 5 },
  { id: "express", label: "Express Air", days: 2 },
  { id: "rail", label: "Rail (China-EU)", days: 20 },
];

const additionalFactors = [
  { id: "sample", label: "Sample Approval", days: 14 },
  { id: "materials", label: "Raw Material Sourcing", days: 10 },
  { id: "testing", label: "Lab Testing/Certification", days: 7 },
  { id: "customs", label: "Customs Clearance Buffer", days: 5 },
];

export function LeadTimeCalculator() {
  const [complexity, setComplexity] = useState("");
  const [shipping, setShipping] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [result, setResult] = useState<{
    phases: { name: string; days: number }[];
    totalDays: number;
    estimatedDate: Date;
  } | null>(null);

  const handleToggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const handleCalculate = () => {
    const comp = productComplexity.find(c => c.id === complexity);
    const ship = shippingOptions.find(s => s.id === shipping);
    const qty = parseInt(quantity) || 0;

    if (!comp || !ship) return;

    const phases: { name: string; days: number }[] = [];

    // Add selected pre-production factors
    selectedFactors.forEach(factorId => {
      const factor = additionalFactors.find(f => f.id === factorId);
      if (factor) {
        phases.push({ name: factor.label, days: factor.days });
      }
    });

    // Production time (scales with quantity)
    let productionDays = comp.productionDays;
    if (qty > 5000) productionDays += 7;
    if (qty > 10000) productionDays += 14;
    phases.push({ name: "Production", days: productionDays });

    // Quality inspection
    phases.push({ name: "Quality Inspection", days: 3 });

    // Shipping
    phases.push({ name: "Shipping", days: ship.days });

    const totalDays = phases.reduce((sum, p) => sum + p.days, 0);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + totalDays);

    setResult({ phases, totalDays, estimatedDate });
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Lead Time Calculator
        </CardTitle>
        <CardDescription>
          Estimate total production and delivery timelines for your orders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Product Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                {productComplexity.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Shipping Method</Label>
            <Select value={shipping} onValueChange={setShipping}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping" />
              </SelectTrigger>
              <SelectContent>
                {shippingOptions.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label} (~{s.days} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order Quantity</Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Additional Factors (select all that apply)</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {additionalFactors.map(factor => (
              <Button
                key={factor.id}
                variant={selectedFactors.includes(factor.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleFactor(factor.id)}
                className="justify-start"
              >
                {factor.label}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={!complexity || !shipping}>
          Calculate Lead Time
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Timeline Breakdown</h4>
              <div className="space-y-3">
                {result.phases.map((phase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between p-3 bg-background rounded-lg">
                      <span>{phase.name}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {phase.days} days
                      </span>
                    </div>
                    {index < result.phases.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1 border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Lead Time</p>
                  <p className="text-2xl font-bold text-primary">{result.totalDays} days</p>
                </CardContent>
              </Card>
              <Card className="flex-1 border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                  <p className="text-2xl font-bold text-primary">
                    {result.estimatedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>

            {result.totalDays > 60 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Long lead time detected. Consider air freight or starting production earlier to meet deadlines.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          * Estimates are approximate. Actual lead times may vary based on factory capacity and seasonal factors.
        </p>
      </CardContent>
    </Card>
  );
}
