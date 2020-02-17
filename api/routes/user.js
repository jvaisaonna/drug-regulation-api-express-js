const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user");
const uuidv1 = require("uuid/v1");

const checkAuth = require("../middleware/check-auth");
const { isDoctor } = require("../middleware/CheckUserRole");

const helper = require("../helper");

router.get("/patient", checkAuth, isDoctor, (req, res, next) => {
	userController.getAllUser().then(result => {
		if (!result.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the user list"
			});
		} else {
			let userList = result.userList;
			let patientList = [];

			for (let i = 0; i < userList.length; i++) {
				let user = userList[i];
				let latestPosition = user.position[user.position.length - 1];
				if (latestPosition.role <= 2) {
					delete user["username"];
					delete user["password"];

					patientList.push(user);
				}
			}

			return res.status(200).json({
				success: true,
				patientList: patientList
			});
		}
	});
});

router.post("/register", (req, res, next) => {
	userController.getAllUser().then(result => {
		let userList = result.userList;

		for (let i = 0; i < userList.length; i++) {
			if (userList[i].username === req.body.username) {
				return res.status(200).json({
					success: false,
					message: "User exist"
				});
			}
		}

		bcrypt.hash(req.body.password, 10, async (err, hash) => {
			if (err) {
				console.log("bcrypt.hash Error:", err);
				return res.status(200).json({
					success: false,
					message: "Cannot create user, please contact us",
					error: err
				});
			} else {
				await userController.createUser(
					"u-" + uuidv1(),
					req.body.first_name,
					req.body.last_name,
					req.body.gender,
					req.body.hkid,
					req.body.phone_number,
					req.body.birth_date_ts,
					{ time: helper.getNowTimeStamp(), hospital: {}, role: 0 },
					req.body.username,
					hash
				);

				//call chain code to insert user
				return res.status(200).json({
					success: true,
					message: "Register success! You can sign in your account now"
				});
			}
		});
	});
});

router.post("/login", async (req, res, next) => {
	let reqUsername = req.body.username;
	let reqPassword = req.body.password;

	// console.log("reqUsername:", reqUsername);
	// console.log("reqPassword:", reqPassword);
	userController.getAllUser().then(response => {
		// console.log("userController.getAllUser() Response:", response);

		let userList = response.userList;
		let userObj = null;
		let userFound = false;

		for (var i = 0; i < userList.length; i++) {
			// console.log("userList[" + i + "].username:", userList[i].username);
			if (userList[i].username === reqUsername) {
				userFound = true;
				userObj = userList[i];

				bcrypt.compare(reqPassword, userObj.password, (err, result) => {
					if (err) {
						return res.status(200).json({
							success: false,
							message: "Authentication failed, please contact us."
						});
					}
					// Result: true/false
					if (result) {
						delete userObj["username"];
						delete userObj["password"];

						const token = jwt.sign(
							{
								...userObj
							},
							process.env.JWT_KEY,
							{
								expiresIn: "1d"
							}
						);
						return res.status(200).json({
							success: true,
							message:
								"Login as " +
								userObj.last_name +
								" " +
								userObj.first_name +
								".",
							token: token,
							user: userObj
						});
					}
					return res.status(200).json({
						success: false,
						message: "Your password might not correct"
					});
				});
				break;
			}
		}
		if (!userFound) {
			return res.status(200).json({
				success: false,
				message: "Cannot find your username"
			});
		}
	});
});

module.exports = router;
