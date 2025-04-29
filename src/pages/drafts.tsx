import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileEdit, Plus, Search, MoreVertical, Eye, Pencil, Trash2, Share, Calendar, Users, FileText, Clock, ArrowUpRight } from "lucide-react";

// Sample draft data
const SAMPLE_DRAFTS = [
  {
    id: 1,
    title: "Increase Customer Retention",
    description: "Improve customer retention through enhanced loyalty programs and personalized experiences",
    owner: "Alex Morgan",
    created: "2025-03-15T10:32:00Z",
    updated: "2025-03-16T14:15:00Z",
    type: "objective",
    status: "in_progress",
    keyResultsCount: 3
  },
  {
    id: 2,
    title: "Launch New Mobile Application",
    description: "Develop and release a mobile application to enhance customer engagement",
    owner: "Jamie Smith",
    created: "2025-03-10T09:15:00Z",
    updated: "2025-03-16T11:45:00Z",
    type: "objective",
    status: "in_progress",
    keyResultsCount: 2
  },
  {
    id: 3,
    title: "Optimize Marketing ROI",
    description: "Improve return on investment for marketing campaigns through data-driven decision making",
    owner: "Alex Morgan",
    created: "2025-03-05T15:20:00Z", 
    updated: "2025-03-05T15:20:00Z",
    type: "objective",
    status: "not_started",
    keyResultsCount: 0
  }
];

export default function DraftsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter drafts based on search query
  const filteredDrafts = SAMPLE_DRAFTS.filter(draft => 
    draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    draft.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Draft OKRs</h1>
          <p className="text-neutral-600 mt-1">
            Manage your draft objectives and key results
          </p>
        </div>
        
        <Link href="/create-draft-okr">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Draft
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-primary" />
                Draft OKRs
              </CardTitle>
              <CardDescription>
                Drafts allow you to work on OKRs before publishing them
              </CardDescription>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search drafts..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="my-drafts" className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="my-drafts">My Drafts</TabsTrigger>
              <TabsTrigger value="shared">Shared With Me</TabsTrigger>
              <TabsTrigger value="all">All Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-drafts">
              {filteredDrafts.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-md border border-neutral-200">
                  <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-700 mb-1">No draft OKRs found</h3>
                  <p className="text-neutral-500 mb-4 max-w-md mx-auto">
                    You haven't created any draft OKRs yet, or none match your search criteria.
                  </p>
                  <Link href="/create-draft-okr">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Draft OKR
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrafts.map((draft) => (
                        <TableRow key={draft.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{draft.title}</div>
                              {draft.description && (
                                <div className="text-sm text-neutral-500 truncate max-w-md">
                                  {draft.description}
                                </div>
                              )}
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-neutral-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(draft.created)}
                                </span>
                                {draft.keyResultsCount > 0 && (
                                  <span className="text-xs text-neutral-500">
                                    {draft.keyResultsCount} key result{draft.keyResultsCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
                                <span className="text-xs font-medium text-neutral-600">
                                  {draft.owner.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span>{draft.owner}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-neutral-400" />
                              <span>
                                {formatDate(draft.updated)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              draft.status === 'in_progress' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {draft.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Share className="h-4 w-4 mr-2" />
                                  Share Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <ArrowUpRight className="h-4 w-4 mr-2" />
                                  Publish OKR
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Draft
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shared">
              <div className="text-center py-12 bg-neutral-50 rounded-md border border-neutral-200">
                <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-1">No shared drafts</h3>
                <p className="text-neutral-500 mb-4 max-w-md mx-auto">
                  No one has shared any draft OKRs with you yet.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="text-center py-12 bg-neutral-50 rounded-md border border-neutral-200">
                <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-1">All company drafts</h3>
                <p className="text-neutral-500 mb-4 max-w-md mx-auto">
                  You need admin permissions to view all company drafts.
                </p>
                <Button variant="outline">
                  Request Access
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t bg-neutral-50 py-4 text-sm text-neutral-600">
          <div className="flex items-center gap-1">
            <FileEdit className="h-4 w-4 text-neutral-400" />
            <span>Drafts are private until published or shared with team members</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}