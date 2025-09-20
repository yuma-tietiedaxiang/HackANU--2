import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  Clock,
  FileText,
  Target,
  DollarSign,
  Users,
  Award,
  Brain,
  Lightbulb
} from 'lucide-react';

interface PlanGeneratorProps {
  companyData: any;
  selectedTemplate: string;
  onPlanGenerated: (plan: any) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export function PlanGenerator({ 
  companyData, 
  selectedTemplate, 
  onPlanGenerated, 
  isGenerating, 
  setIsGenerating 
}: PlanGeneratorProps) {
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generationComplete, setGenerationComplete] = useState(false);

  const templateNames = {
    'aea-innovate': "Australia's Economic Accelerator - Innovate Project Plan",
    'gov-procurement': 'Government Procurement & Vendor Onboarding',
    'accelerator-generic': 'Accelerator Program Application'
  };

  const generationSteps = [
    { step: 'Analyzing company profile...', duration: 2000 },
    { step: 'Mapping to template structure...', duration: 2500 },
    { step: 'Generating project objectives...', duration: 3000 },
    { step: 'Creating milestone framework...', duration: 2000 },
    { step: 'Calculating budget allocations...', duration: 2500 },
    { step: 'Developing risk management plan...', duration: 2000 },
    { step: 'Optimizing for compliance...', duration: 1500 },
    { step: 'Finalizing documentation...', duration: 1000 }
  ];

  const startGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationComplete(false);
    
    let currentStepIndex = 0;
    let totalProgress = 0;
    
