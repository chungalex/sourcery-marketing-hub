import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Package, Ship, FileText, AlertCircle } from "lucide-react";

interface CostBreakdown {
  unitCost: number;
  quantity: number;
  subtotal: number;
  shippingCost: number;
  dutiesAndTaxes: number;
  insuranceCost: number;
  handlingFees: number;
  totalLandedCost: number;
  costPerUnit: number;
}

const shippingMethods = [
  { id: "sea", label: "Sea Freight", multiplier: 0.08 },
  { id: "air", label: "Air Freight", multiplier: 0.25 },
  { id: "express", label: "Express Air", multiplier: 0.40 },
];

const destinations = [
  { id: "us", label: "United States", dutyRate: 0.12 },
  { id: "eu", label: "European Union", dutyRate: 0.15 },
  { id: "uk", label: "United Kingdom", dutyRate: 0.14 },
  { id: "ca", label: "Canada", dutyRate: 0.10 },
  { id: "au", label: "Australia", dutyRate: 0.05 },
];

export function CostCalculator({ className }: { className?: string }) {
  const [unitCost, setUnitCost] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("sea");
  const [destination, setDestination] = useState<string>("us");
  const [productWeight, setProductWeight] = useState<string>("");
  const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null);

  const handleCalculate = () => {
    const unit = parseFloat(unitCost) || 0;
    const qty = parseInt(quantity) || 0;
    const weight = parseFloat(productWeight) || 0;
    
    const shipping = shippingMethods.find(s => s.id === shippingMethod);
    const dest = destinations.find(d => d.id === destination);
    
    const subtotal = unit * qty;
    const shippingCost = subtotal * (shipping?.multiplier || 0.08) + (weight * qty * 0.5);
    const dutiesAndTaxes = subtotal * (dest?.dutyRate || 0.12);
    const insuranceCost = subtotal * 0.015;
    const handlingFees = Math.max(50, subtotal * 0.02);
    
    const totalLandedCost = subtotal + shippingCost + dutiesAndTaxes + insuranceCost + handlingFees;
    const costPerUnit = qty > 0 ? totalLandedCost / qty : 0;

    setBreakdown({
      unitCost: unit,
      quantity: qty,
      subtotal,
      shippingCost,
      dutiesAndTaxes,
      insuranceCost,
      handlingFees,
      totalLandedCost,
      costPerUnit,
    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Landed Cost Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimate your total costs including shipping, duties, and fees
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitCost">Unit Cost (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="unitCost"
                      type="number"
                      placeholder="0.00"
                      value={unitCost}
                      onChange={(e) => setUnitCost(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1000"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Product Weight (kg per unit)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.5"
                  value={productWeight}
                  onChange={(e) => setProductWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Shipping Method</Label>
                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <Ship className="w-4 h-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id}>
                        {dest.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCalculate} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Landed Cost
              </Button>
            </div>

            {/* Results */}
            <div>
              {breakdown ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-muted/50 rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-foreground mb-4">Cost Breakdown</h3>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product Subtotal</span>
                      <span className="font-medium">${breakdown.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${breakdown.shippingCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duties & Taxes</span>
                      <span className="font-medium">${breakdown.dutiesAndTaxes.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-medium">${breakdown.insuranceCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Handling Fees</span>
                      <span className="font-medium">${breakdown.handlingFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total Landed Cost</span>
                        <span className="font-bold text-lg text-primary">
                          ${breakdown.totalLandedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Cost Per Unit</span>
                        <span className="font-medium text-primary">
                          ${breakdown.costPerUnit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      This is an estimate. Actual costs may vary based on specific product classifications, trade agreements, and current rates.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8 bg-muted/30 rounded-xl">
                  <div>
                    <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Enter your product details to see a complete cost breakdown
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
