CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'strength' NOT NULL,
	`metrics` text NOT NULL,
	`default_targets` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `record_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`notes` text,
	FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `record_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`record_exercise_id` text NOT NULL,
	`set_number` integer NOT NULL,
	`reps` integer,
	`weight_kg` real,
	`duration_seconds` integer,
	`distance_m` real,
	FOREIGN KEY (`record_exercise_id`) REFERENCES `record_exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workout_id` text,
	`exercise_id` text,
	`title` text,
	`performed_at` integer NOT NULL,
	`duration_seconds` integer,
	`notes` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text DEFAULT '' NOT NULL,
	`password` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`target_sets` integer,
	`target_reps` integer,
	`target_duration_seconds` integer,
	`target_weight_kg` real,
	`target_distance_m` real,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
