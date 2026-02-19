import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
      // In a real app, you would fetch from the API
      // This is just a simulation
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
      // In a real app, you would make an API call
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
      // In a real app, you would make an API call
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="users">Team Members</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {applications
                  .filter(app => app.status === 'PENDING')
                  .map(application => (
                    <Card key={application.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-medium">{application.name}</h3>
                            <Badge variant={
                              application.status === 'PENDING' ? 'default' :
                              application.status === 'APPROVED' ? 'success' : 'destructive'
                            }>
                              {application.status}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-2">{application.email}</p>
                          
                          <p className="mb-4">{application.motivation}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {application.researchInterests.map(interest => (
                              <Badge key={interest} variant="secondary">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-sm">
                            <p><strong>Expertise:</strong> {application.expertise.join(', ')}</p>
                            <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            onClick={() => handleApprove(application.id)}
                            variant="default"
                          >
                            Approve
                          </Button>
                          <Button 
                            onClick={() => {
                              const feedback = prompt('Enter feedback for rejection (optional):');
                              handleReject(application.id, feedback || '');
                            }}
                            variant="destructive"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                }
                
                {applications.filter(app => app.status === 'PENDING').length === 0 && (
                  <p className="text-center text-gray-500 py-8">No pending applications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Team member management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
