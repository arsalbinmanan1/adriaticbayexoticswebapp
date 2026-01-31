-- ==========================================
-- Seed Cars with LOCAL Image Paths
-- ==========================================
-- This uses /public/car-images/ paths (no upload needed)

-- Clear existing car data (optional)
-- DELETE FROM cars WHERE slug IN ('corvette-c8-r', 'mclaren-570s', 'lamborghini-huracan', 'maserati-levante', 'lamborghini-urus', 'mclaren-650s');

-- 1. Corvette C8-R
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Chevrolet',
    'Corvette C8-R',
    2024,
    'C8R001CORVETTE001',
    'CORV8',
    'sports',
    'corvette-c8-r',
    'The Corvette C8-R represents American supercar excellence with its revolutionary mid-engine design. Experience raw power and precision handling in this track-ready beast. A track-born instant collectible. This isn''t just a Corvette; it''s the limited-edition C8.R Championship package. With a mid-engine exotic layout and open-air freedom, it punches way above its weight class.',
    'Amplify Orange Tintcoat',
    'Natural Dipped',
    419.00,
    219.00,
    2500.00,
    8000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Corvette1.jpeg", "/car-images/Corvette2.jpeg", "/car-images/Corvette3.jpeg", "/car-images/Corvette4.jpeg", "/car-images/Corvette5.jpeg", "/car-images/Corvette6.jpeg", "/car-images/Corvette7.jpeg", "/car-images/Corvette8.jpeg"]'::jsonb,
    '["Mid-engine layout", "Magnetic ride control", "Performance exhaust", "Carbon fiber trim", "Premium Bose audio", "Advanced safety tech", "Z51 Performance Package", "Exclusive C8.R Edition with race-inspired graphics", "Luxury 3LT Trim with premium leather"]'::jsonb,
    '{"engine": "6.2L V8", "horsepower": "495 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "194 mph", "transmission": "8-Speed Dual-Clutch", "drivetrain": "RWD"}'::jsonb
);

-- 2. McLaren 570S Spyder
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'McLaren',
    '570S Spyder',
    2023,
    'MCL570SSPYDER0001',
    'MCL570S',
    'exotic',
    'mclaren-570s',
    'The McLaren 570S delivers pure driving pleasure with Formula 1-inspired technology. Lightweight construction and twin-turbo power create an unforgettable driving experience. British engineering meets pure adrenaline. The 570S Spyder is designed to be the ultimate driver''s car—lightweight, agile, and unmistakably exotic with its signature dihedral (upward-opening) doors.',
    'Paris Blue',
    'Jet Black with Yellow Stitching Inserts',
    1199.00,
    589.00,
    7500.00,
    24000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/McLarenBlue2.jpeg", "/car-images/McLarenBlue1.jpeg"]'::jsonb,
    '["Carbon fiber monocoque", "Dihedral doors", "Active aerodynamics", "Bowers & Wilkins audio", "Track telemetry", "Launch control", "Carbon Fiber Monocell with Formula 1 technology", "Retractable Hardtop (lowers in 15 seconds)"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "562 HP", "acceleration": "0-60 mph in 3.1s", "topSpeed": "204 mph", "transmission": "7-Speed SSG", "drivetrain": "RWD"}'::jsonb
);

-- 3. Lamborghini Huracan Spyder LP 580
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Lamborghini',
    'Huracan Spyder LP 580',
    2024,
    'LAMBOHURACAN58001',
    'HURACAN',
    'exotic',
    'lamborghini-huracan',
    'The Lamborghini Huracan EVO is Italian supercar perfection. With its naturally aspirated V10 and aggressive styling, this is the ultimate exotic car experience. The poster car for Italian aggression. This Rear-Wheel Drive (RWD) variant is built for pure driving pleasure, allowing for thrilling handling dynamics that the All-Wheel Drive models can''t match.',
    'Giallo Orion',
    'Black Leather with Yellow Stitching Inserts',
    1049.00,
    NULL,
    6500.00,
    21000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Lamborghini1.jpeg", "/car-images/Lamborghini2.jpeg", "/car-images/Lamborghini3.jpeg", "/car-images/Lamborghini4.jpeg", "/car-images/Lamborghini5.jpeg", "/car-images/Lamborghini6.jpeg"]'::jsonb,
    '["All-wheel drive", "Rear-wheel steering", "LDVI vehicle dynamics", "Alcantara interior", "Digital cockpit", "Sport exhaust", "Naturally Aspirated V10 engine", "RWD Setup for drift capability", "ANIMA Switch with Strada, Sport, and Corsa modes"]'::jsonb,
    '{"engine": "5.2L V10", "horsepower": "631 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "202 mph", "transmission": "7-Speed Dual-Clutch", "drivetrain": "AWD"}'::jsonb
);

