import { BlogPostCard } from "../components/BlogPostCard";
import { Button } from "../components/ui/button";
import { Search, Lightbulb } from "lucide-react";
import { Input } from "../components/ui/input";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eb1fb471/blog-posts`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        setBlogPosts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
    setLoading(false);
  };

  const categories = [
    "Privacy",
    "AI Ethics",
    "Mental Health",
    "Policy",
    "Methodology",
    "Digital Rights",
    "Social Media",
    "Data Governance"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <p className="text-gray-600">Loading blog posts...</p>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.title} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Topic Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Topic</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 text-sm font-medium rounded-full bg-white border border-gray-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {category}
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
