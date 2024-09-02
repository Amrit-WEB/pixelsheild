<h1>PixelShield</h1>

<p><strong>PixelShield</strong> is an image steganography project that allows users to securely embed a secret message into an image using the Least Significant Bit (LSB) algorithm. This project incorporates cryptographic techniques to ensure the confidentiality of the message.</p>
<h2>Live link</h2>h2>
<a href="https://pixelsheild.netlify.app/">Click here 👆</a>
<h2>Features</h2>
<ul>
  <li><strong>Encryption:</strong> Embeds a secret message into an image using the LSB algorithm, with the message first converted into a hash format for additional security.</li>
  <li><strong>Decryption:</strong> Extracts the secret message from an encrypted image using a provided key. If the key is correct, the original message is retrieved; otherwise, a hash message is returned.</li>
  <li><strong>Cryptographic Key:</strong> Requires a key for both encryption and decryption to ensure that only authorized users can access the hidden message.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
  <li><strong>JavaScript:</strong> For implementing the steganography and cryptographic algorithms.</li>
  <li><strong>HTML &amp; CSS:</strong> For the user interface of the application.</li>
  <li><strong>Hashing Algorithms:</strong> For converting the secret message into a hash format before embedding.</li>
</ul>

<h2>Installation</h2>
<p>To set up <strong>PixelShield</strong>, follow these steps:</p>
<ol>
  <li><strong>Clone the repository:</strong></li>
</ol>

<pre><code>git clone https://github.com/your-username/pixelshield.git
cd pixelshield
</code></pre>

<ol start="2">
  <li><strong>Open the project:</strong> Use a modern web browser to open <code>index.html</code> and start using the application.</li>
</ol>

<h2>Usage</h2>
<ul>
  <li><strong>Encryption:</strong> Provide an image, a secret message, and a cryptographic key. The application will embed the hashed message into the image.</li>
  <li><strong>Decryption:</strong> Provide the encrypted image and the key. If the key matches, the original secret message is revealed; otherwise, a not found message is returned.</li>
</ul>


<h2>Contributing</h2>
<p>Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for any suggestions or improvements.</p>

<h2>License</h2>
<p>This project is licensed under the MIT License. See the <a href="LICENSE">LICENSE</a> file for more details.</p>
