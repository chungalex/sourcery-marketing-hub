
# Phase 2 Implementation Plan: Wire Real Data to Marketplace UI

## Overview
This phase connects existing UI components to the real database, completing the inquiry-to-order funnel. The plan incorporates all 4 approved adjustments to prevent bugs and security issues.

---

## Database Pre-Work (Migration Required)

Before implementing UI changes, add server-side protection for contact form abuse:

```sql
-- Add message length constraint to prevent payload spam
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_message_len CHECK (char_length(message) <= 2000);
```

This provides server-side protection until the Edge Function with rate limiting is built.

---

## Task 1: Wire InquiryModal to Database

### File: `src/components/modals/InquiryModal.tsx`

**Changes:**

1. **Import dependencies:**
   - `supabase` client
   - `useAuth` hook  
   - `useNavigate` from react-router-dom

2. **Authentication guard with draft preservation:**
   - If user not authenticated, save form data to localStorage with namespaced key: `sourcery_inquiry_draft_${factoryId}`
   - Redirect to `/auth?mode=login&redirect=/directory/${factorySlug}`

3. **Restore draft on modal open:**
   - Check localStorage for saved draft
   - Pre-fill form fields
   - Clear localStorage after restore

4. **Autofill email from authenticated user:**
   - Set `email` state to `user.email` if available and field is empty

5. **Consistent message formatting (for future parsing):**
```text
Product Type: [productType]
Description: [productDescription]
Quantity: [quantity]
Timeline: [timeline]
Budget: [budget or "Not specified"]
Additional Notes: [message or "None"]
```

6. **Insert payload (matching schema):**
```typescript
const { error } = await supabase
  .from('inquiries')
  .insert({
    factory_id: factoryId,
    buyer_id: user.id,
    requester_name: name,
    requester_email: email,
    message: formattedMessage,
    // Let DB defaults handle: status='new', conversion_status='new'
  });
```

7. **Success state:**
   - Show "Track in Dashboard" button linking to `/dashboard?tab=inquiries`
   - Clear localStorage draft on success

---

## Task 2: Wire Contact Page to Database

### File: `src/pages/Contact.tsx`

**Changes:**

1. **Add state for honeypot:**
```typescript
const [honeypot, setHoneypot] = useState("");
```

2. **Add hidden honeypot field (invisible to users, bots fill it):**
```tsx
<div className="absolute opacity-0 -z-10 pointer-events-none" aria-hidden="true">
  <Label htmlFor="website">Website</Label>
  <Input 
    id="website" 
    name="website" 
    tabIndex={-1}
    autoComplete="off"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
  />
</div>
```

3. **Update handleSubmit:**
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Honeypot check - silently "succeed" if filled (bot detected)
  if (honeypot) {
    setIsSubmitted(true);
    return;
  }
  
  // Rate limit: 60 seconds between submissions
  const lastSubmit = localStorage.getItem('sourcery_contact_last_submit');
  if (lastSubmit && Date.now() - parseInt(lastSubmit) < 60000) {
    toast({
      title: "Please wait",
      description: "You can submit again in a moment.",
      variant: "destructive"
    });
    return;
  }
  
  setIsSubmitting(true);
  
  const formData = new FormData(e.currentTarget);
  const fullName = `${formData.get('firstName')} ${formData.get('lastName')}`.trim();
  const email = formData.get('email') as string;
  const company = formData.get('company') as string;
  const message = formData.get('message') as string;
  
  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: fullName,
      email: email,
      company: company || null,
      message: message,
      form_type: formType
    });
  
  setIsSubmitting(false);
  
  if (error) {
    // Handle specific errors
    if (error.message.includes('valid_email')) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
    } else if (error.message.includes('contact_message_len')) {
      toast({ title: "Message too long", description: "Please keep your message under 2000 characters.", variant: "destructive" });
    } else {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
    return;
  }
  
  localStorage.setItem('sourcery_contact_last_submit', Date.now().toString());
  setIsSubmitted(true);
  toast({
    title: "Message sent!",
    description: formType === "consulting" 
      ? "A consultant will reach out within 24 hours."
      : "We'll get back to you within 24 hours."
  });
};
```

---

## Task 3: Wire BrandDashboard to Real Data

### File: `src/pages/BrandDashboard.tsx`

**Major changes:**

1. **Add authentication guard:**
```typescript
const { user, isLoading: authLoading } = useAuth();
const navigate = useNavigate();
const [searchParams] = useSearchParams();

