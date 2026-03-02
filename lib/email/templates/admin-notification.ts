/**
 * Admin Notification Email Templates
 * HTML emails for admin alerts (leads, contact form, bookings)
 * Same styling as customer booking confirmation
 */

const ADMIN_EMAIL = 'Adriaticbayexoticsllc@gmail.com';

export const getAdminEmail = (): string =>
  process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || ADMIN_EMAIL;

function baseWrapper(title: string, content: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
    : 'http://localhost:3000';
  const adminUrl = `${baseUrl}/admin`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Adriatic Bay Exotics</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; font-style: italic; letter-spacing: -1px; color: #ffffff;">
                ADRIATIC BAY <span style="color: #fbbf24;">EXOTICS</span>
              </h1>
              <p style="margin: 10px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.8);">
                Admin Notification
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center;">
              <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                View Admin Dashboard
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #27272a;">
              <p style="margin: 0; font-size: 11px; color: #52525b;">© 2026 Adriatic Bay Exotics | Tampa Bay, Florida</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/** Lead from popup (discount or spin wheel) */
export interface LeadNotificationData {
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  source: 'discount_popup' | 'spin_wheel';
  promoCode?: string;
  prize?: string;
  discount?: number;
}

export function generateLeadNotificationEmail(data: LeadNotificationData): string {
  const sourceLabel = data.source === 'discount_popup' ? 'Discount Popup' : 'Spin Wheel';
  const content = `
    <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); padding: 15px; margin-bottom: 20px; text-align: center;">
      <span style="font-size: 28px;">📩</span>
    </div>
    <h2 style="margin: 0 0 10px; font-size: 28px; font-weight: 900; color: #ffffff;">
      New Lead from ${sourceLabel}
    </h2>
    <p style="margin: 0 0 25px; font-size: 14px; color: #9ca3af;">
      A new lead was captured on your website.
    </p>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Contact Details</h4>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Name:</strong> ${data.fullName}</p>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Phone:</strong> ${data.phoneNumber}</p>
      ${data.email ? `<p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Email:</strong> ${data.email}</p>` : ''}
      <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Source:</strong> ${sourceLabel}</p>
      ${data.promoCode ? `<p style="margin: 10px 0 0; font-size: 16px; color: #10b981;"><strong>Promo Code:</strong> ${data.promoCode}</p>` : ''}
      ${data.prize ? `<p style="margin: 5px 0 0; font-size: 16px; color: #10b981;"><strong>Prize:</strong> ${data.prize}</p>` : ''}
      ${data.discount != null ? `<p style="margin: 5px 0 0; font-size: 16px; color: #10b981;"><strong>Discount:</strong> ${data.discount}%</p>` : ''}
    </div>
  `;
  return baseWrapper(`New Lead - ${sourceLabel}`, content);
}

/** Contact form submission */
export interface ContactFormNotificationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export function generateContactFormNotificationEmail(data: ContactFormNotificationData): string {
  const content = `
    <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 15px; margin-bottom: 20px; text-align: center;">
      <span style="font-size: 28px;">✉️</span>
    </div>
    <h2 style="margin: 0 0 10px; font-size: 28px; font-weight: 900; color: #ffffff;">
      New Contact Form Submission
    </h2>
    <p style="margin: 0 0 25px; font-size: 14px; color: #9ca3af;">
      Someone has reached out through your contact form.
    </p>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Contact Details</h4>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Name:</strong> ${data.fullName}</p>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #fbbf24;">${data.email}</a></p>
      <p style="margin: 0 0 15px; font-size: 16px; color: #ffffff;"><strong>Phone:</strong> ${data.phoneNumber}</p>
      <h4 style="margin: 20px 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Message</h4>
      <div style="background-color: #0a0a0a; border-radius: 8px; padding: 20px; border-left: 4px solid #dc2626;">
        <p style="margin: 0; font-size: 15px; color: #e5e5e5; line-height: 1.6; white-space: pre-wrap;">${(data.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    </div>
  `;
  return baseWrapper('New Contact Form', content);
}

/** Booking scheduled (created) */
export interface BookingNotificationData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: string;
  depositAmount: string;
  status: string;
}

export function generateBookingNotificationEmail(data: BookingNotificationData): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
    : 'http://localhost:3000';
  const bookingUrl = `${baseUrl}/admin/bookings/${data.bookingId}`;

  const content = `
    <div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 15px; margin-bottom: 20px; text-align: center;">
      <span style="font-size: 28px;">🚗</span>
    </div>
    <h2 style="margin: 0 0 10px; font-size: 28px; font-weight: 900; color: #ffffff;">
      New Booking Scheduled
    </h2>
    <p style="margin: 0 0 25px; font-size: 14px; color: #9ca3af;">
      A new booking has been created and is awaiting confirmation.
    </p>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 15px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Vehicle</h4>
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">${data.carName}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 15px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Customer</h4>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Name:</strong> ${data.customerName}</p>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #fbbf24;">${data.customerEmail}</a></p>
      <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Phone:</strong> ${data.customerPhone}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 15px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Rental Period</h4>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Pickup:</strong> ${data.pickupDate} — ${data.pickupLocation}</p>
      <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Dropoff:</strong> ${data.dropoffDate} — ${data.dropoffLocation}</p>
    </div>
    <div style="background-color: #27272a; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">Payment</h4>
      <p style="margin: 0 0 8px; font-size: 16px; color: #ffffff;"><strong>Total:</strong> ${data.totalAmount}</p>
      <p style="margin: 0; font-size: 16px; color: #ffffff;"><strong>Deposit:</strong> ${data.depositAmount}</p>
      <p style="margin: 10px 0 0; font-size: 14px; color: #71717a;"><strong>Status:</strong> ${data.status}</p>
    </div>
    <p style="margin: 0 0 20px; font-size: 14px; color: #9ca3af;">
      Booking ID: <code style="background: #27272a; padding: 4px 8px; border-radius: 4px;">${data.bookingId}</code>
    </p>
    <a href="${bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; margin-bottom: 20px;">
      View Booking in Admin
    </a>
  `;
  return baseWrapper('New Booking Scheduled', content);
}
