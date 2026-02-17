import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface InquiryEmailData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  timeline?: string;
  propertyTitle?: string;
}

const BUDGET_LABELS: Record<string, string> = {
  under_50l: 'Under \u20B950 Lakh',
  '50l_1cr': '\u20B950 Lakh \u2013 \u20B91 Cr',
  '1cr_2cr': '\u20B91 Cr \u2013 \u20B92 Cr',
  '2cr_plus': '\u20B92 Cr+',
};

const TIMELINE_LABELS: Record<string, string> = {
  immediately: 'Immediately',
  '1_3_months': '1\u20133 Months',
  '3_6_months': '3\u20136 Months',
  exploring: 'Just Exploring',
};

export async function sendInquiryNotification(data: InquiryEmailData) {
  const to = process.env.INQUIRY_NOTIFICATION_EMAIL;
  if (!to) {
    console.warn('INQUIRY_NOTIFICATION_EMAIL not set \u2014 skipping email');
    return;
  }

  const subject = data.propertyTitle
    ? `New Inquiry: ${data.propertyTitle}`
    : 'New Property Inquiry';

  const html = `
    <h2 style="font-family: sans-serif; color: #1a1a2e;">New Inquiry Received</h2>
    <table style="font-family: sans-serif; border-collapse: collapse; width: 100%; max-width: 480px;">
      <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0; font-weight: 600;">${data.phone}</td></tr>
      ${data.email ? `<tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>` : ''}
      ${data.propertyTitle ? `<tr><td style="padding: 8px 0; color: #666;">Property</td><td style="padding: 8px 0;">${data.propertyTitle}</td></tr>` : ''}
      ${data.budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0;">${BUDGET_LABELS[data.budget] ?? data.budget}</td></tr>` : ''}
      ${data.timeline ? `<tr><td style="padding: 8px 0; color: #666;">Timeline</td><td style="padding: 8px 0;">${TIMELINE_LABELS[data.timeline] ?? data.timeline}</td></tr>` : ''}
    </table>
    <p style="font-family: sans-serif; color: #999; font-size: 12px; margin-top: 24px;">Sent from Estate Pulse inquiry form</p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'inquiries@estatepulse.in',
    to,
    subject,
    html,
  });
}
