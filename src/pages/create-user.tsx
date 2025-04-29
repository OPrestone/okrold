import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Access group options
const accessGroups = [
	{
		id: "admin",
		label: "Admin",
		description:
			"Full system access with all permissions. Can manage users, settings, OKRs, and all other system functionalities.",
	},
	{
		id: "executive",
		label: "Executive",
		description:
			"System-wide visibility. Can view all Objectives and Key Results (OKRs) across the organization. Has access to check-ins and 1:1 meeting data across all teams.",
	},
	{
		id: "team_leader",
		label: "Team Leader",
		description:
			"Management rights limited to their specific team. Can create, edit, and manage their team's OKRs and monitor progress.",
	},
	{
		id: "user",
		label: "User",
		description:
			"Limited to viewing their assigned team's OKRs and objectives. Can edit Key Results assigned specifically to them.",
	},
];

// Language options
const languages = [
	{ id: "en", name: "English" },
	{ id: "es", name: "Spanish" },
	{ id: "fr", name: "French" },
	{ id: "de", name: "German" },
	{ id: "zh", name: "Chinese" },
	{ id: "ja", name: "Japanese" },
];

// Extend the insert schema with Zod validation
const userFormSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name must be less than 50 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name must be less than 50 characters"),
	email: z.string().email("Please enter a valid email address"),
	language: z.string().min(1, "Please select a language"),
	accessGroup: z.string().min(1, "Please select an access group"),
	teamId: z.number().nullable().optional(),
	managerId: z.number().nullable().optional(),
	sendInvite: z.boolean().default(false),
	password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function CreateUser() {
	const [managerOpen, setManagerOpen] = useState(false);
	const [teamOpen, setTeamOpen] = useState(false);
	const [, navigate] = useLocation();
	const { toast } = useToast();

	// Fetch users for manager selection
	const { data: users = [], isLoading: isLoadingUsers } = useQuery<any[]>({
		queryKey: ["/api/users"],
	});

	// Fetch teams for team selection
	const { data: teams = [], isLoading: isLoadingTeams } = useQuery<any[]>({
		queryKey: ["/api/teams"],
	});

	// Initialize form with default values
	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			language: "en",
			accessGroup: "user",
			teamId: null,
			managerId: null,
			sendInvite: true,
			password: "",
		},
	});

	// Create user mutation
	const createUserMutation = useMutation({
		mutationFn: async (data: UserFormValues) => {
			// Transform the form data to match the API schema
			const userData = {
				username: data.email.split("@")[0], // Generate username from email
				password: data.password,
				fullName: `${data.firstName} ${data.lastName}`,
				email: data.email,
				role: data.accessGroup,
				teamId: data.teamId,
				// Additional fields from the form
				language: data.language,
				managerId: data.managerId,
				sendInvite: data.sendInvite,
			};

			const response = await apiRequest("POST", "/api/users", userData);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/users"] });
			toast({
				title: "User created",
				description: "The user has been created successfully",
			});
			navigate("/users");
		},
		onError: (error) => {
			console.error("Error creating user:", error);
			toast({
				title: "Error",
				description: "Failed to create user. Please try again.",
				variant: "destructive",
			});
		},
	});

	// Form submission handler
	function onSubmit(data: UserFormValues) {
		console.log("Form submitted:", data);
		createUserMutation.mutate(data);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-neutral-900 mb-2">Add New User</h1>
				<p className="text-neutral-600">
					Create a new user account in the OKR system
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>User Information</CardTitle>
					<CardDescription>
						Provide the user's details and set appropriate access permissions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Name Fields - First and Last Name */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name*</FormLabel>
											<FormControl>
												<Input placeholder="Enter first name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name*</FormLabel>
											<FormControl>
												<Input placeholder="Enter last name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email*</FormLabel>
										<FormControl>
											<Input placeholder="user@company.com" {...field} />
										</FormControl>
										<FormDescription>User's official email address</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password Field */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password*</FormLabel>
										<FormControl>
											<Input type="password" placeholder="Enter password" {...field} />
										</FormControl>
										<FormDescription>Must be at least 8 characters</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Language Selection */}
							<FormField
								control={form.control}
								name="language"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Language</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select language" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{languages.map((language) => (
													<SelectItem key={language.id} value={language.id}>
														{language.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Access Group Selection */}
							<FormField
								control={form.control}
								name="accessGroup"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Access Group*</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select access level" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{accessGroups.map((group) => (
													<SelectItem key={group.id} value={group.id}>
														{group.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											{accessGroups.find((group) => group.id === field.value)?.description}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Team Selection */}
							<FormField
								control={form.control}
								name="teamId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Team</FormLabel>
										<Popover open={teamOpen} onOpenChange={setTeamOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={teamOpen}
														className="w-full justify-between"
													>
														{field.value && teams.length
															? teams.find((team: any) => team.id === field.value)?.name
															: "Select team"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Search teams..." />
													<CommandEmpty>No teams found.</CommandEmpty>
													<CommandGroup>
														{teams.map((team: any) => (
															<CommandItem
																key={team.id}
																value={team.name}
																onSelect={() => {
																	form.setValue("teamId", team.id);
																	setTeamOpen(false);
																}}
															>
																<Check
																	className={`mr-2 h-4 w-4 ${
																		field.value === team.id ? "opacity-100" : "opacity-0"
																	}`}
																/>
																{team.name}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormDescription>The team this user belongs to</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Manager Selection */}
							<FormField
								control={form.control}
								name="managerId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Manager</FormLabel>
										<Popover open={managerOpen} onOpenChange={setManagerOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={managerOpen}
														className="w-full justify-between"
													>
														{field.value && users.length
															? users.find((user: any) => user.id === field.value)?.fullName
															: "Select manager"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Search users..." />
													<CommandEmpty>No users found.</CommandEmpty>
													<CommandGroup>
														{users.map((user: any) => (
															<CommandItem
																key={user.id}
																value={user.fullName}
																onSelect={() => {
																	form.setValue("managerId", user.id);
																	setManagerOpen(false);
																}}
															>
																<Check
																	className={`mr-2 h-4 w-4 ${
																		field.value === user.id ? "opacity-100" : "opacity-0"
																	}`}
																/>
																{user.fullName}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormDescription>The person who manages this user</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Send Invitation Checkbox */}
							<FormField
								control={form.control}
								name="sendInvite"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Send invitation by email</FormLabel>
											<FormDescription>
												A welcome email will be sent with login instructions
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>

							<div className="flex justify-end space-x-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/users")}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={createUserMutation.isPending}>
									{createUserMutation.isPending ? "Creating..." : "Save User"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
