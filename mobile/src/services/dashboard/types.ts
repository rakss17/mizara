export type UpcomingDue = {
  id: string;
  name: string;
  type: string;
  amount: number;
  currency: string;
  due_date: string;
  days_left: number;
  is_free_trial: boolean;
  icon: string | null;
};

export type OverviewResponse = {
  message: string;
  data: {
    total: string;
    total_upcoming_this_week: string;
    free_trials_ending: string;
    total_monthly_spending: string;
    upcoming_due: UpcomingDue[];
  };
};
