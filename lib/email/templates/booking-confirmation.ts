/**
 * Booking Confirmation Email Template
 * Beautiful HTML email with all booking details
 */

interface BookingDetails {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  carMake: string;
  carModel: string;
  carYear: number;
  carImage?: string;
  
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  
  dropoffDate: string;
  dropoffTime: string;
  dropoffLocation: string;
  
  numberOfDays: number;
  
  // Pricing
  dailyRate: number;
  baseRental: number;
  addOnsTotal: number;
  discountAmount: number;
  promoCode?: string;
  taxAmount: number;
  totalAmount: number;
  
  depositPaid: number;
  balanceDue: number;
  
  // Add-ons
  addOns?: Array<{ name: string; price: number }>;
}

export function generateBookingConfirmationEmail(details: BookingDetails): string {
  const {
    bookingId,
    customerName,
    customerEmail,
    customerPhone,
    carMake,
    carModel,
    carYear,
    carImage,
    pickupDate,
    pickupTime,
    pickupLocation,
    dropoffDate,
    dropoffTime,
    dropoffLocation,
    numberOfDays,
    dailyRate,
    baseRental,
    addOnsTotal,
    discountAmount,
    promoCode,
    taxAmount,
    totalAmount,
    depositPaid,
    balanceDue,
    addOns
  } = details;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - Adriatic Bay Exotics</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  
  <!-- Email Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 900; font-style: italic; letter-spacing: -1px; color: #ffffff;">
                ADRIATIC BAY <span style="color: #fbbf24;">EXOTICS</span>
              </h1>
              <p style="margin: 10px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.8);">
                Tampa Bay's Premier Exotic Car Rental
              </p>
            </td>
          </tr>
          
          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px; text-align: center; background-color: #1a1a1a;">
              <div style="display: inline-block; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; margin-bottom: 20px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style="margin: 0 0 10px; font-size: 36px; font-weight: 900; font-style: italic; color: #ffffff;">
                BOOKING <span style="color: #dc2626;">CONFIRMED!</span>
              </h2>
              <p style="margin: 0; font-size: 16px; color: #9ca3af;">
                Thank you, ${customerName}! Your luxury experience awaits.
              </p>
            </td>
          </tr>
          
          <!-- Car Image -->
          ${carImage ? `
          <tr>
            <td style="padding: 0 40px;">
              <img src="${carImage}" alt="${carYear} ${carMake} ${carModel}" style="width: 100%; border-radius: 12px; display: block;">
            </td>
          </tr>
          ` : ''}
          
          <!-- Vehicle Details -->
          <tr>
            <td style="padding: 30px 40px;">
              <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 12px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">
                  Your Vehicle
                </p>
                <h3 style="margin: 0; font-size: 28px; font-weight: 900; font-style: italic; color: #ffffff;">
                  ${carYear} ${carMake} ${carModel}
                </h3>
              </div>
            </td>
          </tr>
          
          <!-- Booking Details -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                
                <!-- Booking ID -->
                <tr>
                  <td style="padding: 15px 20px; background-color: #27272a; border-radius: 8px; margin-bottom: 10px;">
                    <table width="100%">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a;">Booking ID</p>
                          <p style="margin: 5px 0 0; font-size: 14px; font-family: monospace; color: #ffffff;">${bookingId}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr><td style="height: 10px;"></td></tr>
                
                <!-- Pickup Details -->
                <tr>
                  <td style="padding: 20px; background-color: #27272a; border-radius: 8px;">
                    <p style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981; font-weight: bold;">
                      🚗 Pickup
                    </p>
                    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #ffffff;">${pickupDate} at ${pickupTime}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #9ca3af;">📍 ${pickupLocation}</p>
                  </td>
                </tr>
                
                <tr><td style="height: 10px;"></td></tr>
                
                <!-- Dropoff Details -->
                <tr>
                  <td style="padding: 20px; background-color: #27272a; border-radius: 8px;">
                    <p style="margin: 0 0 15px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #dc2626; font-weight: bold;">
                      🏁 Return
                    </p>
                    <p style="margin: 0; font-size: 16px; font-weight: bold; color: #ffffff;">${dropoffDate} at ${dropoffTime}</p>
                    <p style="margin: 5px 0 0; font-size: 14px; color: #9ca3af;">📍 ${dropoffLocation}</p>
                  </td>
                </tr>
                
                <tr><td style="height: 10px;"></td></tr>
                
                <!-- Duration -->
                <tr>
                  <td style="padding: 15px 20px; background-color: #27272a; border-radius: 8px; text-align: center;">
                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a;">Rental Period</p>
                    <p style="margin: 5px 0 0; font-size: 24px; font-weight: 900; color: #fbbf24;">${numberOfDays} ${numberOfDays === 1 ? 'Day' : 'Days'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Pricing Breakdown -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #27272a; border-radius: 12px; padding: 25px;">
                <h4 style="margin: 0 0 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24; border-bottom: 2px solid #3f3f46; padding-bottom: 10px;">
                  💰 Payment Summary
                </h4>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <!-- Base Rental -->
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">
                      Base Rental (${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'} × $${dailyRate.toFixed(2)})
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-size: 14px; font-weight: 600;">
                      $${baseRental.toFixed(2)}
                    </td>
                  </tr>
                  
                  ${addOns && addOns.length > 0 ? addOns.map(addon => `
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">
                      ${addon.name}
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-size: 14px; font-weight: 600;">
                      $${addon.price.toFixed(2)}
                    </td>
                  </tr>
                  `).join('') : ''}
                  
                  ${addOnsTotal > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">
                      Add-ons & Extras
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-size: 14px; font-weight: 600;">
                      $${addOnsTotal.toFixed(2)}
                    </td>
                  </tr>
                  ` : ''}
                  
                  ${discountAmount > 0 ? `
                  <tr>
                    <td style="padding: 8px 0; color: #10b981; font-size: 14px;">
                      Discount${promoCode ? ` (${promoCode})` : ''}
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #10b981; font-size: 14px; font-weight: 600;">
                      -$${discountAmount.toFixed(2)}
                    </td>
                  </tr>
                  ` : ''}
                  
                  <tr>
                    <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">
                      Sales Tax (7%)
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #ffffff; font-size: 14px; font-weight: 600;">
                      $${taxAmount.toFixed(2)}
                    </td>
                  </tr>
                  
                  <tr>
                    <td colspan="2" style="padding: 15px 0 10px; border-top: 2px solid #3f3f46;"></td>
                  </tr>
                  
                  <!-- Total -->
                  <tr>
                    <td style="padding: 8px 0; color: #ffffff; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                      Total Rental Contract
                    </td>
                    <td style="padding: 8px 0; text-align: right; color: #fbbf24; font-size: 24px; font-weight: 900;">
                      $${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Payment Status -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <!-- Deposit Paid -->
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px;">
                    <table width="100%">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.9);">
                            ✅ Deposit Paid
                          </p>
                          <p style="margin: 5px 0 0; font-size: 28px; font-weight: 900; color: #ffffff;">
                            $${depositPaid.toFixed(2)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr><td style="height: 10px;"></td></tr>
                
                <!-- Balance Due -->
                <tr>
                  <td style="padding: 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 12px;">
                    <table width="100%">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.9);">
                            💳 Due at Pickup
                          </p>
                          <p style="margin: 5px 0 0; font-size: 28px; font-weight: 900; color: #ffffff;">
                            $${balanceDue.toFixed(2)}
                          </p>
                          <p style="margin: 8px 0 0; font-size: 11px; color: rgba(255,255,255,0.8);">
                            Final payment will be collected when you pick up your vehicle
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Important Information -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #27272a; border-left: 4px solid #fbbf24; border-radius: 8px; padding: 20px;">
                <h4 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #fbbf24;">
                  📋 Important Information
                </h4>
                <ul style="margin: 0; padding-left: 20px; color: #9ca3af; font-size: 14px; line-height: 1.8;">
                  <li>Bring a valid driver's license and credit card</li>
                  <li>Arrive 15 minutes early for vehicle inspection</li>
                  <li>Security deposit is refundable upon return</li>
                  <li>Free cancellation up to 48 hours before pickup</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Contact Information -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #9ca3af;">
                Questions about your booking?
              </p>
              <p style="margin: 0; font-size: 16px; color: #ffffff; font-weight: bold;">
                📞 Call us 24/7: <a href="tel:+1 (727) 224-5544" style="color: #fbbf24; text-decoration: none;">+1 (727) 224-5544</a>
              </p>
              <p style="margin: 0; font-size: 16px; color: #ffffff; font-weight: bold;">
                📞 Call us 24/7: <a href="tel:+17279220141" style="color: #fbbf24; text-decoration: none;">+1 (727) 922-0141</a>
              </p>
              <p style="margin: 10px 0 0; font-size: 16px; color: #ffffff; font-weight: bold;">
                📧 Email: <a href="mailto:${customerEmail}" style="color: #fbbf24; text-decoration: none;">adriaticbayexoticsllc@gmail.com</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #27272a;">
              <p style="margin: 0 0 5px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #71717a;">
                Adriatic Bay Exotics
              </p>
              <p style="margin: 0; font-size: 11px; color: #52525b;">
                Tampa Bay, Florida | Premium Exotic Car Rentals
              </p>
              <p style="margin: 15px 0 0; font-size: 10px; color: #52525b;">
                © 2026 Adriatic Bay Exotics. All rights reserved.
              </p>
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

/**
 * Generate plain text version of booking confirmation
 */
export function generateBookingConfirmationText(details: BookingDetails): string {
  return `
BOOKING CONFIRMED - Adriatic Bay Exotics
========================================

Thank you, ${details.customerName}!

BOOKING DETAILS
---------------
Booking ID: ${details.bookingId}
Vehicle: ${details.carYear} ${details.carMake} ${details.carModel}

PICKUP
------
Date: ${details.pickupDate} at ${details.pickupTime}
Location: ${details.pickupLocation}

RETURN
------
Date: ${details.dropoffDate} at ${details.dropoffTime}
Location: ${details.dropoffLocation}

Duration: ${details.numberOfDays} ${details.numberOfDays === 1 ? 'day' : 'days'}

PAYMENT SUMMARY
---------------
Base Rental: $${details.baseRental.toFixed(2)}
Add-ons & Extras: $${details.addOnsTotal.toFixed(2)}
${details.discountAmount > 0 ? `Discount: -$${details.discountAmount.toFixed(2)}\n` : ''}Tax (7%): $${details.taxAmount.toFixed(2)}
------------------------------------------
TOTAL: $${details.totalAmount.toFixed(2)}

Deposit Paid: $${details.depositPaid.toFixed(2)}
Balance Due at Pickup: $${details.balanceDue.toFixed(2)}

IMPORTANT INFORMATION
---------------------
- Bring valid driver's license and credit card
- Arrive 15 minutes early for vehicle inspection
- Security deposit is refundable upon return
- Free cancellation up to 48 hours before pickup

QUESTIONS?
----------
Call us 24/7: +1 (727) 555-0123
Email: support@adriaticbayexotics.com

© 2026 Adriatic Bay Exotics | Tampa Bay, Florida
  `.trim();
}
