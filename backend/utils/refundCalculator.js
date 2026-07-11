function calculateRefund(fare, seats, departureTime) {
    const hoursLeft =
        (departureTime - Date.now()) / (1000 * 60 * 60);

    console.log(hoursLeft)
    
        let refundPercent;

    
    if (hoursLeft > 24) {
        refundPercent = 100;
    } else if (hoursLeft > 6) {
        refundPercent = 75;
    } else if (hoursLeft > 1) {
        refundPercent = 50;
    } else {
        refundPercent = 0;
    }

    const refundAmount =
        (fare * seats * refundPercent) / 100;

    const cancellationFee =
        fare * seats - refundAmount;

    return {
        refundPercent,
        refundAmount,
        cancellationFee
    };
}

module.exports = {
    calculateRefund
};