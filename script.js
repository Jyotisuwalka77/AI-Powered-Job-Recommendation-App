// DOM Elements
const themeIcon = document.getElementById('theme-icon');
const getStartedBtn = document.getElementById('get-started-btn');
const formSection = document.getElementById('form-section');
const coverLetterForm = document.getElementById('cover-letter-form');
const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const saveBtn = document.getElementById('save-btn');
const coverLetterPreview = document.getElementById('cover-letter-preview');
const loadingSpinner = document.getElementById('loading-spinner');
const savedLettersContainer = document.getElementById('saved-letters-container');
const savedLetterTemplate = document.getElementById('saved-letter-template');

// Current step tracker
let currentStep = 1;

// Theme Toggle
themeIcon.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Get Started Button
getStartedBtn.addEventListener('click', () => {
    formSection.scrollIntoView({ behavior: 'smooth' });
});

// Form Navigation
nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            formSteps[currentStep - 1].classList.add('hidden');
            steps[currentStep - 1].classList.remove('active');
            currentStep++;
            formSteps[currentStep - 1].classList.remove('hidden');
            steps[currentStep - 1].classList.add('active');
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formSteps[currentStep - 1].classList.add('hidden');
        steps[currentStep - 1].classList.remove('active');
        currentStep--;
        formSteps[currentStep - 1].classList.remove('hidden');
        steps[currentStep - 1].classList.add('active');
    });
});

// Form Validation
function validateCurrentStep() {
    const currentFormStep = formSteps[currentStep - 1];
    const inputs = currentFormStep.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Create error message if it doesn't exist
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('p');
                errorMsg.classList.add('error-message');
                errorMsg.style.color = 'var(--error-color)';
                errorMsg.style.fontSize = '0.8rem';
                errorMsg.style.marginTop = '0.3rem';
                errorMsg.textContent = 'This field is required';
                input.parentNode.insertBefore(errorMsg, input.nextSibling);
            }
        } else {
            input.classList.remove('error');
            
            // Remove error message if it exists
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        }
    });

    return isValid;
}

// Remove error styling when input is being typed
coverLetterForm.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        e.target.classList.remove('error');
        
        // Remove error message if it exists
        const errorMsg = e.target.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
        }
    }
});

// Generate Cover Letter
generateBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
        // Show loading spinner
        loadingSpinner.classList.remove('hidden');
        coverLetterPreview.classList.add('hidden');
        
        // Go to the preview step
        formSteps[currentStep - 1].classList.add('hidden');
        steps[currentStep - 1].classList.remove('active');
        currentStep = 4;
        formSteps[currentStep - 1].classList.remove('hidden');
        steps[currentStep - 1].classList.add('active');
        
        // Get all form data
        const formData = {
            fullName: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            linkedin: document.getElementById('linkedin').value,
            companyName: document.getElementById('company-name').value,
            hiringManager: document.getElementById('hiring-manager').value,
            jobTitle: document.getElementById('job-title').value,
            jobDescription: document.getElementById('job-description').value,
            education: document.getElementById('education').value,
            experience: document.getElementById('experience').value,
            skills: document.getElementById('skills').value,
            achievements: document.getElementById('achievements').value,
            tone: document.getElementById('tone').value,
            useAI: document.getElementById('use-ai').checked
        };
        
        // Simulate API delay (would be replaced with actual API call)
        setTimeout(() => {
            // Generate cover letter
            const coverLetter = generateCoverLetter(formData);
            
            // Update preview
            coverLetterPreview.innerHTML = coverLetter;
            
            // Hide loading spinner, show preview
            loadingSpinner.classList.add('hidden');
            coverLetterPreview.classList.remove('hidden');
        }, 2000);
    }
});

// Copy Cover Letter
copyBtn.addEventListener('click', () => {
    const content = coverLetterPreview.innerText;
    navigator.clipboard.writeText(content).then(() => {
        // Show success message
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
});

// Download Cover Letter as PDF
downloadBtn.addEventListener('click', () => {
    // This is a placeholder for PDF generation functionality
    // In a real application, you would use a library like jsPDF or html2pdf
    
    const content = coverLetterPreview.innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const fileName = `Cover_Letter_${document.getElementById('company-name').value.replace(/\s+/g, '_')}.txt`;
    
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
    }, 2000);
});

