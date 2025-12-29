import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, Plus, Trash2, Download, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const templateCategories = [
  {
    id: "apparel",
    label: "Apparel",
    items: [
      "Fabric weight matches specification",
      "Color matches approved sample",
      "Stitching is consistent and secure",
      "Labels are correctly positioned",
      "Sizing matches size chart",
      "No visible defects or stains",
      "Zipper/buttons function properly",
      "Packaging meets requirements",
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    items: [
      "Product powers on correctly",
      "All functions work as specified",
      "No physical damage or scratches",
      "Cables and accessories included",
      "Labeling and certifications present",
      "Packaging is protective and correct",
      "User manual included",
      "Safety certifications verified",
    ],
  },
  {
    id: "general",
    label: "General Product",
    items: [
      "Product matches approved sample",
      "Dimensions are within tolerance",
      "Weight matches specification",
      "No visible defects",
      "Packaging is correct",
      "Labeling is accurate",
      "Quantity matches order",
      "Documentation complete",
    ],
  },
];

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export function QualityChecklistBuilder() {
  const [productName, setProductName] = useState("");
  const [template, setTemplate] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");

  const handleLoadTemplate = (templateId: string) => {
    const selected = templateCategories.find(t => t.id === templateId);
    if (selected) {
      setItems(selected.items.map((text, i) => ({
        id: `item-${i}`,
        text,
        checked: false,
      })));
    }
    setTemplate(templateId);
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: `item-${Date.now()}`, text: newItem, checked: false }]);
    setNewItem("");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCopyChecklist = () => {
    const checklistText = items.map(item => `[ ] ${item.text}`).join("\n");
    const fullText = `Quality Checklist: ${productName || "Product"}\n${"=".repeat(40)}\n\n${checklistText}`;
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copied!",
      description: "Checklist copied to clipboard",
    });
  };

  const completedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          Quality Checklist Builder
        </CardTitle>
        <CardDescription>
          Create custom inspection checklists for factory audits and quality control
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Product Name</Label>
            <Input
              placeholder="e.g., Cotton T-Shirt Spring 2024"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Start from Template</Label>
            <Select value={template} onValueChange={handleLoadTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label} ({cat.items.length} items)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Checklist Items ({completedCount}/{items.length})</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyChecklist}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg group"
                >
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => handleToggleItem(item.id)}
                  />
                  <span className={`flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add custom checklist item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
          />
          <Button onClick={handleAddItem} disabled={!newItem.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Tip: Use templates as a starting point, then customize with your specific requirements.
        </p>
      </CardContent>
    </Card>
  );
}
