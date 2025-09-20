import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { 
  Building, 
  Edit, 
  Save, 
  Plus, 
  X, 
  Users, 
  Award, 
  Briefcase,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface CompanyProfileProps {
  companyData: any;
  onUpdate: (data: any) => void;
}

export function CompanyProfile({ companyData, onUpdate }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(companyData || {});
  const [newService, setNewService] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newCapability, setNewCapability] = useState('');

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(companyData);
    setIsEditing(false);
  };

  const addArrayItem = (field: string, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    
    setEditData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter('');
  };

  const removeArrayItem = (field: string, index: number) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const addProject = () => {
    const newProject = {
      name: 'New Project',
      client: 'Client Name',
      value: '$0',
      year: '2024',
      description: 'Project description'
    };

    setEditData((prev: any) => ({
      ...prev,
      pastProjects: [...(prev.pastProjects || []), newProject]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      pastProjects: prev.pastProjects.map((project: any, i: number) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (index: number) => {
    setEditData((prev: any) => ({
      ...prev,
      pastProjects: prev.pastProjects.filter((_: any, i: number) => i !== index)
    }));
  };

  if (!companyData) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-12 text-center">
          <Building className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white mb-2">No Company Profile</h3>
          <p className="text-gray-400">Upload a company profile to get started</p>
        </CardContent>
      </Card>
    );
  }

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
            <CardTitle className="text-white flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Company Profile</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <p className="text-white text-lg">{companyData.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              {isEditing ? (
                <Input
                  id="industry"
                  value={editData.industry || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <p className="text-white">{companyData.industry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="size">Company Size</Label>
              {isEditing ? (
                <Input
                  id="size"
                  value={editData.size || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, size: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{companyData.size}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="founded">Founded</Label>
              {isEditing ? (
                <Input
                  id="founded"
                  value={editData.founded || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, founded: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{companyData.founded}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editData.description || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-800 border-gray-700 text-white h-24"
              />
            ) : (
              <p className="text-gray-300">{companyData.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              {isEditing ? (
                <Input
                  value={editData.contactInfo?.email || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{companyData.contactInfo?.email}</span>
                </div>
              )}
            </div>

            <div>
              <Label>Phone</Label>
              {isEditing ? (
                <Input
                  value={editData.contactInfo?.phone || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{companyData.contactInfo?.phone}</span>
                </div>
              )}
            </div>

            <div>
              <Label>Website</Label>
              {isEditing ? (
                <Input
                  value={editData.contactInfo?.website || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, website: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{companyData.contactInfo?.website}</span>
                </div>
              )}
            </div>

            <div>
              <Label>Address</Label>
              {isEditing ? (
                <Textarea
                  value={editData.contactInfo?.address || ''}
                  onChange={(e) => setEditData(prev => ({ 
                    ...prev, 
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-700 text-white h-16"
                />
              ) : (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-white">{companyData.contactInfo?.address}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services & Capabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing && (
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Add a service"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={() => addArrayItem('services', newService, setNewService)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editData.services : companyData.services)?.map((service: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{service}</span>
                  {isEditing && (
                    <button onClick={() => removeArrayItem('services', index)}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Technical Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing && (
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder="Add a capability"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  onClick={() => addArrayItem('capabilities', newCapability, setNewCapability)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editData.capabilities : companyData.capabilities)?.map((capability: string, index: number) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1 border-blue-400 text-blue-400">
                  <span>{capability}</span>
                  {isEditing && (
                    <button onClick={() => removeArrayItem('capabilities', index)}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Certifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing && (
            <div className="flex space-x-2 mb-4">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add a certification"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={() => addArrayItem('certifications', newCertification, setNewCertification)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {(isEditing ? editData.certifications : companyData.certifications)?.map((cert: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1 bg-green-500/20 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>{cert}</span>
                {isEditing && (
                  <button onClick={() => removeArrayItem('certifications', index)}>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Projects */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Past Projects</span>
            </CardTitle>
            {isEditing && (
              <Button
                onClick={addProject}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(isEditing ? editData.pastProjects : companyData.pastProjects)?.map((project: any, index: number) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Project name"
                      />
                      <Button
                        onClick={() => removeProject(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={project.client}
                        onChange={(e) => updateProject(index, 'client', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Client name"
                      />
                      <Input
                        value={project.value}
                        onChange={(e) => updateProject(index, 'value', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Project value"
                      />
                      <Input
                        value={project.year}
                        onChange={(e) => updateProject(index, 'year', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Year"
                      />
                    </div>
                    
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Project description"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white">{project.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{project.client}</span>
                        <span>{project.value}</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}