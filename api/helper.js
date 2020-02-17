exports.JSON_OBJECT_TO_FABRIC_OBJECT = jsonObject => {
	let tempJSON = JSON.stringify(jsonObject);
	// return tempJSON.substring(1, tempJSON.length - 1);
	return tempJSON;
};

exports.getNowTimeStamp = () => {
	return Math.round(Date.now() / 1000);
};
