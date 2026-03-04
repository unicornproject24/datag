import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Users, Clock, CheckCircle, XCircle, FileText, LayoutDashboard, Plus, BookOpen } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  email: string;
  motivation: string;
  researchInterests: string[];
  expertise: string[];
  cvUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  feedback?: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const mockApplications: Application[] = [
        {
          id: '1',
          name: 'Jane Smith',
          email: 'jane@example.com',
          motivation: 'I am passionate about research in data ethics and want to contribute to meaningful projects.',
          researchInterests: ['AI Ethics', 'Privacy', 'Data Governance'],
          expertise: ['Python', 'Machine Learning', 'Statistics'],
          cvUrl: '/cv/jane_smith.pdf',
          status: 'PENDING',
          createdAt: '2023-05-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@example.com',
          motivation: 'Looking to expand my research experience in mental health analytics.',
          researchInterests: ['Mental Health', 'Digital Wellness'],
          expertise: ['R', 'Data Visualization', 'Psychology'],
          cvUrl: '/cv/john_doe.pdf',
          status: 'PENDING',
          createdAt: '2023-05-16T14:22:00Z'
        }
      ];
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      console.log(`Approving application ${id}`);
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'APPROVED' } : app
      ));
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (id: string, feedback: string = '') => {
    try {
      console.log(`Rejecting application ${id} with feedback: ${feedback}`);
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'REJECTED', feedback } : app
      ));
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Applications</p>
                <p className="text-3xl font-bold mt-1 text-blue-900">{applications.length}</p>
                <p className="text-xs text-blue-600 mt-1">All submissions</p>
              </div>
              <Users className="h-10 w-10 text-blue-500 opacity-75" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending Review</p>
                <p className="text-3xl font-bold mt-1 text-yellow-900">
                  {applications.filter(app => app.status === 'PENDING').length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-500 opacity-75" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Approved</p>
                <p className="text-3xl font-bold mt-1 text-green-900">
                  {applications.filter(app => app.status === 'APPROVED').length}
                </p>
                <p className="text-xs text-green-600 mt-1">Successfully onboarded</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-500 opacity-75" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Rejected</p>
                <p className="text-3xl font-bold mt-1 text-red-900">
                  {applications.filter(app => app.status === 'REJECTED').length}
                </p>
                <p className="text-xs text-red-600 mt-1">Declined applications</p>
              </div>
              <XCircle className="h-10 w-10 text-red-500 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto gap-1 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="applications" className="py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <FileText className="h-4 w-4 mr-2" />
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <Users className="h-4 w-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="content" className="py-3 px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="mt-6">
          <Card className="border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Pending Applications</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Review and manage new team member applications</p>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {applications.filter(app => app.status === 'PENDING').length} awaiting review
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {applications
                  .filter(app => app.status === 'PENDING')
                  .map(application => (
                    <Card key={application.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-3 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                                  {application.name.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{application.name}</h3>
                                  <p className="text-sm text-muted-foreground">{application.email}</p>
                                </div>
                              </div>
                              <Badge variant={
                                application.status === 'PENDING' ? 'default' :
                                application.status === 'APPROVED' ? 'secondary' : 'destructive'
                              } className="px-3 py-1 text-sm">
                                {application.status}
                              </Badge>
                            </div>
                            
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-sm font-medium mb-2">Motivation</p>
                              <p className="text-sm text-muted-foreground italic">{application.motivation}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-2">Research Interests</p>
                                <div className="flex flex-wrap gap-2">
                                  {application.researchInterests.map(interest => (
                                    <Badge key={interest} variant="secondary" className="text-xs px-2 py-1">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium mb-2">Expertise</p>
                                <div className="flex flex-wrap gap-2">
                                  {application.expertise.map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs px-2 py-1">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                              <Clock className="h-3 w-3" />
                              Applied on {new Date(application.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          
                          <div className="lg:col-span-1 flex lg:flex-col gap-2 items-center lg:items-stretch justify-center lg:justify-start border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                            <Button 
                              onClick={() => handleApprove(application.id)}
                              className="flex-1 lg:w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => {
                                const feedback = prompt('Enter feedback for rejection (optional):');
                                handleReject(application.id, feedback || '');
                              }}
                              variant="destructive"
                              className="flex-1 lg:w-full gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
                
                {applications.filter(app => app.status === 'PENDING').length === 0 && (
                  <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground mb-4">No pending applications to review</p>
                    <p className="text-sm text-muted-foreground">New applications will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card className="border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <CardTitle className="text-xl">Team Members</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage your core team members</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Member Management</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add, edit, and manage team member profiles. Control visibility and update information.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-1 transition-all px-6 py-3 rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <Card className="border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
              <CardTitle className="text-xl">Content Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage research projects and blog posts</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Research Projects</h4>
                    <p className="text-sm text-muted-foreground mb-4">Create and manage research project listings</p>
                    <Button variant="outline" className="w-full">Manage Research</Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold mb-2">Blog Posts</h4>
                    <p className="text-sm text-muted-foreground mb-4">Write and publish blog articles</p>
                    <Button variant="outline" className="w-full">Manage Blog</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
