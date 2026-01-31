/*
  Adriatic Bay Exotics - Initial Inventory Seed
  Module: 1.4
  Description: Sample data for testing and initial launch.
*/

-- ROLLBACK SQL
-- DELETE FROM cars WHERE make IN ('Lamborghini', 'Ferrari', 'Porsche', 'Rolls-Royce');

-- Seeding Initial Inventory
INSERT INTO cars (make, model, year, vin, license_plate, daily_rate, status, features, specifications)
VALUES 
(
    'Lamborghini', 'Huracan Evo', 2023, 'VIN1234567890LAM', 'EVO-001', 1200.00, 'available',
    '["V10 Engine", "AWD", "Lifting System", "Apple CarPlay", "Carbon Ceramic Brakes"]'::jsonb,
    '{"engine": "5.2L V10", "power": "640 HP", "top_speed": "202 mph", "0-60": "2.9s"}'::jsonb
),
(
    'Ferrari', 'F8 Tributo', 2022, 'VIN0987654321FER', 'F8-TRIB', 1350.00, 'available',
    '["Twin Turbo V8", "RWD", "S-Duct Aerodynamics", "Racing Seats"]'::jsonb,
    '{"engine": "3.9L V8", "power": "710 HP", "top_speed": "211 mph", "0-60": "2.9s"}'::jsonb
),
(
    'Porsche', '911 GT3 (992)', 2024, 'VIN456789123POR', 'GT3-RS', 950.00, 'available',
    '["Naturally Aspirated Boxter", "Rear Axle Steering", "PDK", "Club Sport Package"]'::jsonb,
    '{"engine": "4.0L Flat-6", "power": "502 HP", "top_speed": "197 mph", "0-60": "3.2s"}'::jsonb
),
(
    'Rolls-Royce', 'Ghost', 2023, 'VIN789123456RR', 'ROYCE-G', 1500.00, 'available',
    '["V12 Engine", "Planar Suspension", "Starlight Headliner", "Massage Seats"]'::jsonb,
    '{"engine": "6.75L V12", "power": "563 HP", "top_speed": "155 mph", "0-60": "4.6s"}'::jsonb
);

-- Seed Initial Promo Code
INSERT INTO promo_codes (code, discount_type, discount_value, start_date, end_date, min_rental_days, status)
VALUES 
('WELCOME2024', 'percentage', 10.00, NOW(), NOW() + INTERVAL '1 year', 2, 'active');
