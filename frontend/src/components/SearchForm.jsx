import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchForm() {
    
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    // console.log("Search Form")
  
    function handleSearch() {
        const params = new URLSearchParams({
            src: source,
            dest: destination,
            date,
        });
        navigate(`/search?${params.toString()}`);
    }

    return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Source */}
          <div className="space-y-2">
            <Label htmlFor="source">From</Label>
            <Input
                id="source"
                placeholder="Enter source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">To</Label>
            <Input
                id="destination"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Travel Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Travel Date</Label>
            <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button className="w-full" onClick = {handleSearch}>
              Search Rides
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}