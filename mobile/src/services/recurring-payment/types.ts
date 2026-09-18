export type RecurringPaymentType = "Subscription" | "Bills";

export type RecurringPaymentBillingCycle =
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Yearly";

export type RecurringPaymentSortBy = "due_date" | "amount" | "name";

export type SortOrder = "ASC" | "DESC";

export type RecurringPayment = {
  id: string;
  user_id: string;
  name: string;
  type: RecurringPaymentType;
  description: string | null;
  amount: string;
  currency: string;
  billing_cycle: RecurringPaymentBillingCycle;
  is_auto_renew: boolean;
  is_archived: boolean;
  is_free_trial: boolean;
  icon: string | null;
  due_date: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
};

export type FindAllRecurringPaymentParams = {
  page?: number;
  limit?: number;
  sort_by?: RecurringPaymentSortBy;
  sort_order?: SortOrder;
  type?: RecurringPaymentType;
  is_archived?: boolean;
  is_auto_renew?: boolean;
  is_free_trial?: boolean;
  category_id?: string;
  search?: string;
};

export type FindAllRecurringPaymentResponse = {
  message: string;
  data: RecurringPayment[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
