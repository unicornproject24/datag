import { Button } from "../components/ui/button";
import { BookOpen, Shield, Users, Target, Heart, Brain } from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
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
            Data Well-being Group
          </h1>
          <p className="text-lg sm:text-xl mb-10 leading-relaxed max-w-3xl mx-auto text-white/90">
            Advancing research at the intersection of data science, technology ethics, and human well-being. 
            We develop frameworks, tools, and insights to ensure data serves people's best interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate("research")}
              className="bg-white text-primary hover:bg-white/90 hover:shadow-lg hover:-translate-y-1 transition-all px-8 py-4 text-base font-medium rounded-xl"
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
      <section className="py-24 bg-gradient-to-br from-background to-soft-green">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl soft-shadow hover:shadow-lg transition-all">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Purpose</span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The Data Well-being Group (DAWG) is dedicated to understanding and improving the relationship 
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
      <section className="py-24 bg-gradient-to-br from-background to-soft-lavender">
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
                  className="bg-white p-8 rounded-2xl soft-shadow hover:shadow-lg hover:-translate-y-2 transition-all text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
