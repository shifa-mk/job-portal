import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setSingleCompany, setAllCompanies } from "@/redux/companySlice";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          setFormData(res.data.company);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateCompany = async () => {
    try {
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        // Fetch updated companies list
        const companiesRes = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (companiesRes?.data?.success) {
          dispatch(setAllCompanies(companiesRes.data.companies));
        }
        toast.success("Company updated successfully");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating company");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Edit Company</h1>
          <p className="text-gray-500">Update your company information</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              className="my-2"
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label>Logo URL</Label>
            <Input
              type="url"
              name="logo"
              value={formData.logo}
              className="my-2"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              className="my-2"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              type="url"
              name="website"
              value={formData.website}
              className="my-2"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              className="my-2"
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center gap-2 my-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
            >
              Cancel
            </Button>
            <Button onClick={updateCompany}>Update Company</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEdit;
