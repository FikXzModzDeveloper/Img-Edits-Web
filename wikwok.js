/* 
Script Created By FikXzMods
© 2024 - 2025 | Prompt Engginering awowkwk
CH : https://whatsapp.com/channel/0029Vb6Jjyf8KMqtrGJZJy0y
CH TELE : https://t.me/ShareCodesfik

Rename/Ubah Silahkan asal ngga hapus credit
------------------------------
Renamed by : Nama lu
CH : ch lu
CH TELE : ceha lu klo ada
sosial media :
tiktok :
lnjutin serah lu dah
*/

const modeButtons = document.querySelectorAll('.slide-toggle button');
const promptGroup = document.getElementById('promptGroup');
const imageInput = document.getElementById('imageInput');
const fileLabel = document.getElementById('fileLabel');
const fileText = document.getElementById('fileText');
const promptInput = document.getElementById('promptInput');
const mainForm = document.getElementById('mainForm');
const submitBtn = document.getElementById('submitBtn');
const errorBox = document.getElementById('errorBox');
const errorText = document.getElementById('errorText');
const progressBox = document.getElementById('progressBox');
const progressBar = document.getElementById('progressBar');
const resultBox = document.getElementById('resultBox');
const resultImg = document.getElementById('resultImg');
const downloadBtn = document.getElementById('downloadBtn');

let currentMode = 'edit';
let progressInterval = null;

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    promptGroup.style.display = currentMode === 'edit' ? 'block' : 'none';
  });
});

imageInput.addEventListener('change', () => {
  if (imageInput.files[0]) {
    fileText.textContent = imageInput.files[0].name;
    fileLabel.classList.add('has-file');
  } else {
    fileText.textContent = 'Pilih gambar…';
    fileLabel.classList.remove('has-file');
  }
});

mainForm.addEventListener('submit', async e => {
  e.preventDefault();
  hideError();
  
  const file = imageInput.files[0];
  if (!file) {
    return showError('Please select an image.');
  }
  
  if (currentMode === 'edit' && !promptInput.value.trim()) {
    return showError('Prompt is required for Img Edit.');
  }

  submitBtn.disabled = true;
  progressBox.classList.remove('hidden');
  resultBox.classList.add('hidden');
  startProgress();

  try {
    const cdnUrl = await uploadToTmpFiles(file);
    
    if (!cdnUrl) {
      throw new Error('Upload failed. Please try again.');
    }

    let apiUrl = '';
    if (currentMode === 'edit') {
      apiUrl = `https://api.fikmydomainsz.xyz/ai/nanobnna?url=${encodeURIComponent(cdnUrl)}&prompt=${encodeURIComponent(promptInput.value.trim())}`;
    } else if (currentMode === 'chibi') {
      apiUrl = `https://api.fikmydomainsz.xyz/imagecreator/tochibi?url=${encodeURIComponent(cdnUrl)}`;
    } else if (currentMode === 'figure') {
      apiUrl = `https://api.fikmydomainsz.xyz/imagecreator/tofigur?url=${encodeURIComponent(cdnUrl)}`;
    }

    const res = await fetch(apiUrl);
    const json = await res.json();
    
    if (!json.status || !json.result) {
      throw new Error(json.message || 'API processing failed.');
    }

    stopProgress();
    progressBox.classList.add('hidden');
    resultImg.src = json.result;
    resultBox.classList.remove('hidden');
    
    downloadBtn.onclick = async (e) => {
      e.preventDefault();
      downloadBtn.disabled = true;
      downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Downloading...';
      
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(json.result)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `result_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
        downloadBtn.disabled = false;
      } catch (err) {
        console.error('Download error:', err);
        showError('Download failed. Opening in new tab instead.');
        window.open(json.result, '_blank');
        
        downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
        downloadBtn.disabled = false;
      }
    };

  } catch (err) {
    stopProgress();
    progressBox.classList.add('hidden');
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    submitBtn.disabled = false;
  }
});

async function uploadToTmpFiles(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Upload response:', data);

    if (data.status === 'success' && data.data && data.data.url) {
      let originalUrl = data.data.url;
      let parts = originalUrl.split('/');
      let fileId = parts[parts.length - 2];
      let fileName = parts[parts.length - 1];
      let directUrl = `https://tmpfiles.org/dl/${fileId}/${fileName}`;
      console.log('Direct image URL:', directUrl);
      return directUrl;
    } else {
      throw new Error('Upload failed - no URL returned');
    }
  } catch (err) {
    console.error('Upload error:', err);
    throw new Error('Upload failed: ' + err.message);
  }
}

function startProgress() {
  let width = 0;
  progressBar.style.width = '0%';
  
  progressInterval = setInterval(() => {
    width += Math.random() * 10;
    if (width >= 90) {
      width = 90;
      clearInterval(progressInterval);
    }
    progressBar.style.width = width + '%';
  }, 300);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  progressBar.style.width = '100%';
}

function showError(msg) {
  errorText.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
  errorText.textContent = '';
}
