import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    motivation: '',
    researchInterests: '',
    expertise: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.motivation) {
        throw new Error('Please fill in all required fields');
      }

      // Upload CV first if provided
      let cvUrl = '';
      if (cvFile) {
        // In a real app, you would upload the file to a storage service
        // For now, we'll simulate with a placeholder
        cvUrl = `/uploads/${cvFile.name}`;
      }

      // Submit application
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          cvUrl: cvUrl || 'placeholder_cv_url',
          researchInterests: formData.researchInterests.split(',').map(s => s.trim()).filter(s => s),
          expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted!</h2>
          <p className="text-green-700">
            Thank you for your interest in joining our research team. 
            We'll review your application and get back to you within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join Our Research Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Motivation Statement *</label>
            <Textarea
              required
              rows={6}
              value={formData.motivation}
              onChange={(e) => setFormData({...formData, motivation: e.target.value})}
              placeholder="Tell us why you want to join our research team and what you hope to contribute..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Research Interests</label>
            <Input
              value={formData.researchInterests}
              onChange={(e) => setFormData({...formData, researchInterests: e.target.value})}
              placeholder="e.g., AI Ethics, Privacy, Mental Health (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expertise</label>
            <Input
              value={formData.expertise}
              onChange={(e) => setFormData({...formData, expertise: e.target.value})}
              placeholder="e.g., Python, Data Analysis, Qualitative Research (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CV/Resume *</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-gray-500 mt-1">PDF or Word document, max 10MB</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
