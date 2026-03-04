import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Linkedin, GraduationCap, ExternalLink, Eye, X, Youtube } from "lucide-react";
import { useState } from "react";

interface TeamMemberCardProps {
  name: string;
  preferredName?: string;
  role: string;
  bio: string;
  expertise: string[];
  researchInterests?: string[];
  projects?: Array<{title: string; description: string}>;
  education?: string;
  links?: {
    linkedIn?: string;
    orcid?: string;
    googleScholar?: string;
    website?: string;
    youtube?: string;
  };
  imageUrl: string;
}

export function TeamMemberCard({ 
  name, 
  preferredName,
  role, 
  bio, 
  expertise, 
  researchInterests,
  projects,
  education,
  links,
  imageUrl 
}: TeamMemberCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const displayName = preferredName || name;
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border cursor-pointer group" onClick={() => setIsDialogOpen(true)}>
        <div className="aspect-square overflow-hidden bg-muted">
          <ImageWithFallback
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold text-lg mb-1">{displayName}</h3>
          {preferredName && preferredName !== name && (
            <p className="text-xs text-muted-foreground mb-1">{name}</p>
          )}
          <p className="text-sm text-primary mb-3">{role}</p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
            className="w-full gap-2"
          >
            <Eye className="h-4 w-4" />
            View Profile
          </Button>
        </CardContent>
      </Card>

      {/* Modal Dialog with Full Details */}
      {isDialogOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
                {preferredName && preferredName !== name && (
                  <p className="text-sm text-muted-foreground">{name}</p>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-full hover:bg-primary/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 bg-gradient-to-br from-background via-white to-soft-lavender/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Image & Quick Info */}
                <div className="md:col-span-1 space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-2">Position</p>
                      <p className="text-sm text-primary">{role}</p>
                    </div>
                    
                    {education && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <p className="text-sm font-semibold">Education</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{education}</p>
                      </div>
                    )}
                    
                    {links && (links.linkedIn || links.orcid || links.googleScholar || links.website || links.youtube) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Connect</p>
                        <div className="flex flex-wrap gap-2">
                          {links.linkedIn && (
                            <a 
                              href={links.linkedIn} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {links.orcid && (
                            <a 
                              href={links.orcid} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="ORCID"
                            >
                              <span className="text-xs font-bold">ORCID</span>
                            </a>
                          )}
                          {links.googleScholar && (
                            <a 
                              href={links.googleScholar} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Google Scholar"
                            >
                              <span className="text-xs font-bold">Scholar</span>
                            </a>
                          )}
                          {links.youtube && (
                            <a 
                              href={links.youtube} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="YouTube"
                            >
                              <Youtube className="h-5 w-5" />
                            </a>
                          )}
                          {links.website && (
                            <a 
                              href={links.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Website"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Detailed Info */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Biography</h4>
                    <p className="text-foreground/80 leading-relaxed">{bio}</p>
                  </div>
                  
                  {expertise && expertise.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {researchInterests && researchInterests.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Research Interests</h4>
                      <ul className="space-y-2">
                        {researchInterests.map((interest, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1.5">•</span>
                            <span className="text-foreground/80">{interest}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {projects && projects.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Projects</h4>
                      <div className="space-y-3">
                        {projects.map((project, idx) => (
                          <div key={idx} className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-foreground">{project.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
