import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Briefcase, Building2, Users, TrendingUp, ArrowRight, Rocket, Star, Zap, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import React from 'react';

const Home = () => {
  const { currentUser } = useAuth();
  
  const stats = [
    { icon: Briefcase, label: 'Active Job Offers', value: '45+', color: 'from-blue-400 to-blue-600' },
    { icon: Building2, label: 'Partner Companies', value: '30+', color: 'from-green-400 to-green-600' },
    { icon: Users, label: 'Placed Alumni', value: '200+', color: 'from-purple-400 to-purple-600' },
    { icon: TrendingUp, label: 'Average Package', value: '₹12 LPA', color: 'from-orange-400 to-orange-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center">
            <div className="flex flex-col items-center mb-6 gap-4">
              {currentUser?.profilePicture ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-700">Welcome back, {currentUser?.name}! 🎉</span>
              </div>
            </div>
            <h1 className="text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Internship and Placement Tracker
            </h1>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-lg">
              Your comprehensive platform to explore job opportunities, track applications, 
              connect with alumni, and access valuable insights for your career journey. 
              Stay organized and make informed decisions about your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/job-offers">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                  <Rocket className="mr-2 h-4 w-4" />
                  Browse Job Offers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/alumni">
                <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                  <Users className="mr-2 h-4 w-4" />
                  Connect with Alumni
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-2 border-transparent hover:border-purple-200 transition-all hover:shadow-xl bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                      <p className={`mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-orange-500" />
              <h2 className="text-gray-900">Everything You Need</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to manage your placement journey from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl w-fit mb-4 shadow-md">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Job Opportunities</h3>
                <p className="text-gray-600 text-sm">
                  Browse through curated internship and full-time positions from top companies. 
                  Filter by role, location, and compensation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl w-fit mb-4 shadow-md">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Company Insights</h3>
                <p className="text-gray-600 text-sm">
                  Get detailed information about hiring companies, their culture, and expectations. 
                  Make informed decisions about where to apply.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl bg-white">
              <CardContent className="p-6">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl w-fit mb-4 shadow-md">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Alumni Network</h3>
                <p className="text-gray-600 text-sm">
                  Connect with seniors who've been placed. Get guidance, tips, and real experiences 
                  to boost your chances of success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-none shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <CardContent className="p-8 sm:p-12 text-center relative">
            <Rocket className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Explore opportunities, track your applications, and connect with alumni who can guide you.
            </p>
            <Link to="/job-offers">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
