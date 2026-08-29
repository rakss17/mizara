export enum UserStatus {
    Unverified = 'unverified',
}

export enum VerificationCodeType {
    EmailVerification = 'Email Verification',
    PasswordReset = 'Password Reset',
}

export enum RecurringPaymentType {
    Subscription = 'Subscription',
    Bills = 'Bills',
}

export enum RecurringPaymentBillingCycle {
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Quarterly = 'Quarterly',
    Yearly = 'Yearly',
}

export enum RecurringPaymentSortBy {
    DueDate = 'due_date',
    Amount = 'amount',
    Name = 'name',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum ReminderOffsetDays {
    SevenDaysBefore = 7,
    ThreeDaysBefore = 3,
    OneDayBefore = 1,
    DueDay = 0,
}

export enum ReminderChannel {
    Email = 'email',
    Push = 'push',
}

export enum Theme {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
}
