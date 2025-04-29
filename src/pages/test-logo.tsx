import { LogoUpload } from "@/components/dashboard/logo-upload";

export default function TestLogoPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Logo Upload Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <LogoUpload />
      </div>
    </div>
  );
}