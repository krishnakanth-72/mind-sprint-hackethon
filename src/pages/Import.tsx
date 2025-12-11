import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';
import { parseExcelFile } from '@/lib/fileParser';

interface UploadedFile {
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  records?: number;
  errors?: string[];
}

export default function Import() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { addProducts } = useInventory();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const parsedProducts = parseExcelFile(data);
        
        // Add the new products to inventory
        addProducts(parsedProducts);
        
        // Update UI to show success
        setFiles(prev => prev.map(f => 
          f.name === file.name 
            ? { 
                ...f, 
                status: 'success',
                records: parsedProducts.length,
                progress: 100
              } 
            : f
        ));
        
        toast({
          title: "Import Successful",
          description: `${file.name} has been processed successfully. Added ${parsedProducts.length} products.`,
        });
      } catch (error) {
        console.error('Error processing file:', error);
        setFiles(prev => prev.map(f => 
          f.name === file.name 
            ? { 
                ...f, 
                status: 'error',
                errors: ['Failed to process file. Please check the format and try again.']
              } 
            : f
        ));
        
        toast({
          title: "Import Failed",
          description: "Failed to process the file. Please check the format and try again.",
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      setFiles(prev => prev.map(f => 
        f.name === file.name 
          ? { 
              ...f, 
              status: 'error',
              errors: ['Error reading file.']
            } 
          : f
      ));
      
      toast({
        title: "Error",
        description: "An error occurred while reading the file.",
        variant: "destructive",
      });
    };

    reader.readAsBinaryString(file);
  };

  const simulateUpload = (file: File) => {
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    };

    setFiles(prev => [...prev, uploadedFile]);

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, status: 'processing', progress: 100 } : f
        ));

        // Process the actual file
        processFile(file);
      } else {
        setFiles(prev => prev.map(f => 
          f.name === file.name ? { ...f, progress } : f
        ));
      }
    }, 100);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
    );

    droppedFiles.forEach(simulateUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(simulateUpload);
  };

  const removeFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Import Data</h1>
        <p className="text-muted-foreground mt-1">
          Upload Excel files to update inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display">Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
                isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200",
                  isDragging ? "bg-primary/20" : "bg-secondary"
                )}>
                  <Upload className={cn(
                    "w-8 h-8 transition-all duration-200",
                    isDragging ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline" className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Select Files
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Supported formats: .xlsx, .xls, .csv
                </p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-foreground">Uploaded Files</h3>
                {files.map((file, index) => (
                  <div
                    key={file.name}
                    className={cn(
                      "p-4 rounded-lg border animate-slide-up",
                      file.status === 'success' && "bg-success/5 border-success/20",
                      file.status === 'error' && "bg-destructive/5 border-destructive/20",
                      (file.status === 'uploading' || file.status === 'processing') && "bg-secondary"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          file.status === 'success' && "bg-success/20",
                          file.status === 'error' && "bg-destructive/20",
                          (file.status === 'uploading' || file.status === 'processing') && "bg-primary/20"
                        )}>
                          {file.status === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                          {file.status === 'error' && <AlertCircle className="w-5 h-5 text-destructive" />}
                          {(file.status === 'uploading' || file.status === 'processing') && (
                            <FileSpreadsheet className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                            {file.records && ` • ${file.records} records imported`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(file.name)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {(file.status === 'uploading' || file.status === 'processing') && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                          </span>
                          <span className="text-foreground">{Math.round(file.progress)}%</span>
                        </div>
                        <Progress value={file.progress} className="h-1.5" />
                      </div>
                    )}

                    {file.errors && file.errors.length > 0 && (
                      <div className="mt-3 p-3 rounded bg-destructive/10">
                        <p className="text-sm font-medium text-destructive mb-1">Errors:</p>
                        <ul className="text-sm text-destructive/80 space-y-1">
                          {file.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">File Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">Required Columns:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Product Name</li>
                  <li>• SKU</li>
                  <li>• Batch Number</li>
                  <li>• Quantity</li>
                  <li>• Expiry Date (YYYY-MM-DD)</li>
                  <li>• Unit Price</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Optional Columns:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Category</li>
                  <li>• Supplier</li>
                  <li>• Reorder Level</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Download Template</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get a sample Excel template with the correct format.
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Download Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
