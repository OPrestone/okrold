import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	jsonb,
	pgTable,
	real,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Company settings schema
export const companySettings = pgTable("company_settings", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().default("My Company"),
	logoUrl: text("logo_url"),
	primaryColor: text("primary_color").default("#4f46e5"), // Default primary color
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCompanySettingsSchema = createInsertSchema(
	companySettings
).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;

// User schema
export const users = pgTable(
	"users",
	{
		id: serial("id").primaryKey(),
		username: varchar("username", { length: 50 }).notNull().unique(),
		password: varchar("password", { length: 255 }).notNull(),
		fullName: varchar("full_name", { length: 100 }).notNull(),
		email: varchar("email", { length: 100 }).notNull().unique(),
		role: varchar("role", { length: 50 }).notNull().default("user"),
		teamId: integer("team_id"),
		position: text("position"),
		bio: text("bio"),
		language: varchar("language", { length: 10 }).default("en"),
		avatarUrl: text("avatar_url"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			teamIdIdx: index("users_team_id_idx").on(table.teamId),
		};
	}
);

// Relations will be defined after all tables
export const usersRelations = relations(users, ({ one, many }) => ({
	team: one(teams, {
		fields: [users.teamId],
		references: [teams.id],
	}),
	objectives: many(objectives, {
		relationName: "owner",
	}),
	keyResults: many(keyResults, {
		relationName: "owner",
	}),
	usersMeetings1: many(meetings, {
		relationName: "participant1",
	}),
	usersMeetings2: many(meetings, {
		relationName: "participant2",
	}),
	userCycles: many(userCycles, {
		relationName: "user",
	}),
}));

export const insertUserSchema = createInsertSchema(users).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Team schema
export const teams = pgTable(
	"teams",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		leaderId: integer("leader_id").references(() => users.id),
		description: text("description"),
		parentTeamId: integer("parent_team_id").references(() => teams.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			leaderIdIdx: index("teams_leader_id_idx").on(table.leaderId),
			parentTeamIdIdx: index("teams_parent_team_id_idx").on(table.parentTeamId),
		};
	}
);

// Simplified relations to avoid circular references
export const teamsRelations = relations(teams, ({ one, many }) => ({
	leader: one(users, {
		fields: [teams.leaderId],
		references: [users.id],
	}),
	parentTeam: one(teams, {
		fields: [teams.parentTeamId],
		references: [teams.id],
	}),
	childTeams: many(teams, {
		relationName: "parentTeam",
	}),
	users: many(users),
}));

export const insertTeamSchema = createInsertSchema(teams).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Cycle schema
export const cycles = pgTable(
	"cycles",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		description: text("description"),
		startDate: timestamp("start_date").notNull(),
		endDate: timestamp("end_date").notNull(),
		status: varchar("status", { length: 20 }).default("upcoming"), // upcoming, active, completed
		type: varchar("type", { length: 20 }).notNull(), // quarterly, annual, custom
		createdById: integer("created_by_id").references(() => users.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
		isDefault: boolean("is_default").default(false),
	},
	(table) => {
		return {
			createdByIdIdx: index("cycles_created_by_id_idx").on(table.createdById),
			dateIdx: index("cycles_date_idx").on(table.startDate, table.endDate),
		};
	}
);

// Simplified relations to avoid circular references
export const cyclesRelations = relations(cycles, ({ one }) => ({
	createdBy: one(users, {
		fields: [cycles.createdById],
		references: [users.id],
	}),
}));

export const insertCycleSchema = createInsertSchema(cycles)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		startDate: z.string().transform((str) => new Date(str)),
		endDate: z.string().transform((str) => new Date(str)),
	});

// User-Cycle relationship
export const userCycles = pgTable(
	"user_cycles",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id),
		cycleId: integer("cycle_id")
			.notNull()
			.references(() => cycles.id),
		objectiveCount: integer("objective_count").default(0),
		completedObjectives: integer("completed_objectives").default(0),
		performance: real("performance").default(0),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			userIdIdx: index("user_cycles_user_id_idx").on(table.userId),
			cycleIdIdx: index("user_cycles_cycle_id_idx").on(table.cycleId),
			userCycleUnique: uniqueIndex("user_cycle_unique_idx").on(
				table.userId,
				table.cycleId
			),
		};
	}
);

