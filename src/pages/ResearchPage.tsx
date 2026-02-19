import { ProjectCard } from "../components/ProjectCard";
import { BookOpen, Search, Filter, ArrowRight, Sparkles, Brain, Lightbulb, Users } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_70%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Brain className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Our Research</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Research Projects
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Our research spans multiple domains, from privacy-preserving methodologies to 
              understanding the societal impacts of data-driven technologies. Each project 
              is designed to produce actionable insights and practical tools.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 bg-white border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-6">
              {/* Search */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 rounded-xl border-border focus:ring-2 focus:ring-primary"
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
                    className={`rounded-full px-4 py-2 ${selectedStatus === status ? "shadow-md" : "hover:shadow-sm"}`}
                  >
                    {status === "all" ? "All Projects" : status}
                    <Badge variant="secondary" className="ml-2 bg-white/20">
                      {statusCounts[status as keyof typeof statusCounts]}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter by tags:
                </span>
                <Button
                  variant={selectedTag === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag("all")}
                  className="rounded-full px-4 py-2"
                >
                  All Tags
                </Button>
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="rounded-full px-4 py-2"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gradient-to-br from-background to-soft-green">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">No Research Projects Found</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  We're currently working on exciting research projects. Check back soon to see our latest work in data well-being and ethical AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Research Impact */}
      <section className="py-24 bg-gradient-to-br from-soft-lavender to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
                <Lightbulb className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Our Impact</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Research Impact</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Making meaningful contributions to data well-being and ethical technology</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <BookOpen className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">50+</div>
                <p className="text-muted-foreground font-medium">Publications</p>
              </div>
              <div className="bg-white p-6 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all text-center group">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary group-hover:scale-110 transition-all">
                  <Lightbulb className="h-8 w-8 text-secondary group-hover:text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform">12</div>
                <p className="text-muted-foreground font-medium">Active Projects</p>
              </div>
              <div className="bg-white p-6 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all text-center group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all">
                  <Sparkles className="h-8 w-8 text-accent group-hover:text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform">8</div>
                <p className="text-muted-foreground font-medium">Policy Impacts</p>
              </div>
              <div className="bg-white p-6 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all text-center group">
                <div className="w-16 h-16 rounded-2xl bg-warm/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-warm group-hover:scale-110 transition-all">
                  <Users className="h-8 w-8 text-warm group-hover:text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-warm mb-2 group-hover:scale-110 transition-transform">25+</div>
                <p className="text-muted-foreground font-medium">Collaborators</p>
              </div>
            </div>
          </div>

          {/* Publications Section */}
          <div className="mt-20 bg-white rounded-3xl p-10 soft-shadow">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Latest Research</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Recent Publications</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our latest contributions to the field of data well-being and ethical technology</p>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-1 transition-all group">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">Privacy in the Age of AI: A Framework for Action</h3>
                <p className="text-muted-foreground mb-3">Chen, S., et al. (2025)</p>
                <p className="text-foreground/70">Journal of Data Ethics, Vol. 12, Issue 3</p>
              </div>
              <div className="bg-gradient-to-r from-secondary/5 to-accent/5 p-8 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-1 transition-all group">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">Measuring Digital Well-being: Validation of the DWB Scale</h3>
                <p className="text-muted-foreground mb-3">Johnson, M., Patel, P. (2025)</p>
                <p className="text-foreground/70">Computers in Human Behavior</p>
              </div>
              <div className="bg-gradient-to-r from-accent/5 to-warm/5 p-8 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-1 transition-all group">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">Teen Social Media Use and Mental Health Outcomes</h3>
                <p className="text-muted-foreground mb-3">Kim, A., et al. (2024)</p>
                <p className="text-foreground/70">Developmental Psychology Quarterly</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}