-- 4. Maserati Levante GrandSport Q4
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Maserati',
    'Levante GrandSport Q4 (Fully Loaded)',
    2024,
    'MASLEVANTEQ40001',
    'MASQ4',
    'luxury',
    'maserati-levante',
    'The Maserati Levante combines Italian luxury with SUV practicality. Perfect for families or groups wanting to travel in style and comfort. The SUV that thinks it''s a Ferrari. Perfect for when you need space for passengers and luggage but refuse to compromise on Italian style and exhaust note.',
    'Grigio Maratea Metallescent',
    'Rosso with Nero Stitching',
    199.00,
    NULL,
    1200.00,
    4000.00,
    500.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/maserati1.webp", "/car-images/maserati2.jpg"]'::jsonb,
    '["Luxury SUV comfort", "Premium leather interior", "Panoramic sunroof", "Harman Kardon audio", "Advanced driver assist", "Spacious cargo area", "Q4 Intelligent AWD", "GranSport Trim with sport bumpers and red calipers", "Ferrari-Built Engine from Maranello"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "580 HP", "acceleration": "0-60 mph in 3.8s", "topSpeed": "187 mph", "transmission": "8-Speed Automatic", "drivetrain": "AWD"}'::jsonb
);

-- 5. Lamborghini Urus
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'Lamborghini',
    'Urus',
    2024,
    'LAMBOURUSSSUV0001',
    'URUS',
    'exotic',
    'lamborghini-urus',
    'The Lamborghini Urus is the world''s first Super Sport Utility Vehicle. Combining supercar performance with SUV versatility for an unmatched driving experience. It defies physics, offering the comfort of a luxury SUV with the acceleration of a supercar. It is the ultimate ''do-it-all'' exotic.',
    'Grigio Keres Metallic',
    'Marrone Elpis with Nero Ade',
    1049.00,
    659.00,
    6500.00,
    21000.00,
    1000.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/Urus1.jpeg", "/car-images/Urus2.jpeg", "/car-images/Urus3.jpeg"]'::jsonb,
    '["Super SUV performance", "Carbon ceramic brakes", "Active roll stabilization", "Sport seats", "Advanced infotainment", "Multiple drive modes", "Supercar-level acceleration", "Tamburo Drive Mode with Neve, Terra, and Sabbia modes", "Largest carbon-ceramic brakes on production car"]'::jsonb,
    '{"engine": "4.0L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "0-60 mph in 3.6s", "topSpeed": "190 mph", "transmission": "8-Speed Automatic", "drivetrain": "AWD"}'::jsonb
);

-- 6. McLaren 650S Spyder
INSERT INTO cars (
    make, model, year, vin, license_plate,
    category, slug, description,
    exterior_color, interior_color,
    daily_rate, four_hour_rate, weekly_rate, monthly_rate, security_deposit,
    status, current_location,
    images, features, specifications
) VALUES (
    'McLaren',
    '650S Spyder',
    2023,
    'MCL650SSPYDER0001',
    'MCL650S',
    'exotic',
    'mclaren-650s',
    'The McLaren 650S Spider offers open-top thrills with brutal performance. Experience the wind in your hair at supercar speeds with this British masterpiece. A technological marvel featuring active aerodynamics and a hydraulic suspension system that practically erases bumps in the road.',
    'Volcano Orange',
    'Carbon Black Alcantara',
    1399.00,
    689.00,
    8500.00,
    27000.00,
    500.00,
    'available',
    'Tampa Bay, FL',
    '["/car-images/McLarenOrange1.jpeg", "/car-images/McLarenOrange2.jpeg", "/car-images/McLarenOrange3.jpeg"]'::jsonb,
    '["Retractable hardtop", "ProActive chassis control", "Carbon fiber body", "Airbrake system", "Iris recognition", "Meridian sound system", "Active Airbrake deployment system", "ProActive Chassis Control suspension", "Premium Volcano Orange multi-layer paint"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "0-60 mph in 2.9s", "topSpeed": "207 mph", "transmission": "7-Speed SSG", "drivetrain": "RWD"}'::jsonb
);

-- Verify the inserted data
SELECT 
    id,
    make || ' ' || model as car_name,
    category,
    slug,
    daily_rate,
    four_hour_rate,
    security_deposit,
    status,
    jsonb_array_length(images) as image_count
FROM cars
WHERE slug IN ('corvette-c8-r', 'mclaren-570s', 'lamborghini-huracan', 'maserati-levante', 'lamborghini-urus', 'mclaren-650s')
ORDER BY daily_rate DESC;

-- Show success message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully seeded 6 luxury vehicles with local image paths!';
    RAISE NOTICE '   ';
    RAISE NOTICE '   🚗 Corvette C8-R - $419/day';
    RAISE NOTICE '   🏎️  McLaren 570S Spyder - $1,199/day';
    RAISE NOTICE '   🏎️  Lamborghini Huracan - $1,049/day';
    RAISE NOTICE '   🚙 Maserati Levante - $199/day';
    RAISE NOTICE '   🚙 Lamborghini Urus - $1,049/day';
    RAISE NOTICE '   🏎️  McLaren 650S Spyder - $1,399/day';
    RAISE NOTICE '   ';
    RAISE NOTICE '   Images are using local paths from /public/car-images/';
    RAISE NOTICE '   Frontend will display these automatically!';
END $$;
