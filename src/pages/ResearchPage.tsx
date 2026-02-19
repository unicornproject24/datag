import { ProjectCard } from "../components/ProjectCard";
import { BookOpen, Search, Filter, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Completed" | "Planning";
  tags: string[];
  imageUrl: string;
  isPublic: boolean;
  createdAt: string;
}

export function ResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedStatus, selectedTag]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/research-projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Only show public projects on the public page
        const publicProjects = data.filter((p: ResearchProject) => p.isPublic);
        setProjects(publicProjects);
        setFilteredProjects(publicProjects);
      }
    } catch (error) {
      console.error('Error fetching research projects:', error);
    }
    setLoading(false);
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter(p => p.tags.includes(selectedTag));
    }

    setFilteredProjects(filtered);
  };

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)));

  const statusCounts = {
    all: projects.length,
    Active: projects.filter(p => p.status === "Active").length,
    Completed: projects.filter(p => p.status === "Completed").length,
    Planning: projects.filter(p => p.status === "Planning").length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading research projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(123,179,192,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_70%,rgba(197,227,246,0.2),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-in slide-in-from-left duration-700">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Research Projects</h2>
            </div>
            <p className="text-foreground/80 text-base sm:text-lg md:text-xl leading-relaxed animate-in slide-in-from-left duration-700 delay-150">
              Our research spans multiple domains, from privacy-preserving methodologies to 
              understanding the societal impacts of data-driven technologies. Each project 
              is designed to produce actionable insights and practical tools.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {["all", "Active", "Completed", "Planning"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All" : status}
                  <Badge variant="secondary" className="ml-2">
                    {statusCounts[status as keyof typeof statusCounts]}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" /> Tags:
              </span>
              <Button
                variant={selectedTag === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag("all")}
              >
                All
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Research Projects Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're currently working on exciting research projects. Check back soon to see our latest work in data well-being and ethical AI.
              </p>
            </div>
          )}

          {/* Research Impact */}
          <div className="mt-16 bg-gradient-to-br from-secondary/20 to-accent/10 rounded-3xl p-8 sm:p-12 border border-border shadow-xl">
            <h3 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold">Research Impact</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-2 text-4xl sm:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">50+</div>
                  <p className="text-foreground/70 font-medium">Publications</p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-2 text-4xl sm:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">12</div>
                  <p className="text-foreground/70 font-medium">Active Projects</p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-2 text-4xl sm:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">8</div>
                  <p className="text-foreground/70 font-medium">Policy Impacts</p>
                </div>
              </div>
              <div className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="mb-2 text-4xl sm:text-5xl font-bold text-primary group-hover:scale-110 transition-transform">25+</div>
                  <p className="text-foreground/70 font-medium">Collaborators</p>
                </div>
              </div>
            </div>
          </div>

          {/* Publications Section */}
          <div className="mt-16">
            <h3 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Recent Publications</h3>
            <div className="space-y-4">
              <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="mb-2 text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">Privacy in the Age of AI: A Framework for Action</h4>
                <p className="text-muted-foreground mb-2 text-sm sm:text-base">Chen, S., et al. (2025)</p>
                <p className="text-foreground/70 text-sm sm:text-base">Journal of Data Ethics, Vol. 12, Issue 3</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="mb-2 text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">Measuring Digital Well-being: Validation of the DWB Scale</h4>
                <p className="text-muted-foreground mb-2 text-sm sm:text-base">Johnson, M., Patel, P. (2025)</p>
                <p className="text-foreground/70 text-sm sm:text-base">Computers in Human Behavior</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <h4 className="mb-2 text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors">Teen Social Media Use and Mental Health Outcomes</h4>
                <p className="text-muted-foreground mb-2 text-sm sm:text-base">Kim, A., et al. (2024)</p>
                <p className="text-foreground/70 text-sm sm:text-base">Developmental Psychology Quarterly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}