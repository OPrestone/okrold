import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CreateOkrAi() {
  const [_, setLocation] = useLocation();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(["Bonface Gitonga"]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(["ICT Team"]);
  const [goal, setGoal] = useState<string>("100% Build and Rollout of Innovative Digital Products");
  const [characterCount, setCharacterCount] = useState<number>(53);
  
  const handleCancel = () => {
    setLocation("/");
  };

  const handleSuggestOKRs = () => {
    // Here you would normally process the data and generate OKRs
    // Then redirect to the suggested OKRs page
    setLocation("/suggested-okrs");
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setGoal(text);
    setCharacterCount(text.length);
  };

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter(u => u !== user));
  };

  const handleRemoveTeam = (team: string) => {
    setSelectedTeams(selectedTeams.filter(t => t !== team));
  };

  const handleAddUser = (user: string) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleAddTeam = (team: string) => {
    if (!selectedTeams.includes(team)) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Create OKR with AI</h1>
        <button 
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-10">
        {/* Who will be involved? Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Who will be involved?</h2>
          <p className="text-gray-600 mb-4">
            Select users and teams who will take responsibility for the success of these goals.
          </p>

          {/* Input field with pills */}
          <div className="relative border rounded-md p-2 flex flex-wrap gap-2 items-center">
            {selectedUsers.map(user => (
              <Badge 
                key={user}
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center gap-1"
              >
                <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-xs">
                  BG
                </div>
                {user}
                <button 
                  className="ml-1 text-purple-800 hover:text-purple-900"
                  onClick={() => handleRemoveUser(user)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {selectedTeams.map(team => (
              <Badge 
                key={team}
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1"
              >
                <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xs">
                  ICT
                </div>
                {team}
                <button 
                  className="ml-1 text-blue-800 hover:text-blue-900"
                  onClick={() => handleRemoveTeam(team)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            <Input 
              className="flex-1 min-w-[150px] border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
              placeholder="Type to search for users and teams..."
            />
          </div>
        </div>

        {/* What should they achieve? Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">What should they achieve?</h2>
          <p className="text-gray-600">
            Imagine the possibilities! Think about the milestones this group of people should aim for.
            <br />
            Upload files such as company reports and analyses related to strategy, marketing, sales, finance
            etc. that these goals should align with.
          </p>

          {/* Textarea for goals */}
          <div className="mt-4 relative">
            <Textarea 
              value={goal}
              onChange={handleGoalChange}
              className="min-h-[100px] p-4 resize-none"
              maxLength={5000}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-500">
              {characterCount}/5000
            </div>
          </div>

          {/* File upload button */}
          <div className="mt-4 flex items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Suggest OKRs button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSuggestOKRs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10"
          >
            Suggest OKRs
          </Button>
        </div>
      </div>
    </div>
  );
}