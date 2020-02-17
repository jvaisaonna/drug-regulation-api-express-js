const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");

const helper = require("../helper");
const checkAuth = require("../middleware/check-auth");
const { isDoctor, isPharmacist } = require("../middleware/CheckUserRole");
const axios = require('axios');
const deliveryRecordController = require("../controllers/deliveryRecord");
const z3serverURL = "http://localhost:3002"

router.get("/", checkAuth, (req, res, next) => {
	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the delivery record"
			});
		} else {
			return res.status(200).json({
				success: true,
				message: "Get delivery record success",
				deliveryRecordList: getResult.deliveryRecordList
			});
		}
	});
});

router.get("/doctor", checkAuth, isDoctor, (req, res, next) => {
	let doctorUid = req.userData.uid;
	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the delivery record"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;
			let doctorRecord = [];
			for (let i = 0; i < deliveryRecordList.length; i++) {
				let record = deliveryRecordList[i];
				if (record.actions[0].user.uid === doctorUid) {
					doctorRecord.push(record);
				}
			}

			return res.status(200).json({
				success: true,
				message: "Get delivery record success",
				deliveryRecordList: doctorRecord
			});
		}
	});
});

router.get("/pharmacist", checkAuth, isPharmacist, (req, res, next) => {
	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the delivery record"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;
			let pharmacistRecord = [];

			for (let i = 0; i < deliveryRecordList.length; i++) {
				let record = deliveryRecordList[i];
				let latestAction = record.actions[record.actions.length - 1];

				if (latestAction.state === 0 || latestAction.state === 1) {
					pharmacistRecord.push(record);
				}
			}

			return res.status(200).json({
				success: true,
				message: "Get delivery record success",
				deliveryRecordList: pharmacistRecord
			});
		}
	});
});

router.get("/:uid", checkAuth, (req, res, next) => {
	let patientId = req.params.uid;

	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the delivery record"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;
			let patientRecord = [];
			for (let i = 0; i < deliveryRecordList.length; i++) {
				let record = deliveryRecordList[i];
				if (record.patient.uid === patientId) {
					patientRecord.push(record);
				}
			}

			return res.status(200).json({
				success: true,
				message: "Get delivery record success",
				deliveryRecordList: patientRecord
			});
		}
	});
});

router.get("/pharmacist/:uid", checkAuth, isPharmacist, (req, res, next) => {
	let pharmacistuid = req.params.uid;

	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			return res.status(200).json({
				success: false,
				message: "Cannot get the delivery record"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;

			for (let i = 0; i < deliveryRecordList.length; i++) {
				let record = deliveryRecordList[i];
				let latestAction = record.actions[record.actions.length - 1];

				if (
					latestAction.user.uid === pharmacistuid &&
					latestAction.state < 3
				) {
					return res.status(200).json({
						success: true,
						message: "Get delivery record success",
						deliveryRecord: record
					});
				}

				return res.status(200).json({
					success: true,
					message: "Get delivery record success",
					deliveryRecord: {}
				});
			}
		}
	});
});

