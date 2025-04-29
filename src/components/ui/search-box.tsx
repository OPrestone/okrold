import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  debounceMs?: number;
  initialValue?: string;
  showClearButton?: boolean;
}

export function SearchBox({
  placeholder = 'Search...',
  onSearch,
  className,
  debounceMs = 300,
  initialValue = '',
  showClearButton = true,
}: SearchBoxProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clearing the search input
  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Set up debouncing for search 
  useEffect(() => {
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to call onSearch after debounceMs milliseconds
    debounceTimeout.current = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    // Clean up the timeout when the component unmounts or searchValue changes
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue, debounceMs, onSearch]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-10"
        />
        {showClearButton && searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
}