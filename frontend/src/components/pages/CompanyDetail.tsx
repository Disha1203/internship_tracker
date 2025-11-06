import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Building2,
  ArrowLeft,
  IndianRupee,
  MapPin,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface JobOffer {
  id: number;
  title: string;
  type: string;
  field: string;
  compensation: string;
  deadline: string;
  location: string;
  description: string;
  duration?: string;
}

interface Company {
  id: number;
  name: string;
  industry: string;
  contactEmail?: string;
  contactPhone?: string;
  jobs?: JobOffer[];
}

const CompanyDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:5000/api/companies";

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${companyId}/detail`);
        if (!res.ok) throw new Error("Failed to fetch company detail");
        const data = await res.json();
        setCompany(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetail();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-gray-700 text-lg mb-4">Company not found</h2>
        <Button
          onClick={() => navigate("/companies")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          onClick={() => navigate("/companies")}
          variant="outline"
          className="mb-6 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Companies
        </Button>

        <div className="bg-white border-2 border-purple-100 rounded-lg p-8 shadow-md mb-10">
          <div className="flex items-start gap-6 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-gray-900 text-2xl font-semibold mb-1">
                {company.name}
              </h1>
              <Badge
                variant="outline"
                className="border-orange-300 text-orange-600 bg-orange-50 mb-3"
              >
                {company.industry}
              </Badge>
              <p className="text-gray-600 text-sm mb-3">
                Contact: {company.contactEmail || "—"}{" "}
                {company.contactPhone && `• ${company.contactPhone}`}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-gray-900 text-xl font-semibold mb-6">
          Open Positions ({company.jobs?.length || 0})
        </h2>

        {company.jobs && company.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.jobs.map((job) => (
              <Card
                key={job.id}
                className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all bg-white"
              >
                <CardHeader>
                  <CardTitle className="text-gray-900">{job.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge
                      variant="outline"
                      className="border-blue-300 text-blue-600 bg-blue-50"
                    >
                      {job.type}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
                      {job.compensation}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                    {job.duration && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        Duration: {job.duration}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {job.description || "No description available."}
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-8">
            No open positions currently.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
