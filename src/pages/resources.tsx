import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FileText, Filter, Plus, Search, Upload, Video, FileArchive } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Resource card component
function ResourceCard({ resource }: { resource: any }) {
  // Determine icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="text-neutral-400 text-4xl" />;
      case 'template':
        return <FileArchive className="text-neutral-400 text-4xl" />;
      case 'article':
      default:
        return <FileText className="text-neutral-400 text-4xl" />;
    }
  };

  // Determine action text based on resource type
  const getActionText = (type: string) => {
    switch (type) {
      case 'video':
        return 'Watch videos';
      case 'template':
        return 'Download templates';
      case 'article':
      default:
        return 'Read guide';
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <div className="h-36 bg-neutral-100 flex items-center justify-center">
        {getResourceIcon(resource.type)}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-neutral-900">{resource.title}</h3>
          <Badge variant="outline" className="ml-2 text-xs">
            {resource.type}
          </Badge>
        </div>
        <p className="text-sm text-neutral-600 mb-3">{resource.description}</p>
        <div className="flex justify-between items-center">
          <a 
            href={resource.url} 
            className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center"
          >
            {getActionText(resource.type)}
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
          <span className="text-xs text-neutral-500">
            {formatDate(resource.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['/api/resources'],
  });
  
  // Filter resources based on search query
  const filteredResources = resources ? resources.filter((resource: any) => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Resources</h1>
          <p className="text-neutral-600">Access helpful guides, templates, and learning materials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search resources..."
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
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              {isLoading ? (
                // Loading state
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <Skeleton className="h-36 w-full" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-5 w-16 ml-2" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                // Error state
                <div className="text-red-500">Error loading resources</div>
              ) : (
                // Resources grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource: any) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-neutral-500">
                      No resources found matching your search
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="guides" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources
                  .filter((resource: any) => resource.type === "article")
                  .map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources
                  .filter((resource: any) => resource.type === "template")
                  .map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources
                  .filter((resource: any) => resource.type === "video")
                  .map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Featured Resource */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-neutral-100 rounded-lg flex items-center justify-center h-48 md:h-auto">
              <FileText className="text-neutral-400 text-6xl" />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">OKR Implementation Guide</h3>
              <div className="flex items-center mb-3">
                <Badge variant="outline" className="mr-2">article</Badge>
                <span className="text-sm text-neutral-500">Published {formatDate(new Date())}</span>
              </div>
              <p className="text-neutral-600 mb-4">
                A comprehensive guide to implementing OKRs in your organization. Learn how to write effective objectives and key results, cascade them throughout your organization, and track progress effectively.
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-600 mb-4 space-y-1">
                <li>Step-by-step implementation process</li>
                <li>Common pitfalls and how to avoid them</li>
                <li>Example OKRs for different departments</li>
                <li>Best practices for OKR reviews</li>
              </ul>
              <Button className="flex items-center gap-1">
                Read Full Guide
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
