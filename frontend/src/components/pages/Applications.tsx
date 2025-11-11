import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Sparkles, User } from 'lucide-react';

const Applications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    interviews: 0,
  });

  const API_URL = "http://127.0.0.1:5000"; // ✅ Flask backend

  // Fetch applications + stats
  useEffect(() => {
    if (!currentUser?.id) return;

    // 1️⃣ Fetch applications
    fetch(`${API_URL}/api/applications/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data || []);
      })
      .catch((err) => console.error("Error fetching applications:", err));

    // 2️⃣ Fetch stats
    fetch(`${API_URL}/api/applications/${currentUser.id}/stats`)
      .then((res) => res.json())
      .then((data) => {
        const newStats = {
          total: data.Total || 0,
          accepted: data.Accepted || 0,
          pending: (data.Applied || 0) + (data["Under Review"] || 0),
          interviews: data["Interview Scheduled"] || 0,
        };
        setStats(newStats);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'Under Review':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
      case 'Interview Scheduled':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      case 'Rejected':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'Accepted':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            {currentUser?.profilePicture ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300 shadow-md">
                <img src={currentUser.profilePicture} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center border-2 border-purple-300 shadow-md">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div className="text-left">
              <div className="inline-flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <h1 className="text-gray-900">My Applications</h1>
              </div>
              <p className="text-gray-600 text-sm">Track all your job applications and their current status</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-blue-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Applications</div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Accepted</div>
              <div className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Under Review</div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Interviews</div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.interviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        {applications.length === 0 ? (
          <Card className="border-2 border-purple-200 bg-white">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't applied to any jobs yet. Start exploring opportunities!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-purple-200 bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-gray-900">All Applications</CardTitle>
              <CardDescription>Complete list of your applications and their progress</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id} className="hover:bg-purple-50">
                        <TableCell>{application.company}</TableCell>
                        <TableCell>{application.position}</TableCell>
                        <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                        </TableCell>
                        <TableCell>{application.result}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Applications;
