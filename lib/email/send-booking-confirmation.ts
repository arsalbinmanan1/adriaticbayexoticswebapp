/**
 * Send Booking Confirmation Email
 * Sends beautiful HTML email with all booking details
 */

import { sendEmail } from './gmail';
import { generateBookingConfirmationEmail, generateBookingConfirmationText } from './templates/booking-confirmation';
import { format } from 'date-fns';

interface BookingData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  carMake: string;
  carModel: string;
  carYear: number;
  carImage?: string;
  
  pickupDatetime: string;
  dropoffDatetime: string;
  pickupLocation: string;
  dropoffLocation: string;
  
  numberOfDays: number;
  dailyRate: number;
  baseRental: number;
  addOnsTotal: number;
  discountAmount: number;
  promoCode?: string;
  taxAmount: number;
  totalAmount: number;
  depositPaid: number;
  
  addOns?: Array<{ name: string; price: number }>;
}

export async function sendBookingConfirmationEmail(booking: BookingData): Promise<boolean> {
  try {
    // Format dates
    const pickupDate = format(new Date(booking.pickupDatetime), 'MMMM dd, yyyy');
    const pickupTime = format(new Date(booking.pickupDatetime), 'h:mm a');
    const dropoffDate = format(new Date(booking.dropoffDatetime), 'MMMM dd, yyyy');
    const dropoffTime = format(new Date(booking.dropoffDatetime), 'h:mm a');

    // Calculate balance due
    const balanceDue = booking.totalAmount;

    // Prepare template data
    const emailData = {
      bookingId: booking.bookingId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      
      carMake: booking.carMake,
      carModel: booking.carModel,
      carYear: booking.carYear,
      carImage: booking.carImage,
      
      pickupDate,
      pickupTime,
      pickupLocation: booking.pickupLocation,
      
      dropoffDate,
      dropoffTime,
      dropoffLocation: booking.dropoffLocation,
      
      numberOfDays: booking.numberOfDays,
      dailyRate: booking.dailyRate,
      baseRental: booking.baseRental,
      addOnsTotal: booking.addOnsTotal,
      discountAmount: booking.discountAmount,
      promoCode: booking.promoCode,
      taxAmount: booking.taxAmount,
      totalAmount: booking.totalAmount,
      
      depositPaid: booking.depositPaid,
      balanceDue: balanceDue,
      
      addOns: booking.addOns
    };

    // Generate email HTML and text
    const htmlContent = generateBookingConfirmationEmail(emailData);
    const textContent = generateBookingConfirmationText(emailData);

    // Send email
    const success = await sendEmail({
      to: booking.customerEmail,
      subject: `🎉 Booking Confirmed - ${booking.carYear} ${booking.carMake} ${booking.carModel}`,
      html: htmlContent,
      text: textContent
    });

    if (success) {
      console.log(`✅ Booking confirmation sent to ${booking.customerEmail}`);
    } else {
      console.error(`❌ Failed to send booking confirmation to ${booking.customerEmail}`);
    }

    return success;
  } catch (error) {
    console.error('❌ Error sending booking confirmation:', error);
    return false;
  }
}
