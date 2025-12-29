import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Info, DollarSign, Percent } from "lucide-react";

const productCategories = [
  { id: "apparel", label: "Apparel & Textiles", dutyRate: 12, hsCode: "61-62" },
  { id: "footwear", label: "Footwear", dutyRate: 20, hsCode: "64" },
  { id: "electronics", label: "Electronics", dutyRate: 0, hsCode: "85" },
  { id: "furniture", label: "Furniture", dutyRate: 0, hsCode: "94" },
  { id: "toys", label: "Toys & Games", dutyRate: 0, hsCode: "95" },
  { id: "accessories", label: "Accessories & Jewelry", dutyRate: 6.5, hsCode: "71" },
  { id: "bags", label: "Bags & Luggage", dutyRate: 17.6, hsCode: "42" },
  { id: "cosmetics", label: "Cosmetics", dutyRate: 0, hsCode: "33" },
];

const destinations = [
  { id: "us", label: "United States", vatRate: 0, processingFee: 25 },
  { id: "uk", label: "United Kingdom", vatRate: 20, processingFee: 30 },
  { id: "eu", label: "European Union", vatRate: 21, processingFee: 35 },
  { id: "ca", label: "Canada", vatRate: 5, processingFee: 20 },
  { id: "au", label: "Australia", vatRate: 10, processingFee: 50 },
];

export function ImportDutyCalculator() {
  const [category, setCategory] = useState("");
  const [destination, setDestination] = useState("");
  const [productValue, setProductValue] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [result, setResult] = useState<{
    duty: number;
    vat: number;
    fees: number;
    total: number;
    landedCost: number;
  } | null>(null);

  const handleCalculate = () => {
    const cat = productCategories.find(c => c.id === category);
    const dest = destinations.find(d => d.id === destination);
    const value = parseFloat(productValue);
    const shipping = parseFloat(shippingCost) || 0;

    if (!cat || !dest || !value) return;

    const cifValue = value + shipping;
    const duty = cifValue * (cat.dutyRate / 100);
    const vatableAmount = cifValue + duty;
    const vat = vatableAmount * (dest.vatRate / 100);
    const fees = dest.processingFee;
    const total = duty + vat + fees;
    const landedCost = cifValue + total;

    setResult({ duty, vat, fees, total, landedCost });
  };

  const selectedCategory = productCategories.find(c => c.id === category);

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Import Duty Calculator
        </CardTitle>
        <CardDescription>
          Estimate duties, taxes, and landed costs for your imports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {productCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label} (HS {cat.hsCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Base duty rate: {selectedCategory.dutyRate}%
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Destination Country</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map(dest => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Product Value (USD)</Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={productValue}
              onChange={(e) => setProductValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Shipping Cost (USD)</Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleCalculate} disabled={!category || !destination || !productValue}>
          Calculate Duties & Taxes
        </Button>

        {result && (
          <div className="bg-muted/30 rounded-xl p-6 space-y-4">
            <h4 className="font-semibold text-lg">Cost Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Import Duty</span>
                <span className="font-medium">${result.duty.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">VAT / GST</span>
                <span className="font-medium">${result.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Processing Fees</span>
                <span className="font-medium">${result.fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">Total Duties & Taxes</span>
                <span className="font-bold text-primary">${result.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-3 mt-4">
                <span className="font-semibold">Estimated Landed Cost</span>
                <span className="text-xl font-bold text-primary">${result.landedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          * Estimates are approximate. Actual duties may vary based on specific HS codes and trade agreements.
        </p>
      </CardContent>
    </Card>
  );
}
