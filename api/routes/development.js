const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");

const helper = require("../helper");
const userController = require("../controllers/user");
const drugController = require("../controllers/drug");
const hospitalController = require("../controllers/hospital");
const deliveryRecordController = require("../controllers/deliveryRecord");

router.get("/initDefault", async (req, res, next) => {
	const resInitUserList = userController.initUserList().then(res => {
		return { initUserList: res.success };
	});
	const resInitDrugList = drugController.initDrugList().then(res => {
		return { initDrugList: res.success };
	});
	const resInitHospitalList = hospitalController
		.initHospitalList()
		.then(res => {
			return { initHospitalList: res.success };
		});
	const resInitDeliveryRecordList = deliveryRecordController
		.initDeliveryRecordList()
		.then(res => {
			return { initDeliveryRecordList: res.success };
		});

	Promise.all([
		resInitUserList,
		resInitDrugList,
		resInitHospitalList,
		resInitDeliveryRecordList
	]).then(async initResult => {
		bcrypt.hash("12345678", 10, async (err, hash) => {
			const resCreateHA = await userController
				.createUser(
					"u-" + uuidv1(),
					"Admin",
					"HA",
					"male",
					"A0000000",
					"23006555",
					helper.getNowTimeStamp(),
					{ time: helper.getNowTimeStamp(), hospital: {}, role: 10 },
					"haAdmin",
					hash
				)
				.then(res => {
					return { resCreateHA: res.success };
				});

			const resCreateHospital_1 = await hospitalController
				.createHospital(
					"h-" + uuidv1(),
					"Queen Elizabeth Hospital",
					"30 Gascoigne Road, King's Park, Kowloon, Hong Kong"
				)
				.then(res => {
					if (!res.success) {
						return { resCreateHospital_1: res.success };
					}
					return userController
						.createUser(
							"u-" + uuidv1(),
							"Admin",
							"QE",
							"male",
							"A0000000",
							"35068888",
							helper.getNowTimeStamp(),
							{
								time: helper.getNowTimeStamp(),
								hospital: res.hospital,
								role: 11
							},
							"qeAdmin",
							hash
						)
						.then(res => {
							return {
								resCreateHospital_1: true,
								createUser: res.success
							};
						});
				});
			const resCreateHospital_2 = await hospitalController
				.createHospital(
					"h-" + uuidv1(),
					"United Christian Hospital",
					"130 Hip Wo Street, Kwun Tong, Kowloon, Hong Kong"
				)
				.then(res => {
					if (!res.success) {
						return { resCreateHospital_2: res.success };
					}
					return userController
						.createUser(
							"u-" + uuidv1(),
							"Admin",
							"UC",
							"male",
							"A0000000",
							"23799611",
							helper.getNowTimeStamp(),
							{
								time: helper.getNowTimeStamp(),
								hospital: res.hospital,
								role: 11
							},
							"ucAdmin",
							hash
						)
						.then(res => {
							return {
								resCreateHospital_2: true,
								createUser: res.success
							};
						});
				});

			Promise.all([
				initResult,
				resCreateHA,
				resCreateHospital_1,
				resCreateHospital_2
			]).then(createHospitalResult => {
				res.status(200).json({
					Initialize: createHospitalResult.shift(),
					CreateAdmin: createHospitalResult
				});
			});
		});
	});
});

router.get("/initAll", (req, res, next) => {
	const resInitUserList = userController.initUserList().then(res => {
		return { initUserList: res.success };
	});
	const resInitDrugList = drugController.initDrugList().then(res => {
		return { initDrugList: res.success };
	});
	const resInitHospitalList = hospitalController
		.initHospitalList()
		.then(res => {
			return { initHospitalList: res.success };
		});
	const resInitDeliveryRecordList = deliveryRecordController
		.initDeliveryRecordList()
		.then(res => {
			return { initDeliveryRecordList: res.success };
		});

	Promise.all([
		resInitUserList,
		resInitDrugList,
		resInitHospitalList,
		resInitDeliveryRecordList
	]).then(value => {
		res.status(200).json(value);
	});
});

router.get("/initUserList", async (req, res, next) => {
	userController.initUserList().then(response => {
		if (!response.success) {
			res.status(200).json({
				success: false,
				message: "Cannot initialize the User List"
			});
		} else {
			res.status(200).json({
				success: true,
				message: "User list initialized"
			});
		}
	});
});

router.get("/initDrugList", async (req, res, next) => {
	drugController.initDrugList().then(response => {
		if (!response.success) {
			res.status(200).json({
				success: false,
				message: "Cannot initialize the Drug List"
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Drug list initialized"
			});
		}
	});
});

router.get("/initHospitalList", async (req, res, next) => {
	hospitalController.initHospitalList().then(response => {
		if (!response.success) {
			res.status(200).json({
				success: false,
				message: "Cannot initialize the Hospital List"
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Hospital list initialized"
			});
		}
	});
});

router.get("/initDeliveryRecordList", async (req, res, next) => {
	deliveryRecordController.initDeliveryRecordList().then(response => {
		if (!response.success) {
			res.status(200).json({
				success: false,
				message: "Cannot initialize the Delivery Record List"
			});
		} else {
			res.status(200).json({
				success: true,
				message: "Delivery Record list initialized"
			});
		}
	});
});

module.exports = router;
