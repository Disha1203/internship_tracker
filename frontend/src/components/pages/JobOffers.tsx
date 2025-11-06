import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, IndianRupee, MapPin, Edit, Trash2, PlusCircle, Sparkles, GraduationCap, Filter, AlertTriangle } from 'lucide-react';
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

  // ------------------------------
  // Fetch jobs
  // ------------------------------
  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.search.trim() !== '') params.append('search', filters.search.trim());

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const data = await res.json();
      setJobs(data.data || []);
    } catch {
      toast.error('Failed to fetch job offers.');
    }
  };

  // Fetch companies for dropdown
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

  const handleSearch = () => {
    fetchJobs();
  };

  const handleAdminLogin = () => {
    if (adminCreds.username === 'admin' && adminCreds.password === 'admin123') {
      toast.success('Admin logged in successfully');
      setIsAdmin(true);
      setAdminDialogOpen(false);
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  const handleViewDetails = (job: JobOffer) => {
    setSelectedJob(job);
    setViewDialogOpen(true);
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
    } catch (error) {
      toast.error('Server error while saving job');
    }
  };

  const confirmDeleteJob = (id: number) => {
    setDeleteJobId(id);
    setDeleteDialogOpen(true);
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

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
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
          <Button variant="secondary" onClick={handleSearch}>
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
                  <Button onClick={() => handleViewDetails(job)} size="sm">View</Button>
                  {isAdmin && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setFormData(job); setAddDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDeleteJob(job.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🧾 View Job Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedJob.title}</DialogTitle>
                  <DialogDescription>{selectedJob.companyName}</DialogDescription>
                </DialogHeader>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>Type:</strong> {selectedJob.type}</p>
                  <p><strong>Location:</strong> {selectedJob.location}</p>
                  <p><strong>Compensation:</strong> ₹{selectedJob.compensation || 'N/A'}</p>
                  <p><strong>Deadline:</strong> {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Description:</strong> {selectedJob.description || 'No description'}</p>

                  <div className="bg-blue-50 p-3 rounded-md mt-3">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <strong>Eligibility</strong>
                    </div>
                    <ul className="list-disc pl-6">
                      {selectedJob.minGPA && <li>Min GPA: {selectedJob.minGPA}</li>}
                      {selectedJob.minTenth && <li>10th Marks: {selectedJob.minTenth}%</li>}
                      {selectedJob.minTwelfth && <li>12th Marks: {selectedJob.minTwelfth}%</li>}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* 🗑 Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" /> Confirm Deletion
              </DialogTitle>
              <DialogDescription>Are you sure you want to delete this job offer? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteJob}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Admin Login Dialog */}
        <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>Enter credentials to manage job offers.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Username" value={adminCreds.username}
                onChange={(e) => setAdminCreds({ ...adminCreds, username: e.target.value })} />
              <Input placeholder="Password" type="password" value={adminCreds.password}
                onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })} />
              <Button onClick={handleAdminLogin} className="w-full bg-blue-600 text-white">Login</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Job Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{formData.id ? 'Edit Job Offer' : 'Add New Job Offer'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <Label>Title</Label>
              <Input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

              <Label>Job Type</Label>
              <select className="border rounded-md w-full p-2" value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="">Select Type</option>
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
              </select>

              <Label>Company</Label>
              <select className="border rounded-md w-full p-2" value={formData.companyId || ''} onChange={(e) => setFormData({ ...formData, companyId: parseInt(e.target.value) })}>
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <Label>Location</Label>
              <Input value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />

              <Label>Compensation (₹)</Label>
              <Input type="number" value={formData.compensation || ''} onChange={(e) => setFormData({ ...formData, compensation: e.target.value })} />

              <Label>Deadline</Label>
              <Input type="date" value={formData.deadline ? formData.deadline.split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />

              {/* ✅ Eligibility Fields */}
              <Label>Minimum GPA</Label>
              <Input type="number" step="0.1" value={formData.minGPA || ''} onChange={(e) => setFormData({ ...formData, minGPA: e.target.value })} />

              <Label>Minimum 10th Marks (%)</Label>
              <Input type="number" value={formData.minTenth || ''} onChange={(e) => setFormData({ ...formData, minTenth: e.target.value })} />

              <Label>Minimum 12th Marks (%)</Label>
              <Input type="number" value={formData.minTwelfth || ''} onChange={(e) => setFormData({ ...formData, minTwelfth: e.target.value })} />

              <Label>Description</Label>
              <Input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

              <Button onClick={handleSaveJob} className="bg-green-600 text-white mt-3">
                {formData.id ? 'Update Job' : 'Create Job'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobOffers;
