import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Linkedin, GraduationCap, ExternalLink, ChevronDown, ChevronUp, Youtube } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const displayName = preferredName || name;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border">
      <div className="aspect-square overflow-hidden bg-muted">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="mb-1">{displayName}</h3>
        {preferredName && preferredName !== name && (
          <p className="text-sm text-muted-foreground mb-1">{name}</p>
        )}
        <p className="text-primary mb-3">{role}</p>
        
        {education && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{education}</span>
          </div>
        )}
        
        <p className={`text-foreground/80 mb-4 ${isExpanded ? '' : 'line-clamp-4'}`}>{bio}</p>
        
        {/* Expandable Content */}
        {isExpanded && (
          <div className="space-y-4 mb-4 animate-in slide-in-from-top-2 duration-200">
            {researchInterests && researchInterests.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Research Interests:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {researchInterests.map((interest, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {projects && projects.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Projects:</p>
                <div className="space-y-3">
                  {projects.map((project, idx) => (
                    <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground">{project.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {expertise.slice(0, isExpanded ? undefined : 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
              {skill}
            </Badge>
          ))}
          {!isExpanded && expertise.length > 4 && (
            <Badge variant="outline" className="text-xs">+{expertise.length - 4} more</Badge>
          )}
        </div>
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mb-3 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              View More
            </>
          )}
        </Button>
        
        {links && (links.linkedIn || links.orcid || links.googleScholar || links.website || links.youtube) && (
          <div className="flex gap-2 pt-3 border-t">
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
        )}
      </CardContent>
    </Card>
  );
}
