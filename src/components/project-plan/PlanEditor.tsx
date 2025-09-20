import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  FileText, 
  Edit, 
  Download, 
  Save, 
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Target,
  DollarSign,
  Clock,
  Users,
  Shield,
  Lightbulb,
  ArrowLeft,
  FileCheck,
  Printer
} from 'lucide-react';

interface PlanEditorProps {
  generatedPlan: any;
  companyData: any;
  selectedTemplate: string;
  onBack: () => void;
}

export function PlanEditor({ generatedPlan, companyData, selectedTemplate, onBack }: PlanEditorProps) {
  const [planData, setPlanData] = useState(generatedPlan);
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleEdit = (sectionKey: string, value: string) => {
    setIsEditing(sectionKey);
    setEditingValue(value);
  };

  const saveEdit = (sectionKey: string) => {
    const keys = sectionKey.split('.');
    const newPlanData = { ...planData };
    let current = newPlanData.sections;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = editingValue;
    
    setPlanData(newPlanData);
    setIsEditing(null);
    setEditingValue('');
    setHasUnsavedChanges(true);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditingValue('');
  };

  const downloadPlan = (format: 'pdf' | 'word') => {
    // Simulate download
    const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyData.name}_Project_Plan.${format === 'pdf' ? 'pdf' : 'docx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'objectives', label: 'Objectives', icon: Target },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'milestones', label: 'Milestones', icon: Clock },
    { id: 'risks', label: 'Risk Management', icon: Shield },
    { id: 'compliance', label: 'Compliance Check', icon: CheckCircle }
  ];

  const complianceCheck = {
    score: 94,
    issues: [
      { type: 'warning', message: 'Consider adding more detail to the IP protection strategy' },
      { type: 'info', message: 'Budget breakdown meets all template requirements' }
    ],
    recommendations: [
      'Add specific patent filing timelines',
      'Include more detailed risk mitigation measures',
      'Consider environmental impact assessment'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              
              <div className="h-6 w-px bg-gray-700" />
              
              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{planData.templateName}</span>
              </CardTitle>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready for Download
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>Company: {companyData.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Generated: {new Date(planData.metadata.generatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <FileCheck className="w-4 h-4" />
              <span>Template: v{planData.metadata.templateVersion}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Section
          </Button>
          
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => downloadPlan('word')}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Word
          </Button>
          
          <Button
            onClick={() => downloadPlan('pdf')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <Card className="bg-gray-900/50 border-gray-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white text-sm">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full justify-start ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Aim */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white">Project Aim</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('projectAim', planData.sections.projectAim)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {isEditing === 'projectAim' ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit('projectAim')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                        {planData.sections.projectAim}
                      </p>
                    )}
                  </div>

                  {/* Scope and Implementation */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white">Scope & Implementation</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit('scopeAndImplementation', planData.sections.scopeAndImplementation)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {isEditing === 'scopeAndImplementation' ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit('scopeAndImplementation')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 bg-gray-800/50 p-4 rounded-lg whitespace-pre-line">
                        {planData.sections.scopeAndImplementation}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">SMART Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {planData.sections.projectObjectives?.map((objective: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-blue-500"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white">Objective {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-gray-300">{objective.objective}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-blue-400">Specific:</span>
                              <p className="text-gray-300">{objective.specific}</p>
                            </div>
                            <div>
                              <span className="text-green-400">Measurable:</span>
                              <p className="text-gray-300">{objective.measurable}</p>
                            </div>
                            <div>
                              <span className="text-yellow-400">Attainable:</span>
                              <p className="text-gray-300">{objective.attainable}</p>
                            </div>
                            <div>
                              <span className="text-purple-400">Timely:</span>
                              <p className="text-gray-300">{objective.timely}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-3xl text-white mb-2">
                        ${planData.sections.budget?.totalFunding?.toLocaleString() || '450,000'}
                      </p>
                      <p className="text-gray-400">Total Project Funding</p>
                    </div>

                    <div className="space-y-4">
                      {planData.sections.budget?.breakdown?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div>
                            <p className="text-white">{item.category}</p>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white">${item.amount.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planData.sections.milestones?.map((milestone: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-green-500"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white">{milestone.phase}</h4>
                          <div className="text-right text-sm text-gray-400">
                            <p>{milestone.startDate} - {milestone.endDate}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-2">{milestone.outcome}</p>
                        
                        <div className="text-sm">
                          <span className="text-green-400">Success Measure:</span>
                          <p className="text-gray-300">{milestone.measure}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Risk Management Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="assumptions" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                      <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                      <TabsTrigger value="constraints">Constraints</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                      <TabsTrigger value="external">External</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assumptions" className="space-y-4">
                      {planData.sections.riskManagement?.assumptions?.map((item: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-white mb-2">{item.assumption}</p>
                          <div className="text-sm">
                            <span className="text-blue-400">Mitigation:</span>
                            <p className="text-gray-300">{item.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="constraints" className="space-y-4">
                      {planData.sections.riskManagement?.constraints?.map((item: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-white mb-2">{item.constraint}</p>
                          <div className="text-sm">
                            <span className="text-yellow-400">Mitigation:</span>
                            <p className="text-gray-300">{item.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      {planData.sections.riskManagement?.technical?.map((item: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-white mb-2">{item.risk}</p>
                          <div className="text-sm">
                            <span className="text-red-400">Mitigation:</span>
                            <p className="text-gray-300">{item.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="external" className="space-y-4">
                      {planData.sections.riskManagement?.external?.map((item: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-white mb-2">{item.dependency}</p>
                          <div className="text-sm">
                            <span className="text-purple-400">Mitigation:</span>
                            <p className="text-gray-300">{item.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-3xl text-white mb-2">{complianceCheck.score}%</p>
                    <p className="text-gray-400">Compliance Score</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white">Issues & Recommendations</h4>
                    
                    {complianceCheck.issues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        issue.type === 'warning' 
                          ? 'bg-yellow-500/10 border-l-yellow-500' 
                          : 'bg-blue-500/10 border-l-blue-500'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {issue.type === 'warning' ? (
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-white text-sm">{issue.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white">AI Recommendations</h4>
                    {complianceCheck.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}