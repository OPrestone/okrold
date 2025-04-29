import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, UserPlus, Filter } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: users = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });
  
  const { data: teams = [] } = useQuery<any[]>({
    queryKey: ['/api/teams'],
  });
  
  // Get team name by ID
  const getTeamName = (teamId: number) => {
    const team = teams.find((team: any) => team.id === teamId);
    return team ? team.name : "Unassigned";
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter((user: any) => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Users</h1>
          <p className="text-neutral-600">Manage user accounts and team assignments</p>
        </div>
        <Button className="flex items-center gap-1" asChild>
          <Link href="/create-user">
            <UserPlus className="h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="team-leads">Team Leads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              {isLoading ? (
                // Loading state
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-9 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading users</div>
              ) : (
                // Data table
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-neutral-500">{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.teamId ? (
                            <Badge variant="outline" className="bg-neutral-100 text-neutral-800 hover:bg-neutral-100">
                              {getTeamName(user.teamId)}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-50">
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                          No users found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="admins" className="pt-4">
              <div className="text-neutral-600 py-8 text-center">
                Administrator accounts would be displayed here
              </div>
            </TabsContent>
            
            <TabsContent value="team-leads" className="pt-4">
              <div className="text-neutral-600 py-8 text-center">
                Team leader accounts would be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
