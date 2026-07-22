const { z } = require("zod");

const signupSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
});

const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

const bookSchema = z.object({
    _id: z.string(),
    bookedSeats: z.number()
});

const cancellSchema = z.object({
    _id: z.string(),
    cancelledSeats: z.number()
});

const createOrderSchema = z.object({
    hold_id: z.string(),
});

const vehicleSchema = z.object({
    veh_no: z.string(),
    company: z.string(),
    model: z.string(),
    color: z.string(),
    type: z.string(),
    seats: z.number().int().positive()
});

const updateVehicleSchema = vehicleSchema.extend({
    _id: z.string()
});

const deleteVehicleSchema = z.object({
    _id: z.string()
});

const searchRideSchema = z.object({
    src: z.string().min(1),
    dest: z.string().min(1),
    date: z.string().date(),
    limit: z.coerce.number().min(1).max(20).default(5),
    cursor: z.string().optional()
});


module.exports = {
    signupSchema,
    signinSchema,
    bookSchema,
    cancellSchema,
    createOrderSchema,
    vehicleSchema,
    updateVehicleSchema,
    deleteVehicleSchema,
    searchRideSchema
};