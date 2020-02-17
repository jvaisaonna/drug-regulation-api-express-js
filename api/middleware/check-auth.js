const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1]; // Header:Authorization, AuthToken format: Bearer <token>
		// const token = req.body.token;
		console.log("Token:", token);
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		// console.log("Decoded:", decoded);
		req.userData = decoded;
		next();
	} catch (error) {
		console.log("check-auth error:", error);
		return res.status(200).json({
			success: false,
			message: "Authentication Failed - " + error.message
		});
	}
};
