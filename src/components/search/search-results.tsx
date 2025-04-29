import React, { useState } from 'react';
import { useSearch, SearchableItemType } from '@/hooks/use-search';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  User, Target, BarChart, Calendar, Users, FileText, 
  Search, Info, SlidersHorizontal
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchBox } from '@/components/ui/search-box';

interface SearchResultsPageProps {
  initialSearchTerm?: string;
}

export default function SearchResultsPage({ initialSearchTerm = '' }: SearchResultsPageProps) {
  const { searchTerm, setSearchTerm, searchResults, isSearching } = useSearch();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [, navigate] = useLocation();

  // Initialize with the initial search term if provided
  React.useEffect(() => {
    if (initialSearchTerm && !searchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm, searchTerm, setSearchTerm]);

  // Get the appropriate icon for each type
  const getIconForType = (type: SearchableItemType) => {
    switch (type) {
      case 'objective':
        return <Target className="h-5 w-5 text-blue-500" />;
      case 'keyResult':
        return <BarChart className="h-5 w-5 text-green-500" />;
      case 'user':
        return <User className="h-5 w-5 text-violet-500" />;
      case 'team':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'meeting':
        return <Calendar className="h-5 w-5 text-red-500" />;
      case 'resource':
        return <FileText className="h-5 w-5 text-neutral-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Filter results by type based on active tab
  const filteredResults = React.useMemo(() => {
    if (activeTab === 'all') {
      return searchResults;
    }
    return searchResults.filter(result => result.type === activeTab);
  }, [searchResults, activeTab]);

  // Organize results by type for better display
  const resultsByType = React.useMemo(() => {
    const byType: Record<string, number> = {
      all: searchResults.length,
      objective: 0,
      keyResult: 0,
      user: 0,
      team: 0,
      meeting: 0,
      resource: 0,
    };

    searchResults.forEach(result => {
      if (byType[result.type] !== undefined) {
        byType[result.type]++;
      }
    });

    return byType;
  }, [searchResults]);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      <div className="mb-6">
        <SearchBox 
          placeholder="Search again..." 
          onSearch={setSearchTerm} 
          initialValue={searchTerm}
          className="max-w-xl"
        />
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Searching for "{searchTerm}"...</p>
        </div>
      ) : !searchTerm ? (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h2 className="mt-4 text-xl font-medium">Enter a search term to find results</h2>
          <p className="mt-2 text-muted-foreground">
            Search for objectives, key results, teams, users, and more
          </p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-neutral-50">
          <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h2 className="mt-4 text-xl font-medium">No results found</h2>
          <p className="mt-2 text-muted-foreground">
            No items matched your search for "{searchTerm}"
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Found {searchResults.length} results for "{searchTerm}"
            </h2>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by:</span>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="all">
                All ({resultsByType.all})
              </TabsTrigger>
              <TabsTrigger value="objective" disabled={resultsByType.objective === 0}>
                Objectives ({resultsByType.objective})
              </TabsTrigger>
              <TabsTrigger value="keyResult" disabled={resultsByType.keyResult === 0}>
                Key Results ({resultsByType.keyResult})
              </TabsTrigger>
              <TabsTrigger value="user" disabled={resultsByType.user === 0}>
                Users ({resultsByType.user})
              </TabsTrigger>
              <TabsTrigger value="team" disabled={resultsByType.team === 0}>
                Teams ({resultsByType.team})
              </TabsTrigger>
              <TabsTrigger value="meeting" disabled={resultsByType.meeting === 0}>
                Meetings ({resultsByType.meeting})
              </TabsTrigger>
              <TabsTrigger value="resource" disabled={resultsByType.resource === 0}>
                Resources ({resultsByType.resource})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.map((result) => (
                  <Card key={`${result.type}-${result.id}`} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        {getIconForType(result.type)}
                        <Badge variant="outline" className="capitalize">
                          {result.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {result.description && (
                        <CardDescription className="line-clamp-3">
                          {result.description}
                        </CardDescription>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => navigate(result.url)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}