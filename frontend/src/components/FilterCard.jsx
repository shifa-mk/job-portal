import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        key: "location",
        array: ["Delhi", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        key: "industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        key: "salary",
        array: ["0-50k", "50k-1L", "1L-5L", "5L-10L", "10L-20L"]
    },
];

const FilterCard = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        location: "",
        industry: "",
        salary: ""
    });

    const dispatch = useDispatch();

    const changeHandler = (filterKey, value) => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: value.trim()  // Ensure no extra spaces
        }));
    };

    useEffect(() => {
        if (Object.values(selectedFilters).some(val => val !== "")) {
            console.log("Updated Filters (Redux):", selectedFilters);
            dispatch(setSearchedQuery(selectedFilters));
        }
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={index}>
                    <h1 className='font-bold text-lg mt-3'>{data.filterType}</h1>
                    <RadioGroup 
                        value={selectedFilters[data.key] || ""} 
                        onValueChange={(value) => changeHandler(data.key, value)}
                    >
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div key={itemId} className='flex items-center space-x-2 my-2'>
                                    <RadioGroupItem value={item} id={itemId} />
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
