import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "Planning" | string;
  tags: string[];
  imageUrl: string;
}

export function ProjectCard({ id, title, description, status, tags, imageUrl }: ProjectCardProps) {
  const statusColors = {
    Active: "bg-green-500 text-white",
    Completed: "bg-blue-500 text-white",
    Planning: "bg-amber-500 text-white"
  };

  const statusColor = statusColors[status as keyof typeof statusColors] || "bg-gray-500 text-white";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-muted relative">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge className={statusColor}>{status}</Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-white text-sm font-medium flex items-center gap-1">
            View Project <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        <p className="text-foreground/70 text-sm mb-4 flex-1 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary/80">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">+{tags.length - 3}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
