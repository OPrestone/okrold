import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CheckCircle, Clock, AlertTriangle, Plus, Filter, PlusCircle, Sparkles, FileEdit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ObjectiveDetailView } from "@/components/objectives/objective-detail-view";

// Status badge component
function StatusBadge({ progress }: { progress: number }) {
  if (progress === 100) {
    return (
      <div className="flex items-center text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </div>
    );
  } else if (progress >= 70) {
    return (
      <div className="flex items-center text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <Clock className="w-3 h-3 mr-1" />
        On Track
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
        <AlertTriangle className="w-3 h-3 mr-1" />
        At Risk
      </div>
    );
  }
}

export default function CompanyObjectives() {
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  
  const { data: objectives = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/objectives/company'],
  });
  
  const handleViewObjective = (objectiveId: number) => {
    setSelectedObjectiveId(objectiveId);
    setDetailViewOpen(true);
  };
  
  const handleCloseDetailView = () => {
    setDetailViewOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Company Objectives</h1>
          <p className="text-neutral-600">Track and manage organization-wide objectives</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => {
              alert("Filter functionality activated");
            }}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Objective
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/create-objective">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create OKRs Manually</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/create-okr-ai">
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Create OKRs with AI</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/create-draft-okr">
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Create Draft OKRs</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Objectives</TabsTrigger>
          <TabsTrigger value="current">Current Quarter</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Company Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading objectives</div>
              ) : (
                // Data table
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Objective</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {objectives && objectives.map((objective: any) => (
                      <TableRow key={objective.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p>{objective.title}</p>
                            <p className="text-sm text-neutral-500">{objective.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge progress={objective.progress} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={objective.progress} className="w-[80px]" />
                            <span className="text-sm font-medium">{objective.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(objective.startDate)} - {formatDate(objective.endDate)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewObjective(objective.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="current" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Quarter Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading objectives</div>
              ) : (
                // Current quarter objectives table
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-semibold">Current Quarter:</span> Q2 2025 (Apr - Jun)
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        alert("Quarter selection activated");
                      }}
                    >
                      Change Quarter
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Objective</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {objectives && 
                        objectives
                          .filter((objective: any) => {
                            // Filter for current quarter objectives
                            // Current quarter is Q2 2025 (April - June 2025)
                            const startDate = new Date(objective.startDate);
                            const endDate = new Date(objective.endDate);
                            
                            // We're checking if the objective overlaps with Q2 2025
                            const quarterStart = new Date('2025-04-01');
                            const quarterEnd = new Date('2025-06-30');
                            
                            // Objective overlaps with current quarter if:
                            // - starts before quarter ends AND
                            // - ends after quarter starts
                            return startDate <= quarterEnd && endDate >= quarterStart;
                          })
                          .map((objective: any) => (
                            <TableRow key={objective.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p>{objective.title}</p>
                                  <p className="text-sm text-neutral-500">{objective.description}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusBadge progress={objective.progress} />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress value={objective.progress} className="w-[80px]" />
                                  <span className="text-sm font-medium">{objective.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{formatDate(objective.startDate)} - {formatDate(objective.endDate)}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewObjective(objective.id)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      }
                      {objectives && 
                        objectives.filter((objective: any) => {
                          const startDate = new Date(objective.startDate);
                          const endDate = new Date(objective.endDate);
                          const quarterStart = new Date('2025-04-01');
                          const quarterEnd = new Date('2025-06-30');
                          return startDate <= quarterEnd && endDate >= quarterStart;
                        }).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                              No objectives found for the current quarter
                            </TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 flex flex-col space-y-4">
                    <div className="bg-blue-50 rounded-md p-4">
                      <h3 className="text-md font-semibold text-blue-700 mb-2">Quarter Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Objectives</p>
                          <p className="text-2xl font-bold">
                            {objectives ? 
                              objectives.filter((objective: any) => {
                                const startDate = new Date(objective.startDate);
                                const endDate = new Date(objective.endDate);
                                const quarterStart = new Date('2025-04-01');
                                const quarterEnd = new Date('2025-06-30');
                                return startDate <= quarterEnd && endDate >= quarterStart;
                              }).length 
                              : 0
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 font-medium">On Track</p>
                          <p className="text-2xl font-bold text-green-600">
                            {objectives ? 
                              objectives.filter((objective: any) => {
                                const startDate = new Date(objective.startDate);
                                const endDate = new Date(objective.endDate);
                                const quarterStart = new Date('2025-04-01');
                                const quarterEnd = new Date('2025-06-30');
                                return startDate <= quarterEnd && endDate >= quarterStart && objective.progress >= 70;
                              }).length 
                              : 0
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Average Progress</p>
                          <p className="text-2xl font-bold">
                            {objectives ? 
                              (() => {
                                const filtered = objectives.filter((objective: any) => {
                                  const startDate = new Date(objective.startDate);
                                  const endDate = new Date(objective.endDate);
                                  const quarterStart = new Date('2025-04-01');
                                  const quarterEnd = new Date('2025-06-30');
                                  return startDate <= quarterEnd && endDate >= quarterStart;
                                });
                                
                                if (filtered.length === 0) return '0%';
                                
                                const sum = filtered.reduce((acc: number, obj: any) => acc + obj.progress, 0);
                                return `${Math.round(sum / filtered.length)}%`;
                              })()
                              : '0%'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completed Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading objectives</div>
              ) : (
                // Completed objectives table
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                      Displaying all completed objectives
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        alert("Exporting results - Feature activated");
                      }}
                    >
                      Export Results
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Objective</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {objectives && 
                        objectives
                          .filter((objective: any) => objective.progress === 100)
                          .map((objective: any) => (
                            <TableRow key={objective.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <p>{objective.title}</p>
                                  <p className="text-sm text-neutral-500">{objective.description}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  {formatDate(objective.completedDate || objective.endDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {(() => {
                                    // Calculate duration in days
                                    const startDate = new Date(objective.startDate);
                                    const endDate = new Date(objective.completedDate || objective.endDate);
                                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    // Format as weeks + days or just days
                                    if (diffDays >= 7) {
                                      const weeks = Math.floor(diffDays / 7);
                                      const days = diffDays % 7;
                                      return `${weeks} week${weeks !== 1 ? 's' : ''}${days > 0 ? `, ${days} day${days !== 1 ? 's' : ''}` : ''}`;
                                    } else {
                                      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
                                    }
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewObjective(objective.id)}
                                >
                                  View Report
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      }
                      {objectives && 
                        objectives.filter((objective: any) => objective.progress === 100).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                              No completed objectives found
                            </TableCell>
                          </TableRow>
                        )
                      }
                    </TableBody>
                  </Table>
                  
                  {objectives && objectives.filter((objective: any) => objective.progress === 100).length > 0 && (
                    <div className="mt-6 flex flex-col space-y-4">
                      <div className="bg-green-50 rounded-md p-4">
                        <h3 className="text-md font-semibold text-green-700 mb-2">Achievement Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Completed Objectives</p>
                            <p className="text-2xl font-bold">
                              {objectives ? 
                                objectives.filter((objective: any) => objective.progress === 100).length 
                                : 0
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Average Completion Time</p>
                            <p className="text-2xl font-bold">
                              {objectives ? 
                                (() => {
                                  const completed = objectives.filter((objective: any) => objective.progress === 100);
                                  
                                  if (completed.length === 0) return 'N/A';
                                  
                                  const totalDays = completed.reduce((acc: number, obj: any) => {
                                    const startDate = new Date(obj.startDate);
                                    const endDate = new Date(obj.completedDate || obj.endDate);
                                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    return acc + diffDays;
                                  }, 0);
                                  
                                  const avgDays = Math.round(totalDays / completed.length);
                                  
                                  if (avgDays >= 7) {
                                    const weeks = Math.floor(avgDays / 7);
                                    const days = avgDays % 7;
                                    return `${weeks}w ${days}d`;
                                  } else {
                                    return `${avgDays} days`;
                                  }
                                })()
                                : 'N/A'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 font-medium">Most Recent Completion</p>
                            <p className="text-lg font-bold">
                              {objectives ? 
                                (() => {
                                  const completed = objectives.filter((objective: any) => objective.progress === 100);
                                  
                                  if (completed.length === 0) return 'None';
                                  
                                  // Sort by completion date (descending)
                                  const sorted = [...completed].sort((a, b) => {
                                    const dateA = new Date(a.completedDate || a.endDate);
                                    const dateB = new Date(b.completedDate || b.endDate);
                                    return dateB.getTime() - dateA.getTime();
                                  });
                                  
                                  return formatDate(sorted[0].completedDate || sorted[0].endDate);
                                })()
                                : 'None'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Objective Detail View */}
      {selectedObjectiveId && (
        <ObjectiveDetailView 
          objectiveId={selectedObjectiveId}
          isOpen={detailViewOpen}
          onClose={handleCloseDetailView}
        />
      )}
    </div>
  );
}
