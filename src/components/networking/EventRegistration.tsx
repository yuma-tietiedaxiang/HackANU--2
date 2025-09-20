import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  User,
  Mail,
  Phone,
  Building,
  FileText,
  CreditCard,
  Calendar,
  MapPin,
  DollarSign,
  Zap,
  Upload,
  AlertCircle,
  Sparkles,
  Send,
  Save
} from 'lucide-react';

interface RegistrationForm {
  eventId: string;
  eventTitle: string;
  requiredFields: string[];
  optionalFields: string[];
  applicationRequired: boolean;
  paymentRequired: boolean;
  price: string;
  deadline: string;
}

const mockRegistrations: RegistrationForm[] = [
  {
    eventId: 'disrupt-2024',
    eventTitle: 'TechCrunch Disrupt 2024',
    requiredFields: ['company_name', 'founder_name', 'email', 'phone', 'company_description', 'pitch_deck'],
    optionalFields: ['website', 'linkedin', 'twitter', 'team_size', 'funding_stage'],
    applicationRequired: true,
    paymentRequired: true,
    price: '$2,995',
    deadline: '2024-02-28'
  },
  {
    eventId: 'yc-startup-school',
    eventTitle: 'Y Combinator Startup School',
    requiredFields: ['company_name', 'founder_name', 'email', 'company_description'],
    optionalFields: ['website', 'team_size', 'previous_experience'],
    applicationRequired: true,
    paymentRequired: false,
    price: 'Free',
    deadline: '2024-01-25'
  },
  {
    eventId: 'ai-summit-austin',
    eventTitle: 'AI Innovation Summit',
    requiredFields: ['name', 'email', 'company', 'job_title'],
    optionalFields: ['linkedin', 'interests', 'dietary_requirements'],
    applicationRequired: false,
    paymentRequired: true,
    price: '$899',
    deadline: '2024-02-15'
  }
];

