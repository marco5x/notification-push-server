const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

// Middlewares
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Constantes

const port = 3001 || process.env.PORT;

const vapidKeys = {
  publicKey:
    "BI7OW5M044ws9kMSfOb0vvS04NNH1oS1d1M7JiS7-3YxeKl-UtQCeKvtikMDQqHfCTiN8kaOPh_ZDss-tejB27U",
  privateKey: "jA9yEw_8DdbjwwpcLbGZLzk3kzyI3TV4bhVS_B6TozI",
};

webpush.setVapidDetails(
  "mailto:server-production@mail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let userNotifications = [];

// Routes
app.get("/", (req, res) => {
  res.send("Server Listen");
});

app.post("/message", async (req, res) => {
  const { title, message } = req.body;
  const payload = JSON.stringify({ title: title, message: message });
  try {
    if (userNotifications.length > 0) {
      userNotifications.map(async (user) => {
        await webpush.sendNotification(user, payload);
      });
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/subscription", (req, res) => {
  let { pushSubscription } = req.body;
  let user = userNotifications.find(
    (user) => user.endpoint === pushSubscription.endpoint
  );
  try {
    if (!user) {
      userNotifications = [...userNotifications, pushSubscription];
    }
    //console.log(userNotifications);
    res.sendStatus(200).json();
  } catch (error) {
    console.error(error);
  }
});

//Server port

app.listen(port, () => console.log(`Server listening on port ${port}`));
