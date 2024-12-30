// Elements Initialization
const image = document.getElementById("draggableImage");
const signature = document.getElementById("draggableImageSignature");
const imageToolbar = document.getElementById("toolbar");
const textToolbar = document.getElementById("text-toolbar");

const output = document.getElementById("output");
let cropper = null;

// Text toolbar buttons
const boldBtn = document.getElementById("bold-button");
const italicBtn = document.getElementById("italic-button");
const underlineBtn = document.getElementById("underline-button");
const alignLeftBtn = document.getElementById("align-left");
const alignCenterBtn = document.getElementById("align-center");
const alignRightBtn = document.getElementById("align-right");
const fontSelector = document.getElementById("font-selector");
const fontSizeInput = document.getElementById("font-size");
const increaseFontBtn = document.getElementById("increase-font");
const decreaseFontBtn = document.getElementById("decrease-font");
const textColorPicker = document.getElementById("text-color-picker");

// Initialize Draggable for Editable Name and Number
const editableName = document.getElementById("editable-name");
const editableNumber = document.getElementById("editable-number");

if (editableName) enableDragging(editableName);
if (editableNumber) enableDragging(editableNumber);

// Font Search Input
const fontSearchInput = document.getElementById("font-search");

// List of fonts for font selector
const fonts = ["Arial", "Arial Black", "Arial Narrow", "Asap", "Bree Serif", "Cabin", "Cantarell", "Cardo", "Cedarville Cursive", "Courier New", "Droid Sans", "Droid Serif", "EB Garamond", "Exo 2", "Frank Ruhl Libre", "Fira Sans", "Lora", "Merriweather", "Montserrat", "Open Sans", "Poppins", "Quicksand", "Raleway", "Roboto", "Roboto Condensed", "Roboto Slab", "Slabo 27px", "Source Sans Pro", "Tisa", "Ubuntu", "Varela Round", "Vollkorn"];

// Dragging Variables
let isDragging = false;
let initialX = 0,
	initialY = 0,
	offsetX = 0,
	offsetY = 0;

	
let currentElement = null;
let selectedEditable = null;
let activeElement = null;

// Enable Dragging for a specific element
function enableDragging(element) {
	element.addEventListener("mousedown", (e) => {
		isDragging = true;
		currentElement = element;
		initialX = e.clientX - (element.offsetLeft || 0);
		initialY = e.clientY - (element.offsetTop || 0);
		document.addEventListener("mousemove", dragElement);
		document.addEventListener("mouseup", stopDragging);
	});
}

function dragElement(e) {
	if (!isDragging || !currentElement) return;

	// Calculate new position based on mouse movement
	offsetX = e.clientX - initialX;
	offsetY = e.clientY - initialY;

	// Set the position for the dragged element only
	currentElement.style.position = "absolute";
	currentElement.style.left = `${offsetX}px`;
	currentElement.style.top = `${offsetY}px`;
}

function stopDragging() {
	isDragging = false;
	currentElement = null;
	document.removeEventListener("mousemove", dragElement);
	document.removeEventListener("mouseup", stopDragging);
}


// Initialize Draggable Elements
if (image) enableDragging(image);
if (signature) enableDragging(signature);
if (imageToolbar) enableDragging(imageToolbar);
if (textToolbar) enableDragging(textToolbar);

// New draggable elements for .date, .brgy, .name
const date = document.querySelector(".date");
const brgy = document.querySelector(".brgy");
const name = document.querySelector(".name");

if (date) enableDragging(date);
if (brgy) enableDragging(brgy);
if (name) enableDragging(name);


// Hide both toolbars initially
imageToolbar.style.display = "none";
textToolbar.style.display = "none";

// Font Selector Functionality
function populateFontSelector() {
	fonts.forEach((font) => {
		const option = document.createElement("option");
		option.value = font;
		option.textContent = font;
		option.style.fontFamily = font;
		fontSelector.appendChild(option);

		const link = document.createElement("link");
		link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	});
}

function filterFonts() {
	const searchQuery = fontSearchInput.value.toLowerCase();
	const options = fontSelector.options;
	for (let i = 0; i < options.length; i++) {
		const option = options[i];
		const fontName = option.textContent.toLowerCase();
		if (fontName.includes(searchQuery)) {
			option.classList.add("visible");
		} else {
			option.classList.remove("visible");
		}
	}
}

// Apply selected font to the currently selected editable element
fontSelector.addEventListener("change", () => {
	if (selectedEditable) {
		const selectedFont = fontSelector.value;
		selectedEditable.style.fontFamily = selectedFont;
	}
});

// Search for fonts
if (fontSearchInput) {
	fontSearchInput.addEventListener("input", filterFonts);
}

// Initialize font selector
populateFontSelector();

