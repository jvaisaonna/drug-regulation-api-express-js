const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { FileSystemWallet, Gateway } = require("fabric-network");

const { JSON_OBJECT_TO_FABRIC_OBJECT } = require("../helper.js");

// A wallet stores a collection of identities for use
const {
	FABRIC_CHANNEL_NAME,
	FABRIC_CONTRACT_NAME,
	FABRIC_WALLET_PATH,
	FABRIC_CONFIG_PATH
} = require("../FabricConnectionConfig.js");
const wallet = new FileSystemWallet(FABRIC_WALLET_PATH);

exports.createUser = async (
	in_uid,
	in_first_name,
	in_last_name,
	in_gender,
	in_hkid,
	in_phone_number,
	in_birth_date_ts,
	in_position,
	in_username,
	in_password
) => {
	// A gateway defines the peers used to access Fabric networks
	const gateway = new Gateway();
	// Get contract name which installed to fabri
	// Main try/catch block
	try {
		// Specify userName for network access
		// const userName = 'isabella.issuer@magnetocorp.com';
		const userName = "Admin@org1.example.com";
		// Load connection profile; will be used to locate a gateway
		let connectionProfile = yaml.safeLoad(
			fs.readFileSync(FABRIC_CONFIG_PATH, "utf8")
		);

		// Set connection options; identity and wallet
		let connectionOptions = {
			identity: userName,
			wallet: wallet,
			discovery: { enabled: false, asLocalhost: true }
		};
		// Connect to gateway using application specified parameters
		console.log("Connect to Fabric gateway.");
		await gateway.connect(connectionProfile, connectionOptions);

		console.log("Use network channel:", FABRIC_CHANNEL_NAME);
		const network = await gateway.getNetwork(FABRIC_CHANNEL_NAME);

		// Get addressability to commercial paper contract
		console.log("Use " + FABRIC_CONTRACT_NAME + " smart contract.");
		const contract = await network.getContract(
			FABRIC_CONTRACT_NAME,
			"org.reg.deliveryRecord"
		);

		const responseFromBC = await contract.submitTransaction(
			"createUser",
			in_uid,
			in_first_name,
			in_last_name,
			in_gender,
			in_hkid.toUpperCase(),
			in_phone_number + "",
			in_birth_date_ts + "",
			in_username.toLowerCase(),
			in_password
		);

		const postitionResponse = await contract.submitTransaction(
			"add_user_position",
			in_uid,
			JSON_OBJECT_TO_FABRIC_OBJECT(in_position)
		);

		return new Promise(resolve => resolve({ success: true }));
	} catch (error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
		return new Promise(resolve => resolve({ success: false }));
	} finally {
		// Disconnect from the gateway
		console.log("Disconnect from Fabric gateway.");
		gateway.disconnect();
	}
};

exports.getAllUser = async () => {
	// A gateway defines the peers used to access Fabric networks
	const gateway = new Gateway();
	// Get contract name which installed to fabri
	// Main try/catch block
	try {
		// Specify userName for network access
		// const userName = 'isabella.issuer@magnetocorp.com';
		const userName = "Admin@org1.example.com";
		// Load connection profile; will be used to locate a gateway
		let connectionProfile = yaml.safeLoad(
			fs.readFileSync(FABRIC_CONFIG_PATH, "utf8")
		);

		// Set connection options; identity and wallet
		let connectionOptions = {
			identity: userName,
			wallet: wallet,
			discovery: { enabled: false, asLocalhost: true }
		};
		// Connect to gateway using application specified parameters
		console.log("Connect to Fabric gateway.");

		await gateway.connect(connectionProfile, connectionOptions);

		console.log("Use network channel:", FABRIC_CHANNEL_NAME);

		const network = await gateway.getNetwork(FABRIC_CHANNEL_NAME);

		// Get addressability to commercial paper contract
		console.log("Use " + FABRIC_CONTRACT_NAME + " smart contract.");

		const contract = await network.getContract(
			FABRIC_CONTRACT_NAME,
			"org.reg.deliveryRecord"
		);
		const responseFromBC = await contract.submitTransaction("getAllUser");
		let response = JSON.parse(responseFromBC.toString("utf8"));

		return new Promise(resolve =>
			resolve({ success: true, userList: response.userList })
		);
	} catch (error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
		return new Promise(resolve => resolve({ success: false }));
	} finally {
		// Disconnect from the gateway
		console.log("Disconnect from Fabric gateway.");
		gateway.disconnect();
	}
};

