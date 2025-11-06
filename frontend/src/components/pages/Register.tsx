import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Upload, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    degree: '',
    branch: '',
    batch: '',
    tenthMarks: '',
    twelfthMarks: '',
    gpa: '',
    password: '',
    confirmPassword: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Branch options based on degree
  const branchOptions: { [key: string]: string[] } = {
    'B.Tech': [
      'Computer Science',
      'Information Technology',
      'Artificial Intelligence & Machine Learning',
      'Data Science',
      'Electronics & Communication',
      'Mechanical Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Chemical Engineering',
      'Aerospace Engineering'
    ],
    'M.Tech': [
      'Computer Science',
      'Information Technology',
      'Artificial Intelligence',
      'Data Science',
      'VLSI Design',
      'Embedded Systems',
      'Structural Engineering',
      'Power Systems'
    ],
    'BCA': [
      'Computer Applications',
      'Web Development',
      'Mobile App Development',
      'Data Analytics'
    ],
    'MCA': [
      'Computer Applications',
      'Software Engineering',
      'Cloud Computing',
      'Cyber Security'
    ],
    'MBA': [
      'Finance',
      'Marketing',
      'Human Resources',
      'Operations',
      'Business Analytics',
      'International Business'
    ]
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Reset branch when degree changes
      if (field === 'degree') {
        updated.branch = '';
      }
      return updated;
    });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
  
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('degree', formData.degree);
    payload.append('branch', formData.branch);
    payload.append('batch', formData.batch);
    payload.append('tenthMarks', formData.tenthMarks);
    payload.append('twelfthMarks', formData.twelfthMarks);
    payload.append('gpa', formData.gpa);
    payload.append('password', formData.password);
  
    if (resumeFile) payload.append('resume', resumeFile);
    if (profilePicture) payload.append('profile_picture', profilePicture);
  
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        body: payload,
      });
  
      const result = await res.json();
  
      if (res.ok) {
        toast.success('🎉 Account created successfully!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Network or server error!');
    }
  };
  

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Join Us Today!</h1>
          <p className="text-gray-600">Create your account to start your placement journey</p>
        </div>

        <Card className="border-2 border-blue-100 shadow-xl bg-white">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Student Registration
            </CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batch" className="text-gray-700">Batch (Graduation Year) *</Label>
                  <Input
                    id="batch"
                    type="number"
                    placeholder="2025"
                    min="2020"
                    max="2035"
                    value={formData.batch}
                    onChange={(e) => handleChange('batch', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-gray-700">Degree *</Label>
                  <Select 
                    onValueChange={(value) => handleChange('degree', value)} 
                    value={formData.degree}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select your degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B.Tech">B.Tech</SelectItem>
                      <SelectItem value="M.Tech">M.Tech</SelectItem>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                      <SelectItem value="MBA">MBA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-gray-700">Branch *</Label>
                  <Select 
                    onValueChange={(value) => handleChange('branch', value)} 
                    value={formData.branch}
                    disabled={!formData.degree}
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder={formData.degree ? "Select your branch" : "Select degree first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.degree && branchOptions[formData.degree]?.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenthMarks" className="text-gray-700">10th Marks (%) *</Label>
                  <Input
                    id="tenthMarks"
                    type="number"
                    step="0.01"
                    placeholder="85.5"
                    min="0"
                    max="100"
                    value={formData.tenthMarks}
                    onChange={(e) => handleChange('tenthMarks', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twelfthMarks" className="text-gray-700">12th Marks (%) *</Label>
                  <Input
                    id="twelfthMarks"
                    type="number"
                    step="0.01"
                    placeholder="90.0"
                    min="0"
                    max="100"
                    value={formData.twelfthMarks}
                    onChange={(e) => handleChange('twelfthMarks', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa" className="text-gray-700">Current GPA *</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    placeholder="8.5"
                    min="0"
                    max="10"
                    value={formData.gpa}
                    onChange={(e) => handleChange('gpa', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="text-gray-700">Profile Picture (Optional)</Label>
                <div className="flex items-center gap-4">
                  {profilePreview && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-300">
                      <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {profilePicture && (
                      <p className="text-sm text-green-600 mt-1">✓ {profilePicture.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume" className="text-gray-700">Upload Resume (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                {resumeFile && (
                  <p className="text-sm text-green-600">✓ {resumeFile.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