// Text Manipulation Buttons
if (boldBtn) boldBtn.addEventListener("click", () => document.execCommand("bold"));
if (italicBtn) italicBtn.addEventListener("click", () => document.execCommand("italic"));
if (underlineBtn) underlineBtn.addEventListener("click", () => document.execCommand("underline"));
if (alignLeftBtn) alignLeftBtn.addEventListener("click", () => document.execCommand("justifyLeft"));
if (alignCenterBtn) alignCenterBtn.addEventListener("click", () => document.execCommand("justifyCenter"));
if (alignRightBtn) alignRightBtn.addEventListener("click", () => document.execCommand("justifyRight"));

// Event listener for selecting an editable text element
document.querySelectorAll(".editable").forEach((el) => {
	el.addEventListener("click", () => {
		document.querySelectorAll(".editable").forEach((e) => e.classList.remove("selected-text"));
		el.classList.add("selected-text");
		selectedEditable = el;
		const currentFontSize = parseInt(window.getComputedStyle(selectedEditable).fontSize);
		fontSizeInput.value = currentFontSize;
	});
});

// Apply font size only to selected text
fontSizeInput.addEventListener("input", () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = `${fontSizeInput.value}px`;
        range.surroundContents(span);
    }
});


// Increase font size for selected text
increaseFontBtn.addEventListener("click", () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        span.style.fontSize = "larger";
        range.surroundContents(span);
    }
});

// Font Size Decrease
if (decreaseFontBtn) {
	decreaseFontBtn.addEventListener("click", () => {
		if (selectedEditable) {
			let fontSize = parseFloat(window.getComputedStyle(selectedEditable).fontSize) || 12;
			fontSize -= 1;
			if (fontSize >= 6) {
				selectedEditable.style.fontSize = fontSize + "px";
				fontSizeInput.value = fontSize.toFixed(1);
			}
		}
	});
}

// Text Color Picker
if (textColorPicker) {
	textColorPicker.addEventListener("input", (e) => {
		document.execCommand("foreColor", false, e.target.value);
	});
}

// Show toolbars and handle image selection
function selectImage(element) {
	image.classList.remove("selected-image");
	signature.classList.remove("selected-image");
	element.classList.add("selected-image");

	imageToolbar.style.display = "flex";
	textToolbar.style.display = "none";
}

// Image Toolbar Actions
if (image) {
	image.addEventListener("click", () => selectImage(image));
}

if (signature) {
	signature.addEventListener("click", () => selectImage(signature));
}

// Text Toolbar Actions
document.querySelectorAll(".editable").forEach((el) => {
	el.addEventListener("click", () => {
		textToolbar.style.display = "block";
		imageToolbar.style.display = "none";
	});
});

// Close text toolbar when clicking outside
document.addEventListener("click", (event) => {
	if (!event.target.closest(".editable") && !event.target.closest("#text-toolbar")) {
		textToolbar.style.display = "none";
	}
});

// Close image toolbar when clicking outside
document.addEventListener("click", (event) => {
	if (!event.target.closest("#draggableImage") && !event.target.closest("#draggableImageSignature") && !event.target.closest("#toolbar")) {
		imageToolbar.style.display = "none";
	}
});

// Add the Remove Background button functionality
const removeBgBtn = document.getElementById("bgRemoveBtn");

if (removeBgBtn) {
	removeBgBtn.addEventListener("click", () => {
		if (!image) return;
		removeBackground(image);
	});
}

// Function to remove the background using the RemoveBG API
async function removeBackground(imageElement) {
	const formData = new FormData();

	// Fetch the image as a Blob and append it to the form data
	const response = await fetch(imageElement.src);
	const imageBlob = await response.blob();

	formData.append("image_file", imageBlob, "image.png"); // Append the image blob with a file name
	formData.append("size", "auto");

	try {
		const res = await fetch("https://api.removebg.com/v1.0/removebg", {
			method: "POST",
			headers: {
				"X-Api-Key": "pFM75PFfj7dYuEfRtcHF7hMk", // Use your RemoveBG API Key here
			},
			body: formData,
		});

		if (!res.ok) {
			throw new Error("Failed to remove background");
		}

		const data = await res.blob();
		const imageUrl = URL.createObjectURL(data);

		// Update the image source with the background removed image
		imageElement.src = imageUrl;

		// Add a temporary border for visual indication
		imageElement.style.border = "2px dashed #007bff";

		// Remove the border after 3 seconds
		setTimeout(() => {
			imageElement.style.border = "none";
		}, 3000);
	} catch (error) {
		console.error("Error removing background:", error);
		alert("Error removing background. Please try again.");
	}
}

