
import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName, description, website, location, logo } = req.body;  // Add logo
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            description,
            website,
            location,
            logo, // Save logo
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select('name description website location logo'); // Include logo
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch companies",
            success: false
        });
    }
};

  
export const getCompanyById =async (req,res)=>{
    try{
        const companyId=req.params.id;
        const company =await Company.findById(companyId);
        if(!company){
            return res.status(400).json({
                message:"company not found ",
                success:false
            }); 
        }
        return res.status(201).json({
            company,
            success:true
        }); 
    }catch(error){
        console.log(error); 
    }
}
export const updateCompany =async (req,res)=>{
    try{
        const{ name,description,website,location}=req.body;
        const file =req.file;
        //cloudinary
        const updateData ={ name,description,website,location};
        const company =await Company.findByIdAndUpdate(req.params.id,updateData,{mew:true});
    
        if(!company){
            return res.status(404).json({
                message:"company not found ",
                success:false
            }); 
        }
        return res.status(201).json({
            message:"company information updated.",
            success:true
        }); 
    
    
    
    }catch(error){
        console.log(error); 
    }
}