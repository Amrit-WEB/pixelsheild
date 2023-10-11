import { elements } from "./dom";
import { toggle } from "./toggle";
import { ParseImageFromFileInput } from "./preview";
import { Encode } from "./encryption";
import { Decode } from "./decryption";

//Toggle Function Run
toggle();

//Image Preview Events
elements.inputImageEncry.addEventListener("change", function (input) {
  ParseImageFromFileInput(input.target);
});
elements.inputImageDecry.addEventListener("change", (e) => {
  ParseImageFromFileInput(e.target);
});

// Setup encode and decode buttons
elements.encryptBtn.onclick = (e) => {
  e.preventDefault();
  if (!elements.inputText.value) {
    alert("Please Enter Your Seceret Message !");
    return;
  }
  elements.messageBoxEncry.style.display = `flex`;
  let result = Encode(elements.inputText.value, previewImageEncry);

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
    elements.messageBoxEncry.innerHTML = markup;
  }, 2000);

  if (result.messageTruncated) {
    alert(
      "Message was too large for the image provided and has been truncated"
    );
  }
};

//Decryption Click
elements.decryptBtn.onclick = () => {
  let result = Decode(elements.previewImageDecry);

  elements.messageBoxDecry.style.display = `flex`;
  setTimeout(() => {
    if (result) {
      elements.messageBoxDecry.innerHTML = `<p class="message-text">Your Seceret message :</p>
      <p class="message-seceret">${result}</p>`;
    } else {
      elements.messageBoxDecry.innerHTML = `<p class="message-seceret">No message found in this image 😐</p>`;
    }
  }, 2000);
};