export function EventRegistration() {
  const [selectedEvent, setSelectedEvent] = useState<string>('disrupt-2024');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFillEnabled, setAutoFillEnabled] = useState(true);
  const [registrationStep, setRegistrationStep] = useState<'form' | 'payment' | 'confirmation'>('form');

  const currentRegistration = mockRegistrations.find(r => r.eventId === selectedEvent) || mockRegistrations[0];

  // Mock company data for auto-fill
  const companyData = {
    company_name: "TechStart Solutions",
    founder_name: "Alex Johnson",
    email: "alex@techstartsolutions.com",
    phone: "+1 (555) 123-4567",
    company_description: "AI-powered business solutions startup specializing in digital transformation services for SMBs.",
    website: "www.techstartsolutions.com",
    linkedin: "linkedin.com/company/techstartsolutions",
    twitter: "@techstartsolutions",
    team_size: "15-25 employees",
    funding_stage: "Seed",
    job_title: "CEO & Founder",
    name: "Alex Johnson",
    company: "TechStart Solutions"
  };

  const handleAutoFill = () => {
    const autoFilledData: Record<string, any> = {};
    
    [...currentRegistration.requiredFields, ...currentRegistration.optionalFields].forEach(field => {
      if (companyData[field as keyof typeof companyData]) {
        autoFilledData[field] = companyData[field as keyof typeof companyData];
      }
    });
    
    setFormData(autoFilledData);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      if (currentRegistration.paymentRequired) {
        setRegistrationStep('payment');
      } else {
        setRegistrationStep('confirmation');
      }
    }, 2000);
  };

  const handlePayment = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setRegistrationStep('confirmation');
    }, 1500);
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'company_name':
      case 'company':
        return <Building className="w-4 h-4" />;
      case 'founder_name':
      case 'name':
        return <User className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'pitch_deck':
        return <Upload className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      company_name: 'Company Name',
      founder_name: 'Founder Name',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company',
      job_title: 'Job Title',
      company_description: 'Company Description',
      pitch_deck: 'Pitch Deck',
      website: 'Website URL',
      linkedin: 'LinkedIn Profile',
      twitter: 'Twitter Handle',
      team_size: 'Team Size',
      funding_stage: 'Funding Stage',
      interests: 'Areas of Interest',
      dietary_requirements: 'Dietary Requirements',
      previous_experience: 'Previous Experience'
    };
    return labels[field] || field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const completionPercentage = () => {
    const totalFields = currentRegistration.requiredFields.length;
    const filledFields = currentRegistration.requiredFields.filter(field => formData[field]).length;
    return Math.round((filledFields / totalFields) * 100);
  };

  if (registrationStep === 'confirmation') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
      >
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl text-white">Registration Successful!</h2>
          <p className="text-gray-400 text-lg max-w-md">
            You've successfully registered for {currentRegistration.eventTitle}. 
            Confirmation details have been sent to your email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
          <Card className="bg-gray-900/50 border-gray-800 text-center">
            <CardContent className="p-4">
              <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white">Event Added to Calendar</p>
              <p className="text-gray-400 text-sm">With reminders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 text-center">
            <CardContent className="p-4">
              <Mail className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white">Confirmation Sent</p>
              <p className="text-gray-400 text-sm">Check your inbox</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800 text-center">
            <CardContent className="p-4">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white">Networking Activated</p>
              <p className="text-gray-400 text-sm">Profile updated</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setRegistrationStep('form');
              setSelectedEvent('');
              setFormData({});
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Register for Another Event
          </Button>
          
          <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
            View Calendar Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  if (registrationStep === 'payment') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <h3 className="text-white">{currentRegistration.eventTitle}</h3>
                <p className="text-gray-400 text-sm">Registration Fee</p>
              </div>
              <div className="text-right">
                <p className="text-2xl text-white">{currentRegistration.price}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm mb-2 block">Expiry Date</label>
                  <Input
                    placeholder="MM/YY"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">CVV</label>
                  <Input
                    placeholder="123"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm mb-2 block">Cardholder Name</label>
                <Input
                  placeholder="Alex Johnson"
                  value={formData.founder_name || formData.name || ''}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="save-card" />
              <label htmlFor="save-card" className="text-gray-300 text-sm">
                Save payment method for future registrations
              </label>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setRegistrationStep('form')}
                className="flex-1 border-gray-600 text-gray-300"
              >
                Back to Form
              </Button>
              
              <Button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Complete Payment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Event Selection */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Quick Registration Hub</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockRegistrations.map((registration) => (
              <Card
                key={registration.eventId}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedEvent === registration.eventId
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedEvent(registration.eventId)}
              >
                <CardContent className="p-4">
                  <h3 className="text-white mb-2">{registration.eventTitle}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <DollarSign className="w-3 h-3" />
                      <span>{registration.price}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>Due: {new Date(registration.deadline).toLocaleDateString()}</span>
                    </div>
                    {registration.applicationRequired && (
                      <Badge variant="outline" className="text-xs border-orange-400 text-orange-400">
                        Application Required
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-fill Section */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white">Smart Auto-Fill</h3>
                <p className="text-gray-400 text-sm">Fill forms instantly using your company profile</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-fill"
                  checked={autoFillEnabled}
                  onCheckedChange={setAutoFillEnabled}
                />
                <label htmlFor="auto-fill" className="text-gray-300 text-sm">
                  Enable auto-fill
                </label>
              </div>
              
              <Button
                onClick={handleAutoFill}
                disabled={!autoFillEnabled}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Auto-Fill Form
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">{currentRegistration.eventTitle} Registration</CardTitle>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white text-sm">{completionPercentage()}% Complete</p>
                <Progress value={completionPercentage()} className="w-32 h-2" />
              </div>
              
              {currentRegistration.applicationRequired && (
                <Badge className="bg-orange-500/20 text-orange-400">
                  <FileText className="w-3 h-3 mr-1" />
                  Application Required
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Required Fields */}
          <div>
            <h3 className="text-white mb-4 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>Required Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRegistration.requiredFields.map((field) => (
                <div key={field}>
                  <label className="text-white text-sm mb-2 block flex items-center space-x-2">
                    {getFieldIcon(field)}
                    <span>{getFieldLabel(field)} *</span>
                  </label>
                  
                  {field === 'company_description' ? (
                    <Textarea
                      value={formData[field] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                    />
                  ) : field === 'pitch_deck' ? (
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Drop your pitch deck here or click to browse</p>
                      <p className="text-gray-500 text-xs mt-1">PDF, PPT, or PPTX files up to 10MB</p>
                    </div>
                  ) : (
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          {currentRegistration.optionalFields.length > 0 && (
            <div>
              <h3 className="text-white mb-4 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Additional Information (Optional)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentRegistration.optionalFields.map((field) => (
                  <div key={field}>
                    <label className="text-white text-sm mb-2 block flex items-center space-x-2">
                      {getFieldIcon(field)}
                      <span>{getFieldLabel(field)}</span>
                    </label>
                    
                    <Input
                      value={formData[field] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                I agree to the event terms and conditions, privacy policy, and code of conduct. 
                I understand that my information will be shared with event organizers and sponsors.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              <p>Deadline: {new Date(currentRegistration.deadline).toLocaleDateString()}</p>
              {currentRegistration.paymentRequired && (
                <p>Payment required: {currentRegistration.price}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || completionPercentage() < 100}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {currentRegistration.paymentRequired ? 'Continue to Payment' : 'Submit Registration'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}