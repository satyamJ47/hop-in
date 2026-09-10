import { useNavigate } from "react-router-dom";

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

const popularRoutes = [
    { source: "Mumbai", destination: "Pune" },
    { source: "Pune", destination: "Mumbai" },
    { source: "Mumbai", destination: "Nashik" },
    { source: "Nashik", destination: "Mumbai" },
    // { source: "Pune", destination: "Nashik" },
    // { source: "Nashik", destination: "Pune" },
];

export default function PopularRoutes() {
    const navigate = useNavigate();

    function handleRouteClick(source, destination) {
        const params = new URLSearchParams({
            src: source,
            dest: destination,
            date: getTodayDate(),
        });

        navigate(`/search?${params.toString()}`);
    }

    return (
        <div>
            <h3 className="mb-4 font-semibold">
                Popular Routes
            </h3>

            <div className="flex flex-col items-center gap-2">
                {popularRoutes.map((route) => (
                    <button
                        key={`${route.source}-${route.destination}`}
                        onClick={() =>
                            handleRouteClick(
                                route.source,
                                route.destination
                            )
                        }
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {route.source} → {route.destination}
                    </button>
                ))}
            </div>
        </div>
    );
}