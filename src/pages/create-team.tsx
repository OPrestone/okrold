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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertTeamSchema } from "@/shared/schema";

// Extend the insert schema with Zod validation
const teamFormSchema = insertTeamSchema.extend({
	name: z
		.string()
		.min(2, "Team name must be at least 2 characters")
		.max(50, "Team name must be less than 50 characters"),
	description: z
		.string()
		.min(5, "Description must be at least 5 characters")
		.max(200, "Description must be less than 200 characters")
		.nullable()
		.optional(),
	leaderId: z.number().nullable().optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function CreateTeam() {
	const [selectedUser, setSelectedUser] = useState<number | null>(null);
	const [teamLeaderOpen, setTeamLeaderOpen] = useState(false);
	const [, navigate] = useLocation();
	const { toast } = useToast();

	const { data: users = [], isLoading: isLoadingUsers } = useQuery<any[]>({
		queryKey: ["/api/users"],
	});

	// Initialize form with default values
	const form = useForm<TeamFormValues>({
		resolver: zodResolver(teamFormSchema),
		defaultValues: {
			name: "",
			description: "",
			leaderId: null,
			memberCount: 0,
			performance: 0,
		},
	});

	// Create team mutation
	const createTeamMutation = useMutation({
		mutationFn: async (data: TeamFormValues) => {
			const response = await apiRequest("POST", "/api/teams", data);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
			toast({
				title: "Team created",
				description: "The team has been created successfully",
			});
			navigate("/teams");
		},
		onError: (error) => {
			console.error("Error creating team:", error);
			toast({
				title: "Error",
				description: "Failed to create team. Please try again.",
				variant: "destructive",
			});
		},
	});

	// Form submission handler
	function onSubmit(data: TeamFormValues) {
		console.log("Form submitted:", data);
		createTeamMutation.mutate(data);
	}

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-neutral-900 mb-2">
					Create New Team
				</h1>
				<p className="text-neutral-600">
					Fill in the details to create a new team in the organization
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Team Information</CardTitle>
					<CardDescription>
						Provide the basic information needed to create a team
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Team Name*</FormLabel>
										<FormControl>
											<Input placeholder="Enter team name" {...field} />
										</FormControl>
										<FormDescription>
											Give your team a clear and descriptive name
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe the team's purpose and responsibilities"
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormDescription>
											Clearly describe what this team is responsible for
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="leaderId"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Team Leader</FormLabel>
										<Popover open={teamLeaderOpen} onOpenChange={setTeamLeaderOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														aria-expanded={teamLeaderOpen}
														className="w-full justify-between"
													>
														{field.value && users
															? users.find((user: any) => user.id === field.value)?.fullName
															: "Select team leader"}
														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-full p-0">
												<Command>
													<CommandInput placeholder="Search users..." />
													<CommandEmpty>No users found.</CommandEmpty>
													<CommandGroup>
														{users &&
															users.map((user: any) => (
																<CommandItem
																	key={user.id}
																	value={user.fullName}
																	onSelect={() => {
																		form.setValue("leaderId", user.id);
																		setTeamLeaderOpen(false);
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
										<FormDescription>
											Select a team leader who will be responsible for the team
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end space-x-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => navigate("/teams")}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={createTeamMutation.isPending}>
									{createTeamMutation.isPending ? "Creating..." : "Create Team"}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