export const userCyclesRelations = relations(userCycles, ({ one }) => ({
	user: one(users, {
		fields: [userCycles.userId],
		references: [users.id],
	}),
	cycle: one(cycles, {
		fields: [userCycles.cycleId],
		references: [cycles.id],
	}),
}));

export const insertUserCycleSchema = createInsertSchema(userCycles).omit({
	id: true,
	createdAt: true,
});

// Team-Cycle relationship
export const teamCycles = pgTable(
	"team_cycles",
	{
		id: serial("id").primaryKey(),
		teamId: integer("team_id")
			.notNull()
			.references(() => teams.id),
		cycleId: integer("cycle_id")
			.notNull()
			.references(() => cycles.id),
		objectiveCount: integer("objective_count").default(0),
		completedObjectives: integer("completed_objectives").default(0),
		performance: real("performance").default(0),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			teamIdIdx: index("team_cycles_team_id_idx").on(table.teamId),
			cycleIdIdx: index("team_cycles_cycle_id_idx").on(table.cycleId),
			teamCycleUnique: uniqueIndex("team_cycle_unique_idx").on(
				table.teamId,
				table.cycleId
			),
		};
	}
);

export const teamCyclesRelations = relations(teamCycles, ({ one }) => ({
	team: one(teams, {
		fields: [teamCycles.teamId],
		references: [teams.id],
	}),
	cycle: one(cycles, {
		fields: [teamCycles.cycleId],
		references: [cycles.id],
	}),
}));

export const insertTeamCycleSchema = createInsertSchema(teamCycles).omit({
	id: true,
	createdAt: true,
});

// Objective schema
export const objectives = pgTable(
	"objectives",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		progress: real("progress").default(0),
		teamId: integer("team_id").references(() => teams.id),
		ownerId: integer("owner_id").references(() => users.id),
		isCompanyObjective: boolean("is_company_objective").default(false),
		startDate: timestamp("start_date").notNull(),
		endDate: timestamp("end_date").notNull(),
		cycleId: integer("cycle_id").references(() => cycles.id),
		status: varchar("status", { length: 20 }).default("active"), // active, completed, cancelled
		priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
		parentObjectiveId: integer("parent_objective_id").references(
			() => objectives.id
		),
		createdById: integer("created_by_id").references(() => users.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
		aiGenerated: boolean("ai_generated").default(false),
		confidenceScore: integer("confidence_score").default(5), // 1-10 scale
	},
	(table) => {
		return {
			teamIdIdx: index("objectives_team_id_idx").on(table.teamId),
			ownerIdIdx: index("objectives_owner_id_idx").on(table.ownerId),
			cycleIdIdx: index("objectives_cycle_id_idx").on(table.cycleId),
			parentObjectiveIdIdx: index("objectives_parent_objective_id_idx").on(
				table.parentObjectiveId
			),
			createdByIdIdx: index("objectives_created_by_id_idx").on(table.createdById),
			dateIdx: index("objectives_date_idx").on(table.startDate, table.endDate),
		};
	}
);

// Simplified relations to avoid circular references
export const objectivesRelations = relations(objectives, ({ one, many }) => ({
	team: one(teams, {
		fields: [objectives.teamId],
		references: [teams.id],
	}),
	owner: one(users, {
		fields: [objectives.ownerId],
		references: [users.id],
	}),
	cycle: one(cycles, {
		fields: [objectives.cycleId],
		references: [cycles.id],
	}),
	parentObjective: one(objectives, {
		fields: [objectives.parentObjectiveId],
		references: [objectives.id],
	}),
	childObjectives: many(objectives, {
		relationName: "parentObjective",
	}),
	createdBy: one(users, {
		fields: [objectives.createdById],
		references: [users.id],
	}),
}));