exports.initUserList = async () => {
	// A gateway defines the peers used to access Fabric networks
	const gateway = new Gateway();
	// Get contract name which installed to fabri
	// Main try/catch block
	try {
		// Specify userName for network access
		// const userName = 'isabella.issuer@magnetocorp.com';
		const userName = "Admin@org1.example.com";
		// Load connection profile; will be used to locate a gateway
		let connectionProfile = yaml.safeLoad(
			fs.readFileSync(FABRIC_CONFIG_PATH, "utf8")
		);

		// Set connection options; identity and wallet
		let connectionOptions = {
			identity: userName,
			wallet: wallet,
			discovery: { enabled: false, asLocalhost: true }
		};
		// Connect to gateway using application specified parameters
		console.log("Connect to Fabric gateway.");

		await gateway.connect(connectionProfile, connectionOptions);

		console.log("Use network channel:", FABRIC_CHANNEL_NAME);

		const network = await gateway.getNetwork(FABRIC_CHANNEL_NAME);

		// Get addressability to commercial paper contract
		console.log("Use " + FABRIC_CONTRACT_NAME + " smart contract.");

		const contract = await network.getContract(
			FABRIC_CONTRACT_NAME,
			"org.reg.deliveryRecord"
		);
		const responseFromBC = await contract.submitTransaction("initUserList");

		return new Promise(resolve => resolve({ success: true }));
	} catch (error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	} finally {
		// Disconnect from the gateway
		console.log("Disconnect from Fabric gateway.");
		gateway.disconnect();
	}
};

exports.add_user_position = async (in_uid, position) => {
	// A gateway defines the peers used to access Fabric networks
	const gateway = new Gateway();
	// Get contract name which installed to fabri
	// Main try/catch block
	try {
		// Specify userName for network access
		// const userName = 'isabella.issuer@magnetocorp.com';
		const userName = "Admin@org1.example.com";
		// Load connection profile; will be used to locate a gateway
		let connectionProfile = yaml.safeLoad(
			fs.readFileSync(FABRIC_CONFIG_PATH, "utf8")
		);
		// Set connection options; identity and wallet
		let connectionOptions = {
			identity: userName,
			wallet: wallet,
			discovery: { enabled: false, asLocalhost: true }
		};
		// Connect to gateway using application specified parameters
		console.log("Connect to Fabric gateway.");
		await gateway.connect(connectionProfile, connectionOptions);
		console.log("Use network channel:", FABRIC_CHANNEL_NAME);
		const network = await gateway.getNetwork(FABRIC_CHANNEL_NAME);
		// Get addressability to commercial paper contract
		console.log("Use " + FABRIC_CONTRACT_NAME + " smart contract.");
		const contract = await network.getContract(
			FABRIC_CONTRACT_NAME,
			"org.reg.deliveryRecord"
		);
		const responseFromBC = await contract.submitTransaction(
			"add_user_position",
			in_uid,
			JSON_OBJECT_TO_FABRIC_OBJECT(position)
		);
		let response = JSON.parse(responseFromBC.toString("utf8"));
		return new Promise(resolve => resolve({ success: true }));
	} catch (error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
		return new Promise(resolve =>
			resolve({ success: false, message: error.message })
		);
	} finally {
		// Disconnect from the gateway
		console.log("Disconnect from Fabric gateway.");
		gateway.disconnect();
	}
};
