import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
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
  Tag
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  imageUrl: string;
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
  const { user, login, logout, isAdmin, isTeamMember } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
    setLoading(false);
  };

  useEffect(() => {
    if (user && (isAdmin || isTeamMember)) {
      fetchAllData();
    } else {
      setLoading(false);
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

  if (!user || (!isAdmin && !isTeamMember)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Login as Admin or Team Member</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={handleLogin} loading={loginLoading} error={loginError} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="research">
              <FileText className="h-4 w-4 mr-2" />
              Research
            </TabsTrigger>
            <TabsTrigger value="blog">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="users">
                <UserPlus className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
            )}
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
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
                  {researchProjects
                    .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{project.title}</h4>
                              <Badge variant={project.isPublic ? 'default' : 'secondary'}>
                                {project.isPublic ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline">{project.status}</Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Updated: {new Date(project.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedResearch(project)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingResearch(project);
                                setShowResearchForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={project.isPublic ? 'secondary' : 'default'}
                              onClick={() => handleTogglePublishResearch(project.id, project.isPublic)}
                            >
                              {project.isPublic ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                              {project.isPublic ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteResearch(project.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                  {blogPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{post.title}</h4>
                              <Badge variant={post.isPublic ? 'default' : 'secondary'}>
                                {post.isPublic ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline">{post.category}</Badge>
                            </div>
                            <p className="text-muted-foreground line-clamp-2 mb-2">{post.excerpt}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {post.readTime}
                              </span>
                              <span>By {post.author}</span>
                              <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBlogPost(post)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBlogPost(post);
                                setShowBlogForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant={post.isPublic ? 'secondary' : 'default'}
                              onClick={() => handleTogglePublishBlogPost(post.id, post.isPublic)}
                            >
                              {post.isPublic ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                              {post.isPublic ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteBlogPost(post.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                  {teamMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            {member.imageUrl && (
                              <img 
                                src={member.imageUrl} 
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{member.name}</h4>
                                <Badge variant={member.isPublic ? 'default' : 'secondary'}>
                                  {member.isPublic ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">{member.role}</p>
                              <p className="text-sm mt-1 line-clamp-2">{member.bio}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {member.expertise.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingTeamMember(member);
                                  setShowTeamForm(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={member.isPublic ? 'secondary' : 'default'}
                                onClick={() => handleDeactivateTeamMember(member.id)}
                              >
                                {member.isPublic ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTeamMember(member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
                    {users.map((u) => (
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
                    ))}
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
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter research description"
              rows={5}
              required
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
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    expertise: member?.expertise?.join(', ') || '',
    imageUrl: member?.imageUrl || '',
    isPublic: member?.isPublic ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{member ? 'Edit Team Member' : 'Add Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full name"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Role</label>
            <Input
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Research Lead"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short biography"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Expertise (comma-separated)</label>
            <Input
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              placeholder="Machine Learning, Ethics, Python"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Photo URL</label>
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/photo.jpg"
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
            <label htmlFor="isPublic" className="text-sm font-medium">Active (visible on website)</label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit">
              {member ? 'Update' : 'Add'} Team Member
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
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Short summary of the post"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full blog post content"
              rows={10}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
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