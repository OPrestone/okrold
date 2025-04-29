import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleUser,
  HelpCircle,
  Info,
  LayoutGrid,
  LineChart,
  SendToBack,
  Target,
  ThumbsUp,
  X
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CreateKeyResult() {
  const [_, setLocation] = useLocation();
  const [resultType, setResultType] = useState<string>("key-result");
  const [targetType, setTargetType] = useState<string>("increase-to");

  const handleCancel = () => {
    setLocation("/");
  };

  const handleSave = () => {
    // Here you would normally save the data
    setLocation("/");
  };
  
  const handleSubmitToCEO = () => {
    // Save the data and submit for CEO approval
    alert("OKRs submitted for CEO approval");
    setLocation("/");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Add Key Result or Initiative</h1>
        <button 
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="name" 
                placeholder="Net profit increase of X%" 
                className="flex-1"
              />
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between">
              <Label htmlFor="description">Description</Label>
              <span className="text-sm text-gray-500">Optional</span>
            </div>
            <Textarea 
              id="description" 
              placeholder="Add a description" 
              className="mt-1 h-20"
            />
          </div>

          {/* Lead */}
          <div>
            <Label>Lead</Label>
            <div className="mt-1">
              <Select defaultValue="bonface">
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium text-sm mr-2">
                      BG
                    </div>
                    <span>Bonface Gitonga</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonface">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium text-sm mr-2">
                        BG
                      </div>
                      Bonface Gitonga
                    </div>
                  </SelectItem>
                  <SelectItem value="jane">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium text-sm mr-2">
                        JD
                      </div>
                      Jane Doe
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Objective */}
          <div>
            <Label>Objective</Label>
            <div className="mt-1">
              <Select defaultValue="development">
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <div className="h-7 w-7 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800 font-medium text-sm mr-2">
                      I
                    </div>
                    <span>Development and deployment of Ticket Yetu</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-800 font-medium text-sm mr-2">
                        I
                      </div>
                      Development and deployment of Ticket Yetu
                    </div>
                  </SelectItem>
                  <SelectItem value="customer">
                    <div className="flex items-center">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm mr-2">
                        O
                      </div>
                      Increase Customer Retention Rate
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Measure as */}
          <div>
            <Label>Measure as a:</Label>
            <div className="mt-1">
              <Select defaultValue="numerical">
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <span className="font-mono font-bold mr-2">#</span>
                    <span>Numerical</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="numerical">
                    <div className="flex items-center">
                      <span className="font-mono font-bold mr-2">#</span>
                      Numerical
                    </div>
                  </SelectItem>
                  <SelectItem value="percentage">
                    <div className="flex items-center">
                      <span className="font-mono font-bold mr-2">%</span>
                      Percentage
                    </div>
                  </SelectItem>
                  <SelectItem value="currency">
                    <div className="flex items-center">
                      <span className="font-mono font-bold mr-2">$</span>
                      Currency
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target type and values */}
          <div className="space-y-4">
            <div>
              <Label>Target type</Label>
              <div className="mt-1">
                <Select defaultValue="increase-to">
                  <SelectTrigger className="w-full">
                    <span>Increase to</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase-to">Increase to</SelectItem>
                    <SelectItem value="decrease-to">Decrease to</SelectItem>
                    <SelectItem value="maintain">Maintain</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start value</Label>
                <div className="flex items-center mt-1">
                  <span className="font-mono font-bold mr-2">#</span>
                  <Input defaultValue="0" />
                </div>
              </div>
              <div>
                <Label>Increase to</Label>
                <div className="flex items-center mt-1">
                  <span className="font-mono font-bold mr-2">#</span>
                  <Input defaultValue="100" />
                </div>
              </div>
            </div>
          </div>

          {/* Result type */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Result type</Label>
              <div className="flex items-center text-gray-500 text-sm">
                <span>What is the difference?</span>
                <HelpCircle className="h-4 w-4 ml-1" />
              </div>
            </div>
            
            <div className="mt-2 space-y-3">
              <div 
                className={`border rounded-md p-4 flex items-start justify-between cursor-pointer ${
                  resultType === "key-result" ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setResultType("key-result")}
              >
                <div className="flex items-start">
                  <div className={`h-4 w-4 rounded-full mt-1 mr-3 flex items-center justify-center ${
                    resultType === "key-result" ? "bg-blue-500" : "border border-gray-300"
                  }`}>
                    {resultType === "key-result" && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Key Result</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Measures success for the Objective and impacts its progress and status.
                    </div>
                  </div>
                </div>
                <LineChart className="h-5 w-5 text-blue-600 mt-1 ml-2" />
              </div>
              
              <div 
                className={`border rounded-md p-4 flex items-start justify-between cursor-pointer ${
                  resultType === "initiative" ? "border-green-500 bg-green-50" : ""
                }`}
                onClick={() => setResultType("initiative")}
              >
                <div className="flex items-start">
                  <div className={`h-4 w-4 rounded-full mt-1 mr-3 flex items-center justify-center ${
                    resultType === "initiative" ? "bg-green-500" : "border border-gray-300"
                  }`}>
                    {resultType === "initiative" && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Initiative</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Supporting work that doesn't affect the Objective's progress and status.
                    </div>
                  </div>
                </div>
                <LayoutGrid className="h-5 w-5 text-green-600 mt-1 ml-2" />
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-options">
              <AccordionTrigger className="text-blue-600 font-medium">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* Contributors */}
                  <div>
                    <div className="flex justify-between">
                      <Label>Contributors</Label>
                      <span className="text-sm text-gray-500">Optional</span>
                    </div>
                    <div className="mt-1">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alex">Alex Morgan</SelectItem>
                          <SelectItem value="jane">Jane Doe</SelectItem>
                          <SelectItem value="rag">RAG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Integration */}
                  <div>
                    <div className="flex justify-between">
                      <Label>Integration</Label>
                      <span className="text-sm text-gray-500">Optional</span>
                    </div>
                    <div className="mt-1">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jira">Jira</SelectItem>
                          <SelectItem value="asana">Asana</SelectItem>
                          <SelectItem value="trello">Trello</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Start date */}
                  <div>
                    <div className="flex justify-between">
                      <Label>Start date</Label>
                      <span className="text-sm text-gray-500">Optional</span>
                    </div>
                    <div className="mt-1">
                      <Input type="date" placeholder="Date" />
                    </div>
                  </div>

                  {/* Due date */}
                  <div>
                    <div className="flex justify-between">
                      <Label>Due date</Label>
                      <span className="text-sm text-gray-500">Optional</span>
                    </div>
                    <div className="mt-1">
                      <Input type="date" placeholder="Date" />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Bottom buttons */}
          <div className="flex justify-between pt-4 border-t">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 flex items-center gap-2" 
                    onClick={handleSubmitToCEO}
                  >
                    <SendToBack className="h-4 w-4" />
                    <span>Save and Submit OKRs for CEO Approval</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Submit this OKR for final CEO review and approval</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Right side help info */}
        <div className="md:col-span-1">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex flex-col">
              <p className="text-blue-800 font-medium mb-2">Need inspiration? Check <a href="#" className="text-blue-600 underline">examples</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}