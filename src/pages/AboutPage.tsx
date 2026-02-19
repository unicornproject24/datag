import { Button } from "../components/ui/button";
import { BookOpen, Shield, Users, Target } from "lucide-react";

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
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Data Well-being Group
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Advancing research at the intersection of data science, technology ethics, and human well-being. 
            We develop frameworks, tools, and insights to ensure data serves people's best interests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate("research")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Research
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-primary hover:text-primary"
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Research Grid */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The Data Well-being Group (DAWG) is dedicated to understanding and improving the relationship 
                between data practices and human flourishing. We believe that data science should be conducted 
                with people's well-being at the center.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Through rigorous research, ethical frameworks, and practical tools, we work to ensure that 
                data-driven technologies enhance rather than diminish quality of life.
              </p>
            </div>

            {/* Research Areas Card */}
            <div className="bg-primary/5 p-8 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Research Areas</h2>
              <ul className="space-y-3">
                {researchAreas.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work and research
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg border hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
