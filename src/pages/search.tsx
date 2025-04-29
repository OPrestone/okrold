import React, { useEffect } from 'react';
import SearchResultsPage from '@/components/search/search-results';
import { useLocation } from 'wouter';

export default function SearchPage() {
  const [location] = useLocation();
  
  // Parse the search query from the URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  
  // Set the page title based on the search query
  useEffect(() => {
    document.title = query ? `Search: ${query}` : 'Search';
  }, [query]);

  return <SearchResultsPage initialSearchTerm={query} />;
}