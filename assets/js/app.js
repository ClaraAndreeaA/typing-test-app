// TypeRacer - Display Sample Text Functionality

// Sample text arrays for each difficulty level
const textSamples = {
    Easy: [
        "The cat sat on the mat.",
        "The sun is shining brightly today.",
        "I love to read books in the library."
    ],
    Medium: [
        "The quick brown fox jumps over the lazy dog.",
        "Web development requires patience and attention to detail.",
        "Learning JavaScript opens doors to many opportunities in tech."
    ],
    Hard: [
        "Implementing responsive design across multiple devices requires careful consideration of viewport dimensions and breakpoints.",
        "Asynchronous programming in JavaScript enables non-blocking operations that significantly improve application performance.",
        "Understanding the event-driven architecture of JavaScript helps developers build more efficient and interactive web applications."
    ]
};

// Function to get a random sample text based on difficulty
function getRandomText(difficulty) {
    const samples = textSamples[difficulty];
    const randomIndex = Math.floor(Math.random() * samples.length);
    return samples[randomIndex];
}

// Function to update the sample text when difficulty changes
function updateSampleText() {
    const difficultySelect = document.getElementById('difficultySelect');
    const sampleTextElement = document.getElementById('sampleText');
    
    const selectedDifficulty = difficultySelect.value;
    const randomText = getRandomText(selectedDifficulty);
    
    sampleTextElement.textContent = randomText;
}

// Event listener for difficulty dropdown
document.getElementById('difficultySelect').addEventListener('change', updateSampleText);

// Initialize with a random text on page load
document.addEventListener('DOMContentLoaded', function() {
    updateSampleText();
});
