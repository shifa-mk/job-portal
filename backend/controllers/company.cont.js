import { Company } from "../models/company.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getDataUri } from "../utils/dataUri.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Handle logo upload
    let logoUrl = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await uploadOnCloudinary(fileUri.content);
      if (cloudResponse) {
        logoUrl = cloudResponse.secure_url;
      }
    }

    const newCompany = await Company.create({
      name,
      description,
      website,
      location,
      logo: logoUrl,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: newCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select(
      "name description website location logo createdAt"
    );
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch companies",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching company",
      success: false,
      error: error.message,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const companyId = req.params.id;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(website && { website }),
      ...(location && { location }),
    };

    // Handle file upload
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudinaryResponse = await uploadOnCloudinary(fileUri.content);
      if (cloudinaryResponse && cloudinaryResponse.secure_url) {
        updateData.logo = cloudinaryResponse.secure_url;
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating company",
    });
  }
};
