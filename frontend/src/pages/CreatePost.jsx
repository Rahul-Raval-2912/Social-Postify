import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Upload, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import FileUploader from "../components/FileUploader.jsx";
import PreviewImage from "../components/PreviewImage.jsx";
import PlatformSelect from "../components/PlatformSelect.jsx";
import apiService from "../services/api.js";

const CreatePost = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const platforms = [
    { id: 'telegram', name: 'Telegram', icon: '📱' },
    { id: 'instagram', name: 'Instagram', icon: '📷' },
  ];

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await apiService.generateImage(prompt);
      if (response.image_base64) {
        setGeneratedImage(`data:image/png;base64,${response.image_base64}`);
        toast({ title: "Image generated successfully!" });
      }
    } catch (error) {
      toast({ title: "Failed to generate image", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (files) => {
    const fileArray = files instanceof FileList ? Array.from(files) : [files];
    const newImages = fileArray.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const handleCreatePost = async () => {
    if (!title || !caption) {
      toast({ title: "Please fill title and caption", variant: "destructive" });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({ title: "Please select at least one platform", variant: "destructive" });
      return;
    }

    setIsCreating(true);
    try {
      toast({ title: "Creating post...", description: "Please wait" });
      
      // Create post
      const postData = {
        title,
        content: caption,
        status: 'draft'
      };

      // Add image if available
      if (uploadedImages.length > 0) {
        postData.image = uploadedImages[0].file;
      }

      const post = await apiService.createPost(postData);
      toast({ title: "Post created!", description: "Now publishing to platforms..." });
      
      // Publish to selected platforms
      const publishData = {
        platforms: selectedPlatforms.reduce((acc, platform) => {
          acc[platform] = true;
          return acc;
        }, {})
      };

      const results = await apiService.publishPost(post.id, publishData);
      
      // Show detailed results
      const successPlatforms = [];
      const failedPlatforms = [];
      
      results.results?.forEach(result => {
        if (result.success) {
          successPlatforms.push(result.platform);
        } else {
          failedPlatforms.push(`${result.platform}: ${result.message}`);
        }
      });
      
      if (successPlatforms.length > 0) {
        toast({ 
          title: `Success! Posted to: ${successPlatforms.join(', ')}`,
          description: failedPlatforms.length > 0 ? `Failed: ${failedPlatforms.join(', ')}` : undefined
        });
        
        // Reset form on success
        setTitle('');
        setCaption('');
        setSelectedPlatforms([]);
        setUploadedImages([]);
        setGeneratedImage(null);
        setPrompt('');
      } else {
        toast({ 
          title: "All platforms failed", 
          description: failedPlatforms.join(', '),
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error.message.includes('login') ? 'Please refresh and login again' : error.message,
        variant: "destructive" 
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Create Post</h1>
        <p className="text-muted-foreground">
          Generate AI content or upload your own images to create engaging posts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Content Creation */}
        <div className="space-y-6">
          {/* AI Image Generator */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                AI Image Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prompt">Describe your image</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A modern tech product on a sleek background with purple lighting..."
                  className="glass-surface border-border/30 resize-none"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleGenerateImage}
                disabled={!prompt.trim() || isGenerating}
                className="w-full btn-gradient"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

              {generatedImage && (
                <PreviewImage src={generatedImage} alt="Generated content" onRemove={() => setGeneratedImage(null)} />
              )}
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-accent" />
                Upload Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader
                onFileSelect={handleImageUpload}
                accept="image/*"
                multiple
              />
              
              {uploadedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {uploadedImages.map((image) => (
                    <PreviewImage 
                      key={image.id} 
                      src={image.url} 
                      alt="Uploaded content"
                      onRemove={() => setUploadedImages(uploadedImages.filter(img => img.id !== image.id))}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Post Details */}
        <div className="space-y-6">
          {/* Client Selection */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                  className="glass-surface border-border/30"
                />
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here... Use emojis to make it engaging! 🚀"
                  className="glass-surface border-border/30 resize-none"
                  rows={4}
                />
              </div>

              <div>
                <Label>Select Platforms</Label>
                <PlatformSelect
                  selectedPlatforms={selectedPlatforms}
                  onChange={setSelectedPlatforms}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={handleCreatePost}
              disabled={!title || !caption || selectedPlatforms.length === 0 || isCreating}
              className="flex-1 btn-gradient"
            >
              {isCreating ? 'Creating...' : 'Create & Publish Post'}
            </Button>
            <Button 
              variant="outline"
              className="btn-glass"
            >
              Save Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;