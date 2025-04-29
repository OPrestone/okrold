import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, User, BarChart, Target, Calendar, FileText, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch, SearchResultItem, SearchableItemType } from '@/hooks/use-search';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

interface SearchBarProps {
  className?: string;
  showInHeader?: boolean;
}

export function SearchBar({ className, showInHeader = false }: SearchBarProps) {
  const { searchTerm, setSearchTerm, searchResults, isSearching, clearSearch } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  // Get icon for each result type
  const getIconForType = (type: SearchableItemType) => {
    switch (type) {
      case 'objective':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'keyResult':
        return <BarChart className="h-4 w-4 text-green-500" />;
      case 'user':
        return <User className="h-4 w-4 text-violet-500" />;
      case 'team':
        return <Users className="h-4 w-4 text-amber-500" />;
      case 'meeting':
        return <Calendar className="h-4 w-4 text-red-500" />;
      case 'resource':
        return <FileText className="h-4 w-4 text-neutral-500" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Open search when clicking on the search button
  const handleOpenSearch = () => {
    setIsSearchOpen(true);
    // Focus the input after a small delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Handle navigating to a result
  const handleSelectResult = (result: SearchResultItem) => {
    navigate(result.url);
    clearSearch();
    setIsSearchOpen(false);
  };

  // For header search button, show compact version
  if (showInHeader && !isSearchOpen) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn("mr-2", className)} 
        onClick={handleOpenSearch}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>
    );
  }

  return (
    <div 
      ref={searchContainerRef}
      className={cn(
        'relative',
        showInHeader && isSearchOpen 
          ? 'absolute right-0 top-1 z-50 w-full md:w-96' 
          : 'w-full',
        className
      )}
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search objectives, teams, people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10"
          onFocus={() => setIsSearchOpen(true)}
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full p-0 opacity-70 hover:opacity-100"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      {isSearchOpen && searchTerm && (
        <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover p-0 shadow-md">
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{searchTerm}"
            </div>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {searchResults.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    className="flex w-full items-start px-4 py-2 text-left hover:bg-muted"
                    onClick={() => handleSelectResult(result)}
                  >
                    <span className="mr-2 mt-0.5 flex-shrink-0">
                      {getIconForType(result.type)}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium">{result.title}</div>
                      {result.description && (
                        <div className="truncate text-xs text-muted-foreground">
                          {result.description}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground capitalize">
                        {result.type}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}