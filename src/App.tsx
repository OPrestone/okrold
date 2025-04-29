import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { DashboardLayout } from "./components/dashboard/layout";
import { SearchProvider } from "./hooks/use-search";
import { SidebarProvider } from "./hooks/use-sidebar";
import { queryClient } from "./lib/queryClient";
import CheckIns from "./pages/check-ins";
import CompanyObjectives from "./pages/company-objectives";
import Configure from "./pages/configure";
import CreateDraftOkr from "./pages/create-draft-okr";
import CreateKeyResult from "./pages/create-key-result";
import CreateObjective from "./pages/create-objective";
import CreateOkrAi from "./pages/create-okr-ai";
import CreateTeam from "./pages/create-team";
import CreateUser from "./pages/create-user";
import Dashboards from "./pages/dashboards";
import Drafts from "./pages/drafts";
import Home from "./pages/home";
import ImportFinancial from "./pages/import-financial";
import Mission from "./pages/mission";
import MyOKRs from "./pages/my-okrs";
import OneOnOne from "./pages/one-on-one";
import QuickStart from "./pages/quick-start";
import Reporting from "./pages/reporting";
import Resources from "./pages/resources";
import Search from "./pages/search";
import StrategyMap from "./pages/strategy-map";
import SuggestedKeyResults from "./pages/suggested-key-results";
import SuggestedOKRs from "./pages/suggested-okrs";
import Teams from "./pages/teams";
import TestLogo from "./pages/test-logo";
import Users from "./pages/users";

function Router() {
	return (
		<SidebarProvider>
			<DashboardLayout>
				<Switch>
					<Route path="/" component={Home} />
					<Route path="/quick-start" component={QuickStart} />
					<Route path="/mission" component={Mission} />
					<Route path="/dashboards" component={Dashboards} />
					<Route path="/company-objectives" component={CompanyObjectives} />
					<Route path="/teams" component={Teams} />
					<Route path="/users" component={Users} />
					<Route path="/one-on-one" component={OneOnOne} />
					<Route path="/check-ins" component={CheckIns} />
					<Route path="/strategy-map" component={StrategyMap} />
					<Route path="/reporting" component={Reporting} />
					<Route path="/resources" component={Resources} />
					<Route path="/configure" component={Configure} />
					<Route path="/create-objective" component={CreateObjective} />
					<Route path="/create-key-result" component={CreateKeyResult} />
					<Route path="/create-okr-ai" component={CreateOkrAi} />
					<Route path="/create-draft-okr" component={CreateDraftOkr} />
					<Route path="/drafts" component={Drafts} />
					<Route path="/my-okrs" component={MyOKRs} />
					<Route path="/suggested-okrs" component={SuggestedOKRs} />
					<Route path="/create-team" component={CreateTeam} />
					<Route path="/create-user" component={CreateUser} />
					<Route path="/suggested-key-results" component={SuggestedKeyResults} />
					<Route path="/import-financial" component={ImportFinancial} />
					<Route path="/search" component={Search} />
					<Route path="/test-logo" component={TestLogo} />
					<Route component={NotFound} />
				</Switch>
			</DashboardLayout>
		</SidebarProvider>
	);
}

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchProvider>
				<Router />
				<Toaster />
			</SearchProvider>
		</QueryClientProvider>
	);
}

export default App;
