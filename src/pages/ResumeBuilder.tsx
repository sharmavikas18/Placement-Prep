import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  User, Mail, Phone, Briefcase, GraduationCap, 
  Code, FileText, Download, Plus, Target, 
  Award, Box, Zap, Trash2, Globe, Heart, Layout, Calendar
} from "lucide-react";

const ATS_LIBRARY = {
  "AI_ENGINEER": ["Python", "TensorFlow", "PyTorch", "NLP", "LLM", "CNN", "Federated Learning", "OpenCV", "Scikit-Learn"],
  "FULL_STACK": ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Docker", "AWS", "REST API", "Next.js"],
};

interface ResumeItem {
  id: string;
  title: string;
  subtitle: string;
  fromYear: string;
  toYear: string;
  description: string;
}

const ResumeBuilder = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [strength, setStrength] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<keyof typeof ATS_LIBRARY>("AI_ENGINEER");
  
  const [formData, setFormData] = useState({
    name: "RAKSHITHA N",
    email: "",
    phone: "",
    title: "DEVELOPER",
    summary: "",
    skills: "",
  });

  const [internships, setInternships] = useState<ResumeItem[]>([]);
  const [education, setEducation] = useState<ResumeItem[]>([]);
  const [activities, setActivities] = useState<ResumeItem[]>([]);
  const [projects, setProjects] = useState<ResumeItem[]>([]);

  // ATS & Strength Meter Logic
  useEffect(() => {
    let score = 10;
    const content = `${formData.summary} ${formData.skills} ${internships.map(i => i.description).join(" ")}`.toLowerCase();
    const matches = ATS_LIBRARY[selectedTrack].filter(word => content.includes(word.toLowerCase()));
    
    const atsScore = (matches.length / ATS_LIBRARY[selectedTrack].length) * 40;
    const sectionScore = (education.length > 0 ? 15 : 0) + (internships.length > 0 ? 15 : 0) + (projects.length > 0 ? 20 : 0);
    
    setStrength(Math.min(100, Math.round(atsScore + sectionScore + (formData.email ? 10 : 0))));
  }, [formData, internships, education, projects, selectedTrack]);

  const addNode = (setter: React.Dispatch<React.SetStateAction<ResumeItem[]>>) => {
    setter(prev => [...prev, { id: Date.now().toString(), title: "", subtitle: "", fromYear: "", toYear: "", description: "" }]);
  };

  const removeNode = (id: string, setter: React.Dispatch<React.SetStateAction<ResumeItem[]>>) => {
    setter(prev => prev.filter(n => n.id !== id));
  };

  const updateNode = (id: string, field: string, value: string, setter: React.Dispatch<React.SetStateAction<ResumeItem[]>>) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const downloadPDF = async () => {
    const element = resumeRef.current;
    if (!element) return;
    const parent = element.parentElement;
    const originalTransform = parent?.style.transform;
    const originalWidth = element.style.width;

    if (parent) parent.style.transform = "none";
    element.style.width = "210mm";
    await new Promise(res => setTimeout(res, 300));

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, 'FAST');

    if (parent) parent.style.transform = originalTransform || "";
    element.style.width = originalWidth;
    pdf.save(`${formData.name.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 lg:p-8 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: INPUT PANEL */}
        <div className="xl:col-span-5 space-y-6 max-h-[92vh] overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 sticky top-0 z-10 backdrop-blur-xl">
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4 flex items-center gap-2">
              <Zap className="text-cyan-400" /> Resume Builder
            </h1>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>ATS Readiness</span>
                <span className="text-cyan-400">{strength}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_15px_#22d3ee]" style={{ width: `${strength}%` }} />
              </div>
              <div className="flex gap-2">
                <select 
                  className="bg-slate-900 text-[9px] font-bold p-1.5 rounded border border-white/10 outline-none flex-1 text-white"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value as any)}
                >
                  <option value="AI_ENGINEER">AI/ML TRACK</option>
                  <option value="FULL_STACK">FULL STACK TRACK</option>
                </select>
                <button onClick={downloadPDF} className="bg-cyan-500 text-black px-4 py-1.5 rounded text-[9px] font-black uppercase flex items-center gap-2 hover:bg-cyan-400 transition-colors">
                  <Download size={12}/> Download PDF
                </button>
              </div>
            </div>
          </div>

          <section className="input-card space-y-4">
            <h2 className="section-title"><User size={14}/> Identity Data</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Name" className="cyber-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Current Role" className="cyber-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <textarea placeholder="Summary..." className="cyber-input h-24" onChange={e => setFormData({...formData, summary: e.target.value})} />
            <input placeholder="Skills (Python, React, NLP...)" className="cyber-input" onChange={e => setFormData({...formData, skills: e.target.value})} />
          </section>

          {/* DYNAMIC LISTS */}
          {[
            { label: "Internships", icon: <Briefcase size={14}/>, data: internships, setter: setInternships, p1: "Company", p2: "Role" },
            { label: "Education", icon: <GraduationCap size={14}/>, data: education, setter: setEducation, p1: "Institution", p2: "Degree" },
            { label: "Projects", icon: <Box size={14}/>, data: projects, setter: setProjects, p1: "Project Name", p2: "Tech Stack" },
            { label: "Extra-Curricular", icon: <Heart size={14}/>, data: activities, setter: setActivities, p1: "Activity", p2: "Award/Post" }
          ].map(sec => (
            <section key={sec.label} className="input-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="section-title">{sec.icon} {sec.label}</h2>
                <button onClick={() => addNode(sec.setter)} className="text-cyan-400 hover:scale-125 transition-all"><Plus size={16}/></button>
              </div>
              {sec.data.map(item => (
                <div key={item.id} className="p-4 bg-slate-950/40 rounded-xl mb-3 border border-white/5 relative group">
                  <button onClick={() => removeNode(item.id, sec.setter)} className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input placeholder={sec.p1} className="cyber-input-sm" onChange={e => updateNode(item.id, "title", e.target.value, sec.setter)} />
                    <input placeholder={sec.p2} className="cyber-input-sm" onChange={e => updateNode(item.id, "subtitle", e.target.value, sec.setter)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input placeholder="From (Year)" className="cyber-input-sm" onChange={e => updateNode(item.id, "fromYear", e.target.value, sec.setter)} />
                    <input placeholder="To (Year/Present)" className="cyber-input-sm" onChange={e => updateNode(item.id, "toYear", e.target.value, sec.setter)} />
                  </div>
                  <textarea placeholder="Achievements/Details..." className="cyber-input-sm h-16 resize-none" onChange={e => updateNode(item.id, "description", e.target.value, sec.setter)} />
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* RIGHT: A4 PREVIEW */}
        <div className="xl:col-span-7 flex flex-col items-center bg-slate-950/50 rounded-[2.5rem] p-4 border border-white/5 overflow-hidden">
          <div className="w-full flex justify-between px-6 mb-4 opacity-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-2"><Layout size={12} /> A4 Simulation Buffer</div>
             <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-red-500/30"/><div className="w-2 h-2 rounded-full bg-yellow-500/30"/><div className="w-2 h-2 rounded-full bg-green-500/30"/></div>
          </div>
          
          <div className="resume-scale-wrapper">
            <div 
              ref={resumeRef} 
              className="bg-white text-slate-900 shadow-2xl relative"
              style={{ width: "210mm", height: "297mm", padding: "18mm", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}
            >
              {/* FIXED HEADER */}
              <div className="border-b-[6px] border-slate-900 pb-6 mb-6">
                <h1 className="text-[38px] font-black uppercase tracking-tighter leading-[1.05] text-slate-900">
                  {formData.name || "RAKSHITHA N"}
                </h1>
                <h3 className="text-cyan-600 font-black uppercase text-[12px] tracking-[0.4em] mt-3">
                  {formData.title || "DEVELOPER"}
                </h3>
              </div>

              <div className="grid grid-cols-12 gap-8 h-full">
                {/* Side Column */}
                <div className="col-span-4 border-r-2 border-slate-100 pr-6 space-y-6">
                  <section>
                    <h4 className="pdf-label"><Code size={10}/> Skill Matrix</h4>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {formData.skills.split(',').map(s => s.trim()).filter(s => s).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">{skill}</span>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h4 className="pdf-label"><GraduationCap size={10}/> Education</h4>
                    {education.map(edu => (
                      <div key={edu.id} className="mt-4">
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase leading-tight text-slate-900">{edu.subtitle}</p>
                          <span className="text-[7px] font-bold text-slate-400">{edu.fromYear} - {edu.toYear}</span>
                        </div>
                        <p className="text-[9px] font-bold text-cyan-600 mt-1">{edu.title}</p>
                      </div>
                    ))}
                  </section>
                </div>
                
                {/* Main Column */}
                <div className="col-span-8 space-y-6">
                  <section>
                    <h4 className="pdf-label"><FileText size={10}/> Profile</h4>
                    <p className="text-[10px] leading-relaxed text-slate-600 mt-3 text-justify italic">{formData.summary || "Awaiting profile data injection..."}</p>
                  </section>
                  <section>
                    <h4 className="pdf-label"><Briefcase size={10}/> Experience</h4>
                    {internships.map(i => (
                      <div key={i.id} className="mt-4">
                        <div className="flex justify-between items-baseline">
                           <p className="text-[11px] font-black uppercase text-slate-900">{i.subtitle} @ {i.title}</p>
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{i.fromYear} — {i.toYear}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{i.description}</p>
                      </div>
                    ))}
                  </section>
                  <section>
                    <h4 className="pdf-label"><Box size={10}/> Projects</h4>
                    {projects.map(p => (
                      <div key={p.id} className="mt-4">
                         <div className="flex justify-between items-baseline">
                            <p className="text-[11px] font-black uppercase text-slate-900">{p.title}</p>
                            <span className="text-[8px] font-bold text-slate-400">{p.fromYear}</span>
                         </div>
                         <p className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider">{p.subtitle}</p>
                         <p className="text-[10px] text-slate-600 mt-1">{p.description}</p>
                      </div>
                    ))}
                  </section>
                  <section>
                    <h4 className="pdf-label"><Award size={10}/> Activities</h4>
                    {activities.map(a => (
                      <div key={a.id} className="mt-4">
                        <div className="flex justify-between items-baseline">
                           <p className="text-[10px] font-black uppercase leading-tight text-slate-900">{a.title}</p>
                           <span className="text-[8px] font-bold text-slate-400">{a.fromYear}</span>
                        </div>
                        <p className="text-[9px] text-slate-600 italic mt-1">{a.subtitle}: {a.description}</p>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel { background: rgba(15, 23, 42, 0.4); }
        .input-card { background: rgba(255, 255, 255, 0.02); padding: 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .cyber-input { width: 100%; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: #fff; font-size: 0.75rem; font-weight: 600; outline: none; }
        .cyber-input-sm { width: 100%; background: transparent; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 8px 4px; color: #fff; font-size: 0.7rem; font-weight: 600; outline: none; }
        .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #fff; display: flex; align-items: center; gap: 8px; }
        .pdf-label { font-size: 10px; font-weight: 900; text-transform: uppercase; border-left: 5px solid #000; padding-left: 10px; display: flex; align-items: center; gap: 8px; color: #000; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .resume-scale-wrapper {
          transform: scale(0.6); 
          transform-origin: top center;
          width: 210mm;
          height: 180mm;
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;