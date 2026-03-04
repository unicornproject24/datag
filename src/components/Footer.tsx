import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#2F4F4F] text-white py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-xl font-bold mb-2">DaWg</div>
            <p className="text-gray-300 text-sm mb-4">
              Data and Wellbeing Group - Advancing ethical data science research
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Github className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Research */}
          <div>
            <h4 className="font-semibold mb-3">Research</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => onNavigate("research")} className="hover:text-white">Publications</button></li>
              <li><button onClick={() => onNavigate("research")} className="hover:text-white">Projects</button></li>
              <li><button className="hover:text-white">Datasets</button></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button onClick={() => onNavigate("blog")} className="hover:text-white">Blog</button></li>
              <li><button className="hover:text-white">Events</button></li>
              <li><button className="hover:text-white">Newsletter</button></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><button className="hover:text-white">Contact Us</button></li>
              <li><button onClick={() => onNavigate("team")} className="hover:text-white">Join the Team</button></li>
              <li><button onClick={() => onNavigate("partners")} className="hover:text-white">Collaborate</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300">
          <p>© 2025 Data and Wellbeing Group. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white">Privacy Policy</button>
            <button className="hover:text-white">Terms of Use</button>
            <button onClick={() => onNavigate("admin")} className="hover:text-white opacity-50">Admin</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
