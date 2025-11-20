export type UUID = string;

export type Policy = {
    id: UUID;
    user_id: UUID;
    policy_number: string;
    insurance_company: string;
    policy_type: "life" | "health" | "motor" | "home" | "travel" | "other";
    policy_name?: string | null;
    sum_assured?: number | null;
    premium_amount: number;
    premium_frequency: "monthly" | "quarterly" | "half_yearly" | "yearly" | "one_time";
    start_date: string;
    end_date?: string | null;
    next_premium_date?: string | null;
    is_active?: boolean | null;
    beneficiary_name?: string | null;
    beneficiary_relationship?: string | null;
    nominee_name?: string | null;
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type Premium = {
    id: UUID;
    policy_id: UUID;
    premium_date: string;
    amount: number;
    payment_method?: string | null;
    receipt_number?: string | null;
    due_date?: string | null;
    paid_date?: string | null;
    status: "paid" | "unpaid" | "overdue" | "cancelled";
    notes?: string | null;
    created_at?: string;
    policy?: { id: UUID; user_id: UUID; policy_name?: string | null };
};

export const POLICY_TYPES = [
    "life",
    "health",
    "motor",
    "home",
    "travel",
    "other",
] as const;

export const PREMIUM_FREQS = [
    "monthly",
    "quarterly",
    "half_yearly",
    "yearly",
    "one_time",
] as const;

export const PREMIUM_STATUS = [
    "paid",
    "unpaid",
    "overdue",
    "cancelled",
] as const;
