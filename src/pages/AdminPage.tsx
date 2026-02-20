import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { AdvancedEditor } from "../components/admin/AdvancedEditor";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Users, 
  FileText, 
  Eye, 
  EyeOff,
  LayoutDashboard,
  UserPlus,
  Search,
  X,
  ChevronLeft,
  LogOut,
  CheckCircle,
  XCircle,
  Archive,
  BookOpen,
  Clock,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  preferredName?: string;
  role: string;
  bio: string;
  expertise: string[];
  researchInterests: string[];
  projects?: Array<{title: string; description: string}>;
  education?: string;
  links?: {
    linkedIn?: string;
    orcid?: string;
    googleScholar?: string;
    website?: string;
    youtube?: string;
  };
  imageUrl: string;
  consentGiven: boolean;
  consentName?: string;
  consentDate?: string;
  isPublic: boolean;
  createdAt: string;
}

interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  imageUrl: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'VISITOR' | 'TEAM_MEMBER' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  bio?: string;
  researchInterests: string[];
  photoUrl?: string;
  isPublic: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalTeam: number;
  publishedResearch: number;
  unpublishedResearch: number;
  totalResearch: number;
  recentResearch: ResearchProject[];
}

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
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function AdminPage() {
  const { user, login, logout, isAdmin, isTeamMember, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [selectedResearch, setSelectedResearch] = useState<ResearchProject | null>(null);
  const [editingResearch, setEditingResearch] = useState<ResearchProject | null>(null);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);

  const API_BASE = '/api';

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const [teamRes, researchRes, usersRes, blogRes] = await Promise.all([
        fetch(`${API_BASE}/team-members`),
        fetch(`${API_BASE}/research-projects`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/blog-posts/admin`)
      ]);

      const teamData = await teamRes.json();
      const researchData = await researchRes.json();
      const usersData = await usersRes.json();
      const blogData = await blogRes.json();

      const team = Array.isArray(teamData) ? teamData : teamData.data || [];
      const research = Array.isArray(researchData) ? researchData : researchData.data || [];
      const allUsers = Array.isArray(usersData) ? usersData : usersData.data || [];
      const posts = Array.isArray(blogData) ? blogData : blogData.data || [];

      setTeamMembers(team);
      setResearchProjects(research);
      setUsers(allUsers);
      setBlogPosts(posts);

      // Calculate stats
      const published = research.filter((r: ResearchProject) => r.isPublic).length;
      const unpublished = research.filter((r: ResearchProject) => !r.isPublic).length;
      
      setStats({
        totalTeam: team.length,
        publishedResearch: published,
        unpublishedResearch: unpublished,
        totalResearch: research.length,
        recentResearch: research.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    if (user && (isAdmin || isTeamMember)) {
      fetchAllData();
    } else {
      setDataLoading(false);
    }
  }, [user, isAdmin, isTeamMember]);

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError("");
    
    try {
      await login(email, password);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Research Management Functions
  const handleCreateResearch = async (data: Partial<ResearchProject>) => {
    try {
      const res = await fetch(`${API_BASE}/research-projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowResearchForm(false);
        setEditingResearch(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error creating research:', error);
    }
  };

  const handleUpdateResearch = async (id: string, data: Partial<ResearchProject>) => {
    try {
      const res = await fetch(`${API_BASE}/research-projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowResearchForm(false);
        setEditingResearch(null);
        setSelectedResearch(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating research:', error);
    }
  };

  const handleDeleteResearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research project?')) return;
    try {
      const res = await fetch(`${API_BASE}/research-projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (res.ok) {
        fetchAllData();
        if (selectedResearch?.id === id) setSelectedResearch(null);
      }
    } catch (error) {
      console.error('Error deleting research:', error);
    }
  };

  const handleTogglePublishResearch = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/research-projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ isPublic: !isPublic })
      });
      if (res.ok) {
        fetchAllData();
        if (selectedResearch?.id === id) {
          setSelectedResearch({ ...selectedResearch, isPublic: !isPublic });
        }
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  // Team Member Management Functions
  const handleCreateTeamMember = async (data: Partial<TeamMember>) => {
    try {
      const res = await fetch(`${API_BASE}/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowTeamForm(false);
        setEditingTeamMember(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  const handleUpdateTeamMember = async (id: string, data: Partial<TeamMember>) => {
    try {
      const res = await fetch(`${API_BASE}/team-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowTeamForm(false);
        setEditingTeamMember(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeactivateTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this team member?')) return;
    try {
      const res = await fetch(`${API_BASE}/team-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ isPublic: false })
      });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error('Error deactivating team member:', error);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this team member?')) return;
    try {
      const res = await fetch(`${API_BASE}/team-members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  // User Management Functions
  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Blog Management Functions
  const handleCreateBlogPost = async (data: Partial<BlogPost>) => {
    try {
      const res = await fetch(`${API_BASE}/blog-posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowBlogForm(false);
        setEditingBlogPost(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  const handleUpdateBlogPost = async (id: string, data: Partial<BlogPost>) => {
    try {
      const res = await fetch(`${API_BASE}/blog-posts/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowBlogForm(false);
        setEditingBlogPost(null);
        setSelectedBlogPost(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`${API_BASE}/blog-posts/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (res.ok) {
        fetchAllData();
        if (selectedBlogPost?.id === id) setSelectedBlogPost(null);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleTogglePublishBlogPost = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/blog-posts/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ isPublic: !isPublic })
      });
      if (res.ok) {
        fetchAllData();
        if (selectedBlogPost?.id === id) {
          setSelectedBlogPost({ ...selectedBlogPost, isPublic: !isPublic });
        }
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user || (!isAdmin && !isTeamMember)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white soft-shadow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Login as Admin or Team Member</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${user?.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                {user?.role}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="rounded-xl border-border hover:shadow-md hover:-translate-y-1 transition-all hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={logout}
                className="rounded-xl border-border hover:shadow-md transition-all sm:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger value="research" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Research</span>
              <span className="sm:hidden">Research</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Blog</span>
              <span className="sm:hidden">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Team</span>
              <span className="sm:hidden">Team</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Users</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="settings" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {stats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    title="Total Team" 
                    value={stats.totalTeam} 
                    icon={Users}
                    description="Active team members"
                  />
                  <StatCard 
                    title="Published Research" 
                    value={stats.publishedResearch} 
                    icon={Eye}
                    description="Publicly visible"
                    variant="success"
                  />
                  <StatCard 
                    title="Unpublished Research" 
                    value={stats.unpublishedResearch} 
                    icon={EyeOff}
                    description="Draft or hidden"
                    variant="warning"
                  />
                  <StatCard 
                    title="Total Research" 
                    value={stats.totalResearch} 
                    icon={FileText}
                    description="All projects"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Research Projects</CardTitle>
                    <CardDescription>Latest research activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentResearch.length > 0 ? (
                        stats.recentResearch.map((project) => (
                          <div 
                            key={project.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setSelectedResearch(project);
                              setActiveTab('research');
                            }}
                          >
                            <div>
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={project.isPublic ? 'default' : 'secondary'}>
                              {project.isPublic ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No research projects yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-6">
            {selectedResearch ? (
              <ResearchDetailView 
                research={selectedResearch}
                onBack={() => setSelectedResearch(null)}
                onEdit={() => {
                  setEditingResearch(selectedResearch);
                  setShowResearchForm(true);
                }}
                onDelete={() => handleDeleteResearch(selectedResearch.id)}
                onTogglePublish={() => handleTogglePublishResearch(selectedResearch.id, selectedResearch.isPublic)}
              />
            ) : showResearchForm ? (
              <ResearchForm 
                research={editingResearch}
                onSubmit={(data) => {
                  if (editingResearch) {
                    handleUpdateResearch(editingResearch.id, data);
                  } else {
                    handleCreateResearch(data);
                  }
                }}
                onCancel={() => {
                  setShowResearchForm(false);
                  setEditingResearch(null);
                }}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search research projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button onClick={() => {
                    setEditingResearch(null);
                    setShowResearchForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Research
                  </Button>
                </div>

                <div className="grid gap-4">
                  {researchProjects.length > 0 ? (
                    researchProjects
                      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-base sm:text-lg">{project.title}</h4>
                                <Badge variant={project.isPublic ? 'default' : 'secondary'} className="text-xs">
                                  {project.isPublic ? 'Published' : 'Draft'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{project.status}</Badge>
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{project.description}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Updated: {new Date(project.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedResearch(project)}
                                className="flex-1 sm:flex-none"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sm:hidden ml-2">View</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingResearch(project);
                                  setShowResearchForm(true);
                                }}
                                className="flex-1 sm:flex-none"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sm:hidden ml-2">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={project.isPublic ? 'secondary' : 'default'}
                                onClick={() => handleTogglePublishResearch(project.id, project.isPublic)}
                                className="flex-1 sm:flex-none"
                              >
                                {project.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sm:hidden ml-2">{project.isPublic ? 'Unpublish' : 'Publish'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteResearch(project.id)}
                                className="flex-1 sm:flex-none"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sm:hidden ml-2">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl soft-shadow">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-primary flex items-center justify-center">
                        <FileText className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">No Research Projects Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Get started by creating your first research project. Share your findings and insights with the community.
                      </p>
                      <Button 
                        onClick={() => {
                          setEditingResearch(null);
                          setShowResearchForm(true);
                        }}
                        className="bg-gradient-primary hover:shadow-lg hover:-translate-y-1 transition-all px-6 py-3 rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Research Project
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            {selectedBlogPost ? (
              <BlogPostDetailView 
                post={selectedBlogPost}
                onBack={() => setSelectedBlogPost(null)}
                onEdit={() => {
                  setEditingBlogPost(selectedBlogPost);
                  setShowBlogForm(true);
                }}
                onDelete={() => handleDeleteBlogPost(selectedBlogPost.id)}
                onTogglePublish={() => handleTogglePublishBlogPost(selectedBlogPost.id, selectedBlogPost.isPublic)}
              />
            ) : showBlogForm ? (
              <BlogPostForm 
                post={editingBlogPost}
                onSubmit={(data) => {
                  if (editingBlogPost) {
                    handleUpdateBlogPost(editingBlogPost.id, data);
                  } else {
                    handleCreateBlogPost(data);
                  }
                }}
                onCancel={() => {
                  setShowBlogForm(false);
                  setEditingBlogPost(null);
                }}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Blog Posts</h3>
                  <Button onClick={() => {
                    setEditingBlogPost(null);
                    setShowBlogForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>

                <div className="grid gap-4">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-semibold text-base sm:text-lg">{post.title}</h4>
                                <Badge variant={post.isPublic ? 'default' : 'secondary'} className="text-xs">
                                  {post.isPublic ? 'Published' : 'Draft'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{post.category}</Badge>
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{post.excerpt}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {post.readTime}
                                </span>
                                <span>By {post.author}</span>
                                <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedBlogPost(post)}
                                className="flex-1 sm:flex-none"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sm:hidden ml-2">View</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingBlogPost(post);
                                  setShowBlogForm(true);
                                }}
                                className="flex-1 sm:flex-none"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sm:hidden ml-2">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant={post.isPublic ? 'secondary' : 'default'}
                                onClick={() => handleTogglePublishBlogPost(post.id, post.isPublic)}
                                className="flex-1 sm:flex-none"
                              >
                                {post.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sm:hidden ml-2">{post.isPublic ? 'Unpublish' : 'Publish'}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteBlogPost(post.id)}
                                className="flex-1 sm:flex-none"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sm:hidden ml-2">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl soft-shadow">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-primary flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">No Blog Posts Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start sharing your insights and knowledge with the community by creating your first blog post.
                      </p>
                      <Button 
                        onClick={() => {
                          setEditingBlogPost(null);
                          setShowBlogForm(true);
                        }}
                        className="bg-gradient-primary hover:shadow-lg hover:-translate-y-1 transition-all px-6 py-3 rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blog Post
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            {showTeamForm ? (
              <TeamMemberForm 
                member={editingTeamMember}
                onSubmit={(data) => {
                  if (editingTeamMember) {
                    handleUpdateTeamMember(editingTeamMember.id, data);
                  } else {
                    handleCreateTeamMember(data);
                  }
                }}
                onCancel={() => {
                  setShowTeamForm(false);
                  setEditingTeamMember(null);
                }}
              />
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  {isAdmin && (
                    <Button onClick={() => {
                      setEditingTeamMember(null);
                      setShowTeamForm(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Team Member
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              {member.imageUrl && (
                                <img 
                                  src={member.imageUrl} 
                                  alt={member.name}
                                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm sm:text-base">{member.name}</h4>
                                  <Badge variant={member.isPublic ? 'default' : 'secondary'} className="text-xs">
                                    {member.isPublic ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-xs sm:text-sm">{member.role}</p>
                                <p className="text-xs sm:text-sm mt-1 line-clamp-2">{member.bio}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {member.expertise.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingTeamMember(member);
                                    setShowTeamForm(true);
                                  }}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Edit className="h-4 w-4 sm:mr-0" />
                                  <span className="sm:hidden ml-2">Edit</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant={member.isPublic ? 'secondary' : 'default'}
                                  onClick={() => handleDeactivateTeamMember(member.id)}
                                  className="flex-1 sm:flex-none"
                                >
                                  {member.isPublic ? <XCircle className="h-4 w-4 sm:mr-0" /> : <CheckCircle className="h-4 w-4 sm:mr-0" />}
                                  <span className="sm:hidden ml-2">{member.isPublic ? 'Deactivate' : 'Activate'}</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteTeamMember(member.id)}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Trash2 className="h-4 w-4 sm:mr-0" />
                                  <span className="sm:hidden ml-2">Delete</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl soft-shadow">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-primary flex items-center justify-center">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">No Team Members Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Build your team by adding members who will contribute to your research and mission.
                      </p>
                      {isAdmin && (
                        <Button 
                          onClick={() => {
                            setEditingTeamMember(null);
                            setShowTeamForm(true);
                          }}
                          className="bg-gradient-primary hover:shadow-lg hover:-translate-y-1 transition-all px-6 py-3 rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Team Member
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Users Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.length > 0 ? (
                      users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{u.name}</h4>
                              <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                              <Badge variant={
                                u.status === 'APPROVED' ? 'default' :
                                u.status === 'PENDING' ? 'secondary' :
                                u.status === 'SUSPENDED' ? 'destructive' : 'outline'
                              }>
                                {u.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <div className="flex gap-2">
                            {u.status === 'PENDING' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateUserStatus(u.id, 'APPROVED')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleUpdateUserStatus(u.id, 'REJECTED')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {u.status === 'APPROVED' && u.id !== user?.id && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleUpdateUserStatus(u.id, 'SUSPENDED')}
                              >
                                <Archive className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-white rounded-2xl soft-shadow">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-primary flex items-center justify-center">
                          <UserPlus className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">No Users Found</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          No user accounts have been created yet. Users will appear here once they register.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={user?.name} disabled className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={user?.email} disabled className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input value={user?.role} disabled className="mt-1" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Component: StatCard
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  variant = 'default'
}: { 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  description: string;
  variant?: 'default' | 'success' | 'warning';
}) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

// Component: ResearchDetailView
function ResearchDetailView({ 
  research, 
  onBack, 
  onEdit, 
  onDelete, 
  onTogglePublish 
}: { 
  research: ResearchProject; 
  onBack: () => void; 
  onEdit: () => void; 
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Research
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{research.title}</CardTitle>
              <CardDescription className="mt-2">
                Created: {new Date(research.createdAt).toLocaleDateString()} | 
                Updated: {new Date(research.updatedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={research.isPublic ? 'default' : 'secondary'}>
                {research.isPublic ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">{research.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {research.imageUrl && (
            <img 
              src={research.imageUrl} 
              alt={research.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{research.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {research.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant={research.isPublic ? 'secondary' : 'default'} onClick={onTogglePublish}>
              {research.isPublic ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {research.isPublic ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component: ResearchForm
function ResearchForm({ 
  research, 
  onSubmit, 
  onCancel 
}: { 
  research: ResearchProject | null; 
  onSubmit: (data: Partial<ResearchProject>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: research?.title || '',
    description: research?.description || '',
    status: research?.status || 'Active',
    tags: research?.tags?.join(', ') || '',
    imageUrl: research?.imageUrl || '',
    isPublic: research?.isPublic || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{research ? 'Edit Research Project' : 'Create Research Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter research title"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <AdvancedEditor
              content={formData.description}
              onChange={(content: string) => setFormData({...formData, description: content})}
              placeholder="Enter research description"
              className="min-h-[300px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full p-2 border rounded-md mt-1"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Planning">Planning</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="AI, Ethics, Data Science"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">Publish immediately</label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {research ? 'Update' : 'Create'} Research
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Component: TeamMemberForm
function TeamMemberForm({ 
  member, 
  onSubmit, 
  onCancel 
}: { 
  member: TeamMember | null; 
  onSubmit: (data: Partial<TeamMember>) => void; 
  onCancel: () => void;
}) {
  const [activeSection, setActiveSection] = useState('basic');
  const [formData, setFormData] = useState({
    // Basic Information
    name: member?.name || '',
    preferredName: member?.preferredName || '',
    role: member?.role || '',
    expertise: member?.expertise?.join(', ') || '',
    
    // Bio
    bio: member?.bio || '',
    
    // Research Interests
    researchInterests: member?.researchInterests?.join('\n') || '',
    
    // Projects
    projects: member?.projects || [{ title: '', description: '' }],
    
    // Education
    education: member?.education || '',
    
    // Links
    linkedIn: member?.links?.linkedIn || '',
    orcid: member?.links?.orcid || '',
    googleScholar: member?.links?.googleScholar || '',
    website: member?.links?.website || '',
    youtube: member?.links?.youtube || '',
    
    // Image
    imageUrl: member?.imageUrl || '',
    
    // Consent
    consentGiven: member?.consentGiven ?? false,
    consentName: member?.consentName || '',
    consentDate: member?.consentDate || new Date().toISOString().split('T')[0],
    
    // Visibility
    isPublic: member?.isPublic ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      preferredName: formData.preferredName,
      role: formData.role,
      bio: formData.bio,
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      researchInterests: formData.researchInterests.split('\n').map(s => s.trim()).filter(Boolean),
      projects: formData.projects.filter(p => p.title.trim()),
      education: formData.education,
      links: {
        linkedIn: formData.linkedIn,
        orcid: formData.orcid,
        googleScholar: formData.googleScholar,
        website: formData.website,
        youtube: formData.youtube
      },
      imageUrl: formData.imageUrl,
      consentGiven: formData.consentGiven,
      consentName: formData.consentName,
      consentDate: formData.consentDate,
      isPublic: formData.isPublic
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: '', description: '' }]
    });
  };

  const updateProject = (index: number, field: string, value: string) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData({ ...formData, projects: updatedProjects });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Users },
    { id: 'bio', label: 'Bio', icon: FileText },
    { id: 'research', label: 'Research', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: LayoutDashboard },
    { id: 'education', label: 'Education', icon: CheckCircle },
    { id: 'links', label: 'Links', icon: Eye },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'consent', label: 'Consent', icon: CheckCircle },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl">{member ? 'Edit Team Member' : 'Add Team Member'}</CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Complete the sections below. This information will be used for the public Team page.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={formData.isPublic ? 'default' : 'secondary'}>
              {formData.isPublic ? 'Public' : 'Draft'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation - Horizontal on mobile, vertical on desktop */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r bg-muted/30 p-2 lg:p-4">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 lg:w-full ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Information */}
              {activeSection === 'basic' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Basic Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Abiodun Ajanaku"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Preferred Name</label>
                      <Input
                        value={formData.preferredName}
                        onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                        placeholder="e.g., Biodun"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Role / Title in DaWg *</label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Data Analyst and Literature Researcher"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Primary Area of Expertise</label>
                    <Input
                      value={formData.expertise}
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                      placeholder="e.g., Data Science, Healthcare, AI Ethics (comma-separated)"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Separate multiple areas with commas</p>
                  </div>
                </div>
              )}

              {/* Section 2: Bio */}
              {activeSection === 'bio' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">2. Short Professional Bio (Public)</h3>
                  <p className="text-sm text-muted-foreground">
                    Write 80-120 words describing your background, current focus, and what you contribute to DaWg.
                  </p>
                  
                  <AdvancedEditor
                    content={formData.bio}
                    onChange={(content: string) => setFormData({...formData, bio: content})}
                    placeholder="Enter your professional bio here..."
                    className="min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Word count: {formData.bio.split(/\s+/).filter(w => w.length > 0).length} words
                  </p>
                </div>
              )}

              {/* Section 3: Research Interests */}
              {activeSection === 'research' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">3. Research & Professional Interests</h3>
                  <p className="text-sm text-muted-foreground">
                    List up to 5 key interests related to data, wellbeing, technology, or human behaviour.
                  </p>
                  
                  <Textarea
                    value={formData.researchInterests}
                    onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                    placeholder="Human-Centred and Responsible AI&#10;AI-Driven Decision Support Systems&#10;Predictive Modelling and Risk Analytics&#10;AI for Wellbeing and Mental Health&#10;Technology, Behaviour, and Adaptive Systems"
                    className="min-h-[200px] mt-2"
                  />
                  <p className="text-xs text-muted-foreground">Enter one interest per line</p>
                </div>
              )}

              {/* Section 4: Projects */}
              {activeSection === 'projects' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">4. Current or Relevant Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe 1-3 projects you are working on or have contributed to that are relevant to DaWg.
                  </p>
                  
                  <div className="space-y-4">
                    {formData.projects.map((project, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium">Project {index + 1}</h4>
                          {formData.projects.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProject(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input
                              value={project.title}
                              onChange={(e) => updateProject(index, 'title', e.target.value)}
                              placeholder="Project title"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Short Description</label>
                            <Textarea
                              value={project.description}
                              onChange={(e) => updateProject(index, 'description', e.target.value)}
                              placeholder="1-2 sentences describing the project"
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {formData.projects.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addProject}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Section 5: Education */}
              {activeSection === 'education' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">5. Education / Professional Background</h3>
                  <p className="text-sm text-muted-foreground">
                    Highest relevant qualification or professional experience.
                  </p>
                  
                  <Input
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="e.g., MSc Applied AI and Data Science - Solent University, UK"
                    className="mt-2"
                  />
                </div>
              )}

              {/* Section 6: Links */}
              {activeSection === 'links' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">6. Links (Optional but Encouraged)</h3>
                  <p className="text-sm text-muted-foreground">
                    Include any links you're comfortable sharing publicly.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium">LinkedIn</label>
                      <Input
                        value={formData.linkedIn}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">ORCID</label>
                      <Input
                        value={formData.orcid}
                        onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
                        placeholder="https://orcid.org/0000-0000-0000-0000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Google Scholar</label>
                      <Input
                        value={formData.googleScholar}
                        onChange={(e) => setFormData({ ...formData, googleScholar: e.target.value })}
                        placeholder="https://scholar.google.com/citations?user=..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Personal Website / Portfolio</label>
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">YouTube / Video</label>
                      <Input
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Section 7: Image */}
              {activeSection === 'image' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">7. Profile Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Please provide a high-quality headshot with neutral or professional background.
                  </p>
                  
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                      className="mt-1"
                    />
                  </div>
                  
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/placeholder.txt';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Section 8: Consent */}
              {activeSection === 'consent' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">8. Consent</h3>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consentGiven"
                        checked={formData.consentGiven}
                        onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                        className="rounded mt-1"
                      />
                      <label htmlFor="consentGiven" className="text-sm">
                        I confirm that I am happy for this information and image to be published on the 
                        DaWg website and related materials.
                      </label>
                    </div>
                  </div>

                  {formData.consentGiven && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Consent Name *</label>
                        <Input
                          value={formData.consentName}
                          onChange={(e) => setFormData({ ...formData, consentName: e.target.value })}
                          placeholder="Your name"
                          required={formData.consentGiven}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Consent Date *</label>
                        <Input
                          type="date"
                          value={formData.consentDate}
                          onChange={(e) => setFormData({ ...formData, consentDate: e.target.value })}
                          required={formData.consentGiven}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium">
                      Make this profile visible on the website
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6 border-t">
                <Button type="submit" className="bg-gradient-primary">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {member ? 'Update' : 'Add'} Team Member
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component: BlogPostDetailView
function BlogPostDetailView({ 
  post, 
  onBack, 
  onEdit, 
  onDelete, 
  onTogglePublish 
}: { 
  post: BlogPost; 
  onBack: () => void; 
  onEdit: () => void; 
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Blog Posts
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription className="mt-2">
                Created: {new Date(post.createdAt).toLocaleDateString()} | 
                Updated: {new Date(post.updatedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={post.isPublic ? 'default' : 'secondary'}>
                {post.isPublic ? 'Published' : 'Draft'}
              </Badge>
              <Badge variant="outline">{post.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
            <span>By {post.author}</span>
            {post.publishedAt && (
              <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Excerpt</h4>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Content</h4>
            <div className="prose max-w-none">
              <p className="text-foreground/80 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant={post.isPublic ? 'secondary' : 'default'} onClick={onTogglePublish}>
              {post.isPublic ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {post.isPublic ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component: BlogPostForm
function BlogPostForm({ 
  post, 
  onSubmit, 
  onCancel 
}: { 
  post: BlogPost | null; 
  onSubmit: (data: Partial<BlogPost>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || '',
    authorImage: post?.authorImage || '',
    category: post?.category || 'General',
    tags: post?.tags?.join(', ') || '',
    imageUrl: post?.imageUrl || '',
    readTime: post?.readTime || '5 min read',
    isPublic: post?.isPublic || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? 'Edit Blog Post' : 'Create Blog Post'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter blog post title"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Excerpt</label>
            <AdvancedEditor
              content={formData.excerpt}
              onChange={(content: string) => setFormData({...formData, excerpt: content})}
              placeholder="Short summary of the post"
              className="min-h-[150px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <AdvancedEditor
              content={formData.content}
              onChange={(content: string) => setFormData({...formData, content: content})}
              placeholder="Full blog post content"
              className="min-h-[400px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Author</label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Privacy, AI Ethics"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Privacy, Ethics, Data Science"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Featured Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Read Time</label>
              <Input
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">Publish immediately</label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {post ? 'Update' : 'Create'} Post
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Component: LoginForm
const LoginForm = ({ onLogin, loading, error }: { onLogin: (email: string, password: string) => void, loading: boolean, error: string }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};