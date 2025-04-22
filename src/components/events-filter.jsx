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
import { cities } from "../data/cities";

export default function EventsFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setCity(searchParams.get("city") || "all");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (city !== "all") {
      params.set("city", city);
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    navigate(`/events${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <label htmlFor="city" className="text-sm font-medium">
          City
        </label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger id="city" className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities
              .filter((c) => c !== "all")
              .map((city) => (
                <SelectItem key={city} value={city} className="capitalize">
                  {city}
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
