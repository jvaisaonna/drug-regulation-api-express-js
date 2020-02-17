const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");

const checkAuth = require("../middleware/check-auth");
const { isHA, isDoctor } = require("../middleware/CheckUserRole");
const drugController = require("../controllers/drug");

router.get("/", checkAuth, isHA, (req, res, next) => {
	drugController.getAllDrug().then(result => {
		if (!result.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the drug formulary"
			});
		} else {
			return res
				.status(200)
				.json({ success: true, drugList: result.drugList });
		}
	});
});

router.get("/available", checkAuth, isDoctor, (req, res, next) => {
	drugController.getAllDrug().then(result => {
		if (!result.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the available drug formulary"
			});
		} else {
			let availableDrugList = [];
			for (let i = 0; i < result.drugList.length; i++) {
				let drug = result.drugList[i];

				if (drug.isValid) {
					availableDrugList.push(drug);
				}
			}

			return res
				.status(200)
				.json({ success: true, drugList: availableDrugList });
		}
	});
});

router.post("/", checkAuth, isHA, (req, res, next) => {
	drugController
		.createDrug("d-" + uuidv1(), req.body.type, req.body.name, "true")
		.then(result => {
			if (!result.success) {
				res.status(200).json({
					success: result.success,
					message: "Create drug failed"
				});
			} else {
				res.status(200).json({
					success: result.success,
					message: "Drug Created"
				});
			}
		});
});

router.patch("/", checkAuth, isHA, (req, res, next) => {
	let { did, type, name, isValid } = req.body;
	drugController
		.updateDrug(did, type, name, isValid ? "true" : "false")
		.then(result => {
			if (!result.success) {
				return res.status(200).json({
					success: result.success,
					message: "Update drug failed"
				});
			} else {
				return res.status(200).json({
					success: result.success,
					message: "Drug Updated"
				});
			}
		});
});

module.exports = router;
