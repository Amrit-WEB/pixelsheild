// ===== Encoding and Decoding ===== //
// Converts a string to a byte array of base 64 characters
function StringToByteArray(string) {
  let safeBase64String = btoa(unescape(encodeURIComponent(string)));
  let byteArray = [];
  for (let i = 0; i < safeBase64String.length; i++) {
    byteArray.push(safeBase64String.charCodeAt(i));
  }
  console.log(byteArray);
  return byteArray;
}

// Converts a byte array of base 64 characters to a string
function ByteArrayToString(byteArray) {
  let string = "";
  for (let i = 0; i < byteArray.length; i++) {
    string += String.fromCharCode(byteArray[i]);
  }
  return decodeURIComponent(escape(atob(string)));
}

// Encodes a string into an image
function Encode(message, image) {
  // Convert the message into an encodeable format
  let messageBytes = StringToByteArray(message);

  // Add two dummy non-base64 characters at the end to define where the message ends
  messageBytes.push(0);
  messageBytes.push(0);

  // Create and canvas to work on and draw the existing image in it
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);

  // Get all of the pixel data, because alpha values may make some pixel unsuitible for encoding
  let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Only work on pixels with this alpha value or greater (see note below)
  let alphaConvertLimit = 250;

  // Loop through the image pixels and insert the message data into them
  let pixelIndex = 0;
  let pixel;
  let byteIndex = 0;
  let bitIndex = 0;
  while (
    pixelIndex * 4 < pixelData.data.length &&
    byteIndex < messageBytes.length
  ) {
    // If the alpha channel of the pixel is above the limit, convert it to the maximum and use it.
    // The reason for this is that the lower the alpha value, the more the RGB data is truncated.
    // For example, if the alpha value is 50, setting red to be 150 might result in it being 170.
    // This is done automatically to decrease file size.
    if (pixelData.data[pixelIndex * 4 + 3] >= alphaConvertLimit) {
      // Set the alpha channel to 255
      pixelData.data[pixelIndex * 4 + 3] = 0xff;

      // Set the red, green, and blue channels
      for (let j = 0; j < 3; j++) {
        let old = pixelData.data[pixelIndex * 4 + j];
        if (messageBytes[byteIndex] & (1 << bitIndex)) {
          pixelData.data[pixelIndex * 4 + j] |= 0b00000001;
        } else {
          pixelData.data[pixelIndex * 4 + j] &= 0b11111110;
        }

        bitIndex++;
        if (bitIndex == 8) {
          byteIndex++;
          bitIndex = 0;
        }
      }
    }

    pixelIndex++;
  }

  // Put the modified data back into the image
  ctx.putImageData(pixelData, 0, 0);

  return {
    dataURL: canvas.toDataURL(),
    messageTruncated: byteIndex < messageBytes.length,
  };
}

// Decodes a string hidden in an image (if there is one)
function Decode(image) {
  // Create and canvas to work on and draw the existing image in it
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);

  // Get the pixel data for the relevant parts of the image
  let pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Any non-base 64 charcters found are not part of the message
  let base64Characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // Only decode pixels at or above this alpha value (see note in Encode() function)
  let alphaConvertLimit = 250;

  // Loop through the message bytes and insert the into the image
  let byteIndex = 0;
  let bitIndex = 0;
  let currentCharacter = 0;
  let decodedCharacters = [];
  for (let i = 0; i < pixelData.data.length; i += 4) {
    // If any non-base 64 characters are encountered, the message is complete
    if (
      decodedCharacters.length > 0 &&
      base64Characters.indexOf(
        String.fromCharCode(decodedCharacters[decodedCharacters.length - 1])
      ) === -1
    ) {
      decodedCharacters = decodedCharacters.slice(
        0,
        decodedCharacters.length - 1
      );
      break;
    }

    // As with encoding, only read pixels with sufficient alpha value
    if (pixelData.data[i + 3] >= alphaConvertLimit) {
      // Read the red, green, and blue channels
      for (let j = 0; j < 3; j++) {
        if (pixelData.data[i + j] & 1) {
          currentCharacter |= 1 << bitIndex;
        }

        bitIndex++;
        if (bitIndex == 8) {
          byteIndex++;
          bitIndex = 0;

          decodedCharacters.push(currentCharacter);
          currentCharacter = 0;
        }
      }
    }
  }

  return ByteArrayToString(decodedCharacters);
}

// ===== Setup User Interaction =====//
// Enable drag+drop as well as encode and decode buttons
function Setup() {
  // Setup encode and decode buttons
  encryptBtn.onclick = (e) => {
    e.preventDefault();
    messageBoxEncry.innerHTML = `<img src="./assets/loader.png" alt="AJAX loader" class="loader-image" />`;
    let result = Encode(
      document.getElementById("inputText").value,
      previewImageEncry
    );

    setTimeout(() => {
      const markup = `<p class="message-text">
      Encrypted Successfully .... Click below to download the image
    </p>
    <a
      href="${result.dataURL}"
      class="download-btn"
      id="download-btn"
      download="encrypted_image.png"
      >Download</a
    >`;
      messageBoxEncry.innerHTML = markup;
    }, 2000);
    // downloadBtn.href = result.dataURL;
    // downloadBtn.disabled = false;

    if (result.messageTruncated) {
      alert(
        "Message was too large for the image provided and has been truncated"
      );
    }
  };

  //Decryption Click
  decryptBtn.onclick = () => {
    let result = Decode(previewImageDecry);
    messageBoxDecry.innerHTML = `<img src="./assets/loader.png" alt="AJAX loader" class="loader-image" />`;
    setTimeout(() => {
      if (result) {
        messageBoxDecry.innerHTML = `<p class="message-text">Your Seceret message :</p>
        <p class="message-seceret">${result}</p>`;
      } else {
        messageBoxDecry.innerHTML = `<p class="message-seceret">No message found in this image 😐</p>`;
      }
    }, 200000);
  };
}

window.onload = Setup;
