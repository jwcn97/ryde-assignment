function calculateEuclideanRange(user = {}, MAX_DISTANCE = 5) {
    let result = {
        lat_range: [null, null],
        long_range: [null, null],
    };

    if (user.latitude)
        result['lat_range'] = [
            parseFloat(user.latitude) - parseFloat(MAX_DISTANCE),
            parseFloat(user.latitude) + parseFloat(MAX_DISTANCE),
        ];
    if (user.longitude)
        result['long_range'] = [
            parseFloat(user.longitude) - parseFloat(MAX_DISTANCE),
            parseFloat(user.longitude) + parseFloat(MAX_DISTANCE),
        ];

    return result;
}

module.exports = calculateEuclideanRange;