// Save Cover Letter
saveBtn.addEventListener('click', () => {
    const companyName = document.getElementById('company-name').value;
    const jobTitle = document.getElementById('job-title').value;
    const content = coverLetterPreview.innerHTML;
    
    // Get form data to save
    const formData = {
        fullName: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        linkedin: document.getElementById('linkedin').value,
        companyName: companyName,
        hiringManager: document.getElementById('hiring-manager').value,
        jobTitle: jobTitle,
        jobDescription: document.getElementById('job-description').value,
        education: document.getElementById('education').value,
        experience: document.getElementById('experience').value,
        skills: document.getElementById('skills').value,
        achievements: document.getElementById('achievements').value,
        tone: document.getElementById('tone').value,
        content: content,
        date: new Date().toISOString()
    };
    
    // Save to local storage
    saveCoverLetter(formData);
    
    // Show success message
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    
    setTimeout(() => {
        saveBtn.innerHTML = originalText;
    }, 2000);
    
    // Refresh saved letters display
    loadSavedLetters();
});

// Function to save cover letter to local storage
function saveCoverLetter(data) {
    // Get existing saved letters
    let savedLetters = JSON.parse(localStorage.getItem('savedCoverLetters')) || [];
    
    // Generate a unique ID
    const id = Date.now().toString();
    data.id = id;
    
    // Add new letter
    savedLetters.push(data);
    
    // Save back to local storage
    localStorage.setItem('savedCoverLetters', JSON.stringify(savedLetters));
}

// Function to load saved letters from local storage
function loadSavedLetters() {
    // Get saved letters from local storage
    const savedLetters = JSON.parse(localStorage.getItem('savedCoverLetters')) || [];
    
    // Update the DOM
    if (savedLetters.length === 0) {
        savedLettersContainer.innerHTML = '<p class="no-saved-letters">No saved cover letters yet.</p>';
        return;
    }
    
    // Clear container
    savedLettersContainer.innerHTML = '';
    
    // Add letters to container
    savedLetters.forEach(letter => {
        const letterElement = savedLetterTemplate.content.cloneNode(true);
        
        letterElement.querySelector('.company-name').textContent = letter.companyName;
        letterElement.querySelector('.job-title').textContent = letter.jobTitle;
        
        // Add event listeners for load and delete buttons
        const letterNode = letterElement.querySelector('.saved-letter');
        letterNode.dataset.id = letter.id;
        
        const loadBtn = letterElement.querySelector('.load-btn');
        loadBtn.addEventListener('click', () => loadLetter(letter.id));
        
        const deleteBtn = letterElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteLetter(letter.id));
        
        savedLettersContainer.appendChild(letterElement);
    });
}

