import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Users, BookOpen, Lightbulb, Handshake, ArrowRight, ChevronDown } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Screen with Image */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="/images/inspa-makers--BCd_TrrhGs-unsplash.jpg"
            alt="Data Well-being"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl mb-8">
            <div className="text-[#7bb3c0] text-2xl font-bold mb-1">DAWG</div>
            <div className="text-gray-600 text-sm">Data Well-being Group</div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Where Data Meets Human Flourishing
          </h1>

          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Advancing research at the intersection of data science, technology ethics, and human well-being. 
            We develop frameworks, tools, and insights to ensure data serves people's best interests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              onClick={() => onNavigate("about")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate("research")}
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Explore Research
            </Button>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="text-white text-sm mb-2">Scroll to explore</div>
            <ChevronDown className="h-6 w-6 mx-auto" />
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="/images/jeremy-bishop-EwKXn5CapA4-unsplash.jpg"
                  alt="Our Approach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Approach
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe that data science should serve humanity. Our interdisciplinary team combines 
                expertise in computer science, psychology, ethics, and policy to create frameworks and 
                tools that put people first.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Evidence-Based</h3>
                    <p className="text-gray-600">Rigorous research methods and empirical validation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Human-Centered</h3>
                    <p className="text-gray-600">Technology designed with people's needs at the core</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Collaborative Impact</h3>
                    <p className="text-gray-600">Partnering across sectors for real-world change</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-gray-600">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">12</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-gray-600">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <div className="text-sm text-gray-600">Policy Impacts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover DAWG Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Discover DAWG
            </h2>
            <p className="text-lg text-gray-600">
              Explore our work across research, community, and collaboration
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lightbulb, title: "About Us", desc: "Learn about our mission to advance ethical data science and human well-being", page: "about" },
              { icon: Users, title: "Our Team", desc: "Meet the researchers and experts dedicated to data well-being", page: "team" },
              { icon: BookOpen, title: "Research", desc: "Explore our cutting-edge projects and publications", page: "research" },
              { icon: Lightbulb, title: "Blog", desc: "Read insights and perspectives from our team members", page: "blog" },
              { icon: Handshake, title: "Partners", desc: "Discover our collaborators across academia, industry, and community", page: "partners" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  onClick={() => onNavigate(item.page)}
                  className="p-8 cursor-pointer border hover:shadow-lg transition-all group bg-gray-50 hover:bg-white"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center text-primary font-medium">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Join Us in Shaping the Future
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a researcher, organization, or individual interested in data well-being, we'd love to connect with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onNavigate("team")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Join Our Team
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => onNavigate("partners")}
              className="border-2 border-gray-300 hover:border-primary hover:text-primary"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