// Initialize draggable and resizable for specified elements
["#draggableImage", "#draggableImageSignature"].forEach((selector) => {
	const element = document.querySelector(selector);
	if (element) {
		element.classList.add("resizable");

		// Store the original size and position
		element.dataset.originalWidth = element.offsetWidth;
		element.dataset.originalHeight = element.offsetHeight;
		element.dataset.originalX = 0; // Assuming no initial translation
		element.dataset.originalY = 0;
	}
});

// Add resize functionality with visual handles and real-time feedback
interact(".resizable")
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true },
		listeners: {
			start(event) {
				const target = event.target;

				// Add border indicator
				target.style.border = "2px dashed #007bff";

				// Add resize handles
				if (!target.querySelector(".resize-handle")) {
					["top-left", "top-right", "bottom-left", "bottom-right"].forEach((position) => {
						const handle = document.createElement("div");
						handle.className = `resize-handle ${position}`;
						Object.assign(handle.style, {
							position: "absolute",
							width: "10px",
							height: "10px",
							backgroundColor: "#007bff",
							zIndex: "10000",
							borderRadius: "50%",
							cursor: `${position.replace("-", "-resize")}`,
						});

						// Set position for each handle
						switch (position) {
							case "top-left":
								handle.style.top = "-5px";
								handle.style.left = "-5px";
								break;
							case "top-right":
								handle.style.top = "-5px";
								handle.style.right = "-5px";
								break;
							case "bottom-left":
								handle.style.bottom = "-5px";
								handle.style.left = "-5px";
								break;
							case "bottom-right":
								handle.style.bottom = "-5px";
								handle.style.right = "-5px";
								break;
						}
						target.appendChild(handle);
					});
				}

				// Add feedback for dimensions
				const feedback = document.createElement("div");
				feedback.id = "resize-feedback";
				feedback.style.position = "absolute";
				feedback.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
				feedback.style.color = "white";
				feedback.style.padding = "5px";
				feedback.style.borderRadius = "5px";
				feedback.style.zIndex = "9999";
				feedback.style.fontSize = "12px";
				document.body.appendChild(feedback);
			},
			move(event) {
				const target = event.target;
				const feedback = document.getElementById("resize-feedback");

				let { x, y } = target.dataset;

				x = (parseFloat(x) || 0) + event.deltaRect.left;
				y = (parseFloat(y) || 0) + event.deltaRect.top;

				Object.assign(target.style, {
					width: `${event.rect.width}px`,
					height: `${event.rect.height}px`,
					transform: `translate(${x}px, ${y}px)`,
				});

				Object.assign(target.dataset, { x, y });

				// Update feedback with current dimensions
				feedback.style.left = `${event.clientX + 10}px`;
				feedback.style.top = `${event.clientY + 10}px`;
				feedback.textContent = `W: ${Math.round(event.rect.width)}px, H: ${Math.round(event.rect.height)}px`;
			},
			end(event) {
				const target = event.target;

				// Remove border indicator and resize handles
				target.style.border = "none";
				target.querySelectorAll(".resize-handle").forEach((handle) => handle.remove());

				// Remove feedback
				const feedback = document.getElementById("resize-feedback");
				if (feedback) feedback.remove();
			},
		},
		modifiers: [
			interact.modifiers.snap({
				targets: [
					interact.snappers.grid({ x: 10, y: 10 }), // Snap to grid of 10px
				],
				range: Infinity,
				relativePoints: [{ x: 0, y: 0 }],
			}),
		],
	})
	.draggable({
		listeners: {
			move(event) {
				let { x, y } = event.target.dataset;

				x = (parseFloat(x) || 0) + event.dx;
				y = (parseFloat(y) || 0) + event.dy;

				event.target.style.transform = `translate(${x}px, ${y}px)`;

				Object.assign(event.target.dataset, { x, y });
			},
		},
	});

// Reset button functionality
document.getElementById("resetBtn").addEventListener("click", () => {
	// Select all resizable elements
	document.querySelectorAll(".resizable").forEach((element) => {
		// Reset size and position to original values
		Object.assign(element.style, {
			width: `${element.dataset.originalWidth}px`,
			height: `${element.dataset.originalHeight}px`,
			transform: `translate(${element.dataset.originalX}px, ${element.dataset.originalY}px)`,
		});

		// Reset dataset values for translation
		element.dataset.x = element.dataset.originalX;
		element.dataset.y = element.dataset.originalY;
	});
});

// Flip button functionality
const flipBtn = document.getElementById("flipBtn");
let currentFlippedElement = null; // Tracks the currently selected image for flipping

