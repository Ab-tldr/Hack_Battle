const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Store the GPS coordinates of the two other devices
const device1 = { lat: 37.7749, lon: -122.4194 }; // Sample coordinates
const device2 = { lat: 34.0522, lon: -118.2437 }; // Sample coordinates

// Calculate the distance between two sets of GPS coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}

// Compare the user's location with the two devices and determine the closest one
app.post('/compare-locations', (req, res) => {
    const userLat = req.body.lat;
    const userLon = req.body.lon;

    const distanceToDevice1 = calculateDistance(userLat, userLon, device1.lat, device1.lon);
    const distanceToDevice2 = calculateDistance(userLat, userLon, device2.lat, device2.lon);

    let closestDevice;
    if (distanceToDevice1 < distanceToDevice2) {
        closestDevice = 'Device 1';
    } else {
        closestDevice = 'Device 2';
    }

    res.json({ closestDevice });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});