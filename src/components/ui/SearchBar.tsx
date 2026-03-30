import { useState } from 'react';
import { Search } from 'lucide-react';
import { useFilters } from '../context/useFilters';


export default function SearchBar() {
  const { filters, setFilters } = useFilters();
  const [value, setValue] = useState(filters.searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ searchQuery: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === '') {
      setFilters({ searchQuery: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full max-w-xl">
      <div className="flex items-center w-full bg-white border-2 border-gray-200 rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow gap-3">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Search destinations..."
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
        <button
          type="submit"
          className="bg-rose-500 text-white text-sm px-4 py-1.5 rounded-full hover:bg-rose-600 transition-colors font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
