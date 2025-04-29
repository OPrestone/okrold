import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, 
  Calendar, 
  ChevronDown, 
  CheckCircle2, 
  EyeIcon, 
  Edit, 
  AlertCircle,
  Clock,
  CheckCircle,
  PlusCircle,
  UserCircle2,
  Target,
  RefreshCw,
  Medal,
  Tag,
  Save,
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

interface ObjectiveDetailProps {
  objectiveId: number;
  isOpen: boolean;
  onClose: () => void;
}

// Status badge component
function StatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case "complete":
      return (
        <Badge variant="outline" className="text-green-600 border-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Complete</span>
        </Badge>
      );
    case "on_track":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>On Track</span>
        </Badge>
      );
    case "at_risk":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>At Risk</span>
        </Badge>
      );
    case "behind":
      return (
        <Badge variant="outline" className="text-red-600 border-red-300 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Behind</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-slate-600 border-slate-300 flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>No Status</span>
        </Badge>
      );
  }
}

// Key result status component
function KeyResultStatus({ progress }: { progress: number }) {
  if (progress === 100) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircle className="w-4 h-4 mr-1" />
        <span>Completed</span>
      </div>
    );
  } else if (progress >= 70) {
    return (
      <div className="flex items-center text-blue-600">
        <Clock className="w-4 h-4 mr-1" />
        <span>On Track</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-amber-600">
        <AlertCircle className="w-4 h-4 mr-1" />
        <span>At Risk</span>
      </div>
    );
  }
}

// Form schema for objective edit
const objectiveFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  teamId: z.number().nullable(),
  ownerId: z.number().nullable(),
  progress: z.number().min(0).max(100).default(0),
  isCompanyObjective: z.boolean().default(true),
});

type ObjectiveFormValues = z.infer<typeof objectiveFormSchema>;

