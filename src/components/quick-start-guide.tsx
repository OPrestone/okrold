import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	ArrowRight,
	BarChart3,
	BookOpen,
	Calendar,
	CheckCircle2,
	HelpCircle,
	ListChecks,
	Target,
	Users,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";

interface StepProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	action: string;
	onClick: () => void;
}

function Step({ title, description, icon, action, onClick }: StepProps) {
	return (
		<Card className="mb-4 transition-all hover:border-primary/50 hover:shadow-md">
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
						{icon}
					</div>
					<div className="flex-1">
						<h3 className="mb-1 text-lg font-medium">{title}</h3>
						<p className="mb-3 text-sm text-muted-foreground">{description}</p>
						<Button onClick={onClick} className="flex items-center gap-1" size="sm">
							{action}
							<ArrowRight className="ml-1 h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function QuickStartGuide() {
	const [open, setOpen] = useState(false);
	const [view, setView] = useState<"guide" | "features" | "resources">("guide");
	const [_, setLocation] = useLocation();

	const handleNavigate = (path: string) => {
		setOpen(false);
		setLocation(path);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="flex items-center gap-1.5">
					<HelpCircle className="h-4 w-4" />
					<span>Quick Start Guide</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-primary" />
						<span>Quick Start Guide</span>
					</DialogTitle>
					<DialogDescription>
						Follow these steps to get started with the OKR platform
					</DialogDescription>
				</DialogHeader>

				<div className="border-b mb-4">
					<div className="flex space-x-4">
						<button
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								view === "guide"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setView("guide")}
						>
							Setup Guide
						</button>
						<button
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								view === "features"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setView("features")}
						>
							Key Features
						</button>
						<button
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								view === "resources"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
							onClick={() => setView("resources")}
						>
							Resources
						</button>
					</div>
				</div>

				{view === "guide" && (
					<div className="py-4">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-medium">Setup your OKR system</h3>
							<Button
								variant="default"
								size="sm"
								onClick={() => handleNavigate("/home")}
							>
								Start Guided Setup
							</Button>
						</div>

						<Step
							title="1. Set Company Mission"
							description="Define your organization's mission, vision, and values to align your objectives."
							icon={<Target className="h-5 w-5" />}
							action="Go to Mission"
							onClick={() => handleNavigate("/mission")}
						/>

						<Step
							title="2. Create Team"
							description="Set up your teams and add team members to collaborate on objectives."
							icon={<Users className="h-5 w-5" />}
							action="Create Team"
							onClick={() => handleNavigate("/create-team")}
						/>

						<Step
							title="3. Create Objectives"
							description="Define measurable objectives that align with your organization's mission."
							icon={<BarChart3 className="h-5 w-5" />}
							action="Create Objective"
							onClick={() => handleNavigate("/create-objective")}
						/>

						<Step
							title="4. Add Key Results"
							description="Create specific, measurable key results to track progress toward your objectives."
							icon={<CheckCircle2 className="h-5 w-5" />}
							action="Add Key Results"
							onClick={() => handleNavigate("/create-key-result")}
						/>

						<Step
							title="5. Schedule Check-ins"
							description="Set up regular check-ins to track progress and update your OKRs."
							icon={<Calendar className="h-5 w-5" />}
							action="Schedule Check-ins"
							onClick={() => handleNavigate("/check-ins")}
						/>

						<Step
							title="6. Track Progress"
							description="Use dashboards to monitor progress and identify areas that need attention."
							icon={<ListChecks className="h-5 w-5" />}
							action="View Dashboards"
							onClick={() => handleNavigate("/")}
						/>
					</div>
				)}

				{view === "features" && (
					<div className="py-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-blue-100 p-2 text-blue-700">
										<Target className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Strategic Alignment</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Align your company strategy from mission to execution
										</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-green-100 p-2 text-green-700">
										<CheckCircle2 className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Progress Tracking</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Real-time tracking of key results and objective progress
										</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-amber-100 p-2 text-amber-700">
										<Calendar className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Regular Check-ins</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Scheduled check-ins and progress reviews
										</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-purple-100 p-2 text-purple-700">
										<Users className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Team Collaboration</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Collaborate and align objectives across teams
										</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-indigo-100 p-2 text-indigo-700">
										<BarChart3 className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Analytics & Reports</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Advanced analytics and performance reports
										</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
								<div className="flex items-start gap-3">
									<div className="rounded-full bg-red-100 p-2 text-red-700">
										<ArrowRight className="h-4 w-4" />
									</div>
									<div>
										<h4 className="font-medium text-sm">Guided Workflows</h4>
										<p className="text-xs text-muted-foreground mt-1">
											Step-by-step guides for effective OKR implementation
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{view === "resources" && (
					<div className="py-4">
						<h3 className="text-lg font-medium mb-4">Learning Resources</h3>

						<div className="space-y-4">
							<div className="border rounded-lg p-4">
								<h4 className="font-medium">OKR Best Practices Guide</h4>
								<p className="text-sm text-muted-foreground mt-1">
									Learn how to create effective OKRs that drive results.
								</p>
								<Button
									variant="link"
									className="px-0 py-2"
									onClick={() => handleNavigate("/resources/best-practices")}
								>
									Read Guide
								</Button>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-medium">OKR Templates</h4>
								<p className="text-sm text-muted-foreground mt-1">
									Download templates for different departments and teams.
								</p>
								<Button
									variant="link"
									className="px-0 py-2"
									onClick={() => handleNavigate("/resources/templates")}
								>
									Get Templates
								</Button>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-medium">Video Tutorials</h4>
								<p className="text-sm text-muted-foreground mt-1">
									Watch step-by-step tutorials for setting up and using OKRs.
								</p>
								<Button
									variant="link"
									className="px-0 py-2"
									onClick={() => handleNavigate("/resources/tutorials")}
								>
									Watch Tutorials
								</Button>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-medium">Case Studies</h4>
								<p className="text-sm text-muted-foreground mt-1">
									See how other organizations have successfully implemented OKRs.
								</p>
								<Button
									variant="link"
									className="px-0 py-2"
									onClick={() => handleNavigate("/resources/case-studies")}
								>
									View Case Studies
								</Button>
							</div>
						</div>
					</div>
				)}

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Close Guide
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
