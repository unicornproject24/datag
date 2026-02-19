import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorImage: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
  publishedAt: string;
  createdAt: string;
  onClick?: () => void;
}

export function BlogPostCard({ 
  title, 
  excerpt, 
  author, 
  authorImage, 
  category,
  tags,
  imageUrl,
  readTime, 
  publishedAt,
  createdAt,
  onClick 
}: BlogPostCardProps) {
  const displayDate = publishedAt ? new Date(publishedAt).toLocaleDateString() : new Date(createdAt).toLocaleDateString();
  
  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col border-border cursor-pointer hover:-translate-y-1"
      onClick={onClick}
    >
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{category}</Badge>
          {tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">+{tags.length - 2}</Badge>
          )}
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-0">
        <p className="text-foreground/70 text-sm mb-4 flex-1 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={authorImage} alt={author} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {author.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground">{author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{displayDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Read More <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
