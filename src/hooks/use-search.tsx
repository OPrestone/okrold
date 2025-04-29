/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React, {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

// Define the types of searchable items
export type SearchableItemType =
	| "objective"
	| "keyResult"
	| "user"
	| "team"
	| "meeting"
	| "resource";

// Interface for search result items
export interface SearchResultItem {
	id: number;
	title: string;
	description?: string;
	type: SearchableItemType;
	url: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any; // Additional data specific to item type
}

// Define the context type
interface SearchContextType {
	searchTerm: string;
	searchResults: SearchResultItem[];
	isSearching: boolean;
	setSearchTerm: (term: string) => void;
	clearSearch: () => void;
	performSearch: () => void;
}

// Create the context with a default undefined value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
	children: ReactNode;
}

// Helper function for searching through collections
function searchInCollection<T extends { id: number }>(
	collection: T[],
	term: string,
	options: {
		fields: (keyof T)[];
		type: SearchableItemType;
		getUrl: (item: T) => string;
		getTitle: (item: T) => string;
		getDescription?: (item: T) => string;
	}
): SearchResultItem[] {
	if (!term || !collection) return [];

	const normalizedTerm = term.toLowerCase().trim();

	return collection
		.filter((item) => {
			return options.fields.some((field) => {
				const value = item[field];
				if (typeof value === "string") {
					return value.toLowerCase().includes(normalizedTerm);
				}
				return false;
			});
		})
		.map((item) => ({
			id: item.id,
			title: options.getTitle(item),
			description: options.getDescription
				? options.getDescription(item)
				: undefined,
			type: options.type,
			url: options.getUrl(item),
			data: item,
		}));
}

// Simpler search provider that doesn't cause infinite renders
export function SearchProvider({ children }: SearchProviderProps) {
	// State
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [searchTriggered, setSearchTriggered] = useState(false);

	// Only enable queries when search is triggered and term is at least 3 characters
	const shouldFetch = searchTriggered && searchTerm.length >= 3;

	// Data queries
	const { data: objectives = [] } = useQuery<any[]>({
		queryKey: ["/api/objectives"],
		enabled: shouldFetch,
	});

	const { data: users = [] } = useQuery<any[]>({
		queryKey: ["/api/users"],
		enabled: shouldFetch,
	});

	const { data: teams = [] } = useQuery<any[]>({
		queryKey: ["/api/teams"],
		enabled: shouldFetch,
	});

	const { data: resources = [] } = useQuery<any[]>({
		queryKey: ["/api/resources"],
		enabled: shouldFetch,
	});

	// Function to trigger search
	const performSearch = useCallback(() => {
		if (searchTerm.length < 3) {
			setSearchResults([]);
			setIsSearching(false);
			return;
		}

		setSearchTriggered(true);
		setIsSearching(true);

		setTimeout(() => {
			if (!searchTerm) {
				setSearchResults([]);
				setIsSearching(false);
				return;
			}

			// Combine search results from all sources
			const results = [
				// Users
				...searchInCollection(users, searchTerm, {
					fields: ["fullName", "username", "email", "role"],
					type: "user",
					getUrl: (item) => `/users/${item.id}`,
					getTitle: (item) => item.fullName,
					getDescription: (item) => item.role,
				}),

				// Teams
				...searchInCollection(teams, searchTerm, {
					fields: ["name", "description"],
					type: "team",
					getUrl: (item) => `/teams/${item.id}`,
					getTitle: (item) => item.name,
					getDescription: (item) => item.description || "No description available",
				}),

				// Objectives
				...searchInCollection(objectives, searchTerm, {
					fields: ["title", "description"],
					type: "objective",
					getUrl: (item) => `/objectives/${item.id}`,
					getTitle: (item) => item.title,
					getDescription: (item) => item.description || "No description available",
				}),

				// Resources
				...searchInCollection(resources, searchTerm, {
					fields: ["title", "description"],
					type: "resource",
					getUrl: (item) => `/resources/${item.id}`,
					getTitle: (item) => item.title,
					getDescription: (item) => item.description || "No description available",
				}),
			];

			setSearchResults(results);
			setIsSearching(false);
		}, 300);
	}, [searchTerm, objectives, users, teams, resources]);

	// Effect to run search when dependencies change
	React.useEffect(() => {
		if (searchTriggered) {
			performSearch();
		}
	}, [performSearch, searchTriggered]);

	// Effect to reset search triggered when term is empty
	React.useEffect(() => {
		if (!searchTerm) {
			setSearchTriggered(false);
			setSearchResults([]);
		}
	}, [searchTerm]);

	// Clear search state
	const clearSearch = useCallback(() => {
		setSearchTerm("");
		setSearchResults([]);
		setIsSearching(false);
		setSearchTriggered(false);
	}, []);

	return (
		<SearchContext.Provider
			value={{
				searchTerm,
				searchResults,
				isSearching,
				setSearchTerm,
				clearSearch,
				performSearch,
			}}
		>
			{children}
		</SearchContext.Provider>
	);
}

// Hook to use the search context
export function useSearch() {
	const context = useContext(SearchContext);
	if (!context) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
}
