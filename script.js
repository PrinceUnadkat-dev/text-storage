import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// Firebase config
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBYuQ4i5jbwikpu_nk4E4cnaWHVFGI-VPc",
  authDomain: "text-storage-2a0b3.firebaseapp.com",
  databaseURL: "https://text-storage-2a0b3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "text-storage-2a0b3",
  storageBucket: "text-storage-2a0b3.firebasestorage.app",
  messagingSenderId: "737296733775",
  appId: "1:737296733775:web:3b0f9095d631e39fb2fc3a",
  measurementId: "G-PE1H1CBN8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
getAnalytics(app);

// Elements
const input = document.getElementById("input");
const readTXT = document.getElementById("readTXT");
const writeBTN = document.getElementById("writeBTN");
const readBTN = document.getElementById("readBTN");
const copyBTN = document.getElementById("copyBTN");
const qrContainer = document.getElementById("qrcode");

// Write to Firebase
writeBTN.addEventListener("click", () => {
  const text = input.value;
  set(ref(db, "storage/text"), { content: text })
    .then(() => alert("Text saved to Firebase!"))
    .catch(err => alert("Error: " + err.message));
});

// ChatGPT-style typing animation for read
function typeText(target, text, cb) {
  target.textContent = "";
  let i = 0;
  function type() {
    if (i <= text.length) {
      target.textContent = text.slice(0, i);
      i++;
      setTimeout(type, Math.random() * 30 + 10); // random speed for more natural effect
    } else if (cb) {
      cb();
    }
  }
  type();
}

// Read from Firebase and generate QR
readBTN.addEventListener("click", () => {
  get(ref(db, "storage/text"))
    .then(snapshot => {
      if (snapshot.exists()) {
        const text = snapshot.val().content || "";
        qrContainer.innerHTML = "";
        if (text.trim() !== "") {
          QRCode.toCanvas(document.createElement("canvas"), text, (err, canvas) => {
            if (!err) {
              animateQR(canvas);
              qrContainer.appendChild(canvas);
            }
          });
        }
        // ChatGPT-style animation
        typeText(readTXT, text);
      } else {
        alert("No text found in Firebase.");
      }
    })
    .catch(err => alert("Error: " + err.message));
});

// Copy to clipboard
copyBTN.addEventListener("click", () => {
  const text = readTXT.textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert("Text copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
});

// Add Send Email button and modal
const sendEmailBTN = document.createElement('button');
sendEmailBTN.id = 'sendEmailBTN';
sendEmailBTN.textContent = 'Send Email';
document.querySelector('.button-row').appendChild(sendEmailBTN);

// Modal HTML
const modal = document.createElement('div');
modal.id = 'emailModal';
modal.style.display = 'none';
modal.innerHTML = `
  <div id="modalOverlay" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;">
    <div style="background:#181818;padding:28px 22px 18px 22px;border-radius:14px;box-shadow:0 4px 32px 0 rgba(0,0,0,0.4);min-width:300px;max-width:90vw;display:flex;flex-direction:column;gap:14px;align-items:stretch;">
      <div style="font-size:1.2rem;font-weight:600;color:#fff;margin-bottom:6px;">Send Text via Email</div>
      <input id="recipientEmail" type="email" placeholder="Recipient Email" style="padding:10px;border-radius:7px;border:1px solid #333;background:#111;color:#fff;font-size:1rem;outline:none;"/>
      <textarea id="emailMessage" style="padding:10px;border-radius:7px;border:1px solid #333;background:#111;color:#fff;font-size:1rem;min-height:60px;resize:vertical;" placeholder="Message"></textarea>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="sendMailNow" style="background:#00bfae;color:#111;padding:8px 18px;border:none;border-radius:7px;font-weight:600;cursor:pointer;">Send</button>
        <button id="closeModal" style="background:#232526;color:#fff;padding:8px 18px;border:none;border-radius:7px;font-weight:600;cursor:pointer;">Cancel</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modal);

// ================= EmailJS CONFIG (obfuscated) =================
const EMAIL_PUBLIC_KEY = ['kS', 'fxW', 'TsL', '5Cf', 'OAL', 'vfN'].join('');
const EMAIL_SERVICE_ID = ['service', '_ag5', 'coiq'].join('');
const EMAIL_TEMPLATE_ID = ['template', '_pyb', '3zbf'].join('');

// Init EmailJS once
(function(){ emailjs.init(EMAIL_PUBLIC_KEY);})();

// Email sending using EmailJS
const sendMailNowBtn = document.getElementById('sendMailNow');
if (sendMailNowBtn) {
  sendMailNowBtn.onclick = async () => {
    const to = document.getElementById('recipientEmail').value.trim();
    const message = document.getElementById('emailMessage').value;
    
    if (!to) {
      alert('Please enter recipient email.');
      return;
    }
    if (!message) {
      alert('Please enter a message.');
      return;
    }

    sendMailNowBtn.disabled = true;
    sendMailNowBtn.textContent = 'Sending...';
    
    try {
      const templateParams = {
        to_email: to,
        message: message,
        from_name: 'Text Storage',
        website_link: 'https://<your-github-username>.github.io/<repo-name>/'
      };

      const result = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        templateParams
      );
      
      alert('Email sent successfully!');
      modal.style.display = 'none';
    } catch (err) {
      let errorMessage = err.text || err.message || 'Unknown error';
      if (err.status === 402 || err.status === 429 || /limit|quota/i.test(errorMessage)) {
        errorMessage = 'Unable to send: monthly 200-email quota has been reached.';
      }
      alert('Failed to send email: ' + errorMessage);
    } finally {
      sendMailNowBtn.disabled = false;
      sendMailNowBtn.textContent = 'Send';
    }
  };
}

document.getElementById('closeModal').onclick = () => {
  modal.style.display = 'none';
};

sendEmailBTN.addEventListener('click', () => {
  document.getElementById('recipientEmail').value = '';
  document.getElementById('emailMessage').value = readTXT.textContent;
  modal.style.display = 'block';
});

// Animate QR code (fade-in)
function animateQR(canvas) {
  canvas.style.opacity = 0;
  canvas.style.transform = 'scale(0.8)';
  canvas.style.transition = 'opacity 0.5s, transform 0.5s';
  setTimeout(() => {
    canvas.style.opacity = 1;
    canvas.style.transform = 'scale(1)';
  }, 30);
}
