import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { AdvancedEditor } from "../components/admin/AdvancedEditor";
import { AdminLayout } from "../components/AdminLayout";
import { PageContentTab } from "../components/PageContentTab";
import { PageSectionEditor } from "../components/PageSectionEditor";
import { 
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

  // Page Content state
  const [pageContent, setPageContent] = useState<any>({});
  const [editingPageSection, setEditingPageSection] = useState<string | null>(null);
  const [pageContentFormData, setPageContentFormData] = useState<any>({});
  const [showPageContentForm, setShowPageContentForm] = useState(false);
  const [selectedPage, setSelectedPage] = useState<'homepage' | 'aboutpage'>('homepage');

  const API_BASE = '/api';

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const [teamRes, researchRes, usersRes, blogRes, pageContentRes] = await Promise.all([
        fetch(`${API_BASE}/team-members`),
        fetch(`${API_BASE}/research-projects`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/blog-posts/admin`),
        fetch(`${API_BASE}/page-contents`)
      ]);

      const teamData = await teamRes.json();
      const researchData = await researchRes.json();
      const usersData = await usersRes.json();
      const blogData = await blogRes.json();
      const pageContentData = await pageContentRes.json();

      const team = Array.isArray(teamData) ? teamData : teamData.data || [];
      const research = Array.isArray(researchData) ? researchData : researchData.data || [];
      const allUsers = Array.isArray(usersData) ? usersData : usersData.data || [];
      const posts = Array.isArray(blogData) ? blogData : blogData.data || [];

      setTeamMembers(team);
      setResearchProjects(research);
      setUsers(allUsers);
      setBlogPosts(posts);
      setPageContent(pageContentData || {});

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

  // Page Content Management Functions
  const handleLoadPageContent = async (pageKey: string) => {
    try {
      const res = await fetch(`${API_BASE}/page-contents?pageKey=${pageKey}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error loading page content:', error);
      return {};
    }
  };

  const handleSavePageContent = async (updates: any[]) => {
    try {
      const res = await fetch(`${API_BASE}/page-contents`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ updates })
      });
      
      if (res.ok) {
        await fetchAllData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving page content:', error);
      return false;
    }
  };

  const handleEditPageSection = (section: string, currentData: any) => {
    setEditingPageSection(section);
    setPageContentFormData(currentData);
    setShowPageContentForm(true);
  };

  const handleUpdatePageSection = async () => {
    if (!editingPageSection) return;
    
    const updates = Object.keys(pageContentFormData).map((key) => ({
      pageKey: selectedPage,
      section: editingPageSection,
      contentKey: key,
      contentValue: pageContentFormData[key].value || pageContentFormData[key],
      metadata: pageContentFormData[key].metadata || null
    }));

    const success = await handleSavePageContent(updates);
    if (success) {
      setShowPageContentForm(false);
      setEditingPageSection(null);
      setPageContentFormData({});
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
    <AdminLayout 
      currentView={activeTab} 
      onViewChange={setActiveTab}
      onLogout={logout}
      isAdmin={isAdmin}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="hidden">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {stats && (
              <>
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">Total Team</p>
                          <p className="text-3xl font-bold mt-1 text-blue-900">{stats.totalTeam}</p>
                          <p className="text-xs text-blue-600 mt-1">Active members</p>
                        </div>
                        <Users className="h-10 w-10 text-blue-500 opacity-75" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">Published Research</p>
                          <p className="text-3xl font-bold mt-1 text-green-900">{stats.publishedResearch}</p>
                          <p className="text-xs text-green-600 mt-1">Publicly visible</p>
                        </div>
                        <Eye className="h-10 w-10 text-green-500 opacity-75" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-700">Unpublished</p>
                          <p className="text-3xl font-bold mt-1 text-yellow-900">{stats.unpublishedResearch}</p>
                          <p className="text-xs text-yellow-600 mt-1">Draft or hidden</p>
                        </div>
                        <EyeOff className="h-10 w-10 text-yellow-500 opacity-75" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">Total Research</p>
                          <p className="text-3xl font-bold mt-1 text-purple-900">{stats.totalResearch}</p>
                          <p className="text-xs text-purple-600 mt-1">All projects</p>
                        </div>
                        <FileText className="h-10 w-10 text-purple-500 opacity-75" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Card */}
                <Card className="border shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Recent Research Projects</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Latest research activity and updates</p>
                      </div>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {stats.recentResearch.length} recent
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.recentResearch.length > 0 ? (
                        stats.recentResearch.map((project) => (
                          <Card 
                            key={project.id} 
                            className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-purple-500"
                            onClick={() => {
                              setSelectedResearch(project);
                              setActiveTab('research');
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-base truncate">{project.title}</h4>
                                    <Badge variant={project.isPublic ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                                      {project.isPublic ? 'Published' : 'Draft'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Created: {new Date(project.createdAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                  <FileText className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
                          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                            <FileText className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No Research Projects Yet</h3>
                          <p className="text-muted-foreground">Get started by creating your first research project</p>
                        </div>
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

                {/* Enhanced Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {researchProjects.length > 0 ? (
                    researchProjects
                      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((project) => (
                        <Card 
                          key={project.id} 
                          className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500 overflow-hidden group"
                        >
                          {/* Card Header with Status */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant={project.isPublic ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                                  {project.isPublic ? 'Published' : 'Draft'}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-2 py-1">{project.status}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Updated: {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h4 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
                                {project.title}
                              </h4>
                              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                {project.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {project.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 5 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  +{project.tags.length - 5}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Action Buttons Grid */}
                            <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedResearch(project)}
                                className="w-full h-9"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingResearch(project);
                                  setShowResearchForm(true);
                                }}
                                className="w-full h-9"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={project.isPublic ? 'secondary' : 'default'}
                                onClick={() => handleTogglePublishResearch(project.id, project.isPublic)}
                                className="w-full h-9"
                                title={project.isPublic ? 'Unpublish' : 'Publish'}
                              >
                                {project.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteResearch(project.id)}
                                className="w-full h-9"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

                {/* Enhanced Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                      <Card 
                        key={post.id} 
                        className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500 overflow-hidden group"
                      >
                        {/* Card Header with Status */}
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={post.isPublic ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                                {post.isPublic ? 'Published' : 'Draft'}
                              </Badge>
                              <Badge variant="outline" className="text-xs px-2 py-1">{post.category}</Badge>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Content */}
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h4 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {post.tags.slice(0, 5).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 5 && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{post.tags.length - 5}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                              {post.author.charAt(0)}
                            </div>
                            <span className="truncate">By {post.author}</span>
                          </div>
                          
                          {/* Action Buttons Grid */}
                          <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedBlogPost(post)}
                              className="w-full h-9"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBlogPost(post);
                                setShowBlogForm(true);
                              }}
                              className="w-full h-9"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={post.isPublic ? 'secondary' : 'default'}
                              onClick={() => handleTogglePublishBlogPost(post.id, post.isPublic)}
                              className="w-full h-9"
                              title={post.isPublic ? 'Unpublish' : 'Publish'}
                            >
                              {post.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="w-full h-9"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

          {/* Page Content Tab */}
          <TabsContent value="pagecontent" className="space-y-6">
            {showPageContentForm && editingPageSection ? (
              <PageSectionEditor
                section={editingPageSection}
                pageName={selectedPage === 'homepage' ? 'Home' : 'About'}
                initialData={pageContentFormData}
                onSave={handleUpdatePageSection}
                onCancel={() => {
                  setShowPageContentForm(false);
                  setEditingPageSection(null);
                  setPageContentFormData({});
                }}
              />
            ) : (
              <PageContentTab
                pageContent={pageContent}
                selectedPage={selectedPage}
                onSelectPage={setSelectedPage}
                onEditSection={(section, data) => handleEditPageSection(section, data)}
              />
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">View and manage your account information</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xl">
                    {user?.name?.charAt(0)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-base font-medium">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-base font-medium">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'} className="px-3 py-1">
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <Badge variant="default" className="px-3 py-1 bg-green-600 hover:bg-green-700">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h4 className="text-sm font-medium mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <LayoutDashboard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-700">Dashboard Access</p>
                        <p className="text-xs text-blue-600 mt-1">Full admin privileges</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-700">Verified Account</p>
                        <p className="text-xs text-green-600 mt-1">Email confirmed</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <Lock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-purple-700">Secure Access</p>
                        <p className="text-xs text-purple-600 mt-1">2FA available</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AdminLayout>
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
  const [activeSection, setActiveSection] = useState('details');
  const [previewMode, setPreviewMode] = useState(false);
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

  const sections = [
    { id: 'details', label: 'Project Details', icon: FileText },
    { id: 'metadata', label: 'Metadata', icon: Tag },
    { id: 'visibility', label: 'Visibility', icon: Eye },
  ];

  return (
    <Card className="border shadow-lg max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              {research ? 'Edit Research Project' : 'Create New Research Project'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {research ? 'Update project information and settings' : 'Share your research findings with the community'}
            </p>
          </div>
          <Badge variant={formData.isPublic ? 'default' : 'secondary'} className="px-4 py-2 text-sm">
            {formData.isPublic ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 border-r bg-muted/30 p-4">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:w-full ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-xs font-semibold text-blue-900 mb-2">Quick Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use clear, descriptive titles</li>
                <li>• Add relevant tags for discoverability</li>
                <li>• Include high-quality images</li>
                <li>• Preview before publishing</li>
              </ul>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Project Details */}
              {activeSection === 'details' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">1. Project Information</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="gap-2"
                    >
                      {previewMode ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                  
                  {!previewMode ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Project Title *</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., AI-Driven Mental Health Analytics"
                          required
                          className="text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.title.length}/100 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description *</label>
                        <AdvancedEditor
                          content={formData.description}
                          onChange={(content: string) => setFormData({...formData, description: content})}
                          placeholder="Describe your research project, objectives, and key findings..."
                          className="min-h-[350px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Word count: {formData.description.split(/\s+/).filter(w => w.length > 0).length} words
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Project Status</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Active', 'Planning', 'Completed', 'On Hold'].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setFormData({ ...formData, status })}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                formData.status === status
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 border rounded-lg p-6 bg-muted/30">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{formData.title || 'Untitled Project'}</h4>
                        <Badge variant={formData.status === 'Active' ? 'default' : 'secondary'}>{formData.status}</Badge>
                      </div>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground whitespace-pre-wrap">{formData.description || 'No description provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 2: Metadata */}
              {activeSection === 'metadata' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">2. Tags & Categorization</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Research Tags</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="AI, Machine Learning, Healthcare, Ethics"
                      className="text-base"
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.split(',').filter(t => t.trim()).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Featured Image URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/research-image.jpg"
                      className="text-base"
                    />
                    
                    {formData.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.txt';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 3: Visibility */}
              {activeSection === 'visibility' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">3. Publishing Settings</h3>
                  
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={formData.isPublic}
                          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                          className="rounded mt-1 h-5 w-5"
                        />
                        <div className="flex-1">
                          <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                            Publish immediately
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Making this public will display it on the research page for all visitors to see
                          </p>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPublic ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.isPublic ? 'translate-x-6' : ''}`} />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Visibility Status</h4>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${formData.isPublic ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="text-sm text-muted-foreground">
                            {formData.isPublic ? 'Visible to public' : 'Only visible to admins'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Before Publishing</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>✓ Review content for accuracy</li>
                      <li>✓ Check image displays correctly</li>
                      <li>✓ Verify tags are relevant</li>
                      <li>✓ Proofread description</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 px-6"
                >
                  <CheckCircle className="h-4 w-4" />
                  {research ? 'Update Project' : 'Create Project'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <div className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  {research ? `Last updated: ${new Date(research.updatedAt).toLocaleDateString()}` : 'Created just now'}
                </span>
              </div>
            </form>
          </div>
        </div>
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
  const [activeSection, setActiveSection] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
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

  const sections = [
    { id: 'content', label: 'Content', icon: BookOpen },
    { id: 'metadata', label: 'Metadata', icon: Tag },
    { id: 'publishing', label: 'Publishing', icon: Eye },
  ];

  return (
    <Card className="border shadow-lg max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              {post ? 'Edit Blog Post' : 'Create New Blog Post'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {post ? 'Update your blog post content and settings' : 'Share your insights and knowledge with the community'}
            </p>
          </div>
          <Badge variant={formData.isPublic ? 'default' : 'secondary'} className="px-4 py-2 text-sm">
            {formData.isPublic ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 border-r bg-muted/30 p-4">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:w-full ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Writing Tips */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-xs font-semibold text-amber-900 mb-2">Writing Tips</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Write compelling headlines</li>
                <li>• Keep paragraphs concise</li>
                <li>• Use formatting for readability</li>
                <li>• Add relevant images</li>
              </ul>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Content */}
              {activeSection === 'content' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">1. Content Creation</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="gap-2"
                    >
                      {previewMode ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {previewMode ? 'Edit' : 'Preview'}
                    </Button>
                  </div>
                  
                  {!previewMode ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Blog Post Title *</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g., The Future of AI in Healthcare"
                          required
                          className="text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.title.length}/120 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Excerpt / Summary *</label>
                        <AdvancedEditor
                          content={formData.excerpt}
                          onChange={(content: string) => setFormData({...formData, excerpt: content})}
                          placeholder="Write a brief summary that will appear in blog listings..."
                          className="min-h-[180px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Word count: {formData.excerpt.split(/\s+/).filter(w => w.length > 0).length} words
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Content *</label>
                        <AdvancedEditor
                          content={formData.content}
                          onChange={(content: string) => setFormData({...formData, content: content})}
                          placeholder="Write your complete blog post here using Markdown formatting..."
                          className="min-h-[450px]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Word count: {formData.content.split(/\s+/).filter(w => w.length > 0).length} words • Est. read time: {Math.ceil(formData.content.split(/\s+/).filter(w => w.length > 0).length / 200)} min
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6 border rounded-lg p-6 bg-muted/30">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{formData.title || 'Untitled Post'}</h2>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>By {formData.author || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{formData.readTime}</span>
                          <Badge variant="outline">{formData.category}</Badge>
                        </div>
                      </div>
                      <div className="prose max-w-none">
                        <h4 className="font-semibold">Excerpt:</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{formData.excerpt || 'No excerpt provided'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 2: Metadata */}
              {activeSection === 'metadata' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">2. Author & Categorization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Author Name *</label>
                      <Input
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="e.g., Dr. Jane Smith"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-2 pr-8 border rounded-md appearance-none bg-white"
                        >
                          <option value="General">General</option>
                          <option value="AI Ethics">AI Ethics</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Privacy">Privacy</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Technology">Technology</option>
                          <option value="Research">Research</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="AI, Machine Learning, Ethics, Technology"
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                    
                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.split(',').filter(t => t.trim()).map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Featured Image URL</label>
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/blog-image.jpg"
                      />
                      
                      {formData.imageUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden border">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.txt';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Read Time</label>
                      <Input
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="5 min read"
                      />
                      <p className="text-xs text-muted-foreground">Auto-calculated based on word count</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Publishing */}
              {activeSection === 'publishing' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">3. Publishing Settings</h3>
                  
                  <Card className="border-2">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={formData.isPublic}
                          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                          className="rounded mt-1 h-5 w-5"
                        />
                        <div className="flex-1">
                          <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
                            Publish immediately
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Making this public will display it on the blog page for all visitors to see
                          </p>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPublic ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.isPublic ? 'translate-x-6' : ''}`} />
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Publication Status</h4>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${formData.isPublic ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="text-sm text-muted-foreground">
                            {formData.isPublic ? 'Live and visible to public' : 'Draft - only visible to admins'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">Pre-Publish Checklist</h4>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>✓ Proofread for spelling and grammar</li>
                      <li>✓ Verify all links work correctly</li>
                      <li>✓ Check image displays properly</li>
                      <li>✓ Ensure proper formatting</li>
                      <li>✓ Add relevant tags for SEO</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 border-t">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 gap-2 px-6"
                >
                  <CheckCircle className="h-4 w-4" />
                  {post ? 'Update Post' : 'Publish Post'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <div className="flex-1" />
                <span className="text-xs text-muted-foreground">
                  {post ? `Last updated: ${new Date(post.updatedAt).toLocaleDateString()}` : 'Created just now'}
                </span>
              </div>
            </form>
          </div>
        </div>
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
} 