export const insertObjectiveSchema = createInsertSchema(objectives)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		startDate: z.string().transform((str) => new Date(str)),
		endDate: z.string().transform((str) => new Date(str)),
	});

// Key Result schema
export const keyResults = pgTable(
	"key_results",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		progress: real("progress").default(0),
		objectiveId: integer("objective_id")
			.notNull()
			.references(() => objectives.id),
		ownerId: integer("owner_id").references(() => users.id),
		startValue: real("start_value").default(0),
		targetValue: real("target_value"),
		currentValue: real("current_value"),
		isCompleted: boolean("is_completed").default(false),
		unit: varchar("unit", { length: 50 }),
		format: varchar("format", { length: 20 }).default("number"), // number, percentage, currency, boolean
		direction: varchar("direction", { length: 10 }).default("increasing"), // increasing, decreasing
		confidenceScore: integer("confidence_score").default(5), // 1-10 scale
		lastUpdated: timestamp("last_updated"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			objectiveIdIdx: index("key_results_objective_id_idx").on(table.objectiveId),
			ownerIdIdx: index("key_results_owner_id_idx").on(table.ownerId),
		};
	}
);

// Simplified relations to avoid circular references
export const keyResultsRelations = relations(keyResults, ({ one }) => ({
	objective: one(objectives, {
		fields: [keyResults.objectiveId],
		references: [objectives.id],
	}),
	owner: one(users, {
		fields: [keyResults.ownerId],
		references: [users.id],
	}),
}));

export const insertKeyResultSchema = createInsertSchema(keyResults).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Check-In schema
export const checkIns = pgTable(
	"check_ins",
	{
		id: serial("id").primaryKey(),
		objectiveId: integer("objective_id").references(() => objectives.id),
		keyResultId: integer("key_result_id").references(() => keyResults.id),
		authorId: integer("author_id")
			.notNull()
			.references(() => users.id),
		newValue: real("new_value"),
		previousValue: real("previous_value"),
		progressDelta: real("progress_delta"),
		note: text("note"),
		confidenceScore: integer("confidence_score"),
		checkInDate: timestamp("check_in_date").notNull().defaultNow(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			objectiveIdIdx: index("check_ins_objective_id_idx").on(table.objectiveId),
			keyResultIdIdx: index("check_ins_key_result_id_idx").on(table.keyResultId),
			authorIdIdx: index("check_ins_author_id_idx").on(table.authorId),
			dateIdx: index("check_ins_date_idx").on(table.checkInDate),
		};
	}
);

export const checkInsRelations = relations(checkIns, ({ one }) => ({
	objective: one(objectives, {
		fields: [checkIns.objectiveId],
		references: [objectives.id],
	}),
	keyResult: one(keyResults, {
		fields: [checkIns.keyResultId],
		references: [keyResults.id],
	}),
	author: one(users, {
		fields: [checkIns.authorId],
		references: [users.id],
	}),
}));

export const insertCheckInSchema = createInsertSchema(checkIns)
	.omit({
		id: true,
		createdAt: true,
	})
	.extend({
		checkInDate: z.string().transform((str) => new Date(str)),
	});

// Comments schema
export const comments = pgTable(
	"comments",
	{
		id: serial("id").primaryKey(),
		authorId: integer("author_id")
			.notNull()
			.references(() => users.id),
		content: text("content").notNull(),
		objectiveId: integer("objective_id").references(() => objectives.id),
		keyResultId: integer("key_result_id").references(() => keyResults.id),
		parentCommentId: integer("parent_comment_id").references(() => comments.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			authorIdIdx: index("comments_author_id_idx").on(table.authorId),
			objectiveIdIdx: index("comments_objective_id_idx").on(table.objectiveId),
			keyResultIdIdx: index("comments_key_result_id_idx").on(table.keyResultId),
			parentCommentIdIdx: index("comments_parent_comment_id_idx").on(
				table.parentCommentId
			),
		};
	}
);

