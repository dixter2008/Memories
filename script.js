// JavaScript for duplication, uploads, and deletes with persistent image storage
const duplicateBtn = document.getElementById('duplicate-btn');
const memoriesContainer = document.getElementById('memories-container');
const inputfile = document.getElementById('file-input');
const deleteImage = document.getElementById('delete-image-btn');
const dateInput = document.getElementById('dateInput');
const output = document.getElementById('output');

// Function to load images from localStorage on page load
function loadImagesFromStorage() {
    const storedImages = JSON.parse(localStorage.getItem('memoryImages') || '{}');
    const containers = memoriesContainer.querySelectorAll('.container');
    containers.forEach((container, index) => {
        const img = container.querySelector('img');
        const key = `container-${index}`;
        if (storedImages[key]) {
            img.src = storedImages[key];
        }
    });
}

// Function to save image to localStorage
function saveImageToStorage(containerIndex, src) {
    const storedImages = JSON.parse(localStorage.getItem('memoryImages') || '{}');
    storedImages[`container-${containerIndex}`] = src;
    localStorage.setItem('memoryImages', JSON.stringify(storedImages));
}

// Function to duplicate a container
duplicateBtn.addEventListener('click', () => {
    const originalContainer = memoriesContainer.querySelector('.container');
    const newContainer = originalContainer.cloneNode(true);
    
    const img = newContainer.querySelector('img');
    img.src = 'profile.jpg'; // Reset to default

    // Append the new container
    memoriesContainer.appendChild(newContainer);

    // Re-load images to ensure indices are correct
    loadImagesFromStorage();
});

// Function to handle deletes (delegated for dynamic elements)
memoriesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const allContainers = memoriesContainer.querySelectorAll('.container');
        if (allContainers.length > 1) {
            const containerToRemove = e.target.closest('.container');
            const containerIndex = Array.from(memoriesContainer.children).indexOf(containerToRemove);
            
            // Remove from storage
            const storedImages = JSON.parse(localStorage.getItem('memoryImages') || '{}');
            delete storedImages[`container-${containerIndex}`];
            localStorage.setItem('memoryImages', JSON.stringify(storedImages));
            
            containerToRemove.remove();
            
            // Re-index remaining containers in storage
            const updatedImages = {};
            memoriesContainer.querySelectorAll('.container').forEach((container, newIndex) => {
                const oldKey = `container-${Array.from(memoriesContainer.children).indexOf(container)}`;
                if (storedImages[oldKey]) {
                    updatedImages[`container-${newIndex}`] = storedImages[oldKey];
                }
            });
            localStorage.setItem('memoryImages', JSON.stringify(updatedImages));
        } else {
            alert('You must keep at least one memory container.');
        }
    }
});

// Function to handle uploads with debugging
memoriesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('upload-btn')) {
        const fileInput = e.target.nextElementSibling;
        console.log('Upload button clicked. File input found:', fileInput); // Debug log
        if (fileInput && fileInput.classList.contains('file-input')) {
            fileInput.click();
        } else {
            console.error('File input not found or incorrect class. Check HTML structure.');
            alert('Upload failed: File input not found.');
        }
    }
});

// Function to handle file changes and persist images with debugging
memoriesContainer.addEventListener('change', (e) => {
    if (e.target.classList.contains('file-input')) {
        const file = e.target.files[0];
        console.log('File selected:', file); // Debug log
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const container = e.target.closest('.container');
                const img = container.querySelector('img');
                img.src = event.target.result;
                console.log('Image loaded and set.'); // Debug log
                
                // Persist to localStorage
                const containerIndex = Array.from(memoriesContainer.children).indexOf(container);
                saveImageToStorage(containerIndex, event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('Invalid file selected.'); // Debug log
            alert('Please select a valid image file (JPG, PNG, etc.).');
        }
    }
});

 // Load saved date on page load
        const savedDate = localStorage.getItem('selectedDate');
        if (savedDate) {
            dateInput.value = savedDate;
            output.textContent = 'Loaded saved date: ' + savedDate;
        }
        // Save date on submit
        document.getElementById('submitBtn').addEventListener('click', function() {
            const selectedDate = dateInput.value;
            if (selectedDate) {
                localStorage.setItem('selectedDate', selectedDate);
                output.textContent = 'Date saved: ' + selectedDate;
            } else {
                output.textContent = 'No date selected to save.';
            }
        });
        // Clear saved date
        document.getElementById('clearBtn').addEventListener('click', function() {
            localStorage.removeItem('selectedDate');
            dateInput.value = '';
            output.textContent = 'Saved date cleared.';
        });
        
// Load images on page load
document.addEventListener('DOMContentLoaded', loadImagesFromStorage);
