const {
    UserModel,
    DriverProfileModel,
    VehicleModel,
    RideModel
} = require("../db");

const demoDrivers = [
    {
        name: "Maya",
        email: "maya.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO01",
            company: "Hyundai",
            model: "Creta",
            color: "White",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Carl",
        email: "carl.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO02",
            company: "Kia",
            model: "Seltos",
            color: "Black",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Rhea",
        email: "rhea.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO03",
            company: "Tata",
            model: "Nexon",
            color: "Blue",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Max",
        email: "max.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO04",
            company: "Mahindra",
            model: "XUV700",
            color: "Grey",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Lewis",
        email: "lewis.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO05",
            company: "Toyota",
            model: "Urban Cruiser Hyryder",
            color: "Silver",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Lando",
        email: "lando.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO06",
            company: "Hyundai",
            model: "Venue",
            color: "Red",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Oscar",
        email: "oscar.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO07",
            company: "Maruti",
            model: "Brezza",
            color: "White",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Charles",
        email: "charles.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO08",
            company: "Kia",
            model: "Sonet",
            color: "Blue",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Carlos",
        email: "carlos.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO09",
            company: "Hyundai",
            model: "Alcazar",
            color: "Black",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "George",
        email: "george.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO10",
            company: "Toyota",
            model: "Urban Cruiser",
            color: "Grey",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Kimi",
        email: "kimi.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO11",
            company: "Volkswagen",
            model: "Taigun",
            color: "White",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Noah",
        email: "noah.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO12",
            company: "Skoda",
            model: "Kushaq",
            color: "Red",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Nico",
        email: "nico.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO13",
            company: "Honda",
            model: "Elevate",
            color: "Silver",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Meera",
        email: "meera.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO14",
            company: "Maruti",
            model: "Grand Vitara",
            color: "Blue",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Ellie",
        email: "ellie.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO15",
            company: "Kia",
            model: "Carens",
            color: "White",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Tara",
        email: "tara.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO16",
            company: "Hyundai",
            model: "Verna",
            color: "Black",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Sudha",
        email: "sudha.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO17",
            company: "Tata",
            model: "Harrier",
            color: "Grey",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Vidya",
        email: "vidya.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO18",
            company: "Mahindra",
            model: "Scorpio N",
            color: "Black",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Shehnaz",
        email: "shehnaz.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO19",
            company: "Hyundai",
            model: "i20",
            color: "Blue",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Kiara",
        email: "kiara.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO20",
            company: "Kia",
            model: "Carens",
            color: "Silver",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Michael",
        email: "michael.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO21",
            company: "Toyota",
            model: "Innova Hycross",
            color: "White",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Ollie",
        email: "ollie.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO22",
            company: "Hyundai",
            model: "Venue",
            color: "Grey",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Dev",
        email: "dev.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO23",
            company: "Tata",
            model: "Punch",
            color: "Red",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Aisha",
        email: "aisha.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO24",
            company: "Maruti",
            model: "Brezza",
            color: "Silver",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Ronin",
        email: "ronin.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO25",
            company: "Mahindra",
            model: "XUV700",
            color: "White",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Sam",
        email: "sam.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO26",
            company: "Hyundai",
            model: "Creta",
            color: "Green",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Mark",
        email: "mark.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO27",
            company: "Volkswagen",
            model: "Virtus",
            color: "White",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Alex",
        email: "alex.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO28",
            company: "Skoda",
            model: "Slavia",
            color: "Blue",
            type: "AC",
            seats: 5
        }
    },
    {
        name: "Seb",
        email: "seb.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO29",
            company: "Toyota",
            model: "Innova Crysta",
            color: "Black",
            type: "AC",
            seats: 7
        }
    },
    {
        name: "Jen",
        email: "jen.demo@hop-in.in",
        vehicle: {
            veh_no: "MH01DEMO30",
            company: "Honda",
            model: "City",
            color: "Silver",
            type: "AC",
            seats: 5
        }
    }
];

const popularRoutes = [
    {
        source: "Mumbai",
        destination: "Pune",
        departureHours: [6, 8, 10, 12, 15, 18],
        fare: 350
    },
    {
        source: "Pune",
        destination: "Mumbai",
        departureHours: [6, 8, 10, 13, 16, 18],
        fare: 350
    },
    {
        source: "Mumbai",
        destination: "Nashik",
        departureHours: [6, 8, 10, 12, 15, 18],
        fare: 450
    },
    {
        source: "Nashik",
        destination: "Mumbai",
        departureHours: [6, 8, 10, 13, 16, 18],
        fare: 450
    },
    {
        source: "Pune",
        destination: "Nashik",
        departureHours: [6, 8, 10, 12, 15, 18],
        fare: 400
    },
    {
        source: "Nashik",
        destination: "Pune",
        departureHours: [6, 8, 10, 13, 16, 18],
        fare: 400
    }
];

