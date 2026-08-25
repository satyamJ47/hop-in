import { cancelBooking, getBookingDetails } from "@/api/rides";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Car, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function BookingDetailsPage() {
    const { bookingId } = useParams();

    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelledSeats, setCancelledSeats] = useState(1);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        async function fetchBooking() {
            try {
                const data = await getBookingDetails(bookingId);
                setBooking(data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch booked ride"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchBooking();
    }, [bookingId]);

    async function handleCancellation() {
        setCancelling(true);
        setCancelError(null);

        try {
            await cancelBooking(
                booking.booking.id,
                cancelledSeats
            );

            // Fetch fresh booking data
            const data = await getBookingDetails(bookingId);
            setBooking(data);

            // Close dialog
            setCancelOpen(false);

            // Reset selection
            setCancelledSeats(1);
        } catch (err) {
            setCancelError(
                err.response?.data?.message ||
                "Failed to cancel seats"
            );
        } finally {
            setCancelling(false);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-destructive">{error}</p>;
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="text-3xl font-bold">
                Booking Details
            </h1>

            <p className="mt-1 text-muted-foreground">
                Your ride and booking information
            </p>

            {booking && (
                <div className="mt-6 space-y-6">

                    {/* Ride */}
                    <div className="rounded-lg border p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    From
                                </p>

                                <h2 className="text-2xl font-bold">
                                    {booking.ride.src}
                                </h2>
                            </div>

                            <div className="text-muted-foreground">
                                →
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                    To
                                </p>

                                <h2 className="text-2xl font-bold">
                                    {booking.ride.dest}
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Departure
                            </p>

                            <p className="mt-1 font-medium">
                                {format(
                                    new Date(
                                        booking.ride.departureTime
                                    ),
                                    "dd MMM yyyy • hh:mm a"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Booking Information */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold">
                            Booking Information
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-3">

                            {/* Status */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>

                                <div className="mt-1">
                                    <Badge>
                                        {booking.booking.status ===
                                        "booked"
                                            ? "Confirmed"
                                            : booking.booking.status ===
                                                "cancelled"
                                                ? "Cancelled"
                                                : "Completed"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Active Seats */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active Seats
                                </p>

                                <p className="mt-1 font-medium">
                                    {booking.booking.activeSeats}
                                </p>
                            </div>

                            {/* Fare */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Fare
                                </p>

                                <p className="mt-1 font-medium">
                                    ₹{booking.booking.fare}
                                </p>
                            </div>

                        </div>

                        {/* Booking ID */}
                        <div className="mt-5 border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Booking ID
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                                {booking.booking.id}
                            </p>
                        </div>

                        {/* Booked On */}
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                                Booked On
                            </p>

                            <p className="mt-1 font-medium">
                                {format(
                                    new Date(
                                        booking.booking.createdAt
                                    ),
                                    "dd MMM yyyy • hh:mm a"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Driver & Vehicle */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold">
                            Driver & Vehicle
                        </h2>

                        <div className="mt-5 grid gap-6 sm:grid-cols-2">

                            {/* Driver */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-3">
                                    <User className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Driver
                                    </p>

                                    <p className="font-medium">
                                        {booking.driver.name}
                                    </p>
                                </div>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-3">
                                    <Car className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Vehicle
                                    </p>

                                    <p className="font-medium">
                                        {booking.vehicle.company}{" "}
                                        {booking.vehicle.model}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {booking.vehicle.number}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3">

                            {/* Color */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Color
                                </p>

                                <p className="mt-1 font-medium">
                                    {booking.vehicle.color}
                                </p>
                            </div>

                            {/* Type */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Type
                                </p>

                                <p className="mt-1 font-medium">
                                    {booking.vehicle.type}
                                </p>
                            </div>

                            {/* Vehicle Seats */}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Vehicle Seats
                                </p>

                                <p className="mt-1 font-medium">
                                    {booking.vehicle.seats}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-lg border p-6">
                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Payment
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Booking payment
                                </p>
                            </div>

                            <Badge>
                                {booking.payment.status ===
                                "captured"
                                    ? "Paid"
                                    : booking.payment.status ===
                                        "created"
                                        ? "Pending"
                                        : "Failed"}
                            </Badge>

                        </div>

                        <div className="mt-5">
                            <p className="text-sm text-muted-foreground">
                                Amount Paid
                            </p>

                            <p className="mt-1 text-3xl font-bold">
                                ₹{booking.payment.amount}
                            </p>
                        </div>
                    </div>

                    {booking.booking.status === "booked" &&
                        booking.booking.activeSeats > 0 && (
                            <div className="rounded-lg border p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Cancel Seats
                                        </h2>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            You currently have{" "}
                                            {booking.booking.activeSeats} active{" "}
                                            {booking.booking.activeSeats === 1
                                                ? "seat"
                                                : "seats"}.
                                        </p>
                                    </div>

                                    <Dialog
                                        open={cancelOpen}
                                        onOpenChange={(open) => {
                                            setCancelOpen(open);

                                            if (!open) {
                                                setCancelledSeats(1);
                                                setCancelError(null);
                                            }
                                        }}
                                    >
                                        <DialogTrigger
                                            render={
                                                <Button variant="destructive">
                                                    Cancel Seats
                                                </Button>
                                            }
                                        />

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Cancel Seats
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Select how many seats you want to
                                                    cancel. This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="py-6">
                                                <p className="text-sm text-muted-foreground">
                                                    Active seats
                                                </p>

                                                <div className="mt-3 flex items-center justify-center gap-6">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={cancelledSeats <= 1}
                                                        onClick={() =>
                                                            setCancelledSeats(
                                                                (prev) => prev - 1
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </Button>

                                                    <span className="text-2xl font-semibold">
                                                        {cancelledSeats}
                                                    </span>

                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        disabled={
                                                            cancelledSeats >=
                                                            booking.booking.activeSeats
                                                        }
                                                        onClick={() =>
                                                            setCancelledSeats(
                                                                (prev) => prev + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </div>

                                                <p className="mt-3 text-center text-sm text-muted-foreground">
                                                    {cancelledSeats}{" "}
                                                    {cancelledSeats === 1
                                                        ? "seat"
                                                        : "seats"}{" "}
                                                    will be cancelled.
                                                </p>

                                                {cancelError && (
                                                    <p className="mt-4 text-sm text-destructive">
                                                        {cancelError}
                                                    </p>
                                                )}
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setCancelOpen(false)
                                                    }
                                                    disabled={cancelling}
                                                >
                                                    Keep Booking
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    disabled={cancelling}
                                                    onClick={handleCancellation}
                                                >
                                                    {cancelling
                                                        ? "Cancelling..."
                                                        : "Confirm Cancellation"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        )}

                    {/* Cancellation */}
                    {booking.cancellation && (
                        <div className="rounded-lg border p-6">

                            <div className="flex items-center justify-between gap-4">

                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Cancellation
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Cancellation and refund details
                                    </p>
                                </div>

                                <Badge variant="secondary">
                                    {booking.booking.cancelledSeats}{" "}
                                    {booking.booking.cancelledSeats ===
                                    1
                                        ? "seat"
                                        : "seats"}{" "}
                                    cancelled
                                </Badge>

                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">

                                {/* Cancelled Seats */}
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Cancelled Seats
                                    </p>

                                    <p className="mt-1 font-medium">
                                        {booking.booking.cancelledSeats}
                                    </p>
                                </div>

                                {/* Cancellation Fee */}
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Cancellation Fee
                                    </p>

                                    <p className="mt-1 font-medium">
                                        ₹
                                        {
                                            booking.cancellation
                                                .totalFee
                                        }
                                    </p>
                                </div>

                                {/* Total Refund */}
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Refund
                                    </p>

                                    <p className="mt-1 font-medium">
                                        ₹
                                        {
                                            booking.cancellation
                                                .totalRefund
                                        }
                                    </p>
                                </div>

                            </div>

                            {/* Cancellation History */}
                            {booking.cancellation.refunds.length >
                                0 && (
                                <div className="mt-6 border-t pt-5">

                                    <h3 className="font-semibold">
                                        Cancellation History
                                    </h3>

                                    <div className="mt-4 space-y-3">

                                        {booking.cancellation.refunds.map(
                                            (refund) => (
                                                <div
                                                    key={refund.id}
                                                    className="rounded-md border p-4"
                                                >

                                                    <div className="flex items-center justify-between gap-4">

                                                        <p className="font-medium">
                                                            {
                                                                refund.seats
                                                            }{" "}
                                                            {
                                                                refund.seats ===
                                                                1
                                                                    ? "seat"
                                                                    : "seats"
                                                            }
                                                        </p>

                                                        <p className="font-semibold">
                                                            ₹
                                                            {
                                                                refund.amount
                                                            }
                                                        </p>

                                                    </div>

                                                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">

                                                        <p className="text-muted-foreground">
                                                            Fee: ₹
                                                            {
                                                                refund.cancellationFee
                                                            }
                                                        </p>

                                                        <p className="text-muted-foreground">
                                                            Status:{" "}
                                                            {
                                                                refund.status
                                                            }
                                                        </p>

                                                        <p className="text-muted-foreground">
                                                            {format(
                                                                new Date(
                                                                    refund.cancelledAt
                                                                ),
                                                                "dd MMM yyyy • hh:mm a"
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            )}

            
        </div>
    );
}