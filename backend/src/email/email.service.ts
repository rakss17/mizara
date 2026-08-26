import { RecurringPaymentBillingCycle, ReminderOffsetDays } from '@/common/enum';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { format } from 'date-fns';

@Injectable()
export class EmailService {
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor() {
        const isProduction = process.env.NODE_ENV === 'production';

        this.transporter = nodemailer.createTransport({
            host: isProduction
                ? process.env.PROD_EMAIL_SMTP_HOST
                : process.env.DEV_EMAIL_SMTP_HOST,

            port: Number(
                isProduction
                    ? process.env.PROD_EMAIL_SMTP_PORT
                    : process.env.DEV_EMAIL_SMTP_PORT,
            ),

            secure: true,

            auth: {
                user: isProduction
                    ? process.env.PROD_EMAIL_SMTP_USER
                    : process.env.DEV_EMAIL_SMTP_USER,

                pass: isProduction
                    ? process.env.PROD_EMAIL_SMTP_PASSWORD
                    : process.env.DEV_EMAIL_SMTP_PASSWORD,
            },
        });

        this.from = isProduction
            ? process.env.PROD_EMAIL_SMTP_FROM!
            : process.env.DEV_EMAIL_SMTP_FROM!;
    }

    async sendEmailVerificationCode(
        email: string,
        code: string,
    ): Promise<void> {
        await this.transporter.sendMail({
            from: this.from,
            to: email,
            subject: 'Verify your Mizara account',
            html: `
                <h2>Verify your email</h2>
                <p>Your verification code is:</p>
                <h1>${code}</h1>
                <p>This code will expire soon.</p>
            `,
        });
    }

    async sendPasswordResetCode(email: string, code: string): Promise<void> {
        await this.transporter.sendMail({
            from: this.from,
            to: email,
            subject: 'Reset your Mizara password',
            html: `
                <h2>Reset your password</h2>
                <p>Your password reset code is:</p>
                <h1>${code}</h1>
                <p>This code will expire soon.</p>
            `,
        });
    }

    async sendDueReminder(
        recipientEmail: string,
        recipientName: string,
        paymentName: string,
        amount: string,
        dueDate: Date,
        remainingDays: ReminderOffsetDays,
    ): Promise<void> {
        const formattedDueDate = format(dueDate, 'MMMM d, yyyy');
        const formattedDueTime = format(dueDate, 'h:mm a');
        const dueMessage =
            remainingDays === ReminderOffsetDays.DueDay
                ? `Your recurring payment is due <strong>right now</strong>.`
                : remainingDays === ReminderOffsetDays.OneDayBefore
                  ? `Your recurring payment is due <strong>tomorrow at ${formattedDueTime}</strong>.`
                  : `Your recurring payment is due in <strong>${remainingDays} days</strong>.`;

        await this.transporter.sendMail({
            from: this.from,
            to: recipientEmail,
            subject: `Reminder: ${paymentName} is due soon`,
            html: `
            <h2>Payment Reminder</h2>

            <p>Hello, ${recipientName}!</p>

            <p>${dueMessage}</p>

            <p><strong>Payment:</strong> ${paymentName}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Due date:</strong> ${formattedDueDate}</p>
            <p><strong>Due time:</strong> ${formattedDueTime}</p>

            <p>
                Please make sure you have sufficient funds for this payment.
            </p>
        `,
        });
    }
    async sendFreeTrialReminder(
        recipientEmail: string,
        recipientName: string,
        paymentName: string,
        amount: string,
        trialEndDate: Date,
        remainingDays: ReminderOffsetDays,
        billingCycle: RecurringPaymentBillingCycle
    ): Promise<void> {
        const formattedDate = format(trialEndDate, 'MMMM d, yyyy');
        const formattedTime = format(trialEndDate, 'h:mm a');

        const trialMessage =
            remainingDays === ReminderOffsetDays.DueDay
                ? `Your free trial for <strong>${paymentName}</strong> ends <strong>right now</strong>.`
                : remainingDays === ReminderOffsetDays.OneDayBefore
                  ? `Your free trial for <strong>${paymentName}</strong> ends <strong>tomorrow at ${formattedTime}</strong>.`
                  : `Your free trial for <strong>${paymentName}</strong> ends <strong>in ${remainingDays} days</strong>.`;

        await this.transporter.sendMail({
            from: this.from,
            to: recipientEmail,
            subject: `Reminder: ${paymentName} free trial ends soon`,
            html: `
            <h2>Free Trial Reminder</h2>

            <p>Hello, ${recipientName}!</p>

            <p>${trialMessage}</p>

            <p><strong>Subscription:</strong> ${paymentName}</p>
            <p><strong>Trial ends:</strong> ${formattedDate}, ${formattedTime}</p>
            <p><strong>Then you'll be charged:</strong> ${amount} / ${billingCycle}</p>

            <p>
                Your subscription will transition to a paid subscription
                after your free trial ends.
            </p>
        `,
        });
    }

    async sendFreeTrialConvertedToPaid(
        recipientEmail: string,
        recipientName: string,
        paymentName: string,
        amount: string,
        nextDueDate: Date,
        billingCycle: RecurringPaymentBillingCycle,
    ): Promise<void> {
        const formattedNextDueDate = format(nextDueDate, 'MMMM d, yyyy');
        const formattedNextDueTime = format(nextDueDate, 'h:mm a');

        await this.transporter.sendMail({
            from: this.from,
            to: recipientEmail,
            subject: `${paymentName} free trial has ended - now a paid subscription`,
            html: `
            <h2>Free Trial Ended</h2>

            <p>Hello, ${recipientName}!</p>

            <p>
                Your free trial for <strong>${paymentName}</strong> has ended
                and your subscription has transitioned to a
                <strong>paid subscription</strong>.
            </p>

            <p><strong>Subscription:</strong> ${paymentName}</p>
            <p><strong>Amount:</strong> ${amount} / ${billingCycle}</p>
            <p><strong>Next payment:</strong> ${formattedNextDueDate}, ${formattedNextDueTime}</p>

            <p>
                Please make sure you have sufficient funds for your next
                payment.
            </p>
        `,
        });
    }

    async sendFreeTrialEnded(
        recipientEmail: string,
        recipientName: string,
        paymentName: string,
        trialEndDate: Date,
    ): Promise<void> {
        const formattedTrialEndDate = format(trialEndDate, 'MMMM d, yyyy');
        const formattedTrialEndTime = format(trialEndDate, 'h:mm a');

        await this.transporter.sendMail({
            from: this.from,
            to: recipientEmail,
            subject: `${paymentName} free trial has ended`,
            html: `
            <h2>Free Trial Ended</h2>

            <p>Hello, ${recipientName}!</p>

            <p>
                Your free trial for <strong>${paymentName}</strong> ended on
                <strong>${formattedTrialEndDate}, ${formattedTrialEndTime}</strong>.
            </p>

            <p>
                Since auto-renew was turned off, this subscription will not
                transition to a paid subscription and has been cancelled and archived.
            </p>
        `,
        });
    }
}
