import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
	cn,
	formatDate,
	generateGoogleMeetLink,
	getInitials,
} from "@/lib/utils";
import { InsertMeeting, User } from "@/shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Bell,
	Calendar,
	Eye,
	FileText,
	HelpCircle,
	Loader2,
	Lock,
	Plus,
	Search,
	Video,
} from "lucide-react";
import { useState } from "react";

export default function OneOnOne() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [meetingTitle, setMeetingTitle] = useState("");
	const [meetingDescription, setMeetingDescription] = useState("");
	const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
	const [meetingStartTime, setMeetingStartTime] = useState("09:00");
	const [meetingEndTime, setMeetingEndTime] = useState("10:00");
	const [isVirtual, setIsVirtual] = useState(true); // Default to virtual meetings

	const { toast } = useToast();
	const queryClient = useQueryClient();

	// Fetch users data from the API
	const { data: users, isLoading } = useQuery<User[]>({
		queryKey: ["/api/users"],
	});

	// Get current user (for this example, we'll assume user 1 is the current user)
	const currentUserId = 1;

	// Create Meeting Mutation
	const createMeetingMutation = useMutation({
		mutationFn: async (meetingData: InsertMeeting) => {
			return await apiRequest("POST", "/api/meetings", meetingData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["/api/meetings/upcoming"] });
			toast({
				title: "Meeting scheduled",
				description: "Your 1:1 meeting has been scheduled successfully.",
			});

			// Reset form
			setMeetingTitle("");
			setMeetingDescription("");
			setMeetingDate(new Date());
			setMeetingStartTime("09:00");
			setMeetingEndTime("10:00");
			setIsDialogOpen(false);
		},
		onError: (error) => {
			toast({
				title: "Failed to schedule meeting",
				description:
					"There was an error scheduling your meeting. Please try again.",
				variant: "destructive",
			});
		},
	});

	// Handle meeting creation
	const handleCreateMeeting = () => {
		if (!meetingTitle || !meetingDate || !selectedUserId) {
			toast({
				title: "Missing information",
				description: "Please fill in all required fields.",
				variant: "destructive",
			});
			return;
		}

		// Format date and times for API
		const startDate = new Date(meetingDate);
		const [startHours, startMinutes] = meetingStartTime.split(":").map(Number);
		startDate.setHours(startHours, startMinutes, 0);

		const endDate = new Date(meetingDate);
		const [endHours, endMinutes] = meetingEndTime.split(":").map(Number);
		endDate.setHours(endHours, endMinutes, 0);

		// Create meeting data
		const meetingData: InsertMeeting = {
			title: meetingTitle,
			description: meetingDescription,
			startTime: startDate instanceof Date ? startDate : new Date(startDate),
			endTime: endDate instanceof Date ? endDate : new Date(endDate),
			userId1: currentUserId,
			userId2: selectedUserId,
			status: "scheduled",
			isVirtual: isVirtual,
			meetingLink: isVirtual ? generateGoogleMeetLink(meetingTitle) : null,
		};

		createMeetingMutation.mutate(meetingData);
	};

	// Filter users based on search query
	const filteredUsers =
		users && searchQuery
			? users.filter(
					(user) =>
						user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(user.email &&
							user.email.toLowerCase().includes(searchQuery.toLowerCase()))
			  )
			: users;

	// Filter out the current user from the list
	const teamMembers =
		filteredUsers?.filter((user) => user.id !== currentUserId) || [];

	// Random color generator for avatars
	const getRandomColor = (userId: number) => {
		const colors = [
			"bg-blue-100",
			"bg-green-100",
			"bg-amber-100",
			"bg-purple-100",
			"bg-pink-100",
			"bg-cyan-100",
		];
		return colors[userId % colors.length];
	};

	// Get user name by ID
	const getUserName = (userId: number | null) => {
		if (!userId || !users) return "Select a team member";
		const user = users.find((u) => u.id === userId);
		return user ? user.fullName : "Select a team member";
	};

	// Generate time options for select
	const generateTimeOptions = () => {
		const options = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const formattedHour = hour.toString().padStart(2, "0");
				const formattedMinute = minute.toString().padStart(2, "0");
				options.push(`${formattedHour}:${formattedMinute}`);
			}
		}
		return options;
	};

	const timeOptions = generateTimeOptions();

	return (
		<div className="w-full">
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
				<h1 className="text-2xl font-bold">1:1 meetings</h1>

				<div className="flex items-center gap-4 mt-4 lg:mt-0">
					<Button variant="outline" className="text-primary h-9 px-3 py-2 gap-2">
						<FileText className="h-4 w-4" />
						<span>How to get started</span>
					</Button>

					<Button variant="outline" className="text-primary h-9 px-3 py-2 gap-2">
						<Video className="h-4 w-4" />
						<span>Watch a video</span>
					</Button>
				</div>
			</div>

			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-medium">Everyone</h2>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<Eye className="h-5 w-5 text-gray-500" />
					</Button>
				</div>

				<div className="flex w-full md:w-auto gap-2">
					<div className="relative flex-grow">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search team members..."
							className="pl-9 h-9"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="bg-primary text-white h-9 px-4 py-2 gap-2 whitespace-nowrap">
								<Plus className="h-4 w-4" />
								<span>Plan 1:1</span>
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[550px]">
							<DialogHeader>
								<DialogTitle>Schedule a 1:1 Meeting</DialogTitle>
							</DialogHeader>

							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="participant">Participant</Label>
									<Select
										onValueChange={(value) => setSelectedUserId(Number(value))}
										value={selectedUserId?.toString() || ""}
									>
										<SelectTrigger id="participant">
											<SelectValue placeholder="Select a team member" />
										</SelectTrigger>
										<SelectContent>
											{teamMembers.map((user) => (
												<SelectItem key={user.id} value={user.id.toString()}>
													{user.fullName}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="title">Meeting Title</Label>
									<Input
										id="title"
										value={meetingTitle}
										onChange={(e) => setMeetingTitle(e.target.value)}
										placeholder="e.g. Weekly Check-in"
									/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="description">Description (Optional)</Label>
									<Textarea
										id="description"
										value={meetingDescription}
										onChange={(e) => setMeetingDescription(e.target.value)}
										placeholder="What would you like to discuss?"
									/>
								</div>

								<div className="flex items-center space-x-2">
									<div className="flex-1">
										<Label htmlFor="virtual-meeting" className="text-sm font-medium">
											Create as virtual meeting with Google Meet
										</Label>
										<p className="text-xs text-muted-foreground">
											A Google Meet link will be automatically generated
										</p>
									</div>
									<input
										type="checkbox"
										id="virtual-meeting"
										checked={isVirtual}
										onChange={(e) => setIsVirtual(e.target.checked)}
										className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
									/>
								</div>

								<div className="grid gap-2">
									<Label>Date</Label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="justify-start text-left font-normal"
											>
												<Calendar className="mr-2 h-4 w-4" />
												{meetingDate ? formatDate(meetingDate) : "Select a date"}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<CalendarComponent
												mode="single"
												selected={meetingDate}
												onSelect={setMeetingDate}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="start-time">Start Time</Label>
										<Select onValueChange={setMeetingStartTime} value={meetingStartTime}>
											<SelectTrigger id="start-time">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{timeOptions.map((time) => (
													<SelectItem key={time} value={time}>
														{time}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="grid gap-2">
										<Label htmlFor="end-time">End Time</Label>
										<Select onValueChange={setMeetingEndTime} value={meetingEndTime}>
											<SelectTrigger id="end-time">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{timeOptions.map((time) => (
													<SelectItem key={time} value={time}>
														{time}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>

							<DialogFooter>
								<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									onClick={handleCreateMeeting}
									disabled={createMeetingMutation.isPending}
								>
									{createMeetingMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Scheduling...
										</>
									) : (
										"Schedule Meeting"
									)}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{[...Array(6)].map((_, index) => (
						<Card key={index} className="border">
							<CardContent className="p-6">
								<div className="flex items-start gap-3">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="flex-1">
										<Skeleton className="h-5 w-32 mb-2" />
										<Skeleton className="h-4 w-24 mb-2" />
										<Skeleton className="h-4 w-48 mt-3" />
									</div>
								</div>
								<div className="flex items-center justify-between mt-4">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-8 w-24" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{teamMembers.length > 0 ? (
						teamMembers.map((user) => (
							<Card key={user.id} className="border">
								<CardContent className="p-6">
									<div className="flex items-start gap-3">
										<Avatar className={cn("h-12 w-12", getRandomColor(user.id))}>
											<AvatarFallback className="text-lg font-semibold">
												{getInitials(user.fullName)}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1">
											<h3 className="font-medium">{user.fullName}</h3>
											<p className="text-sm text-gray-500">{user.role}</p>

											{user.email && (
												<p className="text-sm text-gray-700 mt-1">{user.email}</p>
											)}

											<p className="text-sm text-gray-500 mt-3">
												{user.teamId ? `Team member` : `No team assigned`}
											</p>
										</div>
									</div>

									<div className="flex items-center justify-start mt-4">
										<div className="flex-1">
											<span className="text-amber-500 text-xs font-medium">
												❋ Suggestion
											</span>
										</div>

										<Button
											size="sm"
											className="bg-primary text-white px-3 py-1 h-8"
											onClick={() => {
												setSelectedUserId(user.id);
												setMeetingTitle(`1:1 with ${user.fullName}`);
												setIsDialogOpen(true);
											}}
										>
											Plan a 1:1
										</Button>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-12 text-gray-500">
							{searchQuery ? (
								<p>No team members found matching your search.</p>
							) : (
								<p>
									No team members available. Add team members to schedule 1:1 meetings.
								</p>
							)}
						</div>
					)}
				</div>
			)}

			{/* Search and Header Icons - Optional to match the image*/}
			<div className="fixed top-0 right-0 p-4 hidden lg:flex items-center gap-4 text-gray-500">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
					<Input
						placeholder="Search..."
						className="pl-9 h-9 w-48 rounded-md bg-gray-50"
					/>
				</div>
				<Lock className="h-5 w-5" />
				<Bell className="h-5 w-5" />
				<HelpCircle className="h-5 w-5" />
				<div className="text-sm text-gray-700">7 trial days left</div>
				<Button className="bg-blue-500 text-white h-8">Upgrade</Button>
			</div>
		</div>
	);
}
