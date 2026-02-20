import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Linkedin, GraduationCap, ExternalLink } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  preferredName?: string;
  role: string;
  bio: string;
  expertise: string[];
  researchInterests?: string[];
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
  education,
  links,
  imageUrl 
}: TeamMemberCardProps) {
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
            <GraduationCap className="h-4 w-4" />
            <span>{education}</span>
          </div>
        )}
        
        <p className="text-foreground/80 mb-4 line-clamp-4">{bio}</p>
        
        {researchInterests && researchInterests.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Research Interests:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {researchInterests.slice(0, 3).map((interest, idx) => (
                <li key={idx} className="line-clamp-1">{interest}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {expertise.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
              {skill}
            </Badge>
          ))}
        </div>
        
        {links && (links.linkedIn || links.orcid || links.googleScholar || links.website) && (
          <div className="flex gap-2 pt-3 border-t">
            {links.linkedIn && (
              <a 
                href={links.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
              >
                <span className="text-xs font-bold">Scholar</span>
              </a>
            )}
            {links.website && (
              <a 
                href={links.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
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
