import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { BookOpen, Shield, Users, Target, Heart, Brain, Mail, Lightbulb, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
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
  
  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Protecting individual privacy while advancing research"
    },
    {
      icon: Users,
      title: "Human-Centered",
      description: "Technology designed with people's well-being in mind"
    },
    {
      icon: Target,
      title: "Collaborative",
      description: "Working across disciplines and sectors for impact"
    }
  ];

  const researchAreas = [
    "Privacy-preserving data collection methods",
    "Digital well-being metrics and frameworks",
    "Ethical AI and algorithmic transparency",
    "Social media and mental health",
    "Data governance and policy development"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-soft-blue pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-primary text-white">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Heart className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Our Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Data and Wellbeing Group
          </h1>
          <p className="text-lg sm:text-xl mb-10 leading-relaxed max-w-3xl mx-auto text-white/90">
            Advancing research at the intersection of data science, technology ethics, and human well-being. 
            We develop frameworks, tools, and insights to ensure data serves people's best interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate("research")}
              className="bg-white text-white hover:bg-white/90 hover:shadow-lg hover:-translate-y-1 transition-all px-8 py-4 text-base font-medium rounded-xl"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Research
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-medium rounded-xl"
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Research Grid */}
      <section className="py-24 bg-gradient-to-br from-slate-100 to-emerald-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl soft-shadow">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Purpose</span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Data and Wellbeing Group (DaWg) is dedicated to understanding and improving the relationship
                between data practices and human flourishing. We believe that data science should be conducted 
                with people's well-being at the center.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through rigorous research, ethical frameworks, and practical tools, we work to ensure that 
                data-driven technologies enhance rather than diminish quality of life.
              </p>
            </div>

            {/* Research Areas Card */}
            <div className="bg-gradient-secondary p-10 rounded-3xl text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
                <Brain className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Focus Areas</span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-white">Research Areas</h2>
              <ul className="space-y-4">
                {researchAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <span className="text-white/90">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-slate-100 to-purple-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Core Principles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and research
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl soft-shadow text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Partners Grid */}
            <section className="py-20 bg-gradient-to-br from-slate-100 to-emerald-100">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {partners.map((partner) => (
                    <Card key={partner.name} className="bg-white soft-shadow rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
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
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 soft-shadow">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                        <Lightbulb className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Rigorous Research</h3>
                      <p className="text-muted-foreground">Access to cutting-edge research methodologies and evidence-based insights</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 soft-shadow">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-secondary flex items-center justify-center mx-auto mb-6">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Global Network</h3>
                      <p className="text-muted-foreground">Connect with leading experts and organizations worldwide</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 soft-shadow">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-6">
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
                    <div className="bg-white p-8 rounded-2xl soft-shadow">
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
                  
                    <div className="bg-white p-8 rounded-2xl soft-shadow">
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
                  
                    <div className="bg-white p-8 rounded-2xl soft-shadow">
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
                  
                    <div className="bg-white p-8 rounded-2xl soft-shadow">
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
                <div className="mt-20 bg-gradient-primary text-white rounded-3xl p-12 text-center soft-shadow relative overflow-hidden">
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
                    <Button size="lg" className="bg-black text-white shadow-lg px-8 py-4 text-lg font-medium rounded-xl">
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
