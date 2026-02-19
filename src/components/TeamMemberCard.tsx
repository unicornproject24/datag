import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  imageUrl: string;
}

export function TeamMemberCard({ name, role, bio, expertise, imageUrl }: TeamMemberCardProps) {
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
        <h3 className="mb-1">{name}</h3>
        <p className="text-primary mb-3">{role}</p>
        <p className="text-foreground/80 mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2">
          {expertise.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
