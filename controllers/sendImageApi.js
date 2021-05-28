var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://facial-emotion-recognition.p.rapidapi.com/cloudVision/facialEmotionRecognition',
  params: {
    source: 'https://thumbs.dreamstime.com/z/portrait-attractive-cheerful-young-man-smiling-happy-face-human-expressions-emotions-model-beautiful-smile-handsome-145517730.jpg',
    sourceType: 'url'
  },
  headers: {
    'content-type': 'application/json',
    'x-rapidapi-key': '079c64180bmsh62991ef0e2ce12ep108159jsn4683640dc701',
    'x-rapidapi-host': 'facial-emotion-recognition.p.rapidapi.com'
  },
  data: {
    source: 'https://thumbs.dreamstime.com/z/portrait-attractive-cheerful-young-man-smiling-happy-face-human-expressions-emotions-model-beautiful-smile-handsome-145517730.jpg',
    sourceType: 'url'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});