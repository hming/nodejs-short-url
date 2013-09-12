var crypto = require('crypto');


function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

function getShortUrl(orgUrl){
	var hex = md5(orgUrl);
	var chars = [
					"a","b","c","d","e","f","g","h",
					"i","j","k","l","m","n","o","p",
					"q","r","s","t","u","v","w","x",
					"y","z","0","1","2","3","4","5",
					"6","7","8","9","A","B","C","D",
					"E","F","G","H","I","J","K","L",
					"M","N","O","P","Q","R","S","T",
					"U","V","W","X","Y","Z"
				];
	var resUrl = new Array(4);
	//将长网址md5生成32位签名串,分为4段, 每段8个字节
	for (var i = 0; i < 4; i++) {
		//把加密字符按照8位一组16进制与0x3FFFFFFF进行位与运算
		var hexint = 0x3FFFFFFF & parseInt("0x" + hex.substr(i*8 , 8));
		var outChars = "";
		for(var j = 0; j <6; j++){
			//把得到的值与0x0000003D进行位与运算，取得字符数组chars索引
			var index = 0x0000003D & hexint;
			//把取得的字符相加
			outChars += chars[index];
			//每次循环按位右移5位 
			hexint = hexint >> 5;
		}
		resUrl[i] = outChars;
	};
	//4个short url中随机取一个
	var randomIndex= parseInt(Math.random()*4);
	return resUrl[randomIndex];
}

exports.getShortUrl = getShortUrl;
