/**
 * Send Admin Notification Emails
 * Sends HTML emails to admin when leads, contact form, or bookings come in.
 * Uses same Gmail/nodemailer setup as customer confirmation emails.
 */

import { sendEmail } from './gmail';
import {
  getAdminEmail,
  generateLeadNotificationEmail,
  generateContactFormNotificationEmail,
  generateBookingNotificationEmail,
  type LeadNotificationData,
  type ContactFormNotificationData,
  type BookingNotificationData,
} from './templates/admin-notification';

/** Send admin notification for a new lead (popup) */
export async function sendAdminLeadNotification(data: LeadNotificationData): Promise<boolean> {
  const adminTo = getAdminEmail();
  const sourceLabel = data.source === 'discount_popup' ? 'Discount Popup' : 'Spin Wheel';
  try {
    const html = generateLeadNotificationEmail(data);
    const success = await sendEmail({
      to: adminTo,
      subject: `📩 New Lead - ${sourceLabel} - ${data.fullName}`,
      html,
      text: `New lead from ${sourceLabel}\n\nName: ${data.fullName}\nPhone: ${data.phoneNumber}${data.email ? `\nEmail: ${data.email}` : ''}${data.promoCode ? `\nPromo: ${data.promoCode}` : ''}`,
    });
    if (success) {
      console.log(`✅ Admin lead notification sent to ${adminTo}`);
    } else {
      console.error(`❌ Failed to send admin lead notification to ${adminTo}`);
    }
    return success;
  } catch (error) {
    console.error('❌ Error sending admin lead notification:', error);
    return false;
  }
}

/** Send admin notification for contact form submission */
export async function sendAdminContactFormNotification(
  data: ContactFormNotificationData
): Promise<boolean> {
  const adminTo = getAdminEmail();
  try {
    const html = generateContactFormNotificationEmail(data);
    const success = await sendEmail({
      to: adminTo,
      subject: `✉️ New Contact Form - ${data.fullName}`,
      html,
      text: `New contact form submission\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phoneNumber}\n\nMessage:\n${data.message}`,
    });
    if (success) {
      console.log(`✅ Admin contact form notification sent to ${adminTo}`);
    } else {
      console.error(`❌ Failed to send admin contact form notification to ${adminTo}`);
    }
    return success;
  } catch (error) {
    console.error('❌ Error sending admin contact form notification:', error);
    return false;
  }
}

/** Send admin notification when a booking is scheduled (created) */
export async function sendAdminBookingNotification(
  data: BookingNotificationData
): Promise<boolean> {
  const adminTo = getAdminEmail();
  try {
    const html = generateBookingNotificationEmail(data);
    const success = await sendEmail({
      to: adminTo,
      subject: `🚗 New Booking Scheduled - ${data.carName} - ${data.customerName}`,
      html,
      text: `New booking scheduled\n\nVehicle: ${data.carName}\nCustomer: ${data.customerName}\nEmail: ${data.customerEmail}\nPhone: ${data.customerPhone}\nPickup: ${data.pickupDate}\nDropoff: ${data.dropoffDate}\nTotal: ${data.totalAmount}\nStatus: ${data.status}`,
    });
    if (success) {
      console.log(`✅ Admin booking notification sent to ${adminTo}`);
    } else {
      console.error(`❌ Failed to send admin booking notification to ${adminTo}`);
    }
    return success;
  } catch (error) {
    console.error('❌ Error sending admin booking notification:', error);
    return false;
  }
}
