import express from 'express';
import http from 'http';
import Jimp from 'jimp'

const app = express();

//set server port
const port = process.env.PORT || 8080;
//create server
const server = http.createServer(app);

// listening to server
server.on('listening', function () {
  console.log(`Node Server is running on port ${port}`);
});
server.listen(port);

//body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));

//handle cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, GET, DELETE, PATCH, POST');
    return res.status(200).json()
  }
  next();
});

app.get('/', async (req, res) => {
  res.send({ message: "Hello World", status: 1, server: 'PRODUCTION' });
});

app.post('/generateCoupon', async (req, res) => {

  const { code } = req.body;
  try {
    // Reading image
    const image = await Jimp.read('img.jpg');

    // Defining the text font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print(font, 180, 420, code);

    // Writing image after processing
    await image.writeAsync('image.png');

    res.status(200).json({ message: "Coupon Code Generated", success: true });
  } catch {
    res.status(500).json({ message: "Something went wrong", success: false });
  }

});
