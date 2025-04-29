import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, BarChart, Users, MoreHorizontal, Pencil, Trash, LogOut, UserPlus, 
  Shield, Save, FileText, Target, BarChart2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Team card component
function TeamCard({ team, users }: { team: any; users: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get team leader
  const teamLeader = users.find(user => user.id === team.leaderId);
  
  // Get team members
  const teamMembers = users.filter(user => user.teamId === team.id);
  
  // Determine progress color
  const getProgressColor = (performance: number) => {
    if (performance >= 85) return "bg-green-500";
    if (performance >= 70) return "bg-primary-500";
    return "bg-amber-500";
  };

  // Get performance status text and color
  const getPerformanceStatus = (performance: number) => {
    if (performance >= 85) return { text: "Above Target", bgColor: "bg-green-50", textColor: "text-green-700" };
    if (performance >= 70) return { text: "On Target", bgColor: "bg-amber-50", textColor: "text-amber-700" };
    return { text: "Below Target", bgColor: "bg-red-50", textColor: "text-red-700" };
  };

  // Team colors for avatar
  const teamColors = [
    { bg: "bg-primary-100", text: "text-primary-700" },
    { bg: "bg-indigo-100", text: "text-indigo-700" },
    { bg: "bg-amber-100", text: "text-amber-700" },
    { bg: "bg-rose-100", text: "text-rose-700" },
    { bg: "bg-green-100", text: "text-green-700" },
    { bg: "bg-purple-100", text: "text-purple-700" }
  ];
  
  // Random index for team colors
  const colorIndex = team.id % teamColors.length;
  
  // Get performance status
  const performanceStatus = getPerformanceStatus(team.performance);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${teamColors[colorIndex].bg} flex items-center justify-center ${teamColors[colorIndex].text} font-medium`}>
              {getInitials(team.name)}
            </div>
            <CardTitle className="ml-3 text-lg">{team.name}</CardTitle>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${teamColors[colorIndex].bg} flex items-center justify-center ${teamColors[colorIndex].text} font-medium text-sm`}>
                    {getInitials(team.name)}
                  </div>
                  <span>{team.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Team details and member management
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Team Name</Label>
                      <div className="font-medium">{team.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Team Lead</Label>
                      <div className="font-medium">{teamLeader?.fullName || "Not assigned"}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Team Size</Label>
                      <div className="font-medium">{team.memberCount} members</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Created</Label>
                      <div className="font-medium">April 5, 2025</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Description</Label>
                    <div className="text-sm mt-1">
                      {team.description || "No description provided."}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">Performance</Label>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xl font-semibold">{team.performance}%</div>
                      <Badge variant="outline" className={`${performanceStatus.bgColor} ${performanceStatus.textColor}`}>
                        {performanceStatus.text}
                      </Badge>
                    </div>
                    <Progress value={team.performance} className={`h-2 mb-2 ${getProgressColor(team.performance)}`} />
                    <p className="text-xs text-muted-foreground">Based on OKR completion rate in current cycle</p>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm text-muted-foreground">Quick Stats</Label>
                      <Badge variant="outline" className="text-xs">Current Cycle</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-md p-3 flex flex-col items-center">
                        <Target className="h-5 w-5 text-neutral-400 mb-1" />
                        <span className="text-lg font-semibold">4</span>
                        <span className="text-xs text-neutral-500">Objectives</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center">
                        <BarChart2 className="h-5 w-5 text-neutral-400 mb-1" />
                        <span className="text-lg font-semibold">12</span>
                        <span className="text-xs text-neutral-500">Key Results</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center">
                        <FileText className="h-5 w-5 text-neutral-400 mb-1" />
                        <span className="text-lg font-semibold">8</span>
                        <span className="text-xs text-neutral-500">Updates</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Members Tab */}
                <TabsContent value="members" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Team Members ({team.memberCount})</h3>
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        alert("Add team member functionality activated");
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>OKRs</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamLeader && (
                          <TableRow className="bg-amber-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{getInitials(teamLeader.fullName)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{teamLeader.fullName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-800">Team Lead</Badge>
                            </TableCell>
                            <TableCell>{teamLeader.email}</TableCell>
                            <TableCell>3 active</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2"
                                    onClick={() => {
                                      alert("Editing team lead role");
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" /> Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2 text-red-600"
                                    onClick={() => {
                                      alert("Removing member from team");
                                    }}
                                  >
                                    <LogOut className="h-4 w-4" /> Remove from Team
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                        
                        {teamMembers.filter(m => m.id !== team.leaderId).map(member => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{member.fullName}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Member</Badge>
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>2 active</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2"
                                    onClick={() => {
                                      alert("Making team member the new team lead");
                                    }}
                                  >
                                    <Shield className="h-4 w-4" /> Make Team Lead
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2"
                                    onClick={() => {
                                      alert("Editing team member role");
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" /> Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="cursor-pointer flex items-center gap-2 text-red-600"
                                    onClick={() => {
                                      alert("Removing team member");
                                    }}
                                  >
                                    <LogOut className="h-4 w-4" /> Remove from Team
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Add Team Member Form */}
                  <div className="border rounded-md p-4 mt-6">
                    <h4 className="font-medium mb-3">Add Team Member</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-select">Select User</Label>
                        <div className="relative">
                          <Input id="user-select" placeholder="Search users..." className="pr-8" />
                          <Users className="h-4 w-4 absolute right-3 top-2.5 text-neutral-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-role">Role</Label>
                        <select id="user-role" className="w-full border rounded-md h-10 px-3 bg-white">
                          <option value="member">Member</option>
                          <option value="lead">Team Lead</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => {
                        alert("User added to team successfully");
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add to Team
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Objectives Tab */}
                <TabsContent value="objectives" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Team Objectives</h3>
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        alert("Add objective functionality activated");
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Objective
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Sample objectives - would typically come from API */}
                    <div className="border rounded-md p-4 hover:border-neutral-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Increase social media engagement by 40%</h4>
                          <p className="text-sm text-muted-foreground">Q2 2025</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          In Progress
                        </Badge>
                      </div>
                      <Progress value={65} className="h-2 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">65% complete</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert("Viewing social media engagement objective details");
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 hover:border-neutral-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Launch 2 new campaigns for Q2</h4>
                          <p className="text-sm text-muted-foreground">Q2 2025</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Completed
                        </Badge>
                      </div>
                      <Progress value={100} className="h-2 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">100% complete</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert("Viewing campaign launch objective details");
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => {
                    alert("Changes saved successfully");
                    setIsDialogOpen(false);
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-neutral-500">Performance</span>
            <span className="text-sm font-medium">{team.performance}%</span>
          </div>
          <Progress 
            value={team.performance} 
            className={getProgressColor(team.performance)}
          />
        </div>
        
        {teamLeader && (
          <div className="mb-4">
            <span className="text-sm text-neutral-500 block mb-2">Team Lead</span>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{getInitials(teamLeader.fullName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{teamLeader.fullName}</span>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-neutral-500">Team Members</span>
            <span className="text-sm font-medium">{team.memberCount}</span>
          </div>
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 5).map(member => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
              </Avatar>
            ))}
            {team.memberCount > 5 && (
              <div className="h-7 w-7 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-xs text-neutral-600 font-medium">
                +{team.memberCount - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Teams() {
  const { data: teams = [], isLoading: teamsLoading } = useQuery<any[]>({
    queryKey: ['/api/teams'],
  });
  
  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });
  
  const isLoading = teamsLoading || usersLoading;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Teams</h1>
          <p className="text-neutral-600">Manage and track team performance and objectives</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => {
              alert("Generating team performance report");
            }}
          >
            <BarChart className="h-4 w-4" />
            Performance Report
          </Button>
          <Button className="flex items-center gap-1" asChild>
            <Link href="/create-team">
              <Plus className="h-4 w-4" />
              Add Team
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32 ml-3" />
                  </div>
                  <Skeleton className="h-9 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="mb-4">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-7 w-7 rounded-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Data view
          teams && users && teams.map((team: any) => (
            <TeamCard key={team.id} team={team} users={users} />
          ))
        )}
        
        {/* Add Team Card */}
        <Card className="flex flex-col items-center justify-center py-8 border-dashed">
          <Users className="h-12 w-12 text-neutral-300 mb-3" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">Create a New Team</h3>
          <p className="text-sm text-neutral-500 text-center mb-4 px-8">
            Set up a new team and assign team members and objectives
          </p>
          <Button variant="default" className="flex items-center gap-1" asChild>
            <Link href="/create-team">
              <Plus className="h-4 w-4" />
              Add Team
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
