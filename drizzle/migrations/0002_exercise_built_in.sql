ALTER TABLE `exercises` ADD `built_in` integer DEFAULT false NOT NULL;--> statement-breakpoint
UPDATE `exercises` SET `built_in` = true, `description` = 'Pause between workout steps' WHERE `type` = 'rest';
