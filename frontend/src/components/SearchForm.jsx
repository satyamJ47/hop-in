import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function SearchForm({ compact = false }) {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState(getTodayDate());

    const navigate = useNavigate();

    function handleSearch() {
        const params = new URLSearchParams({
            src: source,
            dest: destination,
            date,
        });

        navigate(`/search?${params.toString()}`);
    }

    return (
        <Card
            className={`border-border transition-all duration-300 ${
                compact ? "shadow-sm" : "shadow-lg"
            }`}
        >
            <CardContent
                className={`transition-all duration-300 ${
                    compact ? "px-6 py-2" : "p-6"
                }`}
            >
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px_160px]">

                    {/* Source */}
                    <div className="space-y-2">
                        {!compact && (
                            <Label htmlFor="source">
                                From
                            </Label>
                        )}

                        <Input
                            id="source"
                            placeholder="Enter source"
                            value={source}
                            onChange={(e) =>
                                setSource(e.target.value)
                            }
                        />
                    </div>

                    {/* Destination */}
                    <div className="space-y-2">
                        {!compact && (
                            <Label htmlFor="destination">
                                To
                            </Label>
                        )}

                        <Input
                            id="destination"
                            placeholder="Enter destination"
                            value={destination}
                            onChange={(e) =>
                                setDestination(e.target.value)
                            }
                        />
                    </div>

                    {/* Travel Date */}
                    <div className="space-y-2">
                        {!compact && (
                            <Label htmlFor="date">
                                Travel Date
                            </Label>
                        )}

                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                        />
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <Button
                            className="w-full"
                            onClick={handleSearch}
                        >
                            Search Rides
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}