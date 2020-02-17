const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const drugRoutes = require("./api/routes/drugs");
const userRoutes = require("./api/routes/user");
const hospitalRoutes = require("./api/routes/hospital");
const deliveryRecordRoutes = require("./api/routes/deliveryRecord");
// Special Route
const developmentRoutes = require("./api/routes/development");

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin,X-Requested-With,Content-Type,Accept,Authorization"
		);
		return res.status(200).json({});
	}
	next();
});

app.use("/drug", drugRoutes);
app.use("/user", userRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/deliveryRecord", deliveryRecordRoutes);
app.use("/dev", developmentRoutes);

app.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status = error.status || 500;
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