// Function to load a saved letter
function loadLetter(id) {
    // Get saved letters
    const savedLetters = JSON.parse(localStorage.getItem('savedCoverLetters')) || [];
    
    // Find the letter with the matching ID
    const letter = savedLetters.find(letter => letter.id === id);
    
    if (letter) {
        // Fill in form fields
        document.getElementById('full-name').value = letter.fullName;
        document.getElementById('email').value = letter.email;
        document.getElementById('phone').value = letter.phone;
        document.getElementById('address').value = letter.address;
        document.getElementById('linkedin').value = letter.linkedin;
        document.getElementById('company-name').value = letter.companyName;
        document.getElementById('hiring-manager').value = letter.hiringManager;
        document.getElementById('job-title').value = letter.jobTitle;
        document.getElementById('job-description').value = letter.jobDescription;
        document.getElementById('education').value = letter.education;
        document.getElementById('experience').value = letter.experience;
        document.getElementById('skills').value = letter.skills;
        document.getElementById('achievements').value = letter.achievements;
        document.getElementById('tone').value = letter.tone;
        
        // Update preview
        coverLetterPreview.innerHTML = letter.content;
        
        // Navigate to preview step
        formSteps.forEach(step => step.classList.add('hidden'));
        steps.forEach(step => step.classList.remove('active'));
        
        currentStep = 4;
        formSteps[currentStep - 1].classList.remove('hidden');
        steps[currentStep - 1].classList.add('active');
        
        // Scroll to form
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to delete a saved letter
function deleteLetter(id) {
    // Get saved letters
    let savedLetters = JSON.parse(localStorage.getItem('savedCoverLetters')) || [];
    
    // Filter out the letter with the matching ID
    savedLetters = savedLetters.filter(letter => letter.id !== id);
    
    // Save back to local storage
    localStorage.setItem('savedCoverLetters', JSON.stringify(savedLetters));
    
    // Refresh display
    loadSavedLetters();
}

// Function to generate cover letter
function generateCoverLetter(data) {
    // Get current date
    const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Get tone styles based on selected tone
    let toneStyle = '';
    let openingLine = '';
    let closingLine = '';
    
    switch(data.tone) {
        case 'professional':
            openingLine = `I am writing to express my interest in the ${data.jobTitle} position at ${data.companyName}.`;
            closingLine = `Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.`;
            break;
        case 'enthusiastic':
            openingLine = `I'm thrilled to apply for the ${data.jobTitle} role at ${data.companyName}! Your company's innovative approach to [derived from job description] truly resonates with me.`;
            closingLine = `I'm excited about the possibility of bringing my passion and skills to your team and would welcome the chance to discuss how I can contribute to ${data.companyName}'s continued success.`;
            break;
        case 'confident':
            openingLine = `With my proven track record in [field related to job], I am confident that I am an excellent candidate for the ${data.jobTitle} position at ${data.companyName}.`;
            closingLine = `I am certain that my combination of experience, skills, and dedication would make me a valuable addition to your team. I look forward to discussing how I can contribute to ${data.companyName}'s objectives.`;
            break;
        case 'creative':
            openingLine = `When I discovered the ${data.jobTitle} opportunity at ${data.companyName}, I couldn't help but imagine the innovative solutions we could create together.`;
            closingLine = `I would love to bring my creative approach and unique perspective to your team. Let's connect to discuss how my vision aligns with ${data.companyName}'s creative direction.`;
            break;
        default:
            openingLine = `I am writing to express my interest in the ${data.jobTitle} position at ${data.companyName}.`;
            closingLine = `Thank you for considering my application. I look forward to hearing from you.`;
    }
    
    // Extract skills from the comma-separated list
    const skills = data.skills.split(',').map(skill => skill.trim());
    
    // Create a skills section based on the extracted skills
    let skillsText = '';
    if (skills.length > 0) {
        skillsText = 'Some of my key skills include:';
        skills.forEach(skill => {
            skillsText += `<br>• ${skill}`;
        });
    }
    
    // AI enhancements - in a real app, this would be replaced with actual AI API calls
    let aiEnhancement = '';
    if (data.useAI) {
        // Simulate AI-enhanced content
        const jobKeywords = extractKeywords(data.jobDescription);
        aiEnhancement = `<p>Based on the job description, I noticed you're looking for someone with expertise in ${jobKeywords.join(', ')}. Throughout my career, I've developed strong capabilities in these areas, as demonstrated by ${generateRelevantExperience(data.experience, jobKeywords)}.</p>`;
    }
    
    // Create the cover letter content
    let salutation = data.hiringManager ? `Dear ${data.hiringManager},` : 'Dear Hiring Manager,';
    
    const coverLetter = `
        <div style="font-family: 'Times New Roman', Times, serif; line-height: 1.6;">
            <div style="text-align: right; margin-bottom: 20px;">
                <p>${data.fullName}<br>
                ${data.address}<br>
                ${data.phone}<br>
                ${data.email}
                ${data.linkedin ? '<br>' + data.linkedin : ''}</p>
                <p>${date}</p>
            </div>
            
            <p>${salutation}</p>
            
            <p>${openingLine}</p>
            
            <p>With a background in ${data.education}, I have developed a strong foundation in ${data.experience}.</p>
            
            <p>${skillsText}</p>
            
            ${aiEnhancement}
            
            ${data.achievements ? `<p>${data.achievements}</p>` : ''}
            
            <p>${closingLine}</p>
            
            <p>Sincerely,<br>
            ${data.fullName}</p>
        </div>
    `;
    
    return coverLetter;
}

// Function to extract keywords from job description
function extractKeywords(jobDescription) {
    // This is a simple keyword extraction function
    // In a real app, this would use more sophisticated NLP techniques or AI
    
    // List of common job skills to look for
    const commonSkills = [
        'javascript', 'react', 'angular', 'vue', 'node', 'python', 'java', 'c#', 'php', 'ruby',
        'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind', 'material ui',
        'sql', 'nosql', 'mongodb', 'mysql', 'postgresql', 'firebase', 'aws', 'azure', 'gcp',
        'design', 'ui', 'ux', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator',
        'agile', 'scrum', 'kanban', 'jira', 'trello', 'git', 'github', 'gitlab',
        'communication', 'teamwork', 'leadership', 'problem-solving', 'creativity'
    ];
    
    // Convert job description to lowercase for case-insensitive matching
    const lowercaseDesc = jobDescription.toLowerCase();
    
    // Find matching skills
    const foundSkills = commonSkills.filter(skill => 
        lowercaseDesc.includes(skill.toLowerCase())
    );
    
    // If no skills found, return some default ones
    if (foundSkills.length === 0) {
        return ['relevant technical skills', 'teamwork', 'communication'];
    }
    
    // Return the top 3 skills (or all if less than 3)
    return foundSkills.slice(0, 3);
}

// Function to generate relevant experience based on keywords
function generateRelevantExperience(experience, keywords) {
    // In a real app, this would be more sophisticated
    return `my experience in ${keywords.join(' and ')}`;
}

// Load saved letters on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSavedLetters();
});