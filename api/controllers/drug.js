const fs = require("fs");
const yaml = require("js-yaml");
const { FileSystemWallet, Gateway } = require("fabric-network");

// A wallet stores a collection of identities for use
const configPath = "../../config/networkConnection.yaml";
const {
	FABRIC_CHANNEL_NAME,
	FABRIC_CONTRACT_NAME,
	FABRIC_WALLET_PATH,
	FABRIC_CONFIG_PATH
} = require("../FabricConnectionConfig.js");
const wallet = new FileSystemWallet(FABRIC_WALLET_PATH);
const { JSON_OBJECT_TO_FABRIC_OBJECT } = require("../helper.js");

exports.initDrugList = async () => {
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
		const responseFromBC = await contract.submitTransaction("initDrugList");
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
exports.getAllDrug = async () => {
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

		const responseFromBC = await contract.submitTransaction("getAllDrug");
		let response = JSON.parse(responseFromBC.toString("utf8"));
		
		return new Promise(resolve =>
			resolve({ success: true, drugList: response.drugList })
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

exports.createDrug = async (in_did, in_typr, in_name, in_isValid) => {
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
			"createDrug",
			in_did,
			in_typr,
			in_name,
			in_isValid
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

exports.updateDrug = async (in_did, in_typr, in_name, in_isValid) => {
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
			"updateDrug",
			in_did,
			in_typr,
			in_name,
			in_isValid
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

exports.updateDrugName = async (in_did, in_name) => {
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
			"updateDrugName",
			in_did,
			in_name
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

exports.updateDrugIsValid = async (in_did, new_isValid) => {
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
			"updateDrugIsValid",
			in_did,
			new_isValid
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
