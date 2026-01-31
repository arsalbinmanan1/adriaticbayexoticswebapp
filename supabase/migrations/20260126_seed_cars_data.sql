/*
  Adriatic Bay Exotics - Initial Car Inventory Seed
  Description: Populates the cars table with data from lib/cars-data.ts.
*/

INSERT INTO cars (
    make, model, year, vin, license_plate, daily_rate, deposit_amount, 
    slug, category, description, detailed_description, 
    images, features, specifications, status
) VALUES 
-- 1. Corvette C8-R
(
    'Chevrolet', 'Corvette C8-R', 2024, 'VIN-VETTE-C8R-2024', 'VETTE-R', 419.00, 1000.00,
    'corvette-c8-r', 'sports', 
    'The Corvette C8-R represents American supercar excellence with its revolutionary mid-engine design.',
    '{"vibe": "A track-born instant collectible...", "highlights": ["Z51 Performance Package", "Exclusive C8.R Edition"]}'::jsonb,
    '["/car-images/Corvette1.jpeg", "/car-images/Corvette2.jpeg", "/car-images/Corvette3.jpeg"]'::jsonb,
    '["Mid-engine layout", "Magnetic ride control", "Performance exhaust"]'::jsonb,
    '{"engine": "6.2L V8", "horsepower": "495 HP", "acceleration": "2.9s", "topSpeed": "194 mph"}'::jsonb,
    'available'
),
-- 2. McLaren 570S Spyder
(
    'McLaren', '570S Spyder', 2023, 'VIN-MCL-570S-2023', 'MCL-570', 1199.00, 1000.00,
    'mclaren-570s', 'exotic',
    'The McLaren 570S delivers pure driving pleasure with Formula 1-inspired technology.',
    '{"vibe": "British engineering meets pure adrenaline...", "highlights": ["Dihedral Doors", "Carbon Fiber Monocell"]}'::jsonb,
    '["/car-images/McLarenBlue2.jpeg", "/car-images/McLarenBlue1.jpeg"]'::jsonb,
    '["Carbon fiber monocoque", "Dihedral doors", "Active aerodynamics"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "562 HP", "acceleration": "3.1s", "topSpeed": "204 mph"}'::jsonb,
    'available'
),
-- 3. Lamborghini Huracan Spyder
(
    'Lamborghini', 'Huracan Spyder LP 580', 2024, 'VIN-LAM-HUR-2024', 'LAM-580', 1049.00, 1000.00,
    'lamborghini-huracan', 'exotic',
    'The Lamborghini Huracan EVO is Italian supercar perfection.',
    '{"vibe": "The poster car for Italian aggression...", "highlights": ["Naturally Aspirated V10", "RWD Setup"]}'::jsonb,
    '["/car-images/Lamborghini1.jpeg", "/car-images/Lamborghini2.jpeg", "/car-images/Lamborghini3.jpeg"]'::jsonb,
    '["All-wheel drive", "Rear-wheel steering", "Sport exhaust"]'::jsonb,
    '{"engine": "5.2L V10", "horsepower": "631 HP", "acceleration": "2.9s", "topSpeed": "202 mph"}'::jsonb,
    'available'
),
-- 4. Maserati Levante
(
    'Maserati', 'Levante GrandSport Q4', 2024, 'VIN-MAS-LEV-2024', 'MAS-LEV', 199.00, 500.00,
    'maserati-levante', 'luxury',
    'The Maserati Levante combines Italian luxury with SUV practicality.',
    '{"vibe": "The SUV that thinks it''s a Ferrari...", "highlights": ["Q4 Intelligent AWD", "GranSport Trim"]}'::jsonb,
    '["/car-images/maserati1.webp", "/car-images/maserati2.jpg"]'::jsonb,
    '["Luxury SUV comfort", "Premium leather interior", "Panoramic sunroof"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "580 HP", "acceleration": "3.8s", "topSpeed": "187 mph"}'::jsonb,
    'available'
),
-- 5. Lamborghini Urus
(
    'Lamborghini', 'Urus', 2024, 'VIN-LAM-URU-2024', 'LAM-URU', 1049.00, 1000.00,
    'lamborghini-urus', 'exotic',
    'The Lamborghini Urus is the world''s first Super Sport Utility Vehicle.',
    '{"vibe": "The world''s first Super Sport Utility Vehicle...", "highlights": ["Supercar Speed", "Ceramic Brakes"]}'::jsonb,
    '["/car-images/Urus1.jpeg", "/car-images/Urus2.jpeg", "/car-images/Urus3.jpeg"]'::jsonb,
    '["Super SUV performance", "Carbon ceramic brakes", "Multiple drive modes"]'::jsonb,
    '{"engine": "4.0L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "3.6s", "topSpeed": "190 mph"}'::jsonb,
    'available'
),
-- 6. McLaren 650S Spyder
(
    'McLaren', '650S Spyder', 2023, 'VIN-MCL-650S-2023', 'MCL-650', 1399.00, 500.00,
    'mclaren-650s', 'exotic',
    'The McLaren 650S Spider offers open-top thrills with brutal performance.',
    '{"vibe": "A technological marvel...", "highlights": ["Active Airbrake", "Volcano Orange Paint"]}'::jsonb,
    '["/car-images/McLarenOrange1.jpeg", "/car-images/McLarenOrange2.jpeg", "/car-images/McLarenOrange3.jpeg"]'::jsonb,
    '["Retractable hardtop", "Airbrake system", "Meridian sound system"]'::jsonb,
    '{"engine": "3.8L Twin-Turbo V8", "horsepower": "641 HP", "acceleration": "2.9s", "topSpeed": "207 mph"}'::jsonb,
    'available'
)
ON CONFLICT (vin) DO NOTHING;
