import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Mail, Linkedin, GraduationCap, Users } from 'lucide-react';
import React from 'react';

interface AlumniMember {
  id: number;
  name: string;
  position: string;
  company: string;
  graduationYear: number;
  field: string;
  email?: string;
  linkedin?: string;
}

const Alumni = () => {
  const alumni: AlumniMember[] = [
    {
      id: 1,
      name: 'Rohit Verma',
      position: 'Software Engineer',
      company: 'Google',
      graduationYear: 2024,
      field: 'Computer Science',
      email: 'rohit.v@example.com',
    },
    {
      id: 2,
      name: 'Meera Nair',
      position: 'Product Manager',
      company: 'Microsoft',
      graduationYear: 2023,
      field: 'Technology',
      email: 'meera.n@example.com',
    },
    {
      id: 3,
      name: 'Aditya Rao',
      position: 'Investment Banking Analyst',
      company: 'Goldman Sachs',
      graduationYear: 2024,
      field: 'Finance',
      email: 'aditya.r@example.com',
    },
    {
      id: 4,
      name: 'Kavya Menon',
      position: 'SDE-2',
      company: 'Amazon',
      graduationYear: 2022,
      field: 'Computer Science',
      email: 'kavya.m@example.com',
    },
    {
      id: 5,
      name: 'Sanjay Kulkarni',
      position: 'Business Analyst',
      company: 'McKinsey & Company',
      graduationYear: 2024,
      field: 'Consulting',
      email: 'sanjay.k@example.com',
    },
    {
      id: 6,
      name: 'Ishita Sharma',
      position: 'Senior Product Manager',
      company: 'Flipkart',
      graduationYear: 2021,
      field: 'Product Management',
      email: 'ishita.s@example.com',
    },
    {
      id: 7,
      name: 'Aryan Joshi',
      position: 'Data Scientist',
      company: 'Uber',
      graduationYear: 2023,
      field: 'Data Science',
      email: 'aryan.j@example.com',
    },
    {
      id: 8,
      name: 'Pooja Reddy',
      position: 'Consultant',
      company: 'Deloitte',
      graduationYear: 2024,
      field: 'Consulting',
      email: 'pooja.r@example.com',
    },
    {
      id: 9,
      name: 'Varun Kapoor',
      position: 'UX Designer',
      company: 'Adobe',
      graduationYear: 2023,
      field: 'Design',
      email: 'varun.k@example.com',
    },
    {
      id: 10,
      name: 'Anjali Gupta',
      position: 'Software Engineer',
      company: 'Infosys',
      graduationYear: 2024,
      field: 'Computer Science',
      email: 'anjali.g@example.com',
    },
    {
      id: 11,
      name: 'Karan Singh',
      position: 'Technology Analyst',
      company: 'Accenture',
      graduationYear: 2023,
      field: 'Technology',
      email: 'karan.s@example.com',
    },
    {
      id: 12,
      name: 'Shreya Patel',
      position: 'Cloud Solutions Architect',
      company: 'Salesforce',
      graduationYear: 2022,
      field: 'Cloud Computing',
      email: 'shreya.p@example.com',
    },
  ];

  const handleContact = (alumni: AlumniMember) => {
    if (alumni.email) {
      window.location.href = `mailto:${alumni.email}?subject=Seeking Guidance for Placement`;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-purple-600" />
            <h1 className="text-gray-900">Alumni Network</h1>
          </div>
          <p className="text-gray-600">
            Connect with seniors who have been successfully placed. Get guidance and insights from their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((member, index) => {
            const colors = [
              'from-blue-400 to-blue-600',
              'from-green-400 to-green-600',
              'from-purple-400 to-purple-600',
              'from-orange-400 to-orange-600',
              'from-pink-400 to-pink-600',
              'from-indigo-400 to-indigo-600',
            ];
            const colorClass = colors[index % colors.length];
            
            return (
              <Card key={member.id} className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md`}>
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Class of {member.graduationYear}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit border-orange-300 text-orange-600 bg-orange-50">
                    {member.field}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-900">{member.position}</p>
                      <p className="text-sm text-gray-600">{member.company}</p>
                    </div>
                    
                    <Button
                      onClick={() => handleContact(member)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact for Guidance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-2">Connect with Alumni</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our alumni are eager to help! Reach out to them for interview tips, company insights, 
                  and career advice. They've been through the process and can provide valuable guidance.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ask about interview experiences</li>
                  <li>• Learn about company culture</li>
                  <li>• Get resume and preparation tips</li>
                  <li>• Seek mentorship opportunities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alumni;
