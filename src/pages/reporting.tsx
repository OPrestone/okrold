import { DashboardLayout } from "@/components/dashboard/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Team } from "@/shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	Calendar,
	ChevronDown,
	Download,
	FileText,
	Filter,
	Loader2,
	Play,
	Presentation,
	Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Reporting() {
	const { toast } = useToast();
	const [timePeriod, setTimePeriod] = useState("2025-q1");
	const [teamId, setTeamId] = useState<string | null>(null);
	const [reportType, setReportType] = useState("detailed");
	const [previewData, setPreviewData] = useState<any>(null);
	const [showDetails, setShowDetails] = useState(false);

	// Fetch teams for the team filter
	const { data: teams } = useQuery({
		queryKey: ["/api/teams"],
		refetchOnWindowFocus: false,
	});

	// Preview report data mutation
	const previewMutation = useMutation({
		mutationFn: async (data: any) => {
			return apiRequest("POST", "/api/reports/preview", data);
		},
		onSuccess: async (response) => {
			const data = await response.json();
			if (data.success && data.preview) {
				setPreviewData(data.preview);
			} else {
				toast({
					title: "Error generating preview",
					description: "Failed to generate report preview. Please try again.",
					variant: "destructive",
				});
			}
		},
		onError: () => {
			toast({
				title: "Error generating preview",
				description: "Failed to generate report preview. Please try again.",
				variant: "destructive",
			});
		},
	});

	// Excel export mutation
	const excelMutation = useMutation({
		mutationFn: async (data: any) => {
			return apiRequest("POST", "/api/reports/excel", data);
		},
		onSuccess: async (response) => {
			const data = await response.json();
			if (data.success && data.reportUrl) {
				// Open the report in a new tab
				window.open(data.reportUrl, "_blank");
			} else {
				toast({
					title: "Error exporting report",
					description: "Failed to generate Excel report. Please try again.",
					variant: "destructive",
				});
			}
		},
		onError: () => {
			toast({
				title: "Error exporting report",
				description: "Failed to generate Excel report. Please try again.",
				variant: "destructive",
			});
		},
	});

	// PowerPoint export mutation
	const pptMutation = useMutation({
		mutationFn: async (data: any) => {
			return apiRequest("POST", "/api/reports/powerpoint", data);
		},
		onSuccess: async (response) => {
			const data = await response.json();
			if (data.success && data.reportUrl) {
				// Open the report in a new tab
				window.open(data.reportUrl, "_blank");
			} else {
				toast({
					title: "Error exporting presentation",
					description:
						"Failed to generate PowerPoint presentation. Please try again.",
					variant: "destructive",
				});
			}
		},
		onError: () => {
			toast({
				title: "Error exporting presentation",
				description:
					"Failed to generate PowerPoint presentation. Please try again.",
				variant: "destructive",
			});
		},
	});

	// Generate preview when filter changes
	useEffect(() => {
		const generatePreview = async () => {
			const filters = {
				timePeriod,
				reportType,
				...(teamId && { teamId }),
			};

			previewMutation.mutate(filters);
		};

		generatePreview();
	}, [timePeriod, teamId, reportType]);

	// Handle Excel export
	const handleExcelExport = () => {
		const filters = {
			timePeriod,
			reportType,
			...(teamId && { teamId }),
		};

		excelMutation.mutate(filters);
	};

	// Handle PowerPoint export
	const handlePowerPointExport = () => {
		const filters = {
			timePeriod,
			reportType,
			...(teamId && { teamId }),
		};

		pptMutation.mutate(filters);
	};

	// Get selected team name
	const getTeamName = () => {
		if (!teamId || !teams) return "All Teams";

		const team = teams.find((team: Team) => team.id.toString() === teamId);
		return team ? team.name : "All Teams";
	};

	return (
		<DashboardLayout>
			<main className="w-full py-6 px-4 sm:px-6">
				<div className="max-w-7xl mx-auto space-y-6">
					<h1 className="text-2xl font-bold">OKR Report Export</h1>

					{/* Filters */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{/* Time Period Filter */}
							<div className="flex items-center border rounded-md bg-white">
								<div className="px-3 py-2">
									<Calendar className="h-5 w-5 text-gray-500" />
								</div>
								<Select
									defaultValue="2025-q1"
									onValueChange={(value) => setTimePeriod(value)}
								>
									<SelectTrigger className="border-0 w-full">
										<SelectValue placeholder="2025 Q1" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="2025-q1">2025 Q1</SelectItem>
										<SelectItem value="2024-q4">2024 Q4</SelectItem>
										<SelectItem value="2024-q3">2024 Q3</SelectItem>
										<SelectItem value="2024-q2">2024 Q2</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Team Filter */}
							<div className="flex items-center border rounded-md bg-white">
								<div className="px-3 py-2">
									<Filter className="h-5 w-5 text-gray-500" />
								</div>
								<Select
									defaultValue="all"
									onValueChange={(value) => setTeamId(value === "all" ? null : value)}
								>
									<SelectTrigger className="border-0 w-full">
										<SelectValue placeholder="All Teams" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Teams</SelectItem>
										{teams &&
											teams.map((team: Team) => (
												<SelectItem key={team.id} value={team.id.toString()}>
													{team.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>

							{/* Report Type */}
							<div className="flex items-center border rounded-md bg-white">
								<Select
									defaultValue="detailed"
									onValueChange={(value) => setReportType(value)}
								>
									<SelectTrigger className="border-0 w-full">
										<SelectValue placeholder="Detailed" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="detailed">Detailed</SelectItem>
										<SelectItem value="summary">Summary</SelectItem>
										<SelectItem value="highlights">Highlights</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Export Options */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Excel Export Card */}
						<Card className="border">
							<CardContent className="p-5">
								<div className="flex items-start mb-4">
									<div className="h-10 w-10 rounded-md bg-green-50 flex items-center justify-center mr-4 flex-shrink-0">
										<FileText className="h-6 w-6 text-green-600" />
									</div>
									<h3 className="text-lg font-semibold mt-1">Excel Export</h3>
								</div>

								<p className="text-gray-600 mb-4">
									Export your OKR data to Excel format for detailed analysis and
									reporting.
								</p>

								<div className="space-y-1 mb-6">
									<h4 className="text-sm text-gray-500">Includes:</h4>
									<ul className="text-sm text-gray-700 space-y-2">
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Objective and Key Results breakdown</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Progress tracking metrics</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Department-wise analysis</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Historical data comparison</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Team performance breakdown</span>
										</li>
									</ul>
								</div>

								<div className="flex space-x-2">
									<Button
										className="bg-green-600 hover:bg-green-700 flex-1"
										onClick={handleExcelExport}
										disabled={excelMutation.isPending}
									>
										{excelMutation.isPending ? (
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										) : (
											<Download className="h-4 w-4 mr-2" />
										)}
										{excelMutation.isPending ? "Generating..." : "Export"}
									</Button>
									<Button variant="outline" className="border-gray-300">
										<Share2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* PowerPoint Export Card */}
						<Card className="border">
							<CardContent className="p-5">
								<div className="flex items-start mb-4">
									<div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center mr-4 flex-shrink-0">
										<Presentation className="h-6 w-6 text-blue-600" />
									</div>
									<h3 className="text-lg font-semibold mt-1">PowerPoint Export</h3>
								</div>

								<p className="text-gray-600 mb-4">
									Generate presentation-ready slides showcasing your OKR progress and
									achievements.
								</p>

								<div className="space-y-1 mb-6">
									<h4 className="text-sm text-gray-500">Includes:</h4>
									<ul className="text-sm text-gray-700 space-y-2">
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Executive summary</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Visual progress indicators</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Key achievements highlights</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Next quarter planning</span>
										</li>
										<li className="flex items-start">
											<span className="mr-2 flex-shrink-0">•</span>
											<span>Key OKR milestones</span>
										</li>
									</ul>
								</div>

								<div className="flex space-x-2">
									<Button
										variant="outline"
										className="text-blue-600 border-blue-200 hover:bg-blue-50 flex-1"
									>
										<Play className="h-4 w-4 mr-2" />
										Present
									</Button>
									<Button
										className="bg-blue-600 hover:bg-blue-700 flex-1"
										onClick={handlePowerPointExport}
										disabled={pptMutation.isPending}
									>
										{pptMutation.isPending ? (
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										) : (
											<Download className="h-4 w-4 mr-2" />
										)}
										{pptMutation.isPending ? "Generating..." : "Export"}
									</Button>
									<Button variant="outline" className="border-gray-300">
										<Share2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Preview Section */}
					<div className="border rounded-lg">
						<div className="p-4 border-b flex justify-between items-center">
							<h3 className="font-semibold">Preview</h3>
							<Button
								variant="outline"
								size="sm"
								className="text-sm"
								onClick={() => setShowDetails(!showDetails)}
							>
								{showDetails ? "Hide Details" : "Show Details"}
								<ChevronDown
									className={`h-3 w-3 ml-1 transition-transform ${
										showDetails ? "rotate-180" : ""
									}`}
								/>
							</Button>
						</div>
						<div className="p-4 bg-gray-50">
							{previewMutation.isPending ? (
								<div className="flex justify-center items-center p-6">
									<Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
									<p className="text-gray-500">Generating preview...</p>
								</div>
							) : previewMutation.isError ? (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										Failed to generate report preview. Please try again.
									</AlertDescription>
								</Alert>
							) : (
								<>
									<div className="space-y-3 text-sm">
										<p className="text-gray-500">Selected filters:</p>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
											<p>
												<span className="font-medium">Time Period:</span>{" "}
												{timePeriod.toUpperCase()}
											</p>
											<p>
												<span className="font-medium">Department:</span> {getTeamName()}
											</p>
											<p>
												<span className="font-medium">View Type:</span>{" "}
												{reportType.charAt(0).toUpperCase() + reportType.slice(1)}
											</p>
										</div>
									</div>

									{previewData && showDetails && (
										<div className="mt-6 bg-white rounded-md border p-4">
											<h4 className="font-medium mb-3">Report Summary Preview</h4>

											<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
												<div className="bg-blue-50 p-3 rounded-md">
													<p className="text-xs text-blue-600 uppercase font-medium">
														Total Objectives
													</p>
													<p className="text-2xl font-bold">
														{previewData.summary.totalObjectives}
													</p>
												</div>
												<div className="bg-green-50 p-3 rounded-md">
													<p className="text-xs text-green-600 uppercase font-medium">
														Completed
													</p>
													<p className="text-2xl font-bold">
														{previewData.summary.completedObjectives}
													</p>
												</div>
												<div className="bg-amber-50 p-3 rounded-md">
													<p className="text-xs text-amber-600 uppercase font-medium">
														At Risk
													</p>
													<p className="text-2xl font-bold">
														{previewData.summary.atRiskObjectives}
													</p>
												</div>
												<div className="bg-purple-50 p-3 rounded-md">
													<p className="text-xs text-purple-600 uppercase font-medium">
														Avg Progress
													</p>
													<p className="text-2xl font-bold">
														{previewData.summary.avgProgress}%
													</p>
												</div>
											</div>

											{previewData.previewData.objectives.length > 0 ? (
												<>
													<h5 className="font-medium text-sm mb-2">
														Objectives Preview (Top 3)
													</h5>
													<div className="overflow-x-auto mb-4">
														<table className="min-w-full text-sm">
															<thead className="bg-gray-50">
																<tr>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Title
																	</th>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Progress
																	</th>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Status
																	</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200">
																{previewData.previewData.objectives.map((obj: any) => (
																	<tr key={obj.id}>
																		<td className="px-3 py-2">{obj.title}</td>
																		<td className="px-3 py-2">{obj.progress}%</td>
																		<td className="px-3 py-2">{obj.status || "Not Started"}</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
												</>
											) : (
												<div className="p-4 mb-4 bg-gray-50 text-center text-gray-500 rounded-md">
													No objectives found for the selected filters.
												</div>
											)}

											{previewData.previewData.keyResultsPreview.length > 0 && (
												<>
													<h5 className="font-medium text-sm mb-2">Key Results Preview</h5>
													<div className="overflow-x-auto">
														<table className="min-w-full text-sm">
															<thead className="bg-gray-50">
																<tr>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Title
																	</th>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Progress
																	</th>
																	<th className="px-3 py-2 text-left font-medium text-gray-500">
																		Status
																	</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200">
																{previewData.previewData.keyResultsPreview.map((kr: any) => (
																	<tr key={kr.id}>
																		<td className="px-3 py-2">{kr.title}</td>
																		<td className="px-3 py-2">{kr.progress}%</td>
																		<td className="px-3 py-2">
																			{kr.isCompleted ? "Completed" : "In Progress"}
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
												</>
											)}
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</main>
		</DashboardLayout>
	);
}
