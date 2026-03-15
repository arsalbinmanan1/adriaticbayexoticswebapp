-- Deactivate Valentine's Day 2026 campaign
UPDATE campaigns
SET status = 'inactive'
WHERE slug = 'valentine-2026';
