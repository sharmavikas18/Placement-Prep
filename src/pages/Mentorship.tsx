import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Star, Calendar, Search, Filter, CheckCircle2, 
  Briefcase, Video, Award, ChevronRight, X, Sparkles, GraduationCap 
} from "lucide-react";

const mentors = [
  { id: 1, name: "Ananya Sharma", role: "Senior SDE", company: "Google", specialization: "System Design", exp: 6, rating: 4.9, price: 0, status: "Available", bio: "Ex-Amazon. Helped 50+ students crack MAANG interviews.", color: "#4285F4" },
  { id: 2, name: "David Miller", role: "Engineering Manager", company: "Meta", specialization: "Behavioral", exp: 10, rating: 5.0, price: 1500, status: "Busy", bio: "Specialist in leadership and frontend architecture.", color: "#0668E1" },
  { id: 3, name: "Rohan Verma", role: "SDE-2", company: "Microsoft", specialization: "DSA", exp: 3, rating: 4.8, price: 0, status: "Available", bio: "Codeforces Red Coder. Passionate about teaching algorithms.", color: "#00BCF2" },
  { id: 4, name: "Sarah Jenkins", role: "Product Manager", company: "Atlassian", specialization: "Product Case", exp: 5, rating: 4.9, price: 2000, status: "Available", bio: "I focus on making your resume stand out to recruiters.", color: "#0052CC" },
  { id: 5, name: "Kevin Duong", role: "Staff Engineer", company: "Uber", specialization: "Backend", exp: 8, rating: 4.7, price: 0, status: "Available", bio: "Distributed systems expert and open-source contributor.", color: "#000000" },
  { id: 6, name: "Priya Das", role: "Tech Lead", company: "Apple", specialization: "Frontend", exp: 7, rating: 4.9, price: 1200, status: "Available", bio: "Expert in React, performance optimization, and UI/UX.", color: "#A3AAAE" },
  { id: 7, name: "Marcus Thorne", role: "Security Architect", company: "Nvidia", specialization: "Cybersecurity", exp: 9, rating: 4.8, price: 2500, status: "Busy", bio: "Protecting cloud infrastructure at scale. Let's talk security.", color: "#76B900" },
  { id: 8, name: "Elena Rodriguez", role: "Data Scientist", company: "Netflix", specialization: "Machine Learning", exp: 4, rating: 4.9, price: 0, status: "Available", bio: "Specializing in recommendation engines and big data analytics.", color: "#E50914" },
  { id: 9, name: "Siddharth Malhotra", role: "VP Engineering", company: "Zomato", specialization: "Scaling Startups", exp: 12, rating: 5.0, price: 5000, status: "Available", bio: "From early-stage to IPO. I can guide your startup journey.", color: "#CB202D" },
  { id: 10, name: "Lisa Wong", role: "UX Design Lead", company: "Adobe", specialization: "Design", exp: 8, rating: 4.7, price: 0, status: "Available", bio: "Mastering the art of user-centric design and accessibility.", color: "#FF0000" },
  { id: 11, name: "James O'Brien", role: "DevOps Lead", company: "Stripe", specialization: "DevOps", exp: 6, rating: 4.9, price: 1800, status: "Available", bio: "CI/CD expert. Making deployments seamless and reliable.", color: "#635BFF" },
  { id: 12, name: "Aarav Gupta", role: "Blockchain Developer", company: "Polygon", specialization: "Web3", exp: 4, rating: 4.6, price: 0, status: "Busy", bio: "Smart contracts and dApps. Exploring the decentralized future.", color: "#8247E5" },
];

const categories = ["All", "DSA", "System Design", "Frontend", "Backend", "Behavioral", "Product Case", "Cybersecurity", "Machine Learning", "Design", "DevOps", "Web3"];

const Mentorship = () => {
  const [search, setSearch] = useState("");
  const [selCategory, setSelCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");

  const filteredMentors = useMemo(() => {
    return mentors.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                            m.company.toLowerCase().includes(search.toLowerCase()) ||
                            m.role.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selCategory === "All" || m.specialization === selCategory;
      const matchesPrice = priceFilter === "All" || (priceFilter === "Free" ? m.price === 0 : m.price > 0);
      const matchesExp = expFilter === "All" || 
                         (expFilter === "Junior" ? m.exp < 5 : expFilter === "Senior" ? m.exp >= 5 && m.exp < 8 : m.exp >= 8);
      
      return matchesSearch && matchesCat && matchesPrice && matchesExp;
    });
  }, [search, selCategory, priceFilter, expFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelCategory("All");
    setPriceFilter("All");
    setExpFilter("All");
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full tracking-widest">Expert Network</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">1:1 Mentorship</h1>
          <p className="text-muted-foreground mt-1 text-lg">Personalized guidance from top industry experts.</p>
        </div>
        <div className="hidden lg:flex gap-4">
            <div className="glass p-3 rounded-2xl border-primary/20 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold italic text-foreground">Verified Professionals</span>
            </div>
        </div>
      </div>

      {/* 2. Advanced Search & Filter Bar */}
      <div className="glass p-6 rounded-3xl border-border/40 space-y-4 shadow-xl shadow-black/5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search name, company, or domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background/50 border border-border/50 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="glass border-none ring-1 ring-border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
            </select>

            <select 
              value={expFilter} 
              onChange={(e) => setExpFilter(e.target.value)}
              className="glass border-none ring-1 ring-border rounded-xl px-4 py-2 text-sm outline-none cursor-pointer"
            >
              <option value="All">Exp Level</option>
              <option value="Junior">0-5 Years</option>
              <option value="Senior">5-8 Years</option>
              <option value="Staff">8+ Years</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selCategory === cat ? "bg-primary text-primary-foreground shadow-lg" : "glass hover:bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMentors.map((m, idx) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass rounded-[2rem] p-6 flex flex-col justify-between group border-border/50 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                        style={{ background: `linear-gradient(135deg, ${m.color}, #1a1a1a)` }}
                    >
                        {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {m.status === "Available" ? (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-background rounded-full"></span>
                    ) : (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border-4 border-background rounded-full"></span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      {m.rating}
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${m.status === "Available" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                        {m.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{m.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-foreground/80">{m.role}</span>
                    <span className="text-xs text-muted-foreground">at</span>
                    <span className="text-sm font-bold text-primary">{m.company}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 italic mb-6">"{m.bio}"</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="flex items-center gap-1 px-3 py-1 bg-secondary/50 rounded-lg text-[10px] font-bold uppercase text-foreground/70">
                    <Award className="w-3 h-3" /> {m.specialization}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-secondary/50 rounded-lg text-[10px] font-bold uppercase text-foreground/70">
                    <GraduationCap className="w-3 h-3" /> {m.exp}Y Exp
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between px-2 mb-2">
                    <div className="text-sm font-bold text-foreground">
                        {m.price === 0 ? <span className="text-emerald-500">Free Session</span> : `₹${m.price}/hr`}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        <Video className="w-3 h-3 text-primary" /> 1:1 Video
                    </div>
                </div>
                <button className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95 group-hover:translate-y-[-2px]">
                  <Calendar className="w-4 h-4" /> Book Session
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. Empty State */}
      {filteredMentors.length === 0 && (
        <div className="text-center py-24 glass rounded-[3rem] border-dashed border-2 border-border/50">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Mentors Found</h3>
          <p className="text-muted-foreground mb-6">Try broadening your search or resetting filters.</p>
          <button 
            onClick={clearFilters}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:opacity-90 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Mentorship;