if (flipBtn) {
	flipBtn.addEventListener("click", () => {
		if (!currentFlippedElement) {
			alert("Please select an image first."); // Notify if no element is selected
			return;
		}

		// Toggle the flip state
		const isFlipped = currentFlippedElement.dataset.flipped === "true";
		const scaleX = isFlipped ? 1 : -1;

		// Apply the updated transform while preserving other transformations
		const currentTransform = currentFlippedElement.style.transform || "";
		const updatedTransform = currentTransform.replace(/scaleX\(-?1\)/, "").trim() + ` scaleX(${scaleX})`;

		console.log("Current Transform:", currentTransform);
		console.log("Updated Transform:", updatedTransform);

		currentFlippedElement.style.transform = updatedTransform;
		currentFlippedElement.dataset.flipped = !isFlipped; // Update the flip state
		currentFlippedElement.dataset.scaleX = scaleX; // Store the scaleX value

		console.log("Flipped State:", currentFlippedElement.dataset.flipped);
		console.log("ScaleX Value:", currentFlippedElement.dataset.scaleX);
	});
}

// Function to select an image for manipulation
function selectImage(element) {
	// Deselect all images
	image.classList.remove("selected-image");
	signature.classList.remove("selected-image");

	// Remove borders from other images
	[image, signature].forEach((img) => {
		img.style.border = "none";
	});

	// Select the clicked image
	element.classList.add("selected-image");
	element.style.border = "2px dashed #007bff"; // Add temporary border

	// Set the current flipped element to the selected image
	currentFlippedElement = element;

	// Show the image toolbar
	imageToolbar.style.display = "flex";
	textToolbar.style.display = "none";

	// Remove the border after a timeout
	setTimeout(() => {
		element.style.border = "none";
	}, 3000); // Border disappears after 3 seconds
}

// Attach the click event to the image and signature
if (image) {
	image.addEventListener("click", () => selectImage(image));
}

if (signature) {
	signature.addEventListener("click", () => selectImage(signature));
}

// Ensure no other part of the code is resetting the transform property
document.getElementById("resetBtn").addEventListener("click", () => {
	// Select all resizable elements
	document.querySelectorAll(".resizable").forEach((element) => {
		// Reset size and position to original values
		const isFlipped = element.dataset.flipped === "true";
		const scaleX = isFlipped ? -1 : 1;

		Object.assign(element.style, {
			width: `${element.dataset.originalWidth}px`,
			height: `${element.dataset.originalHeight}px`,
			transform: `translate(${element.dataset.originalX}px, ${element.dataset.originalY}px) scaleX(${scaleX})`,
		});

		// Reset dataset values for translation
		element.dataset.x = element.dataset.originalX;
		element.dataset.y = element.dataset.originalY;
		element.dataset.scaleX = scaleX; // Store the scaleX value
	});
});

// Interactable settings
interact("#draggableImage, #draggableImageSignature")
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true },
		listeners: {
			move(event) {
				let { x, y } = event.target.dataset;

				// Get stored scaleX (to maintain flip state)
				const scaleX = event.target.dataset.scaleX || 1;

				// Adjust position based on resize
				x = (parseFloat(x) || 0) + event.deltaRect.left;
				y = (parseFloat(y) || 0) + event.deltaRect.top;

				// Apply transform with scaleX preserved
				event.target.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX})`;

				Object.assign(event.target.dataset, { x, y });
			},
		},
	})
	.draggable({
		listeners: {
			move(event) {
				let { x, y } = event.target.dataset;

				// Get stored scaleX (to maintain flip state)
				const scaleX = event.target.dataset.scaleX || 1;

				// Adjust position based on dragging
				x = (parseFloat(x) || 0) + event.dx;
				y = (parseFloat(y) || 0) + event.dy;

				// Apply transform with scaleX preserved
				event.target.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX})`;

				Object.assign(event.target.dataset, { x, y });
			},
		},
	});

// Interact.js for Resizing and Dragging
interact("#draggableImage, #draggableImageSignature")
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true },
		listeners: {
			move(event) {
				let { x, y } = event.target.dataset;

				x = (parseFloat(x) || 0) + event.deltaRect.left;
				y = (parseFloat(y) || 0) + event.deltaRect.top;

				const isFlipped = event.target.dataset.flipped === "true";
				const scaleX = isFlipped ? -1 : 1;

				Object.assign(event.target.style, {
					width: `${event.rect.width}px`,
					height: `${event.rect.height}px`,
					transform: `translate(${x}px, ${y}px) scaleX(${scaleX})`,
				});

				Object.assign(event.target.dataset, { x, y });
			},
		},
	})
	.draggable({
		listeners: {
			move(event) {
				let { x, y } = event.target.dataset;

				x = (parseFloat(x) || 0) + event.dx;
				y = (parseFloat(y) || 0) + event.dy;

				const isFlipped = event.target.dataset.flipped === "true";
				const scaleX = isFlipped ? -1 : 1;

				event.target.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX})`;

				Object.assign(event.target.dataset, { x, y });
			},
		},
	});

	// New draggable elements for .date, .brgy, .name, .course
const course = document.querySelector(".course"); // Add course element
if (course) enableDragging(course); // Enable dragging for the course element