function getDateWithTime(daysFromToday, hour) {
    const date = new Date();

    date.setDate(date.getDate() + daysFromToday);
    date.setHours(hour, 0, 0, 0);

    return date;
}

async function getOrCreateDemoDrivers() {
    const drivers = [];

    for (const demoDriver of demoDrivers) {
        let user = await UserModel.findOne({
            email: demoDriver.email,
            is_demo: true
        });

        if (!user) {
            user = await UserModel.create({
                name: demoDriver.name,
                email: demoDriver.email,
                password: "demo-password",
                is_demo: true
            });
        }

        let driverProfile = await DriverProfileModel.findOne({
            user_id: user._id,
            is_demo: true
        });

        if (!driverProfile) {
            driverProfile = await DriverProfileModel.create({
                user_id: user._id,
                is_demo: true
            });
        }

        let vehicle = await VehicleModel.findOne({
            owner: driverProfile._id,
            veh_no: demoDriver.vehicle.veh_no,
            is_demo: true
        });

        if (!vehicle) {
            vehicle = await VehicleModel.create({
                owner: driverProfile._id,
                ...demoDriver.vehicle,
                is_demo: true
            });
        }

        drivers.push({
            driverProfile,
            vehicle
        });
    }

    return drivers;
}

async function cleanup(){
    console.log("Irrelevant old demo rides clean up")
    const now = new Date();

    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() - 30);

    const cleanupResult = await RideModel.deleteMany({
        is_demo: true,
        departure_time: {
            $lt: expiryDate
        },
        booked_seats: 0
    });

    console.log(
        `Expired demo rides removed: ${cleanupResult.deletedCount}`
    );
}

async function generateDemoRides() {
    await cleanup();

    console.log("Starting demo ride generation...");

    const drivers = await getOrCreateDemoDrivers();

    const RIDES_PER_ROUTE_PER_DAY = 6;
    const DAYS_TO_GENERATE = 14;

    let createdCount = 0;
    let skippedCount = 0;

    /*
     * Generate rides for the next 14 days.
     *
     * 6 rides per route per day
     * 6 routes
     *
     * 6 × 6 × 14 = 504 rides
     */
    for (let day = 0; day < DAYS_TO_GENERATE; day++) {
        for (
            let routeIndex = 0;
            routeIndex < popularRoutes.length;
            routeIndex++
        ) {
            const route = popularRoutes[routeIndex];

            for (
                let rideIndex = 0;
                rideIndex < RIDES_PER_ROUTE_PER_DAY;
                rideIndex++
            ) {
                /*
                 * Rotate through all 30 drivers.
                 *
                 * The combination of day + routeIndex makes the
                 * driver assignment change between routes and days.
                 */
                const driverIndex =
                    (
                        day * popularRoutes.length +
                        routeIndex * RIDES_PER_ROUTE_PER_DAY +
                        rideIndex
                    ) % drivers.length;

                const driver = drivers[driverIndex];

                const departureHour =
                    route.departureHours[rideIndex];

                const departureTime = getDateWithTime(
                    day,
                    departureHour
                );

                /*
                 * Small deterministic fare variation.
                 * This keeps the demo looking more realistic
                 * without making prices random on every run.
                 */
                const fareVariation =
                    (rideIndex % 3) * 25;

                const fare = route.fare + fareVariation;

                /*
                 * Duplicate protection.
                 *
                 * We identify a demo ride by:
                 * driver + route + departure time.
                 */
                const existingRide = await RideModel.findOne({
                    driver_id: driver.driverProfile._id,
                    src: route.source,
                    dest: route.destination,
                    departure_time: departureTime,
                    is_demo: true
                });

                if (existingRide) {
                    skippedCount++;
                    continue;
                }

                await RideModel.create({
                    driver_id: driver.driverProfile._id,
                    vehicle_id: driver.vehicle._id,
                    src: route.source,
                    dest: route.destination,
                    departure_time: departureTime,
                    total_seats: driver.vehicle.seats,
                    available_seats: driver.vehicle.seats,
                    booked_seats: 0,
                    fare,
                    is_demo: true
                });

                createdCount++;
            }
        }
    }

    console.log(
        `Demo ride generation completed. ` +
        `Created: ${createdCount}, ` +
        `Skipped: ${skippedCount}`
    );

    return {
        created: createdCount,
        skipped: skippedCount
    };
}

module.exports = {
    generateDemoRides
};