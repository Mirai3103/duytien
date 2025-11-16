fetch("http://localhost:5173/api/llm", {
	"headers": {
	  "content-type": "application/json",
	  "sec-ch-ua": "\"Chromium\";v=\"142\", \"Brave\";v=\"142\", \"Not_A Brand\";v=\"99\"",
	  "sec-ch-ua-mobile": "?0",
	  "sec-ch-ua-platform": "\"Windows\"",
	  "Referer": "http://localhost:5173/"
	},
	"body": "{\"id\":\"0CJgMoXsvEpa3oJz\",\"messages\":[{\"parts\":[{\"type\":\"text\",\"text\":\"Chào\"}],\"id\":\"rEfR6g7GInKfnxEu\",\"role\":\"user\"}],\"trigger\":\"submit-message\"}",
	"method": "POST"
  }).then(res => {
	return res.text();
  }).then(data => console.log(data));