// Simplified relations to avoid circular references
export const commentsRelations = relations(comments, ({ one, many }) => ({
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
	objective: one(objectives, {
		fields: [comments.objectiveId],
		references: [objectives.id],
	}),
	keyResult: one(keyResults, {
		fields: [comments.keyResultId],
		references: [keyResults.id],
	}),
	parentComment: one(comments, {
		fields: [comments.parentCommentId],
		references: [comments.id],
	}),
	// Only defining the direct relation to avoid circular issues
	childComments: many(comments, {
		relationName: "parentComment",
	}),
}));

export const insertCommentSchema = createInsertSchema(comments).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Meeting schema
export const meetings = pgTable(
	"meetings",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		startTime: timestamp("start_time").notNull(),
		endTime: timestamp("end_time").notNull(),
		userId1: integer("user_id_1")
			.notNull()
			.references(() => users.id),
		userId2: integer("user_id_2")
			.notNull()
			.references(() => users.id),
		status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, completed, cancelled
		meetingType: varchar("meeting_type", { length: 50 }).default("1on1"), // 1on1, team, review, other
		location: varchar("location", { length: 255 }),
		notes: text("notes"),
		recordingUrl: text("recording_url"),
		recurrence: varchar("recurrence", { length: 50 }), // weekly, biweekly, monthly, none
		objectiveId: integer("objective_id").references(() => objectives.id),
		isVirtual: boolean("is_virtual").default(false),
		meetingLink: text("meeting_link"), // URL for virtual meetings (Google Meet, Zoom, etc.)
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			userId1Idx: index("meetings_user_id_1_idx").on(table.userId1),
			userId2Idx: index("meetings_user_id_2_idx").on(table.userId2),
			objectiveIdIdx: index("meetings_objective_id_idx").on(table.objectiveId),
			timeIdx: index("meetings_time_idx").on(table.startTime, table.endTime),
		};
	}
);

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
	participant1: one(users, {
		fields: [meetings.userId1],
		references: [users.id],
		relationName: "participant1",
	}),
	participant2: one(users, {
		fields: [meetings.userId2],
		references: [users.id],
		relationName: "participant2",
	}),
	objective: one(objectives, {
		fields: [meetings.objectiveId],
		references: [objectives.id],
	}),
	meetingAgendaItems: many(meetingAgendaItems, {
		relationName: "meeting",
	}),
}));

export const insertMeetingSchema = createInsertSchema(meetings)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.extend({
		startTime: z.string().transform((str) => new Date(str)),
		endTime: z.string().transform((str) => new Date(str)),
	});

// Meeting Agenda Items schema
export const meetingAgendaItems = pgTable(
	"meeting_agenda_items",
	{
		id: serial("id").primaryKey(),
		meetingId: integer("meeting_id")
			.notNull()
			.references(() => meetings.id),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		orderIndex: integer("order_index").default(0),
		status: varchar("status", { length: 20 }).default("pending"), // pending, discussed, action_required
		assigneeId: integer("assignee_id").references(() => users.id),
		dueDate: timestamp("due_date"),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			meetingIdIdx: index("meeting_agenda_items_meeting_id_idx").on(
				table.meetingId
			),
			assigneeIdIdx: index("meeting_agenda_items_assignee_id_idx").on(
				table.assigneeId
			),
		};
	}
);

export const meetingAgendaItemsRelations = relations(
	meetingAgendaItems,
	({ one }) => ({
		meeting: one(meetings, {
			fields: [meetingAgendaItems.meetingId],
			references: [meetings.id],
		}),
		assignee: one(users, {
			fields: [meetingAgendaItems.assigneeId],
			references: [users.id],
		}),
	})
);

export const insertMeetingAgendaItemSchema = createInsertSchema(
	meetingAgendaItems
).omit({
	id: true,
	createdAt: true,
});

