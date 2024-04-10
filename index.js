const express = require('express')
const app = express()


const bodyParser = require('body-parser');
const db = require('./database/mongoDB');
const admin=""
const firebase =""
const cors = require('cors');
const http = require('http');
const { MongoClient } = require('mongodb');

const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb', type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

const url = 'mongodb+srv://ljexam:LjExam@ljexam.vysc2ku.mongodb.net';
const dbName = 'location'; // Your database name
const collectionName = 'pincodes'; // Your collection name




const clientLocation = {
    latitude: 40.7128, // Example latitude (New York City)
    longitude: -74.0060 // Example longitude (New York City)
  };
  

// Endpoint to calculate distance
app.post('/calculate-distance', async (req, res) => {
  console.log(req.body)
  let { userPincode } = req.body;
  userPincode = parseInt(userPincode);

  console.log("User pincode : ",userPincode)
  
  shopPincode=140308

  try {
    const userLocation = await getLocationFromPincode(userPincode);
    const shopLocation = await getLocationFromPincode(shopPincode);

    console.log("User Location : ",userLocation)

    if(userLocation!=-1){
      const distance = calculateDistance(userLocation, shopLocation);
      return res.json({ distance });
    }else{
      return res.json({ distance:-1 });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getLocationFromPincode(pincode) {
    const client = new MongoClient(url);
  
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Perform geospatial query to find location near the given pincode
      const location = await collection.aggregate([
        {
          $match: {
            postalCode: pincode
          }
        },
        {
          $project: {
            _id: 0,
            latitude: "$geoPosition.latitude",
            longitude: "$geoPosition.longitude"
          }
        }
      ]).toArray();
  
      console.log("Location:", location); // Log the location data
      console.log("Pincode:", pincode); // Log the location data
  
      if (location.length === 0) {
        return -1
      }
  
      return location[0];
    } finally {
      await client.close();
    }
  }


  // Function to calculate distance between two geographical points using Haversine formula
function calculateDistance(point1, point2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = point1.latitude;
    const lon1 = point1.longitude;
    const lat2 = point2.latitude;
    const lon2 = point2.longitude;
  
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  }
  



app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)