    const progressStep = () => {
      if (currentStepIndex < generationSteps.length) {
        const step = generationSteps[currentStepIndex];
        setCurrentStep(step.step);
        
        const stepProgress = 100 / generationSteps.length;
        const targetProgress = totalProgress + stepProgress;
        
        // Animate progress for this step
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / step.duration, 1);
          setGenerationProgress(totalProgress + (stepProgress * progress));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            totalProgress = targetProgress;
            currentStepIndex++;
            setTimeout(progressStep, 500);
          }
        };
        animate();
      } else {
        // Generation complete
        setTimeout(() => {
          setGenerationComplete(true);
          setCurrentStep('Project plan generated successfully!');
          
          // Generate mock project plan based on template
          const mockPlan = generateMockPlan(selectedTemplate, companyData);
          onPlanGenerated(mockPlan);
          setIsGenerating(false);
        }, 1000);
      }
    };
    
    progressStep();
  };

  const generateMockPlan = (templateId: string, companyData: any) => {
    if (templateId === 'aea-innovate') {
      return {
        templateId,
        templateName: templateNames[templateId as keyof typeof templateNames],
        sections: {
          projectAim: `To advance ${companyData.name}'s AI-powered business solutions from Technology Readiness Level 6 to TRL 8, establishing a commercially viable platform that transforms digital operations for SMB clients while securing intellectual property and market positioning.`,
          
          projectObjectives: [
            {
              objective: "Develop and validate scalable AI platform architecture",
              specific: "Create cloud-native AI platform serving 100+ concurrent SMB clients",
              measurable: "Achieve 99.9% uptime and <200ms response times",
              attainable: "Leverage existing AWS infrastructure and team expertise",
              relevant: "Direct pathway to commercial deployment",
              timely: "Complete within 18 months"
            },
            {
              objective: "Secure comprehensive intellectual property protection",
              specific: "File 3 patent applications for core AI algorithms",
              measurable: "Obtain provisional patents within 6 months",
              attainable: "Engage IP legal team and technical documentation",
              relevant: "Essential for competitive advantage and funding",
              timely: "Complete initial filings by Month 6"
            },
            {
              objective: "Establish strategic industry partnerships",
              specific: "Secure partnerships with 2 major technology integrators",
              measurable: "Signed MOUs worth minimum $500K each",
              attainable: "Current discussions with 5 potential partners",
              relevant: "Critical for market penetration and validation",
              timely: "Execute partnerships by Month 12"
            },
            {
              objective: "Achieve revenue generation milestones",
              specific: "Generate $200K ARR from pilot customer deployments",
              measurable: "Minimum 20 paying customers with average $10K/year",
              attainable: "Based on current pipeline and conversion rates",
              relevant: "Demonstrates commercial viability for Series A",
              timely: "Reach target by Month 15"
            }
          ],
          
          scopeAndImplementation: `This project will transform ${companyData.name}'s existing AI prototype into a production-ready commercial platform. 

INCLUDED IN SCOPE:
• Platform architecture redesign for enterprise scalability
• Implementation of advanced AI algorithms for business process automation
• Development of secure, multi-tenant SaaS infrastructure
• Creation of comprehensive API ecosystem for third-party integrations
• Establishment of robust data privacy and security frameworks
• Integration with major business software platforms (Salesforce, HubSpot, etc.)
• Development of customer onboarding and support systems
• Implementation of usage analytics and business intelligence features

NOT INCLUDED IN SCOPE:
• Mobile application development (planned for Phase 2)
• International market expansion (separate initiative)
• Acquisition of competitor technologies
• Hardware infrastructure procurement (cloud-only approach)`,

          projectParticipants: `Lead Organisation: ${companyData.name}
Founded: ${companyData.founded}
Industry: ${companyData.industry}
Team Size: ${companyData.size}

Key Personnel:
• ${companyData.contactInfo?.email?.split('@')[0] || 'Project Lead'} - Chief Executive Officer & Lead Entrepreneur
• Technical Team: ${companyData.capabilities?.slice(0, 3).join(', ')} specialists
• Advisory Board: Industry experts in AI, SaaS scaling, and regulatory compliance

Participating Organizations:
• ${companyData.name} (Lead) - Platform development and commercialization
• University Research Partner - Advanced AI algorithm optimization
• Industry Technology Partner - Integration and deployment support`,

          partnerOrganisations: `Strategic partnerships have been established to enhance project capabilities:

University of Technology Sydney - AI Research Collaboration
• Role: Advanced algorithm development and optimization
• Contribution: Research expertise, graduate student support, lab facilities
• Value: $150,000 in-kind research and development

TechAccelerator Partners Pty Ltd - Commercialization Support  
• Role: Market validation and customer acquisition support
• Contribution: Industry connections, sales expertise, marketing resources
• Value: $100,000 in-kind services and network access`,

          budget: {
            totalFunding: 450000,
            breakdown: [
              { category: "Personnel (60%)", amount: 270000, description: "Development team salaries, contractor fees" },
              { category: "Technology Infrastructure (20%)", amount: 90000, description: "Cloud services, software licenses, development tools" },
              { category: "Intellectual Property (8%)", amount: 36000, description: "Patent applications, legal fees, IP protection" },
              { category: "Market Validation (7%)", amount: 31500, description: "Customer research, pilot deployments, user testing" },
              { category: "Administration (5%)", amount: 22500, description: "Project management, reporting, compliance" }
            ],
            paymentSchedule: [
              { milestone: "Project Commencement", percentage: 30, amount: 135000 },
              { milestone: "Platform Architecture Complete", percentage: 25, amount: 112500 },
              { milestone: "Beta Version Deployment", percentage: 25, amount: 112500 },
              { milestone: "Commercial Launch", percentage: 20, amount: 90000 }
            ]
          },
          
          milestones: [
            {
              phase: "Phase 1: Foundation & Architecture",
              outcome: "Platform architecture designed and core infrastructure established",
              startDate: "2024-03-01",
              endDate: "2024-06-30",
              measure: "Architectural documentation approved, development environment configured, team onboarded"
            },
            {
              phase: "Phase 2: Core Development",
              outcome: "AI algorithms implemented and integrated into scalable platform",
              startDate: "2024-07-01", 
              endDate: "2024-11-30",
              measure: "Platform achieving target performance metrics, automated testing suite operational"
            },
            {
              phase: "Phase 3: Pilot & Validation",
              outcome: "Beta platform deployed with pilot customers, feedback incorporated",
              startDate: "2024-12-01",
              endDate: "2025-04-30", 
              measure: "10 pilot customers onboarded, 90% satisfaction rating, technical issues resolved"
            },
            {
              phase: "Phase 4: Commercial Launch",
              outcome: "Full commercial platform launched with paying customers",
              startDate: "2025-05-01",
              endDate: "2025-08-31",
              measure: "20+ paying customers, $200K ARR achieved, Series A preparation complete"
            }
          ],

          riskManagement: {
            assumptions: [
              {
                assumption: "Market demand for AI-powered SMB solutions will continue growing at 25% annually",
                mitigation: "Continuous market research, flexible platform design to adapt to changing needs"
              },
              {
                assumption: "Current team capabilities are sufficient for technical implementation",
                mitigation: "Skills gap analysis completed, training budget allocated, contractor backup identified"
              }
            ],
            constraints: [
              {
                constraint: "18-month timeline requires efficient resource allocation and milestone management",
                mitigation: "Agile development methodology, monthly progress reviews, risk-based prioritization"
              },
              {
                constraint: "Budget limitations require careful cost management and ROI optimization",
                mitigation: "Detailed budget tracking, monthly financial reviews, contingency fund (10%) maintained"
              }
            ],
            technical: [
              {
                risk: "Scaling challenges with AI algorithms under high concurrent user loads",
                mitigation: "Load testing throughout development, cloud-native architecture, performance monitoring"
              },
              {
                risk: "Integration complexity with multiple third-party business software platforms",
                mitigation: "API-first design, comprehensive testing, fallback integration methods"
              }
            ],
            external: [
              {
                dependency: "AWS cloud infrastructure availability and reliability",
                mitigation: "Multi-region deployment, disaster recovery plan, alternative cloud provider evaluation"
              },
              {
                dependency: "Regulatory compliance requirements for data privacy and AI governance",
                mitigation: "Legal consultation, compliance-by-design approach, regular audit preparation"
              }
            ]
          }
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          companyName: companyData.name,
          templateVersion: "1.0",
          lastModified: new Date().toISOString()
        }
      };
    }
    
    // Default mock plan for other templates
    return {
      templateId,
      templateName: templateNames[templateId as keyof typeof templateNames] || 'Project Plan',
      sections: {
        projectAim: `Strategic project plan for ${companyData.name} to achieve next-level growth and market positioning.`,
        projectObjectives: [
          {
            objective: "Establish market leadership in target segment",
            specific: "Capture 15% market share in core business area",
            measurable: "Increase revenue by 200% within 12 months",
            attainable: "Based on current growth trajectory and market analysis",
            relevant: "Aligns with company vision and strategic goals",
            timely: "Complete within 12-month timeframe"
          }
        ]
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        companyName: companyData.name,
        templateVersion: "1.0",
        lastModified: new Date().toISOString()
      }
    };
  };

  if (!isGenerating && !generationComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Generation Preview */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>AI Project Plan Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white mb-3">Company Profile</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{companyData.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{companyData.industry} • {companyData.size}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>{companyData.services?.length || 0} services • {companyData.capabilities?.length || 0} capabilities</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white mb-3">Selected Template</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{templateNames[selectedTemplate as keyof typeof templateNames]}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Award className="w-4 h-4 text-green-400" />
                    <span>Government approved template</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-white mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>What Our AI Will Generate</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: 'SMART Objectives', desc: 'Specific, measurable goals' },
                  { icon: DollarSign, label: 'Budget Planning', desc: 'Detailed cost breakdown' },
                  { icon: Clock, label: 'Milestone Timeline', desc: 'Phased implementation' },
                  { icon: Users, label: 'Risk Management', desc: 'Comprehensive risk plan' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="text-center p-4 bg-gray-800/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <item.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="text-white text-sm mb-1">{item.label}</h4>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={startGeneration}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Generate Project Plan
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <span>Generating Your Project Plan</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Progress</span>
              <span className="text-white">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-3" />
          </div>

          {/* Current Step */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <h3 className="text-white text-lg mb-2">AI Processing</h3>
              <p className="text-gray-400">{currentStep}</p>
            </div>
          </div>

          {/* Generation Steps Preview */}
          <div className="space-y-2">
            <h4 className="text-white text-sm mb-3">Generation Process:</h4>
            {generationSteps.map((step, index) => (
              <div key={index} className={`flex items-center space-x-3 text-sm ${
                generationSteps.findIndex(s => s.step === currentStep) >= index 
                  ? 'text-green-400' 
                  : generationSteps.findIndex(s => s.step === currentStep) === index - 1
                  ? 'text-purple-400'
                  : 'text-gray-500'
              }`}>
                {generationSteps.findIndex(s => s.step === currentStep) > index ? (
                  <CheckCircle className="w-4 h-4" />
                ) : generationSteps.findIndex(s => s.step === currentStep) === index ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <div className="w-4 h-4 border border-gray-600 rounded-full" />
                )}
                <span>{step.step}</span>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {generationComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4 pt-4 border-t border-gray-700"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-white text-lg mb-2">Generation Complete!</h3>
                <p className="text-gray-400">Your project plan is ready for review and customization.</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}