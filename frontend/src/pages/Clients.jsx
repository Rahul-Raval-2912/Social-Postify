import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import ColorPicker from "../components/ColorPicker";
import FileUploader from "../components/FileUploader";

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "TechCorp",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
      brandColor: "#8B5CF6",
      templates: ["Tech innovation post", "Product launch announcement"]
    },
    {
      id: 2,
      name: "FitLife",
      logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100",
      brandColor: "#10B981",
      templates: ["Fitness motivation", "Workout tips", "Healthy lifestyle"]
    },
    {
      id: 3,
      name: "FoodieDelight",
      logo: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100",
      brandColor: "#F59E0B",
      templates: ["Recipe showcase", "Restaurant feature", "Food photography"]
    }
  ]);

  const [newClient, setNewClient] = useState({
    name: "",
    logo: null,
    brandColor: "#8B5CF6",
    templates: ""
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddClient = () => {
    const client = {
      id: Date.now(),
      name: newClient.name,
      logo: newClient.logo || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100",
      brandColor: newClient.brandColor,
      templates: newClient.templates.split(',').map(t => t.trim()).filter(t => t)
    };
    
    setClients([...clients, client]);
    setNewClient({ name: "", logo: null, brandColor: "#8B5CF6", templates: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and their brand settings
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient gap-2">
              <Plus className="w-4 h-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter client name"
                  className="glass-surface border-border/30"
                />
              </div>

              <div>
                <Label>Logo Upload</Label>
                <FileUploader
                  onFileSelect={(file) => {
                    const fileObj = file instanceof FileList ? file[0] : file;
                    setNewClient({...newClient, logo: URL.createObjectURL(fileObj)});
                  }}
                  accept="image/*"
                />
              </div>

              <div>
                <Label>Brand Color</Label>
                <ColorPicker
                  color={newClient.brandColor}
                  onChange={(color) => setNewClient({...newClient, brandColor: color})}
                />
              </div>

              <div>
                <Label htmlFor="templates">Default Caption Templates</Label>
                <Textarea
                  id="templates"
                  value={newClient.templates}
                  onChange={(e) => setNewClient({...newClient, templates: e.target.value})}
                  placeholder="Enter templates separated by commas"
                  className="glass-surface border-border/30"
                />
              </div>

              <Button onClick={handleAddClient} className="w-full btn-gradient">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="glass-card hover-glow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div 
                      className="w-4 h-4 rounded-full mt-1"
                      style={{ backgroundColor: client.brandColor }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="hover:bg-secondary/50">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleDeleteClient(client.id)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div>
                <h4 className="font-medium mb-2 text-sm text-muted-foreground">Templates:</h4>
                <div className="space-y-1">
                  {client.templates.map((template, index) => (
                    <div key={index} className="text-sm glass-surface px-2 py-1 rounded">
                      {template}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;