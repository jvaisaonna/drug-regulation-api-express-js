exports.isDoctor = (req, res, next) => {
	if (req.userData === undefined) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	if (req.userData.position[req.userData.position.length - 1].role !== 1) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	next();
};

exports.isPharmacist = (req, res, next) => {
	if (req.userData === undefined) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	if (req.userData.position[req.userData.position.length - 1].role !== 2) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	next();
};

exports.isHA = (req, res, next) => {
	if (req.userData === undefined) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	if (req.userData.position[req.userData.position.length - 1].role !== 10) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	next();
};

exports.isHospital = (req, res, next) => {
	if (req.userData === undefined) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	if (req.userData.position[req.userData.position.length - 1].role !== 11) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed: Not Hospital"
		});
	}
	req.userData.latestPosition =
		req.userData.position[req.userData.position.length - 1];

	next();
};

exports.checkForDrugFormulary = (req, res, next) => {
	if (req.userData === undefined) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	if (
		req.userData.position[req.userData.position.length - 1].role !== 1 &&
		req.userData.position[req.userData.position.length - 1].role !== 10
	) {
		return res.status(200).json({
			success: false,
			message: "Authentication Failed"
		});
	}

	next();
};
