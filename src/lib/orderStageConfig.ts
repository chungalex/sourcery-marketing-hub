// ─── Order Stage Configuration ────────────────────────────────────────────────
// Controls which components render at each order status.
// This is the single source of truth for progressive disclosure in OrderDetail.
// Add a component to a stage only when it provides genuine value at that stage.

export type OrderStatus =
  | "draft"
  | "po_issued"
  | "po_accepted"
  | "sampling"
  | "sample_approved"
  | "in_production"
  | "qc_pending"
  | "qc_approved"
  | "ready_to_ship"
  | "shipped"
  | "closed"
  | "cancelled";

export interface StageConfig {
  // Human-readable stage name
  label: string;
  // What the brand should be focused on at this stage
  focus: string;
  // Components to show in main column
  mainComponents: string[];
  // Components to show in right column
  sideComponents: string[];
  // Intelligence widgets to show
  intelligenceComponents: string[];
}

export const ORDER_STAGE_CONFIG: Record<OrderStatus, StageConfig> = {
  draft: {
    label: "Draft",
    focus: "Complete your order details and tech pack before issuing to your factory.",
    mainComponents: [
      "ProactiveGuidance",
      "OrderStatusGuide",
      "TechPackVersions",      // Critical — needs to be complete before PO
      "OrderSKUs",             // What are they making
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
    ],
    intelligenceComponents: [], // Nothing useful at draft stage
  },

  po_issued: {
    label: "PO Issued",
    focus: "Waiting for your factory to accept. Follow up if no response in 3 days.",
    mainComponents: [
      "ProactiveGuidance",     // Will fire "silent factory" alert if no response
      "OrderStatusGuide",
      "TechPackVersions",
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",        // First message template + follow-up drafts
      "PlatformMessaging",
    ],
    intelligenceComponents: [
      "ProductionCountdown",   // Show the timeline from day one
    ],
  },

  po_accepted: {
    label: "PO Accepted",
    focus: "Factory has accepted. Confirm sampling timeline and deposit release.",
    mainComponents: [
      "ProactiveGuidance",
      "OrderStatusGuide",
      "TechPackVersions",
      "BillOfMaterials",       // Confirm materials before production starts
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "OrderChatSummary",
    ],
    intelligenceComponents: [
      "ProductionCountdown",
    ],
  },

  sampling: {
    label: "Sampling",
    focus: "Sample is being made. Prepare your review criteria before it arrives.",
    mainComponents: [
      "ProactiveGuidance",
      "SampleReviewPanel",     // Core of this stage
      "RevisionRounds",        // Track revision history
      "TechPackVersions",      // Reference specs during review
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "OrderChatSummary",
      "TimezoneApproval",      // Approvals across timezones
    ],
    intelligenceComponents: [
      "ProductionCountdown",
    ],
  },

  sample_approved: {
    label: "Sample Approved",
    focus: "Sample approved. Release production payment and confirm bulk start date.",
    mainComponents: [
      "ProactiveGuidance",
      "OrderStatusGuide",
      "BillOfMaterials",       // Confirm all materials confirmed for bulk
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
    ],
    intelligenceComponents: [
      "ProductionCountdown",
    ],
  },

  in_production: {
    label: "In Production",
    focus: "Bulk production running. Monitor progress and watch for timeline drift.",
    mainComponents: [
      "ProactiveGuidance",     // Most important stage for AI alerts
      "ProductionPhotoLog",    // Factory uploads progress photos
      "OrderSKUs",             // SKU-level production status
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "OrderChatSummary",
      "TimezoneApproval",
    ],
    intelligenceComponents: [
      "ProductionCountdown",   // Critical here — days to delivery
    ],
  },

  qc_pending: {
    label: "QC Pending",
    focus: "Production complete. QC inspection needs to happen before final payment.",
    mainComponents: [
      "ProactiveGuidance",     // Will fire payment gate checklist alert
      "DefectReports",         // Core of this stage
      "ProductionPhotoLog",
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "DisputeFiling",         // Available if QC reveals serious issues
    ],
    intelligenceComponents: [
      "ProductionCountdown",
    ],
  },

  qc_approved: {
    label: "QC Approved",
    focus: "QC passed. Confirm shipping arrangements and release final payment.",
    mainComponents: [
      "ProactiveGuidance",
      "DefectReports",         // Show what passed
      "FreightChecklist",      // Prepare shipping docs
      "ShipmentDocs",
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "OrderExportPDF",        // Export order documents
    ],
    intelligenceComponents: [
      "ProductionCountdown",
    ],
  },

  ready_to_ship: {
    label: "Ready to Ship",
    focus: "Goods are ready. Confirm carrier and get shipping confirmation.",
    mainComponents: [
      "ProactiveGuidance",
      "ShipmentTracker",       // Core of this stage
      "FreightChecklist",
      "ShipmentDocs",
      "OrderTimeline",
    ],
    sideComponents: [
      "MessageDrafter",
      "PlatformMessaging",
      "OrderExportPDF",
    ],
    intelligenceComponents: [],
  },

  shipped: {
    label: "Shipped",
    focus: "Goods in transit. Track delivery and prepare for receiving.",
    mainComponents: [
      "ShipmentTracker",       // Core of this stage
      "ShipmentDocs",
      "OrderTimeline",
    ],
    sideComponents: [
      "PlatformMessaging",
      "OrderExportPDF",
    ],
    intelligenceComponents: [],
  },

  closed: {
    label: "Closed",
    focus: "Order complete. Review performance and plan your next order.",
    mainComponents: [
      "OrderTimeline",         // Full history
      "DefectReports",         // Final QC record
      "FactoryReview",         // Rate this factory
      "ComplianceExport",      // Generate compliance docs
      "OrderExportPDF",
    ],
    sideComponents: [
      "SafetyStockCalculator", // Now useful — real lead time data exists
      "ReorderIntelligence",   // When to order again
      "ReorderButton",
    ],
    intelligenceComponents: [
      "SafetyStockCalculator",
      "ReorderIntelligence",
    ],
  },

  cancelled: {
    label: "Cancelled",
    focus: "Order cancelled.",
    mainComponents: [
      "OrderTimeline",
      "DisputeFiling",         // If cancellation is disputed
    ],
    sideComponents: [],
    intelligenceComponents: [],
  },
};

// Helper: get all components for a status
export function getComponentsForStatus(status: OrderStatus) {
  const config = ORDER_STAGE_CONFIG[status] || ORDER_STAGE_CONFIG.draft;
  return {
    ...config,
    allComponents: [
      ...config.mainComponents,
      ...config.sideComponents,
      ...config.intelligenceComponents,
    ],
  };
}

// Helper: should a component show for a given status?
export function shouldShow(componentName: string, status: OrderStatus): boolean {
  const config = getComponentsForStatus(status);
  return config.allComponents.includes(componentName);
}
