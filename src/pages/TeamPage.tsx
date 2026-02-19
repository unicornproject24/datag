import { TeamMemberCard } from "../components/TeamMemberCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Users } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-secondary/20 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(178,201,171,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(123,179,192,0.15),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-in slide-in-from-left duration-700">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Our Team</h2>
            </div>
            <p className="text-foreground/80 text-base sm:text-lg md:text-xl leading-relaxed animate-in slide-in-from-left duration-700 delay-150">
              A diverse group of researchers, data scientists, and ethicists dedicated to 
              advancing data well-being. Our interdisciplinary team brings together expertise 
              from computer science, psychology, public policy, and design.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
            {/* Placeholder for future team members */}
            <Card className="border-2 border-dashed border-secondary/40 flex items-center justify-center min-h-[400px] hover:border-primary/60 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-sm group">
              <div className="text-center p-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />
                </div>
                <h3 className="text-foreground/70 mb-2 text-lg sm:text-xl font-semibold">Join Our Team</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">We're always looking for talented researchers</p>
                <Button variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                  View Opportunities
                </Button>
              </div>
            </Card>
          </div>

          {/* Team Culture */}
          <div className="mt-16 bg-gradient-to-br from-accent/20 to-secondary/10 rounded-3xl p-8 sm:p-12 border border-border shadow-xl">
            <h3 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold">Why Work With Us</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-3xl sm:text-4xl">💡</span>
                </div>
                <h4 className="mb-2 text-lg sm:text-xl font-semibold">Innovative Research</h4>
                <p className="text-foreground/70 text-sm sm:text-base">Work on cutting-edge projects at the forefront of data ethics</p>
              </div>
              <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-3xl sm:text-4xl">🌍</span>
                </div>
                <h4 className="mb-2 text-lg sm:text-xl font-semibold">Global Impact</h4>
                <p className="text-foreground/70 text-sm sm:text-base">Shape policies and practices that affect millions worldwide</p>
              </div>
              <div className="text-center group hover:-translate-y-2 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-3xl sm:text-4xl">🤝</span>
                </div>
                <h4 className="mb-2 text-lg sm:text-xl font-semibold">Collaborative Culture</h4>
                <p className="text-foreground/70 text-sm sm:text-base">Join a supportive, interdisciplinary community of scholars</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}