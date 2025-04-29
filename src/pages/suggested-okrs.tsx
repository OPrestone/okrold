import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, RefreshCw, X, Plus, Check, Target, Edit, Trash2 } from "lucide-react";

interface SuggestedOKR {
  id: string;
  title: string;
  description: string;
  isEditing: boolean;
  users: { initials: string; color: string }[];
  teams: { name: string; color: string }[];
}

export default function SuggestedOKRs() {
  const [_, setLocation] = useLocation();
  const [suggestedOKRs, setSuggestedOKRs] = useState<SuggestedOKR[]>([
    {
      id: "1",
      title: "Revolutionize Digital Landscapes",
      description: "Create groundbreaking digital products that redefine industry standards, pushing boundaries and setting new trends. Foster a culture of innovation and creativity to lead the digital transformation, making an indelible mark on the tech world.",
      isEditing: false,
      users: [{ initials: "BG", color: "bg-emerald-500" }],
      teams: [{ name: "ICT Team", color: "bg-blue-500" }]
    },
    {
      id: "2",
      title: "Ignite Innovation Fires",
      description: "Fuel the development of cutting-edge digital solutions, sparking creativity and pioneering advancements. Cultivate an environment where ideas flourish, driving the creation of products that challenge norms and inspire future technological evolution.",
      isEditing: false,
      users: [{ initials: "BG", color: "bg-emerald-500" }],
      teams: [{ name: "ICT Team", color: "bg-blue-500" }]
    },
    {
      id: "3",
      title: "Craft Tomorrow's Digital Wonders",
      description: "Design and develop visionary digital products that captivate and engage users, transforming the way people interact with technology. Focus on originality and boldness to deliver experiences that are both innovative and unforgettable.",
      isEditing: true,
      users: [{ initials: "BG", color: "bg-emerald-500" }],
      teams: [{ name: "ICT Team", color: "bg-blue-500" }]
    },
    {
      id: "4",
      title: "Embrace the Future of Tech",
      description: "Lead the charge in digital innovation by creating products that anticipate future trends and needs. Encourage bold thinking and experimentation to produce solutions that are ahead of their time, setting the pace for industry evolution.",
      isEditing: false,
      users: [{ initials: "BG", color: "bg-emerald-500" }],
      teams: [{ name: "ICT Team", color: "bg-blue-500" }]
    },
    {
      id: "5",
      title: "Pioneer Digital Excellence",
      description: "Establish a new benchmark for digital product quality and user experience. Commit to delivering solutions that exceed expectations through meticulous attention to detail, innovative approaches, and a deep understanding of user needs.",
      isEditing: false,
      users: [{ initials: "BG", color: "bg-emerald-500" }],
      teams: [{ name: "ICT Team", color: "bg-blue-500" }]
    }
  ]);

  const handleEditTitle = (id: string, newTitle: string) => {
    setSuggestedOKRs(suggestedOKRs.map(okr => 
      okr.id === id ? { ...okr, title: newTitle } : okr
    ));
  };

  const handleEditDescription = (id: string, newDescription: string) => {
    setSuggestedOKRs(suggestedOKRs.map(okr => 
      okr.id === id ? { ...okr, description: newDescription } : okr
    ));
  };

  const toggleEditing = (id: string) => {
    setSuggestedOKRs(suggestedOKRs.map(okr => 
      okr.id === id ? { ...okr, isEditing: !okr.isEditing } : okr
    ));
  };

  const handleCancelEditing = (id: string) => {
    setSuggestedOKRs(suggestedOKRs.map(okr => 
      okr.id === id ? { ...okr, isEditing: false } : okr
    ));
  };

  const handleSaveEditing = (id: string) => {
    setSuggestedOKRs(suggestedOKRs.map(okr => 
      okr.id === id ? { ...okr, isEditing: false } : okr
    ));
  };

  const handleDeleteOKR = (id: string) => {
    setSuggestedOKRs(suggestedOKRs.filter(okr => okr.id !== id));
  };

  const handleSuggestMore = () => {
    // Here we would normally make an API call to get more suggestions
    // For demo purposes, we'll just reset to the original suggestions
    setLocation("/create-okr-ai");
  };

  const handleAddManually = () => {
    setLocation("/create-objective");
  };

  const handleCreateKeyResults = () => {
    setLocation("/suggested-key-results");
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="bg-blue-50 p-4 mb-6 rounded-md">
        <p className="text-blue-800">
          These are your recommended Objectives. Edit, remove, or add Objectives before adding Key Results.
        </p>
      </div>

      <div className="space-y-4">
        {suggestedOKRs.map((okr) => (
          <div key={okr.id} className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              
              <div className="flex-1">
                {okr.isEditing ? (
                  <>
                    <Input 
                      value={okr.title}
                      onChange={(e) => handleEditTitle(okr.id, e.target.value)}
                      className="mb-3 font-medium text-gray-900"
                    />
                    <Textarea 
                      value={okr.description}
                      onChange={(e) => handleEditDescription(okr.id, e.target.value)}
                      className="w-full mb-4"
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-900 mb-3">{okr.title}</h3>
                    <p className="text-gray-600 mb-4">{okr.description}</p>
                  </>
                )}

                <div className="flex flex-wrap gap-2">
                  {okr.users.map((user, idx) => (
                    <div key={`user-${idx}`} className="flex items-center">
                      <div className={`h-8 w-8 rounded-full ${user.color} text-white flex items-center justify-center font-medium`}>
                        {user.initials}
                      </div>
                    </div>
                  ))}
                  
                  {okr.teams.map((team, idx) => (
                    <div key={`team-${idx}`} className="flex items-center">
                      <div className="flex items-center gap-1 border rounded-full px-3 py-1 bg-gray-100">
                        <div className={`h-6 w-6 rounded-full ${team.color} text-white flex items-center justify-center text-xs`}>
                          ICT
                        </div>
                        <span className="text-sm">{team.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {okr.isEditing ? (
                  <>
                    <button 
                      onClick={() => handleCancelEditing(okr.id)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Cancel editing"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleSaveEditing(okr.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Save changes"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => toggleEditing(okr.id)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Edit this objective"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOKR(okr.id)}
                      className="text-gray-500 hover:text-red-500"
                      title="Remove this objective"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleSuggestMore}
        >
          <RefreshCw className="h-4 w-4" />
          Suggest more
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleAddManually}
        >
          <Plus className="h-4 w-4" />
          Add manually
        </Button>
        
        <Button 
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleCreateKeyResults}
        >
          <Target className="h-4 w-4" />
          Create Key Results
        </Button>
      </div>
    </div>
  );
}