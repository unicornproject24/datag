import { TeamMemberCard } from "../components/TeamMemberCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Users, Heart, Brain, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eb1fb471/team-members`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        setTeamMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-green">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Users className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Meet Our Experts</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Our Team
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              A diverse group of researchers, data scientists, and ethicists dedicated to 
              advancing data well-being. Our interdisciplinary team brings together expertise 
              from computer science, psychology, public policy, and design.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-24 bg-gradient-to-br from-background to-soft-blue">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
            {/* Placeholder for future team members */}
            <Card className="border-2 border-dashed border-accent/40 flex items-center justify-center min-h-[400px] hover:border-accent/60 hover:shadow-xl transition-all bg-gradient-to-br from-white to-soft-lavender group rounded-3xl">
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-foreground mb-3 text-xl font-semibold">Join Our Team</h3>
                <p className="text-muted-foreground mb-6">We're always looking for talented researchers</p>
                <Button variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all px-6 py-3 rounded-xl">
                  View Opportunities
                </Button>
              </div>
            </Card>
          </div>

          {/* Team Culture */}
          <div className="bg-white rounded-3xl p-10 sm:p-12 soft-shadow">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Our Culture</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Work With Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Join a community that values innovation, collaboration, and positive impact</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Innovative Research</h3>
                <p className="text-muted-foreground">Work on cutting-edge projects at the forefront of data ethics</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Global Impact</h3>
                <p className="text-muted-foreground">Shape policies and practices that affect millions worldwide</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Collaborative Culture</h3>
                <p className="text-muted-foreground">Join a supportive, interdisciplinary community of scholars</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}