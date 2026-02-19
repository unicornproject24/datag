import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "lucide-react";

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  author: string;
  authorImage: string;
  date: string;
  readTime: string;
}

export function BlogPostCard({ title, excerpt, author, authorImage, date, readTime }: BlogPostCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-foreground/80 mb-4 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorImage} alt={author} />
              <AvatarFallback className="bg-primary/20 text-primary">{author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-foreground">{author}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <span>{readTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
