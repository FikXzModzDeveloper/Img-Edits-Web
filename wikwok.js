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
const uploadStatus = document.getElementById('uploadStatus');
const resultBox = document.getElementById('resultBox');
const resultImg = document.getElementById('resultImg');
const downloadBtn = document.getElementById('downloadBtn');

let currentMode = 'edit';

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
  if (!file) return showError('Please select an image.');
  if (currentMode === 'edit' && !promptInput.value.trim()) {
    return showError('Prompt is required for Img Edit.');
  }

  submitBtn.disabled = true;
  progressBox.classList.remove('hidden');
  resultBox.classList.add('hidden');
  animateProgress();

  try {
    const cdnUrl = await uploadToUrl(file);
    if (!cdnUrl) throw new Error('Upload gagal jir, mungkin lu jelek😂.');

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
      throw new Error(json.message || 'API error.');
    }

    progressBox.classList.add('hidden');
    resultImg.src = json.result;
    downloadBtn.href = json.result;
    resultBox.classList.remove('hidden');

  } catch (err) {
    progressBox.classList.add('hidden');
    showError(err.message || 'Something went wrong.');
  } finally {
    submitBtn.disabled = false;
  }
});

async function uploadToUrl(file, timeout = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timer);
    const data = await res.json();

    if (data?.status === 'success' && data?.data?.url) {
      return data.data.url;
    } else {
      throw new Error(data?.message || 'Upload gagal.');
    }
  } catch (err) {
    throw new Error('Error upload: ' + err.message);
  }
}

function animateProgress() {
  let w = 0;
  progressBar.style.width = '0%';
  const timer = setInterval(() => {
    w += Math.random() * 15;
    if (w >= 90) {
      clearInterval(timer);
      w = 90;
    }
    progressBar.style.width = w + '%';
  }, 300);
}

function showError(msg) {
  errorText.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}
