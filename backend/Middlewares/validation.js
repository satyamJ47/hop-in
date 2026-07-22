
function validate(schema,source="body"){
    return (req,res,next)=>{
        console.log("validate schema test")
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error.issues[0].message
            });
        }
        req[source] = result.data
        next();
    }
}
module.exports = validate;