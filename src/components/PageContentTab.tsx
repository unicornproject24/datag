import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { AdvancedEditor } from "./admin/AdvancedEditor";
import { Home, FileText, Save, X, Eye, Edit3, Image as ImageIcon } from "lucide-react";

interface PageContentTabProps {
  pageContent: any;
  selectedPage: 'homepage' | 'aboutpage';
  onSelectPage: (page: 'homepage' | 'aboutpage') => void;
  onEditSection: (section: string, data: any) => void;
}

const PAGE_SECTIONS = {
  homepage: [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'approach', label: 'Our Approach', icon: FileText },
    { id: 'stats', label: 'Statistics', icon: FileText },
    { id: 'discover', label: 'Discover DaWg', icon: FileText },
    { id: 'cta', label: 'Call to Action', icon: FileText },
  ],
  aboutpage: [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'mission', label: 'Mission & Research', icon: FileText },
    { id: 'values', label: 'Our Values', icon: FileText },
    { id: 'partners', label: 'Partners', icon: FileText },
  ]
};

export function PageContentTab({ pageContent, selectedPage, onSelectPage, onEditSection }: PageContentTabProps) {
  const currentPageContent = pageContent[selectedPage] || {};
  const sections = PAGE_SECTIONS[selectedPage];

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Page to Edit</CardTitle>
          <CardDescription>Choose which page content you want to manage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedPage === 'homepage' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onSelectPage('homepage')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Home Page</h4>
                <p className="text-sm text-muted-foreground">Edit hero, approach, stats, and CTA sections</p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedPage === 'aboutpage' ? 'ring-2 ring-primary' : ''}`}
              onClick={() => onSelectPage('aboutpage')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">About Page</h4>
                <p className="text-sm text-muted-foreground">Edit mission, values, and partner sections</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Sections Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedPage === 'homepage' ? 'Home' : 'About'} Page Sections</CardTitle>
              <CardDescription>Edit content for each section of the page</CardDescription>
            </div>
            <Badge variant={Object.keys(currentPageContent).length > 0 ? 'default' : 'secondary'}>
              {Object.keys(currentPageContent).length} sections configured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={sections[0]?.id} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {sections.map((section) => {
              const sectionData = currentPageContent[section.id] || {};
              const hasContent = Object.keys(sectionData).length > 0;

              return (
                <TabsContent key={section.id} value={section.id} className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{section.label}</h3>
                      <Button
                        size="sm"
                        onClick={() => onEditSection(section.id, sectionData)}
                        className="gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        {hasContent ? 'Edit' : 'Add Content'}
                      </Button>
                    </div>

                    {hasContent ? (
                      <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                        {Object.entries(sectionData).map(([key, data]: [string, any]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {key}
                              </Badge>
                              {data.metadata?.imageUrl && (
                                <Badge variant="secondary" className="text-xs">
                                  <ImageIcon className="h-3 w-3 mr-1" />
                                  Has Image
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {data.value || data}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No content added yet</p>
                        <p className="text-xs mt-1">Click "Add Content" to configure this section</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
