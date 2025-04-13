import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { locations } from "../data/locations";
import { categories } from "../data/categories";

export default function EventsFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setLocation(searchParams.get("location") || "all");
    setCategory(searchParams.get("category") || "all");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location !== "all") {
      params.set("location", location);
    }

    if (category !== "all") {
      params.set("category", category);
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    navigate(`/events${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger id="location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button type="button" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
