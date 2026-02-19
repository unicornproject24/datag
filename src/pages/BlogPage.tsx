import { BlogPostCard } from "../components/BlogPostCard";
import { Button } from "../components/ui/button";
import { Search, Lightbulb, ArrowLeft, Clock, User, Calendar, Heart, Brain } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
  isPublic: boolean;
  publishedAt: string;
  createdAt: string;
}

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchQuery, selectedCategory]);

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blog-posts');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogPosts(data);
        setFilteredPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
    setLoading(false);
  };

  const filterPosts = () => {
    let filtered = blogPosts;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  // Get unique categories
  const allCategories = ["all", ...Array.from(new Set(blogPosts.map(p => p.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground text-lg">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Show single blog post detail
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-green pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button 
            variant="outline"
            onClick={() => setSelectedPost(null)}
            className="mb-8 rounded-xl px-6 py-3 border-border hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          {selectedPost.imageUrl && (
            <div className="relative mb-8 rounded-3xl overflow-hidden soft-shadow">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">{selectedPost.category}</Badge>
            {selectedPost.tags.map(tag => (
              <Badge key={tag} variant="outline" className="border-accent text-accent px-4 py-2 rounded-full text-sm">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium text-foreground">{selectedPost.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(selectedPost.publishedAt || selectedPost.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {selectedPost.readTime}
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {selectedPost.excerpt}
            </p>
            <div className="text-foreground leading-relaxed whitespace-pre-wrap bg-white p-8 rounded-2xl soft-shadow">
              {selectedPost.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue pt-20">
      {/* Header Section */}
      <section className="py-24 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Heart className="h-5 w-5 text-white" />
            <span className="text-sm font-medium text-white">Our Thoughts</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Insights & Ideas
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Our team members share thoughts, findings, and perspectives on data well-being. 
            These posts are open for anyone to explore and engage with.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
            <Input 
              type="text" 
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 rounded-2xl focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-gradient-to-br from-background to-soft-green">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Latest Articles</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Latest Posts</h2>
            </div>
            <Button 
              variant="outline"
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-xl px-6 py-3 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              Subscribe to Updates
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.map((post) => (
              <BlogPostCard 
                key={post.id} 
                {...post} 
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl soft-shadow">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-primary flex items-center justify-center">
                <Lightbulb className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">No Blog Posts Found</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Check back soon for insights and perspectives from our team on data well-being and ethical AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Topic Section */}
      <section className="py-20 bg-gradient-to-br from-soft-lavender to-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Explore Topics</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Browse by Topic</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover content organized by categories</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 text-sm font-medium rounded-full border-2 transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-primary text-white border-primary shadow-md hover:shadow-lg'
                    : 'bg-white border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-sm hover:-translate-y-1'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Stay Connected</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Subscribe to our newsletter to receive the latest blog posts, research updates, and insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 h-14 bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 rounded-xl focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary hover:bg-white/90 h-14 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
