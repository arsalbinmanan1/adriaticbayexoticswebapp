import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { fullName, phoneNumber, discountPercentage } = await req.json();

    if (!fullName || !phoneNumber || !discountPercentage) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Generate a unique promo code
    const promoCode = `WELCOME${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save to marketing_leads (with correct column names)
    const { error: leadError } = await supabase
      .from('marketing_leads')
      .insert({
        full_name: fullName,
        phone_number: phoneNumber,
        email: null,
        source: 'discount_popup',
        meta: {
          promo_code: promoCode,
          discount_percentage: discountPercentage,
        },
      });

    if (leadError) {
      console.error('Error saving lead:', leadError);
      // Don't fail if lead save fails, continue with promo code creation
    }

    // Create promo code (using admin client to bypass RLS)
    const { data: promoData, error: promoError } = await supabase
      .from('promo_codes')
      .insert({
        code: promoCode,
        description: `${discountPercentage}% off welcome discount`,
        discount_type: 'percentage',
        discount_value: discountPercentage,
        starts_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        max_uses: 1,
        used_count: 0,
        min_booking_amount: 0,
        campaign_source: 'Welcome Discount Popup',
        status: 'active',
      })
      .select()
      .single();

    if (promoError) {
      console.error('Error creating promo code:', promoError);
      console.error('Promo code details:', { promoCode, discountPercentage });
      return NextResponse.json(
        { success: false, message: `Failed to create promo code: ${promoError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      promoCode: promoData.code,
      message: 'Promo code generated successfully',
    });
  } catch (error) {
    console.error('Error in discount popup API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