// Resource schema
export const resources = pgTable(
	"resources",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		type: varchar("type", { length: 50 }).notNull(), // article, video, template, guide
		url: text("url"),
		category: varchar("category", { length: 100 }), // onboarding, best_practices, examples
		tags: text("tags").array(),
		authorId: integer("author_id").references(() => users.id),
		isPublic: boolean("is_public").default(true),
		downloadCount: integer("download_count").default(0),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			typeIdx: index("resources_type_idx").on(table.type),
			categoryIdx: index("resources_category_idx").on(table.category),
			authorIdIdx: index("resources_author_id_idx").on(table.authorId),
		};
	}
);

export const resourcesRelations = relations(resources, ({ one }) => ({
	author: one(users, {
		fields: [resources.authorId],
		references: [users.id],
	}),
}));

export const insertResourceSchema = createInsertSchema(resources).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Financial Data schema
export const financialData = pgTable(
	"financial_data",
	{
		id: serial("id").primaryKey(),
		date: date("date").notNull(),
		revenue: real("revenue"),
		cost: real("cost"),
		ebitda: real("ebitda"),
		profitAfterTaxMargin: real("profit_after_tax_margin"),
		cumulativeAudience: integer("cumulative_audience"),
		notes: text("notes"),
		objectiveId: integer("objective_id").references(() => objectives.id),
		uploadedById: integer("uploaded_by_id").references(() => users.id),
		teamId: integer("team_id").references(() => teams.id),
		quarter: varchar("quarter", { length: 10 }),
		year: integer("year"),
		source: varchar("source", { length: 100 }),
		uploadedAt: timestamp("uploaded_at").defaultNow(),
	},
	(table) => {
		return {
			objectiveIdIdx: index("financial_data_objective_id_idx").on(
				table.objectiveId
			),
			uploadedByIdIdx: index("financial_data_uploaded_by_id_idx").on(
				table.uploadedById
			),
			teamIdIdx: index("financial_data_team_id_idx").on(table.teamId),
			dateIdx: index("financial_data_date_idx").on(table.date),
			quarterYearIdx: index("financial_data_quarter_year_idx").on(
				table.quarter,
				table.year
			),
		};
	}
);

export const financialDataRelations = relations(financialData, ({ one }) => ({
	objective: one(objectives, {
		fields: [financialData.objectiveId],
		references: [objectives.id],
	}),
	uploadedBy: one(users, {
		fields: [financialData.uploadedById],
		references: [users.id],
	}),
	team: one(teams, {
		fields: [financialData.teamId],
		references: [teams.id],
	}),
}));

export const insertFinancialDataSchema = createInsertSchema(financialData).omit(
	{
		id: true,
		uploadedAt: true,
	}
);

// Notifications schema
export const notifications = pgTable(
	"notifications",
	{
		id: serial("id").primaryKey(),
		recipientId: integer("recipient_id")
			.notNull()
			.references(() => users.id),
		title: varchar("title", { length: 255 }).notNull(),
		content: text("content").notNull(),
		type: varchar("type", { length: 50 }).notNull(), // objective_update, meeting_reminder, assignment, comment, etc.
		isRead: boolean("is_read").default(false),
		entityType: varchar("entity_type", { length: 50 }), // objective, key_result, meeting, etc.
		entityId: integer("entity_id"),
		priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
		additionalData: jsonb("additional_data"),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			recipientIdIdx: index("notifications_recipient_id_idx").on(
				table.recipientId
			),
			entityTypeIdIdx: index("notifications_entity_type_id_idx").on(
				table.entityType,
				table.entityId
			),
			isReadIdx: index("notifications_is_read_idx").on(table.isRead),
		};
	}
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
	recipient: one(users, {
		fields: [notifications.recipientId],
		references: [users.id],
		relationName: "recipient",
	}),
}));

export const insertNotificationSchema = createInsertSchema(notifications).omit({
	id: true,
	createdAt: true,
});

