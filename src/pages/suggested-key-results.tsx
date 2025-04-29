import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  RefreshCw, 
  X, 
  Plus, 
  Check, 
  Target, 
  TrendingUp, 
  Edit, 
  Save,
  ArrowLeft,
  Trash2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface KeyResult {
  id: string;
  title: string;
  description: string;
  isEditing: boolean;
  objective: string;
  startValue: number;
  targetValue: number;
  currentValue: number;
  owner: { 
    name: string;
    initials: string;
    color: string;
  };
  dueDate: string;
}

export default function SuggestedKeyResults() {
  const [, setLocation] = useLocation();
  const [selectedObjective, setSelectedObjective] = useState("Revolutionize Digital Landscapes");

  const [suggestedKRs, setSuggestedKRs] = useState<KeyResult[]>([
    {
      id: "1",
      title: "Increase User Engagement by 40%",
      description: "Boost user engagement across all digital platforms by improving UX, adding interactive features, and personalized content recommendations.",
      isEditing: false,
      objective: "Revolutionize Digital Landscapes",
      startValue: 10,
      targetValue: 50,
      currentValue: 10,
      owner: { name: "Bonface Nderitu", initials: "BN", color: "bg-emerald-500" },
      dueDate: "2025-06-30"
    },
    {
      id: "2",
      title: "Launch 5 Innovative Digital Products",
      description: "Develop and release five groundbreaking digital products that offer unique value propositions and address specific market needs.",
      isEditing: false,
      objective: "Revolutionize Digital Landscapes",
      startValue: 0,
      targetValue: 5,
      currentValue: 0,
      owner: { name: "Bonface Nderitu", initials: "BN", color: "bg-emerald-500" },
      dueDate: "2025-09-15"
    },
    {
      id: "3",
      title: "Achieve 90% Positive User Feedback",
      description: "Ensure that 90% of user feedback across all digital products is positive, indicating high satisfaction and product-market fit.",
      isEditing: false,
      objective: "Revolutionize Digital Landscapes",
      startValue: 70,
      targetValue: 90,
      currentValue: 70,
      owner: { name: "Bonface Nderitu", initials: "BN", color: "bg-emerald-500" },
      dueDate: "2025-08-01"
    },
    {
      id: "4",
      title: "Reduce System Downtime to 0.1%",
      description: "Optimize all digital platforms to achieve 99.9% uptime, ensuring continuous availability and reliability for users.",
      isEditing: false,
      objective: "Revolutionize Digital Landscapes",
      startValue: 2,
      targetValue: 0.1,
      currentValue: 2,
      owner: { name: "Bonface Nderitu", initials: "BN", color: "bg-emerald-500" },
      dueDate: "2025-07-15"
    },
    {
      id: "5",
      title: "Increase Mobile App Downloads by 200%",
      description: "Drive a significant increase in mobile application downloads through marketing campaigns, feature enhancements, and improved app store optimization.",
      isEditing: false,
      objective: "Revolutionize Digital Landscapes",
      startValue: 10000,
      targetValue: 30000,
      currentValue: 10000,
      owner: { name: "Bonface Nderitu", initials: "BN", color: "bg-emerald-500" },
      dueDate: "2025-10-01"
    }
  ]);

  const handleEditTitle = (id: string, newTitle: string) => {
    setSuggestedKRs(suggestedKRs.map(kr => 
      kr.id === id ? { ...kr, title: newTitle } : kr
    ));
  };

  const handleEditDescription = (id: string, newDescription: string) => {
    setSuggestedKRs(suggestedKRs.map(kr => 
      kr.id === id ? { ...kr, description: newDescription } : kr
    ));
  };

  const toggleEditing = (id: string) => {
    setSuggestedKRs(suggestedKRs.map(kr => 
      kr.id === id ? { ...kr, isEditing: !kr.isEditing } : kr
    ));
  };

  const handleSaveEditing = (id: string) => {
    setSuggestedKRs(suggestedKRs.map(kr => 
      kr.id === id ? { ...kr, isEditing: false } : kr
    ));
  };

  const handleDeleteKR = (id: string) => {
    setSuggestedKRs(suggestedKRs.filter(kr => kr.id !== id));
  };

  const handleGenerateMore = () => {
    // Here we would normally make an API call to get more suggestions
    // For demo purposes, just redirect to the AI suggestion flow
    setLocation("/create-okr-ai");
  };
  
  const handleAddManually = () => {
    // Redirect to the manual key result creation form
    setLocation("/create-key-result");
  };

  const handleSaveAll = () => {
    // In a real app, we would save all key results to the database
    // For now, just show a success message and redirect
    alert("Key Results submitted for CEO approval successfully!");
    setLocation("/my-okrs");
  };

  const handleBack = () => {
    setLocation("/suggested-okrs");
  };

  const calculateProgress = (kr: KeyResult) => {
    const total = kr.targetValue - kr.startValue;
    const current = kr.currentValue - kr.startValue;
    let progress = (current / total) * 100;
    
    // Handle case where lower values are better (like reducing downtime)
    if (kr.targetValue < kr.startValue) {
      progress = ((kr.startValue - kr.currentValue) / (kr.startValue - kr.targetValue)) * 100;
    }
    
    return Math.max(0, Math.min(100, progress));
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2 text-neutral-500 hover:text-neutral-800"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Objectives
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>AI-Generated Key Results</CardTitle>
          <CardDescription>
            Based on your objective: <span className="font-medium text-neutral-800">{selectedObjective}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 mb-6 rounded-md">
            <p className="text-blue-800">
              Here are AI-suggested Key Results for your selected objective. You can edit, remove, or add Key Results to finalize your OKR.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {suggestedKRs.map((kr) => (
          <Card key={kr.id} className="relative">
            {kr.isEditing ? (
              <CardHeader className="pb-2">
                <Input 
                  value={kr.title}
                  onChange={(e) => handleEditTitle(kr.id, e.target.value)}
                  className="font-medium text-lg"
                />
              </CardHeader>
            ) : (
              <CardHeader className="pb-2 pr-16">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  {kr.title}
                </CardTitle>
              </CardHeader>
            )}
            
            <div className="absolute top-5 right-6 flex space-x-2">
              {kr.isEditing ? (
                <>
                  <Button 
                    onClick={() => toggleEditing(kr.id)} 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    title="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleSaveEditing(kr.id)} 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-500 hover:text-blue-700"
                    title="Save changes"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => toggleEditing(kr.id)} 
                    variant="ghost" 
                    size="sm"
                    className="text-neutral-500 hover:text-neutral-700"
                    title="Edit this key result"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteKR(kr.id)} 
                    variant="ghost" 
                    size="sm"
                    className="text-neutral-500 hover:text-red-500"
                    title="Remove this key result"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            <CardContent className="pt-0">
              {kr.isEditing ? (
                <Textarea 
                  value={kr.description}
                  onChange={(e) => handleEditDescription(kr.id, e.target.value)}
                  className="w-full mb-4"
                  rows={3}
                />
              ) : (
                <p className="text-neutral-600 mb-4">{kr.description}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs uppercase text-neutral-500 mb-1">Starting Value</div>
                  <div className="font-medium">{kr.startValue.toLocaleString()}</div>
                </div>
                
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs uppercase text-neutral-500 mb-1">Current Value</div>
                  <div className="font-medium">{kr.currentValue.toLocaleString()}</div>
                </div>
                
                <div className="bg-neutral-50 p-3 rounded-md">
                  <div className="text-xs uppercase text-neutral-500 mb-1">Target Value</div>
                  <div className="font-medium">{kr.targetValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-neutral-600">Progress</span>
                  <span className="text-sm font-medium">{Math.round(calculateProgress(kr))}%</span>
                </div>
                <Progress value={calculateProgress(kr)} className="h-2" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={kr.owner.color}>
                      {kr.owner.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-neutral-600">{kr.owner.name}</span>
                </div>
                
                <Badge variant="outline">{new Date(kr.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleGenerateMore}
        >
          <RefreshCw className="h-4 w-4" />
          Generate more
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleAddManually}
        >
          <Plus className="h-4 w-4" />
          Add Manually
        </Button>
        
        <Button 
          className="flex items-center gap-2"
          onClick={handleSaveAll}
        >
          <Check className="h-4 w-4" />
          Save and Submit for CEO Approval
        </Button>
      </div>
    </div>
  );
}