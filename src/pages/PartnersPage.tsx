import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Users, ArrowRight, Sparkles, Globe, Heart, Lightbulb } from "lucide-react";

export function PartnersPage() {
  const handleJoinCommunity = () => {
    window.location.hash = "community";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-soft-blue to-soft-lavender flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <Card className="relative w-full max-w-4xl bg-white/80 backdrop-blur-xl border-2 border-white/20 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Visual Content */}
            <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 sm:p-12 text-white relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    <span>Join Our Growing Community</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                    Be Part of Something Bigger
                  </h1>
                  
                  <p className="text-lg text-white/90 leading-relaxed">
                    Connect with researchers, professionals, and enthusiasts passionate about data well-being and ethical technology.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all group/item">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Global Network</h3>
                      <p className="text-sm text-white/80">Connect with members worldwide</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all group/item">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Knowledge Sharing</h3>
                      <p className="text-sm text-white/80">Access exclusive resources and insights</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-all group/item">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Make an Impact</h3>
                      <p className="text-sm text-white/80">Contribute to meaningful research</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Call to Action */}
            <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-white to-gray-50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      Join Our Community
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Become a member today
                    </p>
                  </div>
                </div>

                <p className="text-foreground/70 leading-relaxed">
                  Whether you're a researcher, student, professional, or simply passionate about data ethics and well-being, 
                  our community welcomes you. Together, we're shaping a more human-centered approach to technology.
                </p>
              </div>

              {/* Membership Benefits */}
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-foreground">Access to exclusive content and resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-foreground">Networking opportunities with experts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-foreground">Early access to research findings</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-foreground">Participate in events and workshops</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleJoinCommunity}
                className="w-full bg-gradient-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg font-semibold py-6 rounded-xl group/btn"
                size="lg"
              >
                <span>Join the Community</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-4">
                Free to join • No credit card required • Instant access
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Elements */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">Community is active</span>
          </div>
        </div>
      </div>
    </div>
  );
}