// User Settings schema
export const userSettings = pgTable("user_settings", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id)
		.unique(),
	emailNotifications: boolean("email_notifications").default(true),
	pushNotifications: boolean("push_notifications").default(true),
	theme: varchar("theme", { length: 20 }).default("light"),
	dashboardLayout: jsonb("dashboard_layout"),
	weeklyDigest: boolean("weekly_digest").default(true),
	reminderFrequency: varchar("reminder_frequency", { length: 20 }).default(
		"daily"
	),
	timezone: varchar("timezone", { length: 50 }).default("UTC"),
	language: varchar("language", { length: 10 }).default("en"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
	user: one(users, {
		fields: [userSettings.userId],
		references: [users.id],
	}),
}));

export const insertUserSettingSchema = createInsertSchema(userSettings).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// System Settings schema
export const systemSettings = pgTable(
	"system_settings",
	{
		id: serial("id").primaryKey(),
		key: varchar("key", { length: 100 }).notNull().unique(),
		value: text("value").notNull(),
		description: text("description"),
		category: varchar("category", { length: 100 }).notNull(),
		isPublic: boolean("is_public").default(false),
		lastModifiedById: integer("last_modified_by_id").references(() => users.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			categoryIdx: index("system_settings_category_idx").on(table.category),
			keyIdx: uniqueIndex("system_settings_key_idx").on(table.key),
		};
	}
);

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
	lastModifiedBy: one(users, {
		fields: [systemSettings.lastModifiedById],
		references: [users.id],
	}),
}));

export const insertSystemSettingSchema = createInsertSchema(
	systemSettings
).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Activity Log schema
export const activityLogs = pgTable(
	"activity_logs",
	{
		id: serial("id").primaryKey(),
		userId: integer("user_id").references(() => users.id),
		action: varchar("action", { length: 100 }).notNull(),
		entityType: varchar("entity_type", { length: 50 }).notNull(),
		entityId: integer("entity_id"),
		details: jsonb("details"),
		ip: varchar("ip", { length: 50 }),
		userAgent: text("user_agent"),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => {
		return {
			userIdIdx: index("activity_logs_user_id_idx").on(table.userId),
			actionIdx: index("activity_logs_action_idx").on(table.action),
			entityTypeIdIdx: index("activity_logs_entity_type_id_idx").on(
				table.entityType,
				table.entityId
			),
			createdAtIdx: index("activity_logs_created_at_idx").on(table.createdAt),
		};
	}
);

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id],
	}),
}));

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
	id: true,
	createdAt: true,
});

// Integration schema
export const integrations = pgTable(
	"integrations",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		provider: varchar("provider", { length: 100 }).notNull(),
		status: varchar("status", { length: 20 }).default("inactive"), // active, inactive, error
		config: jsonb("config"),
		metadata: jsonb("metadata"),
		lastSyncedAt: timestamp("last_synced_at"),
		createdById: integer("created_by_id").references(() => users.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			providerIdx: index("integrations_provider_idx").on(table.provider),
			statusIdx: index("integrations_status_idx").on(table.status),
			createdByIdIdx: index("integrations_created_by_id_idx").on(
				table.createdById
			),
		};
	}
);

export const integrationsRelations = relations(integrations, ({ one }) => ({
	createdBy: one(users, {
		fields: [integrations.createdById],
		references: [users.id],
	}),
}));

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Objective = typeof objectives.$inferSelect;
export type InsertObjective = z.infer<typeof insertObjectiveSchema>;

export type KeyResult = typeof keyResults.$inferSelect;
export type InsertKeyResult = z.infer<typeof insertKeyResultSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type MeetingAgendaItem = typeof meetingAgendaItems.$inferSelect;
export type InsertMeetingAgendaItem = z.infer<
	typeof insertMeetingAgendaItemSchema
>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type FinancialData = typeof financialData.$inferSelect;
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;

export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;

export type UserCycle = typeof userCycles.$inferSelect;
export type InsertUserCycle = z.infer<typeof insertUserCycleSchema>;

export type TeamCycle = typeof teamCycles.$inferSelect;
export type InsertTeamCycle = z.infer<typeof insertTeamCycleSchema>;

export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserSetting = typeof userSettings.$inferSelect;
export type InsertUserSetting = z.infer<typeof insertUserSettingSchema>;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
