import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="container">
    <h1>Camera & Image Upload</h1>

    <div class="controls">
      <button id="startCamera" class="btn btn-primary">Start Camera</button>
      <button id="stopCamera" class="btn btn-secondary" disabled>Stop Camera</button>
      <button id="capture" class="btn btn-success" disabled>Capture Photo</button>
    </div>

    <div class="camera-section">
      <video id="video" autoplay playsinline></video>
      <canvas id="canvas" style="display:none;"></canvas>
    </div>

    <div class="upload-section">
      <h2>Or Upload Image</h2>
      <input type="file" id="fileInput" accept="image/*" class="file-input">
    </div>

    <div id="gallery" class="gallery"></div>
  </div>
`

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const startCameraBtn = document.getElementById('startCamera')
const stopCameraBtn = document.getElementById('stopCamera')
const captureBtn = document.getElementById('capture')
const fileInput = document.getElementById('fileInput')
const gallery = document.getElementById('gallery')

let stream = null

// Start camera
startCameraBtn.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    })
    video.srcObject = stream

    startCameraBtn.disabled = true
    stopCameraBtn.disabled = false
    captureBtn.disabled = false
  } catch (err) {
    alert('Could not access camera: ' + err.message)
  }
})

// Stop camera
stopCameraBtn.addEventListener('click', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    video.srcObject = null
    stream = null

    startCameraBtn.disabled = false
    stopCameraBtn.disabled = true
    captureBtn.disabled = true
  }
})

// Capture photo
captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0)

  const imageUrl = canvas.toDataURL('image/png')
  addToGallery(imageUrl)
})

// Handle file upload
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      addToGallery(event.target.result)
    }
    reader.readAsDataURL(file)
  }
})

// Add image to gallery
function addToGallery(imageUrl) {
  const imgContainer = document.createElement('div')
  imgContainer.className = 'gallery-item'

  const img = document.createElement('img')
  img.src = imageUrl

  const downloadBtn = document.createElement('a')
  downloadBtn.href = imageUrl
  downloadBtn.download = 'photo-' + Date.now() + '.png'
  downloadBtn.className = 'btn btn-download'
  downloadBtn.textContent = 'Download'

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'btn btn-delete'
  deleteBtn.textContent = 'Delete'
  deleteBtn.addEventListener('click', () => {
    imgContainer.remove()
  })

  imgContainer.appendChild(img)
  imgContainer.appendChild(downloadBtn)
  imgContainer.appendChild(deleteBtn)

  gallery.insertBefore(imgContainer, gallery.firstChild)
}