useEffect(() => {
  if (!authLoading && !user) {
    navigate('/auth?redirect=/dashboard');
  }
}, [user, authLoading, navigate]);
```

2. **Use new hooks for data fetching:**
```typescript
const { inquiries, isLoading: inquiriesLoading, refetch: refetchInquiries } = useInquiries();
const { orders, isLoading: ordersLoading, refetch: refetchOrders } = useOrders();
```

3. **Update status mappings to match 4-state enum:**
```typescript
const getStatusIcon = (status: string) => {
  switch (status) {
    case "new":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "replied":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "declined":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "closed":
      return <CheckCircle className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "new": return "Awaiting Response";
    case "replied": return "Factory Replied";
    case "declined": return "Declined";
    case "closed": return "Closed";
    default: return status;
  }
};
```

4. **Convert button eligibility (primary check is order_id is null):**
```typescript
const canConvert = (inquiry: InquiryWithFactory) => {
  return (
    inquiry.order_id === null &&           // Primary: not already converted
    inquiry.factory_id !== null &&          // Has factory to convert to
    inquiry.conversion_status !== 'declined' // Not declined
  );
};
```

5. **Convert handler with correct navigation:**
```typescript
const [converting, setConverting] = useState<string | null>(null);

const handleConvert = async (inquiryId: string) => {
  setConverting(inquiryId);
  
  const { data, error } = await supabase.functions.invoke('convert-inquiry-to-order', {
    body: { inquiry_id: inquiryId }
  });
  
  if (error || !data?.success) {
    toast.error(data?.error || 'Failed to convert inquiry');
    setConverting(null);
    return;
  }
  
  toast.success(`Order ${data.order_number} created!`);
  refetchInquiries();
  refetchOrders();
  
  // Navigate to orders tab with highlight (no /orders/:id route exists yet)
  navigate(`/dashboard?tab=orders&highlight=${data.order_id}`);
};
```

6. **Orders tab with proper price handling (no "Edit Draft" to /orders/create):**
```tsx
<TabsContent value="orders" className="space-y-4">
  {ordersLoading ? (
    <OrdersSkeleton />
  ) : orders.length > 0 ? (
    <div className="space-y-4">
      {orders.map((order) => {
        const priceInfo = formatOrderPrice(order);
        const isHighlighted = searchParams.get('highlight') === order.id;
        
        return (
          <div
            key={order.id}
            className={cn(
              "bg-card border rounded-xl p-6",
              isHighlighted && "border-primary ring-2 ring-primary/20"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-1">
                  {order.order_number}
                </div>
                {order.factories ? (
                  <Link 
                    to={`/directory/${order.factories.slug}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {order.factories.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Factory unavailable</span>
                )}
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            
            {/* Price display with unit_price=0 handling */}
            <div className="text-sm text-muted-foreground mb-4">
              {priceInfo.showTotal ? (
                <>
                  <span>{priceInfo.priceDisplay}</span>
                  <span className="font-semibold text-foreground ml-2">
                    = {priceInfo.totalDisplay}
                  </span>
                </>
              ) : (
                <span className="text-amber-600 font-medium">
                  {order.quantity.toLocaleString()} units • Price not set
                </span>
              )}
            </div>
            
            {/* Milestone Progress */}
            <MilestoneProgress milestones={order.order_milestones || []} />
            
            {/* Actions - NO Edit Draft to /orders/create */}
            <div className="flex gap-2 mt-4">
              {order.status === 'draft' && (
                <Button size="sm" variant="outline">
                  View Draft
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <EmptyOrdersState />
  )}
</TabsContent>
```

7. **Price formatting helper:**
```typescript
const formatOrderPrice = (order: OrderWithDetails) => {
  if (!order.unit_price || order.unit_price === 0) {
    return {
      priceDisplay: null,
      totalDisplay: null,
      showTotal: false
    };
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: order.currency || 'USD'
  });
  
  return {
    priceDisplay: `${order.quantity.toLocaleString()} × ${formatter.format(order.unit_price)}`,
    totalDisplay: formatter.format(order.total_amount || order.quantity * order.unit_price),
    showTotal: true
  };
};
```

---

## Task 4: Create useInquiries Hook

### New File: `src/hooks/useInquiries.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface InquiryWithFactory {
  id: string;
  factory_id: string | null;
  requester_name: string;
  requester_email: string;
  message: string | null;
  status: string;
  conversion_status: 'new' | 'replied' | 'converted' | 'declined';
  order_id: string | null;
  created_at: string;
  factories: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
}

export function useInquiries() {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['inquiries', user?.id],
    queryFn: async (): Promise<InquiryWithFactory[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('inquiries')
        .select(`
          id, factory_id, requester_name, requester_email,
          message, status, conversion_status, order_id, created_at,
          factories (id, name, slug, logo_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as InquiryWithFactory[];
    },
    enabled: !!user
  });
  
  return {
    inquiries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
```

---

## Task 5: Create useOrders Hook

### New File: `src/hooks/useOrders.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderMilestone {
  id: string;
  label: string;
  status: string;
  percentage: number;
  sequence_order: number;
}

export interface OrderWithDetails {
  id: string;
  order_number: string;
  status: string;
  quantity: number;
  unit_price: number;
  total_amount: number | null;
  currency: string;
  created_at: string;
  factories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  order_milestones: OrderMilestone[];
}

export function useOrders() {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<OrderWithDetails[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, quantity, unit_price,
          total_amount, currency, created_at,
          factories (id, name, slug),
          order_milestones (id, label, status, percentage, sequence_order)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as OrderWithDetails[];
    },
    enabled: !!user
  });
  
  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
```

---

## Summary of Files to Change

| File | Type | Description |
|------|------|-------------|
| Migration | Create | Add `contact_message_len` constraint (max 2000 chars) |
| `src/hooks/useInquiries.ts` | Create | Typed inquiry fetching with TanStack Query |
| `src/hooks/useOrders.ts` | Create | Typed order fetching with TanStack Query |
| `src/components/modals/InquiryModal.tsx` | Modify | Auth guard, localStorage draft, DB insert, autofill email |
| `src/pages/Contact.tsx` | Modify | DB insert, honeypot field, rate limiting, error handling |
| `src/pages/BrandDashboard.tsx` | Modify | Auth guard, real data, convert flow, highlight, proper status labels |

---

## Acceptance Criteria

### InquiryModal
- Authenticated users can submit (saved with `buyer_id = auth.uid()`)
- Anonymous users redirected; draft saved to namespaced localStorage key
- Draft restored and form pre-filled after login
- `requester_email` autofilled from `user.email`
- Message formatted consistently for future parsing
- Success state shows "Track in Dashboard" CTA

### BrandDashboard - Inquiries
- Shows only current user's inquiries
- Status labels: Awaiting Response / Factory Replied / Declined / Closed
- Convert button shows when `order_id is null` AND `factory_id not null` AND `conversion_status !== 'declined'`
- Convert calls Edge Function, navigates to `/dashboard?tab=orders&highlight={id}`

### BrandDashboard - Orders
- Shows only current user's orders
- Price shown as amber "Price not set" when `unit_price = 0`
- No "Edit Draft" button linking to `/orders/create` (just "View Draft" for now)
- Newly created order highlighted via URL parameter
- Milestone progress displayed

### Contact Form
- Submissions saved to `contact_submissions` table
- Honeypot field blocks bots silently
- Client-side rate limiting (60 seconds)
- Server-side message length limit (2000 chars via DB constraint)
- Email constraint errors show helpful message

---

## Edge Cases Handled

1. **No inquiries** - Empty state with CTA to browse factories
2. **No orders** - Empty state with explanation
3. **Inquiry converted** - Button hidden, conversion badge shown
4. **Factory deleted** - Show "Factory unavailable" with null check
5. **Session expires** - Redirect to login, preserve draft
6. **Price not set** - Amber "Price not set" instead of $0
7. **Message too long** - Friendly error from DB constraint
8. **Bot submission** - Honeypot silently "succeeds" without insert

---

## Not In Scope (Future Tasks)

- Order detail/edit page (`/orders/:id`) - needed for true draft editing
- Factory reply workflow via Edge Function
- Contact form Edge Function with server-side rate limiting
- Structured inquiry fields (jsonb `details` column)
