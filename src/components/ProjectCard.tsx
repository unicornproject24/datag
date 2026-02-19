import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProjectCardProps {
  title: string;
  description: string;
  status: "Active" | "Completed" | "Planning";
  tags: string[];
  imageUrl: string;
}

export function ProjectCard({ title, description, status, tags, imageUrl }: ProjectCardProps) {
  const statusColors = {
    Active: "bg-secondary text-white",
    Completed: "bg-primary text-white",
    Planning: "bg-accent text-foreground"
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-border">
      <div className="aspect-video overflow-hidden bg-muted">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex-1">{title}</CardTitle>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-foreground/80 mb-4 flex-1">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-primary/40 text-primary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