router.post("/", checkAuth, isDoctor, (req, res, next) => {
	let user = req.userData;
	user.position = user.position[user.position.length - 1];
	let patient = req.body.patient;
	let patientId = patient.uid;
	delete patient["position"];
	let drugDetail = req.body.drugDetail;

	let newRecordId = "r-" + uuidv1();
	let action = {
		time: helper.getNowTimeStamp(),
		state: 0,
		user: user,
		drugDetail: drugDetail
	};
	deliveryRecordController.getAllDeliveryRecord()
		.then(getResult => {
			if (!getResult.success) {
				return res.status(200).json({
					success: false,
					message: "Cannot get the delivery record"
				});
			} else {
				console.log("proceed to checking block ")
				let deliveryRecordList = getResult.deliveryRecordList;
				let patientRecord = [];
				for (let i = 0; i < deliveryRecordList.length; i++) {
					let record = deliveryRecordList[i];
					if (record.patient.uid === patientId) {
						patientRecord.push(record);
					}
				}
				console.log(patientRecord);

				let currentDrugList = [];
				let resultString = "";
				currentDrugList.push(drugDetail.drug.name)
				for (var i = 0; i < patientRecord.length; i++) {
					console.log("record: ", patientRecord[i])
					let curTime = helper.getNowTimeStamp();
					if (parseInt(patientRecord[i].actions[patientRecord[i].actions.length - 1].drugDetail.treatment_duration) * 86400 + patientRecord[i].actions[patientRecord[i].actions.length - 1].time > curTime) {
						console.log(patientRecord[i].actions[patientRecord[i].actions.length - 1])
						if (patientRecord[i].actions[patientRecord[i].actions.length - 1].state != 3) {
							currentDrugList.push(patientRecord[i].actions[patientRecord[i].actions.length - 1].drugDetail.drug.name)
						}
					}
				}
				console.log(currentDrugList)
				axios.post(z3serverURL, {
					Drug: currentDrugList
				})
					.then(function (response) {
						let resFromZ3 = JSON.parse(JSON.stringify(response.data))
						console.log(resFromZ3);
						let descriptionList = [];
						if (resFromZ3.result == null) {
							for (var i = 0; i < resFromZ3.length; i++) {
								descriptionList.push(resFromZ3[i].description);
							}
							let uniqueDescription = [...new Set(descriptionList)];
							for (var i = 0; i < uniqueDescription.length; i++) {
								resultString += (uniqueDescription[i] + "\n");
							}
							console.log(resultString);

							return res.status(200).json({
								success: false,
								isPermanent: true,
								message: resultString

							});
						}
						console.log(resFromZ3);

						deliveryRecordController
							.createDeliveryRecord(newRecordId, patient)
							.then(createResult => {
								if (!createResult.success) {
									res.status(200).json({
										success: false,
										message: "Create record failed"
									});
								} else {
									deliveryRecordController
										.addActionToDeliveryRecord(newRecordId, action)
										.then(addResult => {
											if (!addResult.success) {
												res.status(200).json({
													success: false,
													message: "Add record action failed"
												});
											} else {
												res.status(200).json({
													success: true,
													message: "Create record success"
												});
											}
										});
								}
							});
					})
					.catch(function (error) {
						console.log(error);
					});

			}
		})





});

router.patch("/:rid", checkAuth, (req, res, next) => {
	let recordId = req.params.rid;
	let drugDetail = req.body.drugDetail;
	let user = req.userData;
	console.log("body: ", req.body);
	let patientId = req.body.patientId;
	user.position = user.position[user.position.length - 1];

	let action = {
		time: helper.getNowTimeStamp(),
		state: 1,
		user: user,
		drugDetail: drugDetail
	};


	deliveryRecordController.getAllDeliveryRecord()
		.then(getResult => {
			if (!getResult.success) {
				return res.status(200).json({
					success: false,
					message: "Cannot get the delivery record"
				});
			} else {
				console.log("proceed to checking block ")
				let deliveryRecordList = getResult.deliveryRecordList;
				let patientRecord = [];
				for (let i = 0; i < deliveryRecordList.length; i++) {
					let record = deliveryRecordList[i];
					console.log(record);
					if (record.patient.uid === patientId) {
						patientRecord.push(record);
					}
				}
				console.log(patientRecord);

				let currentDrugList = [];
				let resultString = "";

				currentDrugList.push(drugDetail.drug.name)
				for (var i = 0; i < patientRecord.length; i++) {
					console.log("record: ", patientRecord[i])
					let curTime = helper.getNowTimeStamp();
					if (parseInt(patientRecord[i].actions[patientRecord[i].actions.length - 1].drugDetail.treatment_duration) * 86400 + patientRecord[i].actions[patientRecord[i].actions.length - 1].time > curTime) {
						if (patientRecord[i].actions[patientRecord[i].actions.length - 1].state != 3) {
							currentDrugList.push(patientRecord[i].actions[patientRecord[i].actions.length - 1].drugDetail.drug.name)
						}
					}
				}
				console.log(currentDrugList)
				axios.post(z3serverURL, {
					Drug: currentDrugList
				})
					.then(function (response) {
						let resFromZ3 = JSON.parse(JSON.stringify(response.data))
						let descriptionList = [];
						if (resFromZ3.result == null) {
							for (var i = 0; i < resFromZ3.length; i++) {
								descriptionList.push(resFromZ3[i].description);
							}
							let uniqueDescription = [...new Set(descriptionList)];
							for (var i = 0; i < uniqueDescription.length; i++) {
								resultString += (uniqueDescription[i] + "\n");
							}

							console.log(resultString);
							return res.status(200).json({
								success: false,
								isPermanent: true,
								message: resultString

							});
						}
						console.log(resFromZ3);

						deliveryRecordController
							.addActionToDeliveryRecord(recordId, action)
							.then(addResult => {
								if (!addResult.success) {
									res.status(200).json({
										success: false,
										message: "Update record failed"
									});
								} else {
									res.status(200).json({
										success: true,
										message: "Delivery Record is updated"
									});
								}
							});

					})
					.catch(function (error) {
						console.log(error);
					});

			}
		})





});

