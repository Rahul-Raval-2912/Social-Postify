import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageCircle, Book, Video, ChevronDown } from "lucide-react";

const Help = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I generate AI images for my posts?",
      answer: "Navigate to the 'Create Post' section and use the AI Image Generator. Simply describe what you want in the text area and click 'Generate Image'. Our AI will create a unique image based on your description."
    },
    {
      question: "Can I schedule posts to multiple platforms at once?",
      answer: "Yes! When creating or scheduling a post, you can select multiple platforms including Instagram, WhatsApp, Telegram, and Email. The post will be automatically formatted for each platform."
    },
    {
      question: "How do I add a new client?",
      answer: "Go to the 'Clients' page and click 'Add New Client'. You can upload their logo, set their brand color, and create default caption templates for faster posting."
    },
    {
      question: "What happens if a scheduled post fails?",
      answer: "If a post fails to publish, you'll receive a notification and can see the status in your Post History. Failed posts can be rescheduled or manually published."
    },
    {
      question: "How can I track engagement and performance?",
      answer: "Visit your Dashboard to see overall performance metrics, or check the Post History page for detailed engagement data on individual posts including likes, shares, and comments."
    },
    {
      question: "Is there a limit to how many posts I can schedule?",
      answer: "The number of posts you can schedule depends on your subscription plan. Check your account settings for current limits and upgrade options."
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using Social Postify",
      icon: Book,
      type: "Documentation"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      icon: Video,
      type: "Videos"
    },
    {
      title: "API Documentation",
      description: "For developers wanting to integrate",
      icon: Book,
      type: "Technical"
    }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions or get in touch with our team
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - FAQs and Resources */}
        <div className="space-y-8">
          {/* FAQs */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="glass-surface rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-accent" />
                Learning Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <div 
                    key={index}
                    className="glass-surface p-4 rounded-lg hover:bg-glass/80 transition-smooth cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                        <resource.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Form */}
        <div className="space-y-8">
          {/* Contact Support */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="glass-surface border-border/30"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="glass-surface border-border/30"
                      required
                    />
                  </div>
                </div>
                
                <Input
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="glass-surface border-border/30"
                  required
                />
                
                <Textarea
                  placeholder="Describe your issue or question..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="glass-surface border-border/30 resize-none"
                  rows={6}
                  required
                />
                
                <Button type="submit" className="w-full btn-gradient">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full btn-glass justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="w-full btn-glass justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full btn-glass justify-start">
                <Book className="w-4 h-4 mr-2" />
                Browse Knowledge Base
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="text-muted-foreground">Support Email:</p>
                <p className="font-medium">support@socialpostify.com</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Response Time:</p>
                <p className="font-medium">Within 24 hours</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Available:</p>
                <p className="font-medium">Monday - Friday, 9AM - 6PM EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;