import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileEdit, Save, Target, ArrowRight, LucideBookmark, Info, CheckCircle2, Calendar, Users } from "lucide-react";

export default function CreateDraftOkrPage() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("objective");
  const [saved, setSaved] = useState(false);
  const [objectiveData, setObjectiveData] = useState({
    title: "",
    description: "",
    category: "",
    owner: "",
    timeframe: "",
    isPrivate: false
  });
  
  const handleSaveDraft = () => {
    setSaved(true);
    
    // Show success message briefly before redirecting
    setTimeout(() => {
      navigate("/drafts");
    }, 1500);
  };
  
  const handleObjectiveChange = (field: string, value: any) => {
    setObjectiveData({
      ...objectiveData,
      [field]: value
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Create Draft OKR</h1>
          <p className="text-neutral-600 mt-1">
            Create a draft to refine your ideas before publishing
          </p>
        </div>
        
        {saved ? (
          <Alert className="w-[260px] bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Draft saved successfully!
            </AlertDescription>
          </Alert>
        ) : (
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleSaveDraft}
            disabled={!objectiveData.title}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-primary" />
            Draft OKR
          </CardTitle>
          <CardDescription>
            Drafts allow you to collaborate on OKRs before making them official
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="objective" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="objective">Objective Details</TabsTrigger>
              <TabsTrigger value="key-results">Key Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="objective" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Objective Title <span className="text-red-500">*</span></Label>
                  <Input 
                    id="title" 
                    placeholder="E.g., Improve Customer Satisfaction"
                    value={objectiveData.title}
                    onChange={(e) => handleObjectiveChange("title", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the purpose and expected outcomes of this objective"
                    className="min-h-[100px]"
                    value={objectiveData.description}
                    onChange={(e) => handleObjectiveChange("description", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={objectiveData.category} 
                      onValueChange={(value) => handleObjectiveChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="customer">Customer Experience</SelectItem>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="operational">Operational Excellence</SelectItem>
                        <SelectItem value="culture">Culture & People</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Select 
                      value={objectiveData.owner} 
                      onValueChange={(value) => handleObjectiveChange("owner", value)}
                    >
                      <SelectTrigger id="owner">
                        <SelectValue placeholder="Assign an owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Alex Morgan</SelectItem>
                        <SelectItem value="2">Jamie Smith</SelectItem>
                        <SelectItem value="3">Taylor Johnson</SelectItem>
                        <SelectItem value="4">Casey Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select 
                      value={objectiveData.timeframe} 
                      onValueChange={(value) => handleObjectiveChange("timeframe", value)}
                    >
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select a timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="q1">Q1 2025 (Jan-Mar)</SelectItem>
                        <SelectItem value="q2">Q2 2025 (Apr-Jun)</SelectItem>
                        <SelectItem value="q3">Q3 2025 (Jul-Sep)</SelectItem>
                        <SelectItem value="q4">Q4 2025 (Oct-Dec)</SelectItem>
                        <SelectItem value="annual">Annual 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="block mb-2">Privacy</Label>
                    <div className="flex items-center space-x-2 h-10 pl-3">
                      <Checkbox 
                        id="private"
                        checked={objectiveData.isPrivate}
                        onCheckedChange={(checked) => handleObjectiveChange("isPrivate", checked)}
                      />
                      <Label htmlFor="private" className="text-sm font-normal cursor-pointer">
                        Keep this draft private until ready to share
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between items-center">
                <div className="bg-amber-50 text-amber-800 px-4 py-2 rounded-md text-sm flex items-center">
                  <Info className="h-4 w-4 text-amber-500 mr-2" />
                  <span>Add key results to make your objective measurable</span>
                </div>
                
                <Button onClick={() => setActiveTab("key-results")}>
                  Next: Key Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="key-results" className="space-y-6 mt-6">
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-md mb-6">
                <h3 className="font-medium text-lg text-neutral-900">
                  {objectiveData.title || "Untitled Objective"}
                </h3>
                {objectiveData.description && (
                  <p className="text-neutral-600 mt-1">{objectiveData.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {objectiveData.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {objectiveData.category.charAt(0).toUpperCase() + objectiveData.category.slice(1)}
                    </span>
                  )}
                  {objectiveData.timeframe && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Calendar className="mr-1 h-3 w-3" />
                      {objectiveData.timeframe.toUpperCase()}
                    </span>
                  )}
                  {objectiveData.owner && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Users className="mr-1 h-3 w-3" />
                      Owner
                    </span>
                  )}
                </div>
              </div>
                
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Key Results</h3>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Add Key Result
                  </Button>
                </div>
                
                <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 rounded-md p-10 text-center">
                  <Target className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
                  <h3 className="text-neutral-500 font-medium mb-2">No key results yet</h3>
                  <p className="text-neutral-400 text-sm max-w-md mx-auto mb-4">
                    Key results make your objective measurable. Great key results are specific, measurable, achievable, relevant, and time-bound.
                  </p>
                  <Button variant="default" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Add Your First Key Result
                  </Button>
                </div>
              </div>
              
              <div className="pt-5 flex justify-between items-center">
                <Button variant="outline" onClick={() => setActiveTab("objective")}>
                  Back to Objective
                </Button>
                
                <Button onClick={handleSaveDraft} disabled={!objectiveData.title}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft OKR
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-neutral-50 px-6 py-4">
          <div className="flex items-center text-sm text-neutral-600">
            <LucideBookmark className="h-4 w-4 text-neutral-400 mr-2" />
            <span>Draft OKRs are saved privately until published</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}