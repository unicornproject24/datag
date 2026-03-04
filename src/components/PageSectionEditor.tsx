import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { AdvancedEditor } from "./admin/AdvancedEditor";
import { Save, X, CheckCircle, Image as ImageIcon } from "lucide-react";

interface PageSectionEditorProps {
  section: string;
  pageName: string;
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function PageSectionEditor({ section, pageName, initialData, onSave, onCancel }: PageSectionEditorProps) {
  const [formData, setFormData] = useState(initialData || {});

  const handleFieldChange = (key: string, value: string | object) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  // Render different fields based on section
  const renderSectionFields = () => {
    const currentData = formData || {};

    switch (section) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <Input
                value={currentData.heroTitle?.value || ''}
                onChange={(e) => handleFieldChange('heroTitle', { value: e.target.value })}
                placeholder="Where Data Meets Human Flourishing"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Description</label>
              <Textarea
                value={currentData.heroDescription?.value || ''}
                onChange={(e) => handleFieldChange('heroDescription', { value: e.target.value })}
                placeholder="Advancing research at the intersection of data science..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image URL</label>
              <Input
                value={currentData.heroImage?.metadata?.imageUrl || ''}
                onChange={(e) => handleFieldChange('heroImage', { 
                  value: currentData.heroImage?.value || '',
                  metadata: { imageUrl: e.target.value }
                })}
                placeholder="/images/your-image.jpg"
              />
              {currentData.heroImage?.metadata?.imageUrl && (
                <img 
                  src={currentData.heroImage.metadata.imageUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg mt-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.txt';
                  }}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Button 1 Text</label>
              <Input
                value={currentData.ctaButton1Text?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton1Text', { value: e.target.value })}
                placeholder="Learn More"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Button 2 Text</label>
              <Input
                value={currentData.ctaButton2Text?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton2Text', { value: e.target.value })}
                placeholder="Explore Research"
              />
            </div>
          </div>
        );

      case 'approach':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Section Title</label>
              <Input
                value={currentData.approachTitle?.value || ''}
                onChange={(e) => handleFieldChange('approachTitle', { value: e.target.value })}
                placeholder="Our Approach"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Description</label>
              <Textarea
                value={currentData.approachDescription?.value || ''}
                onChange={(e) => handleFieldChange('approachDescription', { value: e.target.value })}
                placeholder="We believe that data science should serve humanity..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Approach Image URL</label>
              <Input
                value={currentData.approachImage?.metadata?.imageUrl || ''}
                onChange={(e) => handleFieldChange('approachImage', {
                  value: currentData.approachImage?.value || '',
                  metadata: { imageUrl: e.target.value }
                })}
                placeholder="/images/approach-image.jpg"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Core Values (3 cards)</h4>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="mb-4 p-3 border rounded-lg space-y-2">
                  <h5 className="text-sm font-medium">Value {num}</h5>
                  <Input
                    value={currentData[`value${num}Title`]?.value || ''}
                    onChange={(e) => handleFieldChange(`value${num}Title`, { value: e.target.value })}
                    placeholder="Evidence-Based"
                    className="mb-2"
                  />
                  <Textarea
                    value={currentData[`value${num}Description`]?.value || ''}
                    onChange={(e) => handleFieldChange(`value${num}Description`, { value: e.target.value })}
                    placeholder="Rigorous research methods..."
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Section Title</label>
              <Input
                value={currentData.statsTitle?.value || ''}
                onChange={(e) => handleFieldChange('statsTitle', { value: e.target.value })}
                placeholder="Making a Difference"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Section Subtitle</label>
              <Input
                value={currentData.statsSubtitle?.value || ''}
                onChange={(e) => handleFieldChange('statsSubtitle', { value: e.target.value })}
                placeholder="Our research and initiatives are creating positive change"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Statistics (4 stats)</h4>
              
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="mb-4 p-3 border rounded-lg space-y-2">
                  <h5 className="text-sm font-medium">Statistic {num}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={currentData[`stat${num}Value`]?.value || ''}
                      onChange={(e) => handleFieldChange(`stat${num}Value`, { value: e.target.value })}
                      placeholder="50+"
                    />
                    <Input
                      value={currentData[`stat${num}Label`]?.value || ''}
                      onChange={(e) => handleFieldChange(`stat${num}Label`, { value: e.target.value })}
                      placeholder="Publications"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'discover':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Section Title</label>
              <Input
                value={currentData.discoverTitle?.value || ''}
                onChange={(e) => handleFieldChange('discoverTitle', { value: e.target.value })}
                placeholder="Discover DaWg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Section Subtitle</label>
              <Input
                value={currentData.discoverSubtitle?.value || ''}
                onChange={(e) => handleFieldChange('discoverSubtitle', { value: e.target.value })}
                placeholder="Explore our work across research, community, and collaboration"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Cards (5 cards)</h4>
              <p className="text-xs text-muted-foreground mb-3">Each card has: title, description, and target page</p>
              
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="mb-4 p-3 border rounded-lg space-y-2">
                  <h5 className="text-sm font-medium">Card {num}</h5>
                  <Input
                    value={currentData[`card${num}Title`]?.value || ''}
                    onChange={(e) => handleFieldChange(`card${num}Title`, { value: e.target.value })}
                    placeholder="About Us"
                    className="mb-2"
                  />
                  <Textarea
                    value={currentData[`card${num}Description`]?.value || ''}
                    onChange={(e) => handleFieldChange(`card${num}Description`, { value: e.target.value })}
                    placeholder="Learn about our mission..."
                    rows={2}
                    className="mb-2"
                  />
                  <Input
                    value={currentData[`card${num}Page`]?.value || ''}
                    onChange={(e) => handleFieldChange(`card${num}Page`, { value: e.target.value })}
                    placeholder="about"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Title</label>
              <Input
                value={currentData.ctaTitle?.value || ''}
                onChange={(e) => handleFieldChange('ctaTitle', { value: e.target.value })}
                placeholder="Join Us in Shaping the Future"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CTA Description</label>
              <Textarea
                value={currentData.ctaDescription?.value || ''}
                onChange={(e) => handleFieldChange('ctaDescription', { value: e.target.value })}
                placeholder="Whether you're a researcher, organization, or individual..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button 1 Text</label>
              <Input
                value={currentData.ctaButton1Text?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton1Text', { value: e.target.value })}
                placeholder="Join Our Team"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button 1 Target Page</label>
              <Input
                value={currentData.ctaButton1Page?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton1Page', { value: e.target.value })}
                placeholder="team"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button 2 Text</label>
              <Input
                value={currentData.ctaButton2Text?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton2Text', { value: e.target.value })}
                placeholder="Become a Partner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button 2 Target Page</label>
              <Input
                value={currentData.ctaButton2Page?.value || ''}
                onChange={(e) => handleFieldChange('ctaButton2Page', { value: e.target.value })}
                placeholder="partners"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Editing section: <strong>{section}</strong>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content (JSON format)</label>
              <Textarea
                value={JSON.stringify(currentData, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData(parsed);
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Edit {pageName} - {section}</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Configure the content for this section
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {renderSectionFields()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button 
              type="button" 
              onClick={handleSave}
              className="bg-gradient-primary gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
