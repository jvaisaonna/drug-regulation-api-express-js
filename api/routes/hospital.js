const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const { isHospital } = require("../middleware/CheckUserRole");

const helper = require("../helper");
const userController = require("../controllers/user");
const hospitalController = require("../controllers/hospital");

router.get("/", checkAuth, isHospital, (req, res, next) => {
	let reqHospitalId =
		req.userData.position[req.userData.position.length - 1].hospital.hid;
	hospitalController.getAllHospital().then(result => {
		if (!result.success) {
			return res.status(200).json({
				success: false,
				message: "Get Hospital Information Failed"
			});
		} else {
			for (let i = 0; i < result.hospitalList.length; i++) {
				if (result.hospitalList[i].hid === reqHospitalId) {
					return res.status(200).json({
						success: true,
						message: "Updated Hospital Info",
						hospital: result.hospitalList[i]
					});
				}
			}
		}
	});
});

router.post("/doctor", checkAuth, isHospital, (req, res, next) => {
	userController.getAllUser().then(userResult => {
		if (!userResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the user list"
			});
		} else {
			let userList = userResult.userList;
			let doctorHKID = req.body.hkid;
			let foundUser = null;

			for (let i = 0; i < userList.length; i++) {
				if (userList[i].hkid === doctorHKID) {
					if (
						userList[i].position[userList[i].position.length - 1].role !==
						0
					) {
						return res.status(200).json({
							success: false,
							message: "The spcific user is not normal user role"
						});
					}
					foundUser = userList[i];
					delete foundUser["username"];
					delete foundUser["password"];

					foundUser.position = {
						time: helper.getNowTimeStamp(),
						hospital: req.userData.latestPosition.hospital,
						role: 1
					};

					hospitalController
						.add_to_hospital_doctor_list(
							req.userData.latestPosition.hospital.hid,
							foundUser
						)
						.then(addResult => {
							if (!addResult.success) {
								return res.status(200).json({
									success: false,
									message: "Cannot add doctor to your hospital"
								});
							} else {
								userController
									.add_user_position(foundUser.uid, foundUser.position)
									.then(addPositionResult => {
										if (!addPositionResult.success) {
											return res.status(200).json({
												success: false,
												message: "Cannot add user position"
											});
										} else {
											return res.status(200).json({
												success: true,
												message: "Doctor Added"
											});
										}
									});
							}
						});
				}
			}

			if (!foundUser) {
				return res.status(200).json({
					success: false,
					message: "Cannot find the user"
				});
			}
		}
	});
});

router.post("/pharmacist", checkAuth, isHospital, (req, res, next) => {
	userController.getAllUser().then(userResult => {
		if (!userResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the user list"
			});
		} else {
			let userList = userResult.userList;
			let doctorHKID = req.body.hkid;
			let foundUser = null;

			for (let i = 0; i < userList.length; i++) {
				if (userList[i].hkid === doctorHKID) {
					if (
						userList[i].position[userList[i].position.length - 1].role !==
						0
					) {
						return res.status(200).json({
							success: false,
							message: "The spcific user is not normal user role"
						});
					}
					foundUser = userList[i];
					delete foundUser["username"];
					delete foundUser["password"];

					foundUser.position = {
						time: helper.getNowTimeStamp(),
						hospital: req.userData.latestPosition.hospital,
						role: 2
					};

					hospitalController
						.add_to_hospital_pharmacist_list(
							req.userData.latestPosition.hospital.hid,
							foundUser
						)
						.then(addResult => {
							if (!addResult.success) {
								return res.status(200).json({
									success: false,
									message: "Cannot add doctor to your hospital"
								});
							} else {
								userController
									.add_user_position(foundUser.uid, foundUser.position)
									.then(addPositionResult => {
										if (!addPositionResult.success) {
											return res.status(200).json({
												success: false,
												message: "Cannot add user position"
											});
										} else {
											return res.status(200).json({
												success: true,
												message: "Pharmacist Added"
											});
										}
									});
							}
						});
				}
			}

			if (!foundUser) {
				return res.status(200).json({
					success: false,
					message: "Cannot find the user"
				});
			}
		}
	});
});

router.delete("/doctor/:uid", checkAuth, isHospital, (req, res, next) => {
	let removeUid = req.params.uid;
	hospitalController
		.remove_from_hospital_doctor_list(
			req.userData.latestPosition.hospital.hid,
			removeUid
		)
		.then(removeResult => {
			if (!removeResult.success) {
				return res.status(200).json({
					success: false,
					message: "Cannot remove doctor from list"
				});
			} else {
				userController
					.add_user_position(removeUid, {
						role: 0,
						hospital: {},
						time: helper.getNowTimeStamp()
					})
					.then(addResult => {
						if (!addResult.success) {
							return res.status(200).json({
								success: false,
								message: "Cannot recover user role"
							});
						} else {
							return res
								.status(200)
								.json({ success: true, message: "Docter Removed" });
						}
					});
			}
		});
});

router.delete("/pharmacist/:uid", checkAuth, isHospital, (req, res, next) => {
	let removeUid = req.params.uid;
	hospitalController
		.remove_from_hospital_pharmacist_list(
			req.userData.latestPosition.hospital.hid,
			removeUid
		)
		.then(removeResult => {
			if (!removeResult.success) {
				return res.status(200).json({
					success: false,
					message: "Cannot remove pharmacist from list"
				});
			} else {
				userController
					.add_user_position(removeUid, {
						role: 0,
						hospital: {},
						time: helper.getNowTimeStamp()
					})
					.then(addResult => {
						if (!addResult.success) {
							return res.status(200).json({
								success: false,
								message: "Cannot recover user role"
							});
						} else {
							return res
								.status(200)
								.json({ success: true, message: "Removed pharmacist" });
						}
					});
			}
		});
});

module.exports = router;
