import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const { data, error } = await supabase.functions.invoke("send-email", {
    body: { to, subject, html },
  });

  if (error) throw error;
  return data;
};

export const emailTemplates = {
  vendorApproval: (businessName: string) => ({
    subject: "🎉 Your RobCompare vendor account is approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #16a34a; font-size: 24px;">Welcome to RobCompare, ${businessName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Great news — your vendor account has been approved. You can now start listing your products and reaching buyers across Africa.
        </p>
        <a href="https://deal-radar-link.lovable.app/vendor/dashboard"
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Go to Dashboard
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          — The RobCompare Team
        </p>
      </div>
    `,
  }),

  priceAlert: (productName: string, currentPrice: string, targetPrice: string, currency: string, productUrl: string) => ({
    subject: `📉 Price drop alert: ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #16a34a; font-size: 24px;">Price Drop Alert!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          <strong>${productName}</strong> just dropped to <strong>${currency} ${currentPrice}</strong> — below your target of ${currency} ${targetPrice}.
        </p>
        <a href="${productUrl}"
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          View Deal
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          — RobCompare Price Alerts
        </p>
      </div>
    `,
  }),

  vendorWelcome: (businessName: string) => ({
    subject: "🚀 Welcome to RobCompare — Let's get started!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #16a34a; font-size: 24px;">Welcome aboard, ${businessName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          You've successfully joined RobCompare as a founding vendor — that means <strong>0% commission</strong> during our launch period.
        </p>
        <h2 style="color: #111827; font-size: 18px; margin-top: 20px;">Next steps:</h2>
        <ol style="color: #374151; font-size: 16px; line-height: 1.8;">
          <li>Add your first product listing</li>
          <li>Share your referral link with other vendors</li>
          <li>Start receiving buyer inquiries</li>
        </ol>
        <a href="https://deal-radar-link.lovable.app/vendor/dashboard"
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Open Dashboard
        </a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          — The RobCompare Team
        </p>
      </div>
    `,
  }),
};
