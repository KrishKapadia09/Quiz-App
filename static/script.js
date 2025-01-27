// Global variables
let questionCounter = 0;

// Prevent back navigation
history.pushState(null, null, location.href);
window.onpopstate = function() {
    history.go(1);
};

// Modified key event listener - only prevent navigation keys
document.addEventListener('keydown', function(e) {
    const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
    
    // Only prevent F5 and navigation shortcuts
    if (!isInputField && (
        e.keyCode === 116 || // F5
        (e.ctrlKey && e.keyCode === 82) || // Ctrl+R
        (e.ctrlKey && e.keyCode === 78)    // Ctrl+N
    )) {
        e.preventDefault();
    }
});

// Function to create a new question input set
function createQuestionInput() {
    questionCounter++;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    
    questionDiv.innerHTML = `
        <h3>Question ${questionCounter}</h3>
        <input type="text" class="question-text" placeholder="Enter your question" required>
        <div class="options-container">
            <input type="text" class="option-input" placeholder="Option 1" required>
            <input type="text" class="option-input" placeholder="Option 2" required>
            <input type="text" class="option-input" placeholder="Option 3" required>
            <input type="text" class="option-input" placeholder="Option 4" required>
        </div>
        <select class="correct-answer" required>
            <option value="">Select Correct Answer</option>
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
        </select>
    `;
    
    return questionDiv;
}

// Function to add a new question
function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const newQuestion = createQuestionInput();
    questionsContainer.appendChild(newQuestion);
    newQuestion.querySelector('.question-text').focus();
}

// Function to save the quiz
async function saveQuiz() {
    try {
        const title = document.getElementById('quiz-title').value;
        if (!title) {
            alert('Please enter a quiz title');
            return;
        }

        const questions = [];
        const questionDivs = document.getElementsByClassName('question');
        
        for (const div of questionDivs) {
            const questionText = div.querySelector('.question-text').value;
            const options = Array.from(div.querySelectorAll('.option-input')).map(input => input.value);
            const correctAnswer = div.querySelector('.correct-answer').value;
            
            if (!questionText || options.some(opt => !opt) || correctAnswer === '') {
                alert('Please fill in all fields for each question');
                return;
            }
            
            questions.push({
                questionText,
                options,
                correctAnswer: parseInt(correctAnswer)
            });
        }

        if (questions.length === 0) {
            alert('Please add at least one question');
            return;
        }

        const response = await fetch('/create_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                questions
            })
        });

        const data = await response.json();
        
        if (data.success) {
            window.onbeforeunload = null;
            alert('Quiz created successfully!');
            window.location.href = '/quiz';
        } else {
            alert(data.message || 'Error creating quiz');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while saving the quiz');
    }
}

// Function to submit quiz
function submitQuiz() {
    window.onbeforeunload = null;
    
    const answers = {};
    const questions = document.querySelectorAll('.question');
    let allAnswered = true;

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            answers[index] = parseInt(selectedOption.value);
        } else {
            allAnswered = false;
            question.classList.add('unanswered');
        }
    });

    if (!allAnswered) {
        alert('Please answer all questions before submitting.');
        return;
    }

    questions.forEach(question => {
        question.querySelectorAll('input').forEach(element => {
            element.disabled = true;
        });
    });

    fetch('/submit_quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            answers: Object.values(answers)
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            localStorage.setItem('quiz_submitted', 'true');
            window.location.href = `/result?score=${data.score}&total=${data.totalQuestions}`;
        } else {
            throw new Error(data.message || 'Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting quiz. Please try again.');
        
        questions.forEach(question => {
            question.querySelectorAll('input').forEach(element => {
                element.disabled = false;
            });
        });
    });
}

// Check submission status on page load
document.addEventListener('DOMContentLoaded', () => {
    const quizId = document.querySelector('[data-quiz-id]')?.dataset.quizId;
    if (quizId) {
        const isSubmitted = localStorage.getItem(`quiz_${quizId}_submitted`);
        
        if (isSubmitted === 'true') {
            document.querySelectorAll('.question input, .question select, #submit-button').forEach(element => {
                element.disabled = true;
            });
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'submitted-message';
            messageDiv.textContent = 'This quiz has already been submitted.';
            document.querySelector('#quiz-form').prepend(messageDiv);
        }
    }
    
    // Warning before leaving page
    window.onbeforeunload = () => false;
});

// Prevent context menu
document.addEventListener('contextmenu', event => event.preventDefault());