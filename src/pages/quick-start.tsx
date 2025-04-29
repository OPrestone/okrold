import { GetStartedGuide } from "@/components/quick-start/get-started-guide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Lightbulb, Video } from "lucide-react";

export default function QuickStart() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Quick Get Started Guide</h1>
        <p className="text-neutral-600">Everything you need to set up and run your OKR system successfully</p>
      </div>

      {/* Main Guide */}
      <GetStartedGuide />

      {/* Additional Resources */}
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">Additional Resources</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              OKR Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">
              Download ready-to-use templates for different departments and team sizes.
            </p>
            <a href="/resources" className="text-sm font-medium text-primary-600 hover:text-primary-800 inline-flex items-center">
              Get templates
              <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Video className="mr-2 h-5 w-5 text-primary-500" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">
              Learn through our comprehensive video guides on implementing OKRs effectively.
            </p>
            <a href="/resources#tutorials" className="text-sm font-medium text-primary-600 hover:text-primary-800 inline-flex items-center">
              Watch tutorials
              <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Lightbulb className="mr-2 h-5 w-5 text-primary-500" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600 mb-4">
              Learn from industry experts about OKR best practices and common pitfalls to avoid.
            </p>
            <a href="/resources#best-practices" className="text-sm font-medium text-primary-600 hover:text-primary-800 inline-flex items-center">
              Read best practices
              <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">Frequently Asked Questions</h2>
      
      <Card className="mb-8">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-neutral-900 mb-2">How often should we review OKRs?</h3>
            <p className="text-sm text-neutral-600">
              It's recommended to have weekly check-ins for individual OKRs, bi-weekly for team OKRs, and monthly for company OKRs. Quarterly reviews are essential for evaluating overall performance and planning the next quarter.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-neutral-900 mb-2">What's the ideal number of objectives?</h3>
            <p className="text-sm text-neutral-600">
              For optimal focus and effectiveness, companies should aim for 3-5 objectives per quarter, with 3-5 key results per objective. This prevents spreading resources too thin while maintaining clear priorities.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-neutral-900 mb-2">How do I write good key results?</h3>
            <p className="text-sm text-neutral-600">
              Good key results should be specific, measurable, achievable, relevant, and time-bound (SMART). They should be outcome-focused rather than task-oriented, and quantifiable so progress can be objectively tracked.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
