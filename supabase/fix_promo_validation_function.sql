/*
  Fix: validate_and_increment_promo Function
  This updates the function to work with both old and new column names
*/

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
    v_start_date TIMESTAMPTZ;
    v_end_date TIMESTAMPTZ;
    v_usage_count INTEGER;
    v_min_days INTEGER;
BEGIN
    -- Lock the promo code row to prevent race conditions
    SELECT * INTO v_promo 
    FROM promo_codes 
    WHERE code = UPPER(p_code)
    FOR UPDATE;  -- ← ROW LOCK

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

    -- Support both old and new column names for dates
    -- Try new column names first, fall back to old names
    BEGIN
        v_start_date := COALESCE(v_promo.starts_at, v_promo.start_date);
    EXCEPTION WHEN OTHERS THEN
        v_start_date := v_promo.start_date;
    END;
    
    BEGIN
        v_end_date := COALESCE(v_promo.expires_at, v_promo.end_date);
    EXCEPTION WHEN OTHERS THEN
        v_end_date := v_promo.end_date;
    END;

    -- Check dates
    IF v_start_date IS NOT NULL AND v_start_date > NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code is not active yet'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    IF v_end_date IS NOT NULL AND v_end_date < NOW() THEN
        RETURN QUERY SELECT FALSE, 'This promo code has expired'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Support both old and new column names for usage count
    BEGIN
        v_usage_count := COALESCE(v_promo.used_count, v_promo.times_used, 0);
    EXCEPTION WHEN OTHERS THEN
        v_usage_count := COALESCE(v_promo.times_used, 0);
    END;

    -- Check usage limits (BEFORE incrementing)
    IF v_promo.max_uses IS NOT NULL AND v_usage_count >= v_promo.max_uses THEN
        RETURN QUERY SELECT FALSE, 'This promo code has reached its usage limit'::TEXT, NULL::TEXT, NULL::DECIMAL;
        RETURN;
    END IF;

    -- Support both old and new column names for minimum days
    BEGIN
        v_min_days := COALESCE(
            CAST(v_promo.min_booking_amount AS INTEGER),
            v_promo.min_rental_days
        );
    EXCEPTION WHEN OTHERS THEN
        v_min_days := v_promo.min_rental_days;
    END;

    -- Check rental days requirement
    IF p_rental_days IS NOT NULL AND v_min_days IS NOT NULL AND p_rental_days < v_min_days THEN
        RETURN QUERY SELECT FALSE, 
            ('This promo code requires a minimum of ' || v_min_days::TEXT || ' rental days')::TEXT,
            NULL::TEXT, 
            NULL::DECIMAL;
        RETURN;
    END IF;

    -- Check car category restriction (if applicable)
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

    -- Increment usage count using appropriate column name
    BEGIN
        -- Try to update used_count first (new column name)
        UPDATE promo_codes 
        SET used_count = COALESCE(used_count, 0) + 1 
        WHERE code = UPPER(p_code);
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Could not update used_count';
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Fall back to times_used (old column name)
        UPDATE promo_codes 
        SET times_used = COALESCE(times_used, 0) + 1 
        WHERE code = UPPER(p_code);
    END;

    -- Return success with promo details
    RETURN QUERY SELECT 
        TRUE, 
        'Valid promo code'::TEXT, 
        v_promo.discount_type::TEXT, 
        v_promo.discount_value;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Test the function
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ validate_and_increment_promo Function Updated!';
    RAISE NOTICE '';
    RAISE NOTICE 'This function now supports both column naming conventions:';
    RAISE NOTICE '  • starts_at / start_date';
    RAISE NOTICE '  • expires_at / end_date';
    RAISE NOTICE '  • used_count / times_used';
    RAISE NOTICE '  • min_booking_amount / min_rental_days';
    RAISE NOTICE '';
    RAISE NOTICE 'Promo codes will now work in checkout!';
    RAISE NOTICE '';
END $$;
