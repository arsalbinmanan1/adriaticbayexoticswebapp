-- ==========================================
-- FINAL FIX: validate_and_increment_promo
-- Handles min_booking_amount as MONEY not DAYS
-- ==========================================

CREATE OR REPLACE FUNCTION validate_and_increment_promo(
    p_code TEXT,
    p_rental_days INTEGER DEFAULT NULL,
    p_car_id UUID DEFAULT NULL
) RETURNS TABLE (
    valid BOOLEAN,
    message TEXT,
    discount_type TEXT,
    discount_value DECIMAL(12, 2)
) AS $$
DECLARE
    v_promo RECORD;
    v_car_category TEXT;
BEGIN
    -- Lock the promo code row to prevent race conditions
    SELECT * INTO v_promo 
    FROM promo_codes 
    WHERE code = UPPER(p_code)
    FOR UPDATE;

    -- Check if promo exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Invalid promo code'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check status
    IF v_promo.status != 'active' THEN
        RETURN QUERY SELECT FALSE, 'This promo code is no longer active'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check dates (use starts_at/expires_at columns)
    IF v_promo.starts_at IS NOT NULL AND v_promo.starts_at > NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code is not active yet'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code has expired'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check usage limits (use used_count column)
    IF v_promo.max_uses IS NOT NULL AND v_promo.used_count >= v_promo.max_uses THEN
        RETURN QUERY SELECT FALSE, 'This promo code has reached its usage limit'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Skip min_booking_amount check here - it will be validated by frontend/API
    -- This column represents minimum $ amount, not rental days
    -- The checkout calculates total and can check if it meets minimum

    -- Check car category restriction
    IF p_car_id IS NOT NULL AND 
       v_promo.applicable_car_categories IS NOT NULL AND 
       jsonb_array_length(v_promo.applicable_car_categories) > 0 THEN
        
        SELECT category INTO v_car_category FROM cars WHERE id = p_car_id;
        
        IF v_car_category IS NULL OR 
           NOT (v_promo.applicable_car_categories @> to_jsonb(v_car_category)) THEN
            RETURN QUERY SELECT FALSE, 'This promo code is not applicable to the selected car'::TEXT, NULL::TEXT, NULL::DECIMAL;
            RETURN;
        END IF;
    END IF;

    -- Increment usage count
    UPDATE promo_codes 
    SET used_count = used_count + 1 
    WHERE code = UPPER(p_code);

    -- Return success with promo details
    RETURN QUERY SELECT 
        TRUE, 
        'Valid promo code'::TEXT, 
        v_promo.discount_type::TEXT, 
        v_promo.discount_value;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Verification
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Function Updated Successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '  • Uses starts_at/expires_at columns';
    RAISE NOTICE '  • Uses used_count column';
    RAISE NOTICE '  • Skips min_booking_amount check (handled by frontend)';
    RAISE NOTICE '';
    RAISE NOTICE 'Test it now with: SELECT * FROM validate_and_increment_promo(''WELCOME2024'', 3, NULL);';
    RAISE NOTICE '';
END $$;
