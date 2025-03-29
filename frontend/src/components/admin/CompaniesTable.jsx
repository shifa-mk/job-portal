import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filterCompany, setFilterCompany] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    console.log("Redux Companies:", companies);  // ✅ Verify Redux store contains logos
}, [companies]);

  useEffect(() => {
    const filteredCompany =
      companies?.filter((company) =>
        searchCompanyByText
          ? company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
          : true
      ) || [];

    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);
  console.log('Company Data:', companies);
  console.log('Companies in Redux:', companies);


  return (
    <div className="table-container">
      <Table className="table-auto w-full">
        <TableCaption>A list of your recently registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.length > 0 ? (
            filterCompany.map((company) => (
              <TableRow key={company?._id}>
                <TableCell>
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} style={{ width: '50px', height: '50px' }} />
                  ) : (
                    "No Logo"
                  )}
                </TableCell>

                <TableCell>{company?.name || 'N/A'}</TableCell>
                <TableCell>{company?.createdAt?.split('T')[0] || 'Unknown'}</TableCell>
                <TableCell className="text-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div
                        onClick={() => navigate(`/admin/companies/${company?._id}`)}
                        className="flex items-center gap-2 w-fit cursor-pointer"
                      >
                        <Edit2 className="w-4" />
                        <span>Edit</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                No companies found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