export function ObjectiveDetailView({ objectiveId, isOpen, onClose }: ObjectiveDetailProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch objective details
  const { 
    data: objective, 
    isLoading: objectiveLoading, 
    error: objectiveError 
  } = useQuery<any>({
    queryKey: [`/api/objectives/${objectiveId}`],
    enabled: isOpen && !!objectiveId
  });
  
  // Fetch key results for this objective
  const { 
    data: keyResults = [], 
    isLoading: keyResultsLoading, 
    error: keyResultsError 
  } = useQuery<any[]>({
    queryKey: [`/api/objectives/${objectiveId}/key-results`],
    enabled: isOpen && !!objectiveId
  });
  
  // Setup form
  const form = useForm<ObjectiveFormValues>({
    resolver: zodResolver(objectiveFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      teamId: null,
      ownerId: null,
      progress: 0,
      isCompanyObjective: true
    }
  });
  
  // Update form values when objective data is loaded
  useEffect(() => {
    if (objective) {
      form.reset({
        title: objective.title,
        description: objective.description || "",
        startDate: objective.startDate ? new Date(objective.startDate).toISOString().slice(0, 10) : "",
        endDate: objective.endDate ? new Date(objective.endDate).toISOString().slice(0, 10) : "",
        teamId: objective.teamId,
        ownerId: objective.ownerId,
        progress: objective.progress || 0,
        isCompanyObjective: objective.isCompanyObjective || true
      });
    }
  }, [objective, form]);
  
  // Update objective mutation
  const updateObjectiveMutation = useMutation({
    mutationFn: async (data: ObjectiveFormValues) => {
      return apiRequest('PATCH', `/api/objectives/${objectiveId}`, data) as Promise<any>;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: [`/api/objectives/${objectiveId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/objectives/company'] });
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Show success toast
      // if (toast) toast({ title: "Success", description: "Objective updated successfully" });
    }
  });
  
  // Calculate status based on progress
  const getStatusFromProgress = (progress: number): string => {
    if (progress === 100) return "complete";
    if (progress >= 70) return "on_track";
    if (progress > 30) return "at_risk";
    return "behind";
  };
  
  // Determine if we should show loading state
  const isLoading = objectiveLoading || keyResultsLoading;
  
  // Determine if we have an error
  const hasError = objectiveError || keyResultsError;
  
  // Handle form submission
  const onSubmit = (data: ObjectiveFormValues) => {
    updateObjectiveMutation.mutate(data);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    
    // Reset form to original values
    if (objective) {
      form.reset({
        title: objective.title,
        description: objective.description || "",
        startDate: objective.startDate ? new Date(objective.startDate).toISOString().slice(0, 10) : "",
        endDate: objective.endDate ? new Date(objective.endDate).toISOString().slice(0, 10) : "",
        teamId: objective.teamId,
        ownerId: objective.ownerId,
        progress: objective.progress || 0,
        isCompanyObjective: objective.isCompanyObjective || true
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : hasError ? (
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load objective</h3>
            <p className="text-sm text-neutral-600">
              There was an error loading the objective details. Please try again later.
            </p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        ) : objective ? (
          isEditMode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-xl font-bold">Edit Objective</DialogTitle>
                    <Button variant="outline" size="icon" onClick={cancelEdit} type="button">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                </DialogHeader>
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter objective title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the objective" 
                            className="min-h-[100px]" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="progress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress ({field.value}%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isCompanyObjective"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Company Objective</FormLabel>
                          <FormDescription>
                            Mark this as a company-wide objective rather than a team objective
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={cancelEdit} type="button">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateObjectiveMutation.isPending}
                    className="gap-1"
                  >
                    {updateObjectiveMutation.isPending ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-xl font-bold">{objective.title}</DialogTitle>
                  <Button variant="outline" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <StatusBadge status={objective.status || getStatusFromProgress(objective.progress)} />
                  <Badge variant="outline" className="border-neutral-300">
                    Q{Math.floor(new Date(objective.startDate).getMonth() / 3) + 1} {new Date(objective.startDate).getFullYear()}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                  <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1 text-neutral-500" />
                        Description
                      </h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-7 w-7">
                          <ChevronDown className={`h-4 w-4 transition-transform ${descriptionOpen ? 'transform rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="text-sm text-neutral-600 mb-4">
                        {objective.description || "No description provided."}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="space-y-6 mt-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1 text-neutral-500" />
                        Key Results & Initiatives
                      </h3>
                      
                      {keyResults.length === 0 ? (
                        <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                          <p className="text-sm text-neutral-500 mb-3">You haven't created any Key Results yet.</p>
                          <Button size="sm" className="gap-1">
                            <PlusCircle className="h-4 w-4" />
                            Add Key Result
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {keyResults.map((keyResult) => (
                            <Card key={keyResult.id} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-neutral-900">{keyResult.title}</h4>
                                    <p className="text-sm text-neutral-600 mt-1">{keyResult.description || "No description"}</p>
                                    
                                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-neutral-500 block">Start Value</span>
                                        <span className="font-medium">{keyResult.startValue !== null ? keyResult.startValue : 'N/A'}</span>
                                      </div>
                                      <div>
                                        <span className="text-neutral-500 block">Current Value</span>
                                        <span className="font-medium">{keyResult.currentValue !== null ? keyResult.currentValue : 'N/A'}</span>
                                      </div>
                                      <div>
                                        <span className="text-neutral-500 block">Target Value</span>
                                        <span className="font-medium">{keyResult.targetValue !== null ? keyResult.targetValue : 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-4 flex flex-col items-end">
                                    <KeyResultStatus progress={keyResult.progress} />
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Progress value={keyResult.progress} className="w-[120px]" />
                                      <span className="text-sm font-medium">{keyResult.progress}%</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-1 text-neutral-500" />
                        Aligned OKRs
                      </h3>
                      
                      <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                        <p className="text-sm text-neutral-500">No aligned OKRs found</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                        Activity
                      </h3>
                      
                      <div className="text-center py-6 border border-dashed rounded-md border-neutral-300">
                        <p className="text-sm text-neutral-500">No recent activity</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Objective details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <Medal className="h-4 w-4 text-neutral-500" /> 
                          <span>Progress</span>
                        </p>
                        <div className="mt-1">
                          <div className="h-7 w-7 rounded-full bg-neutral-100 flex items-center justify-center relative mb-1">
                            <span className="text-xs font-medium">{objective.progress}%</span>
                          </div>
                          <Progress value={objective.progress} className="h-2" />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <Info className="h-4 w-4 text-neutral-500" /> 
                          <span>Status</span>
                        </p>
                        <div className="mt-1">
                          <StatusBadge status={objective.status || getStatusFromProgress(objective.progress)} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-neutral-500" /> 
                          <span>Timeframe</span>
                        </p>
                        <div className="mt-1 text-sm">
                          {formatDate(objective.startDate)} - {formatDate(objective.endDate)}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <UserCircle2 className="h-4 w-4 text-neutral-500" /> 
                          <span>Owner</span>
                        </p>
                        <div className="mt-1 text-sm">
                          {objective.ownerName || "ICT Department"}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <UserCircle2 className="h-4 w-4 text-neutral-500" /> 
                          <span>Lead</span>
                        </p>
                        <div className="mt-1 text-sm">
                          {objective.leadName || "Immaculate Okeke"}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <RefreshCw className="h-4 w-4 text-neutral-500" /> 
                          <span>Update frequency</span>
                        </p>
                        <div className="mt-1 text-sm">
                          Weekly
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-neutral-700 flex items-center gap-1">
                          <Tag className="h-4 w-4 text-neutral-500" /> 
                          <span>Tags</span>
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">build</Badge>
                          <Badge variant="secondary" className="text-xs">innovate</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter className="mt-6 gap-2 sm:gap-0">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button variant="default" className="gap-1" onClick={toggleEditMode}>
                  <Edit className="h-4 w-4" />
                  Edit Objective
                </Button>
              </DialogFooter>
            </>
          )
        ) : (
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Objective not found</h3>
            <p className="text-sm text-neutral-600">
              The selected objective could not be found.
            </p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}