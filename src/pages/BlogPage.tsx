import { BlogPostCard } from "../components/BlogPostCard";
import { Button } from "../components/ui/button";
import { Search, Lightbulb, ArrowLeft, Clock, User, Calendar } from "lucide-react";
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
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  // Show single blog post detail
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPost(null)}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          {selectedPost.imageUrl && (
            <img 
              src={selectedPost.imageUrl} 
              alt={selectedPost.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
            />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{selectedPost.category}</Badge>
            {selectedPost.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {selectedPost.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {selectedPost.author}
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
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {selectedPost.excerpt}
            </p>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {selectedPost.content}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Insights & Ideas
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            Our team members share thoughts, findings, and perspectives on data well-being. 
            These posts are open for anyone to explore and engage with.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <Button 
              variant="outline"
              className="border-gray-300 hover:border-primary hover:text-primary"
            >
              Subscribe to Updates
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <BlogPostCard 
                key={post.id} 
                {...post} 
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Lightbulb className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Blog Posts Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Check back soon for insights and perspectives from our team on data well-being and ethical AI.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Browse by Topic Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter to receive the latest blog posts, research updates, and insights directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 h-12 bg-gray-50 border-gray-300"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
