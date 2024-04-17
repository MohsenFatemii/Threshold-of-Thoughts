// Predefined static grayscale array
// const staticArray = openFile("file.png");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'Images/azadi.png';

let staticArray = []; // Grayscale image data array

img.onload = function () {
    ctx.drawImage(img, 0, 0); // Draw the image at (0, 0) on the canvas

    const width = canvas.width;
    const height = canvas.height;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelData = imageData.data;

    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4; // Calculate the index
            const grayscaleValue = pixelData[i]; // Red channel value
            row.push(grayscaleValue);
        }
        staticArray.push(row);
    }
};




// Copy of the static array for display
let displayedArray = staticArray.map(row => [...row]);

// Function to draw the grayscale image on the canvas
function drawImage(array) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const pixelSize = canvas.width / 1063;

    array.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            ctx.fillStyle = `rgb(${value},${value},${value})`;
            ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
        });
    });
}

// Function to update the color square based on the selected threshold
function updateColorSquare(threshold) {
    const colorSquareCanvas = document.getElementById('colorSquare');
    const ctx = colorSquareCanvas.getContext('2d');

    ctx.clearRect(0, 0, colorSquareCanvas.width, colorSquareCanvas.height);
    ctx.fillStyle = `rgb(${threshold},${threshold},${threshold})`;
    ctx.fillRect(0, 0, colorSquareCanvas.width, colorSquareCanvas.height);
}

// Function to update the color gradient based on the selected threshold
function updateColorGradient(threshold) {
    const colorGradientCanvas = document.getElementById('colorGradient');
    const ctx = colorGradientCanvas.getContext('2d');

    // Clear previous gradient
    ctx.clearRect(0, 0, colorGradientCanvas.width, colorGradientCanvas.height);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, colorGradientCanvas.width, 0);
    gradient.addColorStop(0, `rgb(0, 0, 0)`);
    gradient.addColorStop(1, `rgb(${threshold},${threshold},${threshold})`);

    // Fill rectangle with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, colorGradientCanvas.width, colorGradientCanvas.height);
}

// Function to handle color mode change
function handleColorModeChange(thresholdValue) {
    const colorMode = document.getElementById('colorMode').value;
    displayedArray = staticArray.map(row => [...row]);
    const mixPercentage = document.getElementById('mixPercentage').value;
    switch (colorMode) {
        case 'binary':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => value > thresholdValue ? 255 : 0));
            break;
        case 'mixed':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => Math.random() * 100 < mixPercentage ? (value > thresholdValue ? 255 : 0) : value));
            break;

        case 'gray':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => Math.random() * 100 < mixPercentage ? 128 : value));
            break;

        case 'partial-random':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => Math.random() *100 < mixPercentage/2 ? 255 : value));
            displayedArray = displayedArray.map(row => row.map(value => Math.random() *100 < mixPercentage/2 ? 0 : value));
            break;

        case 'completely-random':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => Math.random() > 0.5 ? 255 : 0));
            break;
        case 'invert':
            // Update the color square and color gradient
            updateColorSquare(thresholdValue);
            updateColorGradient(255);
            displayedArray = staticArray.map(row => row.map(value => (255 - value)));
            break;
        default:
            break;
    }

    // Draw the image using the displayed array
    drawImage(displayedArray);
}

// Event listener for color mode change
document.getElementById('colorMode').addEventListener('change', function () {
    const colorMode = this.value;

    // Reseting image
    displayedArray = staticArray.map(row => [...row]);

    // Draw the image using the displayed array
    drawImage(displayedArray);

    // Update the color square and color gradient
    updateColorSquare(255);
    updateColorGradient(255);

    const mixedOptionContainer = document.getElementById('mixedOptionContainer');
    if (colorMode === 'mixed' || colorMode === 'partial-random' || colorMode === 'gray') {
        mixedOptionContainer.style.display = 'block';
    } else if(colorMode==='invert') {
        handleColorModeChange(255);
    }else
        mixedOptionContainer.style.display = 'none';
    
    // handleColorModeChange(255); // Reset threshold when changing color mode
});

// Event listener for mix percentage change
document.getElementById('mixPercentage').addEventListener('change', function () {
    handleColorModeChange(255); // Reset threshold when changing mix percentage
});


// Update the threshold value and redraw the image when the color gradient is clicked
document.getElementById('colorGradient').addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const thresholdValue = Math.round((mouseX / rect.width) * 255);

    // Update the color square and color gradient
    updateColorSquare(thresholdValue);

    // Draw the image using the displayed array
    handleColorModeChange(thresholdValue);
});

// Reset button click handler
document.getElementById('resetButton').addEventListener('click', function () {
    // Restore the original array and reset the threshold
    displayedArray = staticArray.map(row => [...row]);

    // Draw the image using the displayed array
    drawImage(displayedArray);

    // Update the color square and color gradient
    updateColorSquare(255);
    updateColorGradient(255);
});

// Generate the initial image using the displayed array
window.onload = function () {
    // Draw the initial image using the displayed array
    drawImage(displayedArray);

    // Update the initial color square and color gradient
    updateColorSquare(255);
    updateColorGradient(255);
};

// Function to load the selected image onto the canvas
function loadImage(selectedImage) {
    const img = new Image();
    img.src = "Images/"+selectedImage;

    img.onload = function () {
        ctx.drawImage(img, 0, 0); // Draw the image at (0, 0) on the canvas

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;

        const width = canvas.width;
        const height = canvas.height;

        staticArray = []; // Clear the existing staticArray

        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4; // Calculate the index
                const grayscaleValue = pixelData[i]; // Red channel value
                row.push(grayscaleValue);
            }
            staticArray.push(row);
        }

        // Draw the image using the displayed array
        drawImage(staticArray);
    };
}

document.getElementById('imageSelect').addEventListener('change', function () {
    const selectedImage = this.value;
    loadImage(selectedImage);
});