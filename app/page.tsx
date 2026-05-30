'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { FloatingPaths } from '@/components/ui/background-paths'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { GLSLHills } from '@/components/ui/glsl-hills'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { ReplyIQImageComparison } from '@/components/landing/ReplyIQImageComparison'
import { ReplyIQStoryScroll } from '@/components/landing/ReplyIQStoryScroll'
import { ReplyIQLightningSplit } from '@/components/landing/ReplyIQLightningSplit'
import { ReplyIQFooter } from '@/components/landing/ReplyIQFooter'
import { ReplyIQCpuFeatures } from '@/components/ui/demo-cpu'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { AboutSection } from '@/components/landing/AboutSection'
import { ContactSection } from '@/components/landing/ContactSection'
import Link from 'next/link'

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-black selection:bg-purple-500/30 font-sans">
      
      {/* NAVIGATION BAR */}
      <LandingNavbar />
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Animated SVG Lines */}
         <FloatingPaths position={1} />
         <FloatingPaths position={-1} />
         
         {/* Subtle Grid Pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
         
         {/* Ambient Glows */}
         <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
         
      </div>

      {/* Interactive Cursor Spotlight */}
      <Spotlight size={600} className="z-10 mix-blend-screen opacity-50" />

      {/* CONTENT GRID */}
      <div className="relative z-10 w-full min-h-screen max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center px-6 md:px-12 xl:px-24">
        
        {/* LEFT COLUMN - Typography & CTA */}
        <div className="flex-1 flex flex-col justify-center items-start pt-32 lg:pt-0 pb-12 lg:pb-0 z-30 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 pointer-events-auto shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
            <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">ReplyIQ OS v2.0 Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neutral-500 mb-6 leading-[1.1] pb-2"
          >
            Autonomous <br/>
            Sales Agent.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-neutral-400 max-w-xl mb-10 leading-relaxed font-light"
          >
            The intelligent operating system for modern revenue teams. Score leads, predict churn, and let AI agents handle conversations 24/7. Turn every interaction into closed won.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4 pointer-events-auto"
          >
            <Link href="/inbox">
              <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-neutral-200 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - 3D Visual & Floating Cards */}
        <div className="flex-1 w-full h-[60vh] lg:h-screen relative z-20 lg:absolute lg:right-0 lg:w-[55%]">
           
           {/* The 3D Scene - Scaled to break boundaries */}
           <div className="absolute inset-0 scale-[1.2] lg:scale-[1.3] translate-x-10 lg:translate-x-16 xl:translate-x-24 origin-center pointer-events-auto">
             <SplineScene 
               scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
               className="w-full h-full cursor-grab active:cursor-grabbing"
             />
           </div>
        </div>

      </div>
      
      {/* SECTIONS WITH GLSL BACKGROUND */}
      <div className="relative z-0 w-full">
        {/* Sticky GLSL Background */}
        <div className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none z-0">
           <GLSLHills className="opacity-60 w-full h-full" />
        </div>

      {/* DASHBOARD SCROLL ANIMATION SECTION (Transparent to show GLSL) */}
      <div id="features" className="relative z-10 w-full bg-transparent flex flex-col items-center justify-center border-t border-white/5 pt-10 -mt-[100vh]">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4">
                One Platform. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  Complete Revenue Intelligence.
                </span>
              </h1>
              <p className="text-neutral-400 text-base md:text-xl max-w-3xl mx-auto mt-6 font-light leading-relaxed">
                ReplyIQ unifies AI Lead Scoring, Sentiment Analysis, Workflow Automation, AI Sales Agents, Churn Prediction and Customer Intelligence into a single platform.
              </p>
            </>
          }
        >
          {/* FAKE DASHBOARD UI */}
          <div className="flex w-full h-full text-white bg-neutral-950 font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 hidden md:flex flex-col p-4 bg-black/40">
              <div className="flex items-center gap-2 mb-10 px-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20"></div>
                <span className="font-bold text-xl tracking-wide">ReplyIQ</span>
              </div>
              <nav className="space-y-1.5 text-sm text-neutral-400 font-medium">
                <div className="px-3 py-2.5 rounded-lg bg-white/10 text-white flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div> AI Sales Agent
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition flex items-center gap-3 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 opacity-60"></div> AI Lead Scoring
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition flex items-center gap-3 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-60"></div> Sentiment Analysis
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition flex items-center gap-3 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-60"></div> Workflow Builder
                </div>
                <div className="px-3 py-2.5 rounded-lg hover:bg-white/5 transition flex items-center gap-3 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-60"></div> Churn Shield
                </div>
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col bg-black/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">System Healthy</div>
                  <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                  <div className="text-neutral-500 text-sm font-medium mb-1">Active Leads Scored</div>
                  <div className="text-4xl font-bold tracking-tight">1,248</div>
                  <div className="text-green-400/90 text-sm mt-3 flex items-center gap-1"><span className="text-green-400">↑</span> 24% from last week</div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                  <div className="text-neutral-500 text-sm font-medium mb-1">AI Agent Responses</div>
                  <div className="text-4xl font-bold tracking-tight">8,592</div>
                  <div className="text-green-400/90 text-sm mt-3 flex items-center gap-1"><span className="text-green-400">↑</span> 12% automation rate</div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                  <div className="text-neutral-500 text-sm font-medium mb-1">Churn Risk Prevented</div>
                  <div className="text-4xl font-bold tracking-tight">34</div>
                  <div className="text-blue-400/90 text-sm mt-3 flex items-center gap-1">Protected $12,400 ARR</div>
                </div>
              </div>

              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
                <h3 className="text-lg font-medium text-white/90 relative z-10">AI Sentiment Heatmap</h3>
                <div className="w-full h-48 flex items-end gap-2 md:gap-3 relative z-10 mt-6">
                   {[40, 70, 45, 90, 65, 80, 100, 85, 60, 75, 95, 85].map((h, i) => (
                     <div key={i} className="flex-1 bg-gradient-to-t from-purple-600/40 to-blue-400/60 rounded-t-md hover:from-purple-500/60 hover:to-blue-300/80 transition-all cursor-crosshair group relative" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">
                          {h}% Positive
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* COMPARISON SLIDER SECTION */}
      <ReplyIQImageComparison />

      {/* STORY SCROLL SECTION */}
      <ReplyIQStoryScroll />

      {/* NEURAL CORE CPU FEATURES SECTION (Transparent to show GLSL) */}
      <div className="relative z-10 w-full min-h-screen bg-transparent flex flex-col items-center justify-center border-t border-white/5">
        <ReplyIQCpuFeatures />
      </div>

      </div>

      {/* LIGHTNING SPLIT SECTION */}
      <ReplyIQLightningSplit />

      {/* ABOUT & CONTACT SECTIONS */}
      <AboutSection />
      <ContactSection />

      {/* FOOTER SECTION */}
      <ReplyIQFooter />

    </main>
  )
}
