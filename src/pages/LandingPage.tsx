import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Shield, 
  Users, 
  Calendar, 
  BarChart3, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  UserCheck,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  FileText,
  MessageSquare,
  Bell
} from "lucide-react";

const LandingPage = () => {
  // Add custom animations
  React.useEffect(() => {
    const animations = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes bounceSubtle {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-4px);
        }
        60% {
          transform: translateY(-2px);
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .animate-slide-in-left {
        animation: slideInLeft 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .animate-bounce-subtle {
        animation: bounceSubtle 3s infinite;
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      
      @keyframes gradientText {
        0%, 100% {
          background-size: 200% 200%;
          background-position: left center;
        }
        50% {
          background-size: 200% 200%;
          background-position: right center;
        }
      }
      
      .animate-gradient-text {
        background: linear-gradient(-45deg, #2195F2, #1976D2, #42A5F5, #2195F2);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientText 3s ease infinite;
      }
      
      @keyframes expandWidth {
        from {
          width: 0%;
        }
        to {
          width: 100%;
        }
      }
      
      .animate-expand-width {
        animation: expandWidth 1.5s ease-out 0.8s forwards;
        width: 0%;
      }
      
      @keyframes pulseButton {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(33, 149, 242, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(33, 149, 242, 0);
        }
      }
      
      .animate-pulse-button {
        animation: pulseButton 2s infinite;
      }
      
      @keyframes twinkle {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.2);
        }
      }
      
      .animate-twinkle {
        animation: twinkle 2s ease-in-out infinite;
      }
      
      @keyframes slideInfinite {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      .animate-slide-infinite {
        animation: slideInfinite 30s linear infinite;
      }
      
      @keyframes slideInFromLeft {
        from {
          opacity: 0;
          transform: translateX(-100px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      @keyframes slideInFromRight {
        from {
          opacity: 0;
          transform: translateX(100px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      @keyframes problemShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
        20%, 40%, 60%, 80% { transform: translateX(3px); }
      }
      
      @keyframes solutionGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(33, 149, 242, 0.1); }
        50% { box-shadow: 0 0 30px rgba(33, 149, 242, 0.3); }
      }
      
      .animate-slide-in-left-scroll {
        opacity: 0;
        transform: translateX(-100px) scale(0.8);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-slide-in-right-scroll {
        opacity: 0;
        transform: translateX(100px) scale(0.8);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .animate-in-view {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
      
      .problem-card:hover {
        animation: problemShake 0.6s ease-in-out;
      }
      
      .solution-card:hover {
        animation: solutionGlow 1.5s ease-in-out;
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = animations;
    document.head.appendChild(styleElement);
    
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const animationType = target.dataset.animation;
          
          if (animationType === 'slide-left') {
            target.classList.add('animate-in-view');
          } else if (animationType === 'slide-right') {
            target.classList.add('animate-in-view');
          }
        }
      });
    }, observerOptions);

    // Observe elements after a short delay to ensure DOM is ready
    setTimeout(() => {
      const animatedElements = document.querySelectorAll('[data-animation]');
      animatedElements.forEach((el) => observer.observe(el));
    }, 100);
    
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <div className="h-8 w-8 bg-[#1e3b93] rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Guardian Pro</span> */}
            <img src="/logo.svg" alt="Guardian Pro" className="h-10" />
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#2195F2] hover:bg-[#2195F2]/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-yellow-100 text-orange-700 hover:bg-yellow-200 border-yellow-300 animate-fade-in-up">
                🏆 #1 Rated 
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                Find & Schedule Support.{" "}
                <br />
                {" "}
                <span style={{color: '#2195F2'}}>Zero Admin Hassle.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                AI-powered matching connects you with verified support workers who 
                understand your needs. Join 5,000+ participants already using GuardianCare+
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">NDIS Registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Police Checked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Insured Workers</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto text-white hover:scale-105 transition-transform duration-200" style={{backgroundColor: '#2195F2'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2195F2'}>
                    Start Your Free Account
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200" style={{borderColor: '#2195F2', color: '#2195F2'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#E3F2FD'}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = 'transparent'}}>
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch 2-min Demo
                </Button>
              </div>

              <div className="flex items-center space-x-2 animate-fade-in-up" style={{animationDelay: '1s'}}>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">4.8/5 from 500+ reviews</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex flex-col gap-6 max-w-md mx-auto">
              {/* Dashboard Preview Cards - Stacked vertically with different rotations */}
              
              {/* Animated Support Worker Section */}
              <div className="space-y-8 transform rotate-3">
                {/* Header with animation */}
                <div className="flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-lg font-bold text-gray-900">Find Support Workers</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">15 Available Now</span>
                  </div>
                </div>

                {/* Support Worker 1 with slide-in animation */}
                <div className="flex items-center space-x-4 px-6 py-6 rounded-xl bg-gray-100 shadow-xs transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-in-left" 
                     style={{animationDelay: '0.4s'}}>
                  <div className="w-12 h-12 rounded-full animate-bounce-subtle flex items-center justify-center text-white font-bold text-lg" 
                       style={{backgroundColor: '#2195F2', animationDelay: '0.6s'}}>
                    SJ
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900">Antony Walters</div>
                    <div className="text-sm text-gray-600">Community Access  • 2.3km away</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
                    <span className="text-sm font-bold text-gray-800">4.9</span>
                  </div>
                </div>
                
                {/* Support Worker 2 with slide-in animation */}
                <div className="flex items-center space-x-4 px-6 py-6 rounded-xl bg-gray-100 shadow-xs transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-slide-in-right" 
                     style={{animationDelay: '0.6s'}}>
                  <div className="w-12 h-12 rounded-full animate-bounce-subtle flex items-center justify-center text-white font-bold text-lg" 
                       style={{backgroundColor: '#2195F2', animationDelay: '0.8s'}}>
                    MC
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900">Lee Min Tsu</div>
                    <div className="text-sm text-gray-600">Daily Personal Activities • 3.1km away</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
                    <span className="text-sm font-bold text-gray-800">4.8</span>
                  </div>
                </div>
                
                {/* Auto-matched banner */}
                <div className="relative animate-fade-in-up" style={{animationDelay: '0.7s'}}>
                  <div className="absolute lg:top-0 top-10 left-10 lg:-left-20 z-10">
                    <div className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 text-sm font-medium shadow-lg animate-bounce-subtle" 
                         style={{backgroundColor: '#fff', animationDelay: '1s'}}>
                      <CheckCircle className="h-4 w-4" />
                      <span>Auto-matched in 30s</span> 
                    </div>
                  </div>
                  
                  {/* CTA Button with animation */}
                  <Button className="w-full text-white px-8 py-6 text-base font-bold rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-xs animate-fade-in-up shadow-xs" 
                          style={{backgroundColor: '#2195F2', animationDelay: '0.8s'}} 
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'} 
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2195F2'}>
                    <span className="animate-float">View All Matches</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section with Sliding Logos */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 font-medium">
              Trusted by leading NDIS providers and participants
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex space-x-12 animate-slide-infinite">
              {/* Logo 1 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">CarePlus</div>
              </div>
              
              {/* Logo 2 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">SupportWorks</div>
              </div>
              
              {/* Logo 3 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">NDIS Connect</div>
              </div>
              
              {/* Logo 4 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">CareLink</div>
              </div>
              
              {/* Logo 5 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">DisabilityCare</div>
              </div>
              
              {/* Logo 6 */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">SupportHub</div>
              </div>
              
              {/* Duplicate logos for seamless loop */}
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">CarePlus</div>
              </div>
              
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">SupportWorks</div>
              </div>
              
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">NDIS Connect</div>
              </div>
              
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">CareLink</div>
              </div>
              
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">DisabilityCare</div>
              </div>
              
              <div className="flex items-center justify-center min-w-[200px] h-16 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
                <div className="text-xl font-bold text-gray-700">SupportHub</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              From Frustration to <span style={{color: '#2195F2'}}>Seamless Care</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto">
              We understand the challenges you face. That's why we built a platform that 
              eliminates every pain point.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Problems Column */}
            <div className="space-y-8">
              <div className="text-center lg:text-left animate-slide-in-left-scroll" data-animation="slide-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Pain Points you're addressing:</h3>
                <p className="text-lg text-gray-600">The daily struggles that drain your time and energy</p>
              </div>
              <div className="space-y-6">
                {/* Problem 1 */}
                <div className="problem-card flex items-start space-x-4 p-6 bg-red-50 border border-red-100 rounded-xl transition-all duration-300 hover:border-red-200 hover:shadow-lg animate-slide-in-left-scroll" data-animation="slide-left" style={{transitionDelay: '0.1s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Complexity & Time Drain</h4>
                    <p className="text-gray-600">Manually finding and scheduling supports is time-consuming, frustrating, and often leads to gaps in care.</p>
                  </div>
                </div>
                {/* Problem 2 */}
                <div className="problem-card flex items-start space-x-4 p-6 bg-orange-50 border border-orange-100 rounded-xl transition-all duration-300 hover:border-orange-200 hover:shadow-lg animate-slide-in-left-scroll" data-animation="slide-left" style={{transitionDelay: '0.2s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Lack of Control & Choice</h4>
                    <p className="text-gray-600">Guardians/participants often feel they have limited options or control over who provides care and when.</p>
                  </div>
                </div>
                {/* Problem 3 */}
                <div className="problem-card flex items-start space-x-4 p-6 bg-yellow-50 border border-yellow-100 rounded-xl transition-all duration-300 hover:border-yellow-200 hover:shadow-lg animate-slide-in-left-scroll" data-animation="slide-left" style={{transitionDelay: '0.3s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Trust & Reliability</h4>
                    <p className="text-gray-600">Finding trustworthy and reliable support workers can be difficult.</p>
                  </div>
                </div>
                {/* Problem 4 */}
                <div className="problem-card flex items-start space-x-4 p-6 bg-blue-50 border border-blue-100 rounded-xl transition-all duration-300 hover:border-blue-200 hover:shadow-lg animate-slide-in-left-scroll" data-animation="slide-left" style={{transitionDelay: '0.4s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Communication Gaps</h4>
                    <p className="text-gray-600">Difficulty coordinating between multiple carers and staying updated on care delivery.</p>
                  </div>
                </div>
                {/* Problem 5 */}
                <div className="problem-card flex items-start space-x-4 p-6 bg-green-50 border border-green-100 rounded-xl transition-all duration-300 hover:border-green-200 hover:shadow-lg animate-slide-in-left-scroll" data-animation="slide-left" style={{transitionDelay: '0.5s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Administrative Burden</h4>
                    <p className="text-gray-600">Managing timesheets, invoices, and compliance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions Column */}
            <div className="space-y-8">
              <div className="text-center lg:text-left animate-slide-in-right-scroll" data-animation="slide-right">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why this works:</h3>
                <p className="text-lg text-gray-600">How our approach solves these pain points</p>
              </div>
              <div className="space-y-6">
                {/* Solution 1 */}
                <div className="solution-card flex items-start space-x-4 p-6 bg-blue-50 border border-blue-100 rounded-xl transition-all duration-300 hover:border-blue-200 hover:shadow-xl animate-slide-in-right-scroll" data-animation="slide-right" style={{transitionDelay: '0.2s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Empowers... take full control</h4>
                    <p className="text-gray-600">Addresses the desire for autonomy and agency.</p>
                  </div>
                </div>
                {/* Solution 2 */}
                <div className="solution-card flex items-start space-x-4 p-6 bg-green-50 border border-green-100 rounded-xl transition-all duration-300 hover:border-green-200 hover:shadow-xl animate-slide-in-right-scroll" data-animation="slide-right" style={{transitionDelay: '0.3s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Connecting them directly</h4>
                    <p className="text-gray-600">Highlights the benefit of disintermediation, potentially leading to better choice and cost-effectiveness.</p>
                  </div>
                </div>
                {/* Solution 3 */}
                <div className="solution-card flex items-start space-x-4 p-6 bg-purple-50 border border-purple-100 rounded-xl transition-all duration-300 hover:border-purple-200 hover:shadow-xl animate-slide-in-right-scroll" data-animation="slide-right" style={{transitionDelay: '0.4s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Trusted, vetted support workers</h4>
                    <p className="text-gray-600">Addresses the crucial need for reliability and safety.</p>
                  </div>
                </div>
                {/* Solution 4 */}
                <div className="solution-card flex items-start space-x-4 p-6 bg-yellow-50 border border-yellow-100 rounded-xl transition-all duration-300 hover:border-yellow-200 hover:shadow-xl animate-slide-in-right-scroll" data-animation="slide-right" style={{transitionDelay: '0.5s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Flexible scheduling</h4>
                    <p className="text-gray-600">Speaks to the need for adaptability in care.</p>
                  </div>
                </div>
                {/* Solution 5 */}
                <div className="solution-card flex items-start space-x-4 p-6 bg-pink-50 border border-pink-100 rounded-xl transition-all duration-300 hover:border-pink-200 hover:shadow-xl animate-slide-in-right-scroll" data-animation="slide-right" style={{transitionDelay: '0.6s'}}>
                  <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Seamless care management, all in one intuitive app</h4>
                    <p className="text-gray-600">Promises ease of use and comprehensive functionality, hitting administrative pain points.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How it <span style={{color: '#2195F2'}}>Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Choose your journey below to see how Guardian Care Plus simplifies your experience
            </p>
            
            {/* Role Toggle Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button className="text-white px-6 py-3 rounded-lg" style={{backgroundColor: '#2195F2'}}>
                <Users className="mr-2 h-4 w-4" />
                I'm a Participant/Guardian
              </Button>
              <Button variant="outline" className="px-6 py-3 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50">
                <UserCheck className="mr-2 h-4 w-4" />
                I'm a Support Worker
              </Button>
            </div>
          </div>

          {/* Steps Flow */}
          <div className="relative mb-12">
            {/* Step Numbers with Lines */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center">
                {/* Step 1 Circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold z-10" style={{backgroundColor: '#2195F2'}}>
                  01
                </div>
                
                {/* Line 1-2 */}
                <div className="w-16 lg:w-96 h-0.5 bg-blue-200 mx-4"></div>
                
                {/* Step 2 Circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold z-10" style={{backgroundColor: '#2195F2'}}>
                  02
                </div>
                
                {/* Line 2-3 */}
                <div className="w-16 lg:w-96 h-0.5 bg-blue-200 mx-4"></div>
                
                {/* Step 3 Circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold z-10" style={{backgroundColor: '#2195F2'}}>
                  03
                </div>
              </div>
            </div>

            {/* Step Content Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Create Profile</h3>
                  <p className="text-lg text-gray-700 mb-4">Tell us your support needs and preference</p>
                  <p className="text-sm text-gray-500">
                    Quick 5-minute setup with your goals, location, and care requirements
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get Matched</h3>
                  <p className="text-lg text-gray-700 mb-4">AI suggests compatible workers in your area</p>
                  <p className="text-sm text-gray-500">
                    Our smart algorithm considers skills, availability, and personality fit
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Book & Manage</h3>
                  <p className="text-lg text-gray-700 mb-4">Schedule, communicate, and enjoy seamless support</p>
                  <p className="text-sm text-gray-500">
                    Everything in one place - from booking to invoicing
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link to="/register">
              <Button size="lg" className="text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                      style={{backgroundColor: '#2195F2'}} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1976D2'} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2195F2'}>
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Powerful Features for <span style={{color: '#2195F2'}}>Better Care</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Everything you need to manage support services efficiently, all in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr">
            {/* AI Smart Matching - Large Card (2x3 on desktop) */}
            <div className="md:col-span-2 lg:col-span-2 md:row-span-2">
              <Card className="h-full border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">AI Powered</Badge>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">AI Smart Matching</CardTitle>
                  <CardDescription className="text-gray-600">
                    Advanced algorithms match you with the perfect support workers based on skills, personality, and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">99.7% successful matches</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Average match time: 30 seconds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">AI learns your preferences</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shift Management - Wide Card */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">Popular</Badge>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Shift Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Intuitive calendar interface for scheduling and managing all your support sessions
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* NDIS Claiming - Medium Card */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-700 border-green-200">Time Saver</Badge>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Invoice Management</CardTitle>
                  <CardDescription className="text-gray-600">
                    Automated invoicing and claiming process that saves you hours of paperwork
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Smart Notifications - Medium Card */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-700 border-green-200">Real-time</Badge>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Smart Notifications</CardTitle>
                  <CardDescription className="text-gray-600">
                    Intelligent alerts and reminders that keep everyone informed and on track
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Secure Messaging - Wide Card */}
            <div className="md:col-span-2 lg:col-span-2">
              <Card className="h-full border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">Secure</Badge>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">Secure Messaging</CardTitle>
                  <CardDescription className="text-gray-600">
                    Compliant communication platform for participants and support workers with end-to-end encryption
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Built for Everyone in Your Care Network
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're receiving care, providing support, or managing services, 
              Guardian Pro has the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-16 w-16 bg-[#1e3b93]/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-[#1e3b93]" />
                </div>
                <CardTitle className="text-[#1e3b93]">Participants</CardTitle>
                <CardDescription>
                  Access quality care services, manage your support team, and track your care journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/register?role=participant">
                  <Button variant="outline" className="w-full">
                    Join as Participant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-green-600">Support Workers</CardTitle>
                <CardDescription>
                  Find meaningful work, manage your schedule, and make a difference in people's lives.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/register?role=supportWorker">
                  <Button variant="outline" className="w-full">
                    Join as Worker
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">Guardians</CardTitle>
                <CardDescription>
                  Oversee care for your loved ones, coordinate services, and stay informed about their wellbeing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/register?role=guardian">
                  <Button variant="outline" className="w-full">
                    Join as Guardian
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Coordinators</CardTitle>
                <CardDescription>
                  Manage your organization, oversee operations, and ensure quality service delivery.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Link to="/register?role=admin"> */}
                  <Button variant="outline" className="w-full">
                    Join as Coordinator
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                {/* </Link> */}
              </CardContent>
            </Card>

            {/* add a plan management card here */}
            {/* <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
            </Card> */}
            
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1e3b93] py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Care Experience?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of participants and support workers who trust Guardian Pro 
              for their care management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-[#1e3b93] hover:bg-gray-100 w-full sm:w-auto">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg"   className="text-white hover:bg-[#2195F2]/90 bg-[#2195F2] w-full sm:w-auto">
                  Sign In
                </Button>
              {/* <Button className="bg-[#2195F2] hover:bg-[#2195F2]/90 ">Sign In</Button> */}

              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
                {/* <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-[#1e3b93] rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Guardian Pro</span>
                </div> */}
                <img src="/logo.svg" alt="Guardian Pro" className="h-10" />
              <p className="text-gray-400">
                Your Comprehensive Caregiving Assistant
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-400 hover:text-white">Get Started</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#training" className="text-gray-400 hover:text-white">Training</a></li>
                <li><a href="#resources" className="text-gray-400 hover:text-white">Resources</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">1-800-GUARDIAN</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">support@guardianpro.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Available Nationwide</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Guardian Pro. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 