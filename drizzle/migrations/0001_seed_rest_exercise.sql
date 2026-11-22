INSERT INTO `exercises` (`id`, `name`, `type`, `metrics`, `created_at`, `updated_at`)
SELECT 'f6a415fd-2920-4e7a-991a-bc10261cfe4a', 'Rest', 'rest', '["duration"]', unixepoch(), unixepoch()
WHERE NOT EXISTS (SELECT 1 FROM `exercises` WHERE `type` = 'rest');
