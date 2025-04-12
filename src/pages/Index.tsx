
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Github } from 'lucide-react';
import ImageRecognition from '@/components/ImageRecognition';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6 text-theme-purple" />
            <h1 className="text-xl font-bold">SightSnap</h1>
          </div>
          
          <a 
            href="https://github.com/huggingface/transformers.js" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Github size={16} />
              <span className="hidden sm:block">GitHub</span>
            </Button>
          </a>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-theme-purple to-theme-teal bg-clip-text text-transparent">
              Image Recognition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload an image or take a photo and our AI will tell you what it sees. 
              All processing happens in your browser - no data is sent to any server.
            </p>
          </div>
          
          <ImageRecognition />
          
          <div className="mt-12 bg-muted rounded-lg p-4 text-center text-sm text-muted-foreground">
            <p>
              Powered by HuggingFace Transformers.js - all image processing happens locally in your browser.
              <br />No images are uploaded to any server.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
