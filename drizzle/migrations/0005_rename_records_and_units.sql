ALTER TABLE `workout_history` RENAME TO `records`;--> statement-breakpoint
ALTER TABLE `records` RENAME COLUMN `duration` TO `duration_seconds`;--> statement-breakpoint
ALTER TABLE `workout_session_exercises` RENAME TO `record_exercises`;--> statement-breakpoint
ALTER TABLE `record_exercises` RENAME COLUMN `history_id` TO `record_id`;--> statement-breakpoint
ALTER TABLE `workout_session_sets` RENAME TO `record_sets`;--> statement-breakpoint
ALTER TABLE `record_sets` RENAME COLUMN `session_exercise_id` TO `record_exercise_id`;--> statement-breakpoint
ALTER TABLE `record_sets` RENAME COLUMN `weight` TO `weight_kg`;--> statement-breakpoint
ALTER TABLE `record_sets` RENAME COLUMN `duration` TO `duration_seconds`;--> statement-breakpoint
ALTER TABLE `record_sets` RENAME COLUMN `distance` TO `distance_m`;--> statement-breakpoint
ALTER TABLE `workout_exercises` RENAME COLUMN `target_duration` TO `target_duration_seconds`;--> statement-breakpoint
ALTER TABLE `workout_exercises` RENAME COLUMN `target_weight` TO `target_weight_kg`;
