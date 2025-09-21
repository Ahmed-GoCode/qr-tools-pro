function generateQR() {
    const text = document.getElementById('qr-text').value.trim();
    const size = parseInt(document.getElementById('qr-size').value);
    const resultDiv = document.getElementById('qr-result');

    if (!text) {
        showAlert('Please enter some text to generate QR code', 'error');
        return;
    }

    resultDiv.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #ff9000;"></i><p style="color: #ff9000; margin-top: 10px;">Creating your QR code...</p></div>';

    const canvas = document.createElement('canvas');
    
    QRCode.toCanvas(canvas, text, {
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        margin: 2
    }, function (error) {
        if (error) {
            resultDiv.innerHTML = '<p style="color: #ff6666;"><i class="fas fa-exclamation-triangle"></i> Error generating QR code</p>';
            return;
        }

        resultDiv.innerHTML = '';
        resultDiv.appendChild(canvas);
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn copy-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download QR Code';
        downloadBtn.onclick = () => downloadQR(canvas);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '15px';
        buttonContainer.appendChild(downloadBtn);
        resultDiv.appendChild(buttonContainer);
    });
}

function downloadQR(canvas) {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL();
    link.click();
}

function clearQR() {
    document.getElementById('qr-text').value = '';
    document.getElementById('qr-result').innerHTML = `
        <p><i class="fas fa-qrcode" style="font-size: 3rem; color: #ff9000;"></i></p>
        <p style="color: #ffffff; margin-top: 10px;">Your QR code will appear here</p>
    `;
}

function encryptMessage() {
    const message = document.getElementById('message-text').value.trim();
    const key = document.getElementById('encryption-key').value.trim();
    const resultDiv = document.getElementById('encryption-result');

    if (!message) {
        showAlert('Please enter a message to encrypt', 'error');
        return;
    }

    if (!key) {
        showAlert('Please enter an encryption key', 'error');
        return;
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(message, key).toString();
        
        resultDiv.innerHTML = `
            <div class="encrypted-result">
                <strong>Encrypted Message:</strong><br>
                <span id="encrypted-text">${encrypted}</span>
            </div>
            <button class="btn copy-btn" onclick="copyToClipboard('encrypted-text')">
                <i class="fas fa-copy"></i> Copy Encrypted Text
            </button>
        `;
        
        showAlert('Message encrypted successfully!', 'success');
    } catch (error) {
        showAlert('Encryption failed. Please try again.', 'error');
    }
}

function decryptMessage() {
    const message = document.getElementById('message-text').value.trim();
    const key = document.getElementById('encryption-key').value.trim();
    const resultDiv = document.getElementById('encryption-result');

    if (!message) {
        showAlert('Please enter an encrypted message to decrypt', 'error');
        return;
    }

    if (!key) {
        showAlert('Please enter the decryption key', 'error');
        return;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
        
        if (!decrypted) {
            showAlert('Decryption failed. Please check your key and message.', 'error');
            return;
        }

        resultDiv.innerHTML = `
            <div class="encrypted-result">
                <strong>Decrypted Message:</strong><br>
                <span id="decrypted-text">${decrypted}</span>
            </div>
            <button class="btn copy-btn" onclick="copyToClipboard('decrypted-text')">
                <i class="fas fa-copy"></i> Copy Decrypted Text
            </button>
        `;
        
        showAlert('Message decrypted successfully!', 'success');
    } catch (error) {
        showAlert('Decryption failed. Please check your key and message.', 'error');
    }
}

function clearEncryption() {
    document.getElementById('message-text').value = '';
    document.getElementById('encryption-key').value = '';
    document.getElementById('encryption-result').innerHTML = `
        <p><i class="fas fa-shield-alt" style="font-size: 3rem; color: #ff9000;"></i></p>
        <p style="color: #ffffff; margin-top: 10px;">Your encrypted/decrypted message will appear here</p>
    `;
    hideAlerts();
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Copied to clipboard!', 'success');
    }).catch(() => {
        showAlert('Failed to copy to clipboard', 'error');
    });
}

function showAlert(message, type) {
    hideAlerts();
    const alertDiv = document.getElementById(type === 'success' ? 'success-alert' : 'error-alert');
    const messageSpan = document.getElementById(type === 'success' ? 'success-message' : 'error-message');
    
    messageSpan.textContent = message;
    alertDiv.style.display = 'block';
    alertDiv.style.animation = 'fadeInUp 0.5s ease';
    
    setTimeout(hideAlerts, 4000);
}

function hideAlerts() {
    document.getElementById('success-alert').style.display = 'none';
    document.getElementById('error-alert').style.display = 'none';
}

document.getElementById('qr-text').addEventListener('input', function() {
    if (this.value.trim()) {
        clearTimeout(this.generateTimeout);
        this.generateTimeout = setTimeout(() => {
            generateQR();
        }, 800);
    }
});