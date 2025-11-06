import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit, Trash2, PlusCircle, Filter, Sparkles, GraduationCap, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface Company {
  id: number;
  name: string;
}

interface JobOffer {
  id: number;
  title: string;
  type: string;
  field?: string;
  compensation?: number;
  deadline?: string;
  location?: string;
  description?: string;
  minGPA?: number;
  minTenth?: number;
  minTwelfth?: number;
  companyId?: number;
  companyName?: string;
}

const JobOffers = () => {
  const API_URL = 'http://127.0.0.1:5000/api/joboffers';
  const COMPANY_API = 'http://127.0.0.1:5000/api/companies';
  const { currentUser } = useAuth();

  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [filters, setFilters] = useState({ type: '', search: '' });
  const [activeTab, setActiveTab] = useState<'all' | 'eligible'>('all');

  // 🟢 Fetch Jobs
  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.search.trim() !== '') params.append('search', filters.search.trim());

      const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch job offers');

      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch job offers.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(COMPANY_API);
      const data = await res.json();
      setCompanies(data);
    } catch {
      toast.error('Failed to load companies.');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const handleAdminLogin = () => {
    if (adminCreds.username === 'admin' && adminCreds.password === 'admin123') {
      toast.success('Admin logged in successfully');
      setIsAdmin(true);
      setAdminDialogOpen(false);
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  const handleSaveJob = async () => {
    const payload = {
      ...formData,
      compensation: formData.compensation ? parseFloat(formData.compensation) : null,
      minGPA: formData.minGPA ? parseFloat(formData.minGPA) : null,
      minTenth: formData.minTenth ? parseFloat(formData.minTenth) : null,
      minTwelfth: formData.minTwelfth ? parseFloat(formData.minTwelfth) : null,
      deadline: formData.deadline ? formData.deadline : null,
    };

    const method = formData.id ? 'PUT' : 'POST';
    const url = formData.id ? `${API_URL}/${formData.id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Username': adminCreds.username,
          'X-Admin-Password': adminCreds.password,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(formData.id ? 'Job updated successfully' : 'Job created successfully');
        setAddDialogOpen(false);
        setFormData({});
        fetchJobs();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch {
      toast.error('Server error while saving job');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    try {
      const res = await fetch(`${API_URL}/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Username': adminCreds.username,
          'X-Admin-Password': adminCreds.password,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Job deleted successfully');
        fetchJobs();
      } else {
        toast.error(data.error || 'Failed to delete job');
      }
    } catch {
      toast.error('Server error while deleting job');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteJobId(null);
    }
  };

  const isEligible = (job: JobOffer): boolean => {
    if (!currentUser) return false;
    const gpa = parseFloat(currentUser.gpa || '0');
    const tenth = parseFloat(currentUser.tenthMarks || '0');
    const twelfth = parseFloat(currentUser.twelfthMarks || '0');
    if (job.minGPA && gpa < job.minGPA) return false;
    if (job.minTenth && tenth < job.minTenth) return false;
    if (job.minTwelfth && twelfth < job.minTwelfth) return false;
    return true;
  };

  const eligibleJobs = jobs.filter(isEligible);
  const displayJobs = activeTab === 'all' ? jobs : eligibleJobs;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Job Offers</h1>
          </div>
          <div className="flex gap-2">
            {!isAdmin && (
              <Button variant="outline" onClick={() => setAdminDialogOpen(true)}>Admin Login</Button>
            )}
            {isAdmin && (
              <>
                <Button onClick={() => setAddDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Add Job
                </Button>
                <Button variant="outline" onClick={() => setIsAdmin(false)}>Logout</Button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <Input
            placeholder="Search by title or company..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="max-w-sm"
          />
          <select
            className="border rounded-md px-3 py-2"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time">Full-Time</option>
          </select>
          <Button variant="secondary" onClick={fetchJobs}>
            <Filter className="h-4 w-4 mr-1" /> Apply Filters
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'eligible')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white border p-1 mb-8">
            <TabsTrigger value="all">All Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="eligible">Eligible Jobs ({eligibleJobs.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job) => (
            <Card key={job.id} className="border-2 border-blue-100 hover:border-blue-300 transition-all">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.companyName}</CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge>{job.type}</Badge>
                  {job.field && <Badge variant="outline">{job.field}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">{job.location}</p>
                <p className="text-sm text-gray-600">
                  Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => { setSelectedJob(job); setViewDialogOpen(true); }} size="sm">View</Button>
                  {isAdmin && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setFormData(job); setAddDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => { setDeleteJobId(job.id); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobOffers;
