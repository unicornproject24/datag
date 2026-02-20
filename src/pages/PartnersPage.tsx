import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Handshake, Mail, Heart, Users, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

export function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      const data = await res.json();
      setPartners(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center animate-pulse">
            <Handshake className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground text-lg">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Users className="h-5 w-5 text-white" />
              <span className="text-sm font-medium text-white">Our Network</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Partners & Collaborators
            </h1>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              We collaborate with organizations across academia, industry, and civil society to maximize 
              the impact of our research. Together, we're building a more ethical and human-centered 
              data ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 bg-gradient-to-br from-background to-soft-green">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {partners.map((partner) => (
              <Card key={partner.name} className="bg-white soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all group rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{partner.name}</h3>
                  <p className="text-primary mb-4 font-medium">{partner.type}</p>
                  <p className="text-muted-foreground leading-relaxed">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Partnership Benefits */}
          <div className="bg-white rounded-3xl p-10 soft-shadow">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
                <Heart className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Why Partner With Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Partner With DaWg</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Join us in creating positive change through ethical data practices</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Rigorous Research</h3>
                <p className="text-muted-foreground">Access to cutting-edge research methodologies and evidence-based insights</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Global Network</h3>
                <p className="text-muted-foreground">Connect with leading experts and organizations worldwide</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 soft-shadow hover:shadow-md transition-all group hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Real Impact</h3>
                <p className="text-muted-foreground">Collaborate on projects that create meaningful change in the world</p>
              </div>
            </div>
          </div>

          {/* Collaboration Types */}
          <div className="mt-20 bg-gradient-to-br from-soft-lavender to-background rounded-3xl p-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Handshake className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Partnership Models</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How We Collaborate</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Multiple ways to work together based on your organization's needs</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl soft-shadow hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Research Partnerships</h3>
                <p className="text-muted-foreground mb-6">
                  Joint research projects, data sharing agreements, and co-authored publications 
                  that advance the field of data well-being.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-foreground">Collaborative research projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-foreground">Data and resource sharing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-foreground">Joint publications and grants</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl soft-shadow hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Advisory Services</h3>
                <p className="text-muted-foreground mb-6">
                  Expert consultation on data ethics, privacy, and well-being for organizations 
                  seeking to improve their practices.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    </div>
                    <span className="text-foreground">Ethics audits and assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    </div>
                    <span className="text-foreground">Policy development support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    </div>
                    <span className="text-foreground">Training and workshops</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl soft-shadow hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Funding Partnerships</h3>
                <p className="text-muted-foreground mb-6">
                  Support for specific research initiatives that align with your organization's 
                  mission and values.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                    <span className="text-foreground">Project-specific grants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                    <span className="text-foreground">General operating support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                    <span className="text-foreground">Endowments and fellowships</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl soft-shadow hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-warm flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Community Engagement</h3>
                <p className="text-muted-foreground mb-6">
                  Participatory research and co-design with communities to ensure research 
                  meets real-world needs.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-warm/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-warm"></div>
                    </div>
                    <span className="text-foreground">Co-design workshops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-warm/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-warm"></div>
                    </div>
                    <span className="text-foreground">Community advisory boards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-warm/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-warm"></div>
                    </div>
                    <span className="text-foreground">Public engagement events</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-primary text-white rounded-3xl p-12 text-center soft-shadow group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Let's Connect</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Interested in Collaborating?</h2>
              <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
                We're always open to new partnerships that align with our mission. 
                Let's explore how we can work together to advance data well-being.
              </p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all px-8 py-4 text-lg font-medium rounded-xl">
                <Mail className="h-5 w-5 mr-2" />
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}