router.post("/process/:rid", checkAuth, (req, res, next) => {
	console.log("req.params.rid:", req.params.rid);
	let recordId = req.params.rid;
	let user = req.userData;
	user.position = user.position[user.position.length - 1];

	let action = {
		time: helper.getNowTimeStamp(),
		state: 2,
		user: user
	};

	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			res.status(200).json({
				success: false,
				message: "Get record failed"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;

			for (let i = 0; i < deliveryRecordList.length; i++) {
				let targetRecord = deliveryRecordList[i];

				if (targetRecord.rid === recordId) {
					let targetRecordLastestAction =
						targetRecord.actions[targetRecord.actions.length - 1];
					action.drugDetail = targetRecordLastestAction.drugDetail;

					deliveryRecordController
						.addActionToDeliveryRecord(recordId, action)
						.then(addResult => {
							if (!addResult.success) {
								res.status(200).json({
									success: false,
									message: "Update record failed"
								});
							} else {
								res.status(200).json({
									success: true,
									message: "Delivery Record state is processing now"
								});
							}
						});
				}
			}
		}
	});
});

router.delete("/:rid", checkAuth, (req, res, next) => {
	let recordId = req.params.rid;
	let user = req.userData;
	user.position = user.position[user.position.length - 1];

	let action = {
		time: helper.getNowTimeStamp(),
		state: 3,
		user: user
	};

	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			res.status(200).json({
				success: false,
				message: "Get record failed"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;

			for (let i = 0; i < deliveryRecordList.length; i++) {
				let targetRecord = deliveryRecordList[i];

				if (targetRecord.rid === recordId) {
					let targetRecordLastestAction =
						targetRecord.actions[targetRecord.actions.length - 1];
					action.drugDetail = targetRecordLastestAction.drugDetail;

					deliveryRecordController
						.addActionToDeliveryRecord(recordId, action)
						.then(addResult => {
							if (!addResult.success) {
								res.status(200).json({
									success: false,
									message: "Update record failed"
								});
							} else {
								res.status(200).json({
									success: true,
									message: "Delivery Record is rejected"
								});
							}
						});
				}
			}
		}
	});
});

router.post("/complete/:rid", checkAuth, (req, res, next) => {
	let recordId = req.params.rid;
	let user = req.userData;
	user.position = user.position[user.position.length - 1];

	let action = {
		time: helper.getNowTimeStamp(),
		state: 4,
		user: user
	};

	deliveryRecordController.getAllDeliveryRecord().then(getResult => {
		if (!getResult.success) {
			res.status(200).json({
				success: false,
				message: "Get record failed"
			});
		} else {
			let deliveryRecordList = getResult.deliveryRecordList;

			for (let i = 0; i < deliveryRecordList.length; i++) {
				let targetRecord = deliveryRecordList[i];

				if (targetRecord.rid === recordId) {
					let targetRecordLastestAction =
						targetRecord.actions[targetRecord.actions.length - 1];
					action.drugDetail = targetRecordLastestAction.drugDetail;

					deliveryRecordController
						.addActionToDeliveryRecord(recordId, action)
						.then(addResult => {
							if (!addResult.success) {
								res.status(200).json({
									success: false,
									message: "Update record failed"
								});
							} else {
								res.status(200).json({
									success: true,
									message: "Delivery Record state is completed"
								});
							}
						});
				}
			}
		}
	});
});

module.exports = router;
