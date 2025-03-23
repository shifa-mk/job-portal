import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  {
    filterType: "Location",
    key: "location",
    array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    key: "industry",
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    key: "salary",
    array: ["0-50k", "50k-1L", "1L-5L", "5L-10L", "10L-20L"],
  },
];

const FilterCard = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    industry: "",
    salary: "",
  });

  const dispatch = useDispatch();

  const changeHandler = (filterKey, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterKey]: value.trim(),
    };
    setSelectedFilters(newFilters);
    dispatch(setSearchedQuery(newFilters)); // Dispatch immediately
  };

  const resetFilters = () => {
    setSelectedFilters({
      location: "",
      industry: "",
      salary: "",
    });
    dispatch(
      setSearchedQuery({
        location: "",
        industry: "",
        salary: "",
      })
    );
  };

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        {Object.values(selectedFilters).some((val) => val !== "") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      <hr className="mt-3" />
      {filterData.map((data, index) => (
        <div key={index}>
          <h1 className="font-bold text-lg mt-3">{data.filterType}</h1>
          <RadioGroup
            value={selectedFilters[data.key] || ""}
            onValueChange={(value) => changeHandler(data.key, value)}
          >
            {data.array.map((item, idx) => {
              const itemId = `id${index}-${idx}`;
              return (
                <div
                  key={itemId}
                  className="flex items-center space-x-2 my-2"
                >
                  <RadioGroupItem
                    value={item}
                    id={itemId}
                  />
                  <Label htmlFor={itemId}>{item}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
