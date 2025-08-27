import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// Simple test component to verify file upload functionality
export default function FileUploadTest() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    console.log("Button clicked!");
    console.log("File input ref:", fileInputRef.current);
    
    // Try multiple approaches
    const element = document.getElementById("test-file-input");
    console.log("getElementById result:", element);
    
    if (fileInputRef.current) {
      console.log("Using ref approach");
      fileInputRef.current.click();
    } else if (element) {
      console.log("Using getElementById approach");
      element.click();
    } else {
      console.error("No file input found!");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File selected:", file);
    if (file) {
      alert(`File selected: ${file.name}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="mb-4 font-semibold">File Upload Test</h3>
      
      <input
        ref={fileInputRef}
        id="test-file-input"
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Test File Upload
      </Button>
    </div>
  );
}