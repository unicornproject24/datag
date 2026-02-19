import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Users, BookOpen, Lightbulb, Handshake, ArrowRight, ChevronDown, Heart, Brain, Shield } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blue via-background to-soft-green">
      {/* Hero Section - Full Screen with Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/inspa-makers--BCd_TrrhGs-unsplash.jpg"
            alt="Data Well-being"
            className="w-full h-full object-cover"
            onLoad={() => console.log("✅ Hero image loaded successfully")}
            onError={(e) => {
              console.error("❌ Hero image failed to load:", e);
              const target = e.target as HTMLImageElement;
              console.log("Image src:", target.src);
            }}
          /> 
          {/* Gradients temporarily removed to test image visibility */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div> */}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl mb-8 border border-white/20 animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-white">DaWG</div>
              <div className="text-sm text-white/80">Data and Well-being Group</div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-tight animate-slide-up">
            Where Data Meets <span className="text-secondary">Human Flourishing</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed animate-slide-up" style={{animationDelay: "0.2s"}}>
            Advancing research at the intersection of data science, technology ethics, and human well-being. 
            We develop frameworks, tools, and insights to ensure data serves people's best interests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: "0.4s"}}>
            <Button 
              size="lg"
              onClick={() => onNavigate("about")}
              className="bg-gradient-primary text-white hover:shadow-lg hover:-translate-y-1 transition-all px-8 py-4 text-base font-medium rounded-xl"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate("research")}
              className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-medium rounded-xl"
            >
              Explore Research
            </Button>
          </div>

        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-24 bg-gradient-to-br from-background to-soft-blue">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden soft-shadow">
                <ImageWithFallback
                  src="/images/jeremy-bishop-EwKXn5CapA4-unsplash.jpg"
                  alt="Our Approach"
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Philosophy</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Our Approach
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                We believe that data science should serve humanity. Our interdisciplinary team combines 
                expertise in computer science, psychology, ethics, and policy to create frameworks and 
                tools that put people first.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Evidence-Based</h3>
                    <p className="text-muted-foreground">Rigorous research methods and empirical validation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-lg bg-gradient-secondary flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Human-Centered</h3>
                    <p className="text-muted-foreground">Technology designed with people's needs at the core</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-lg bg-gradient-warm flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Collaborative Impact</h3>
                    <p className="text-muted-foreground">Partnering across sectors for real-world change</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-soft-green to-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
              <Heart className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Our Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Making a Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our research and initiatives are creating positive change in data well-being
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Publications</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">12</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Partners</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white soft-shadow hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-warm/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-warm" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-warm mb-2">8</div>
              <div className="text-sm text-muted-foreground">Policy Impacts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover DAWG Section */}
      <section className="py-24 bg-gradient-to-br from-background to-soft-lavender">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
              <Brain className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Explore Our Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Discover DAWG
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our work across research, community, and collaboration
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: "About Us", desc: "Learn about our mission to advance ethical data science and human well-being", page: "about", color: "primary" },
              { icon: Users, title: "Our Team", desc: "Meet the researchers and experts dedicated to data well-being", page: "team", color: "secondary" },
              { icon: BookOpen, title: "Research", desc: "Explore our cutting-edge projects and publications", page: "research", color: "accent" },
              { icon: Heart, title: "Blog", desc: "Read insights and perspectives from our team members", page: "blog", color: "warm" },
              { icon: Handshake, title: "Partners", desc: "Discover our collaborators across academia, industry, and community", page: "partners", color: "primary" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  onClick={() => onNavigate(item.page)}
                  className="p-8 cursor-pointer bg-white soft-shadow hover:shadow-xl transition-all group hover:-translate-y-2 rounded-2xl"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${item.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary' : item.color === 'secondary' ? 'bg-secondary/10 group-hover:bg-secondary' : item.color === 'accent' ? 'bg-accent/10 group-hover:bg-accent' : 'bg-warm/10 group-hover:bg-warm'}`}>
                    <Icon className={`h-8 w-8 ${item.color === 'primary' ? 'text-primary group-hover:text-white' : item.color === 'secondary' ? 'text-secondary group-hover:text-white' : item.color === 'accent' ? 'text-accent group-hover:text-white' : 'text-warm group-hover:text-white'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                  <div className={`flex items-center font-medium ${item.color === 'primary' ? 'text-primary' : item.color === 'secondary' ? 'text-secondary' : item.color === 'accent' ? 'text-accent' : 'text-warm'}`}>
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Join Our Team */}
      <section className="py-24 bg-gradient-primary">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Get Involved</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Us in Shaping the Future
            </h2>
            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Whether you're a researcher, organization, or individual interested in data well-being, we'd love to connect with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate("team")}
                className="bg-white text-primary hover:bg-white/90 hover:shadow-lg hover:-translate-y-1 transition-all px-8 py-4 text-base font-medium rounded-xl shadow-lg"
              >
                Join Our Team
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate("partners")}
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-medium rounded-xl shadow-lg"
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
