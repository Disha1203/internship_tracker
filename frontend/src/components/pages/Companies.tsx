import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  Edit2,
  Trash2,
  PlusCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface Company {
  id: number;
  name: string;
  industry: string;
  contactEmail?: string;
  contactPhone?: string;
}

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
  });

  const adminUsername = "admin";
  const adminPassword = "admin123";

  const API_BASE = "http://127.0.0.1:5000/api/companies";

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch companies");
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      toast.error("Error fetching companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Add form
  const openAddForm = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      industry: "",
      contactEmail: "",
      contactPhone: "",
    });
    setOpenForm(true);
  };

  // Open Edit form
  const openEditForm = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      industry: company.industry,
      contactEmail: company.contactEmail || "",
      contactPhone: company.contactPhone || "",
    });
    setOpenForm(true);
  };

  // Save (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCompany ? "PUT" : "POST";
    const url = editingCompany
      ? `${API_BASE}/${editingCompany.id}`
      : API_BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Username": adminUsername,
          "X-Admin-Password": adminPassword,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");

      toast.success(
        editingCompany
          ? "Company updated successfully"
          : "Company added successfully"
      );
      setOpenForm(false);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Delete
  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Username": adminUsername,
          "X-Admin-Password": adminPassword,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCompanyClick = (id: number) => {
    navigate(`/companies/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6 text-green-600" />
              <h1 className="text-gray-900 text-lg font-semibold">
                Partner Companies
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Explore companies hiring through our placement program. Click on
              any company to view their job offers.
            </p>
          </div>

          <Button
            onClick={openAddForm}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Company
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => {
              const colors = [
                "from-blue-400 to-blue-600",
                "from-green-400 to-green-600",
                "from-purple-400 to-purple-600",
                "from-orange-400 to-orange-600",
                "from-pink-400 to-pink-600",
                "from-indigo-400 to-indigo-600",
              ];
              const colorClass = colors[index % colors.length];

              return (
                <Card
                  key={company.id}
                  className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all bg-white group relative"
                >
                  <CardHeader
                    onClick={() => handleCompanyClick(company.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 bg-gradient-to-br ${colorClass} rounded-xl mb-3 shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <CardTitle className="text-gray-900 group-hover:text-purple-600 transition-colors">
                      {company.name}
                    </CardTitle>
                    <CardDescription>
                      <Badge
                        variant="outline"
                        className="border-orange-300 text-orange-600 bg-orange-50 mt-2"
                      >
                        {company.industry}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {company.contactEmail}{" "}
                      {company.contactPhone && `• ${company.contactPhone}`}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditForm(company)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCompany(company.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog Form */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Edit Company" : "Add Company"}
            </DialogTitle>
            <DialogDescription>
              Enter the company details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {editingCompany ? "Update" : "Add"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenForm(false)}
                type="button"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies;
