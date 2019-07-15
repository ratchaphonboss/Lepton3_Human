(function($) {
  $(function () {

      var socket = io();
      var canvas = document.getElementById('canvas');
	  var value = document.getElementById('value');
	  var temp = document.getElementById('temp');
      var ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      socket.on('frame', function (msg) {

        // Inflate the data
        var inflatedData = pako.inflate(msg).buffer;

        // Create an array of unsigned integers from the array
        var intData = new Uint16Array(inflatedData);

        // Take the range of the values
        var max = Math.max.apply(Math, intData);
        var min = Math.min.apply(Math, intData);
        var range = max - min;

        var tempMax = ((0.0217*max)-177.77+25.0+8.0).toFixed(2);
	var tempMin = ((0.0217*min)-177.77+25.0+8.0).toFixed(2);
		
	if(tempMax > 0 && tempMax < 100 && tempMin > 0 && tempMin < 100)
	{
        // Build some image data with the integers
        for (var c = 0; c < intData.length; c ++) {
          // Normalise each pixel value first
          var pixelValue = parseInt((intData[c] - min) / range * 254);
          // var pixelValue = parseInt(intData[c] / 16384 * 255);
          imageData.data[(c * 4) + 0] = gradients.fusion[pixelValue][0];
          imageData.data[(c * 4) + 1] = gradients.fusion[pixelValue][1];
          imageData.data[(c * 4) + 2] = gradients.fusion[pixelValue][2];
        }

        ctx.putImageData(imageData, 0, 0);
		temp.innerHTML = "อุณหภูมิสูงสุด:" + tempMax.toString()+"  "+ "อุณหภูมิต่ำสุด:" + tempMin.toString();
		}
      });

  });
})(jQuery);
