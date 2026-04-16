window.addEventListener('load', () => {
    const overlay = document.getElementById("captcha-overlay");
    const stage = document.getElementById("captcha-stage");
    const instruction = document.getElementById("captcha-instruction");
    const verifyBtn = document.getElementById("captcha-verify-btn");
    
    let pendingUrl = "";
    let correctAnswer = "";
    let currentMathValue = 0;

    // Helper: Generates a random alphanumeric string for the pattern game
    function generateRandomPattern(length) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 1. Intercepting the real school links
    document.querySelectorAll("a.menu").forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href && href !== "#") {
                e.preventDefault(); 
                pendingUrl = href; // Save the real school URL
                showRandomCaptcha();
            }
        });
    });

    function showRandomCaptcha() {
        overlay.classList.remove("hidden");
        stage.innerHTML = ""; 
        verifyBtn.disabled = false;
        verifyBtn.innerText = "Verify";
        
        // Randomly pick: 0 = math, 1 = timer, 2 = pattern
        const choice = Math.floor(Math.random() * 3);

        if (choice === 0) {
            // MATH GAME (No keyboard input allowed)
            const n1 = Math.floor(Math.random() * 30) + 10;
            const n2 = Math.floor(Math.random() * 30) + 10;
            correctAnswer = n1 + n2;
            currentMathValue = 0;
            
            instruction.innerText = "Anti-Bot Measure: Set value to the correct sum.";
            stage.innerHTML = `
                <p style="font-size:22px; font-weight:bold;">${n1} + ${n2} = ?</p>
                <div class="math-controls">
                    <button type="button" class="math-step" onclick="updateMath(-1)">-</button>
                    <input type="text" id="math-display" value="0" readonly>
                    <button type="button" class="math-step" onclick="updateMath(1)">+</button>
                </div>
            `;
            
            window.updateMath = (val) => {
                currentMathValue += val;
                const display = document.getElementById('math-display');
                if(display) display.value = currentMathValue;
            };
        } 
        else if (choice === 1) {
            // TIMER GAME (The "Trap" - always fails)
            instruction.innerText = "Syncing with School Database... Please wait.";
            verifyBtn.disabled = true;
            correctAnswer = "TRAP"; 
            
            let timeLeft = Math.floor(Math.random() * 4) + 4; // 4 to 7 seconds
            const timer = setInterval(() => {
                verifyBtn.innerText = `Syncing (${timeLeft}s)`;
                timeLeft--;
                if (timeLeft < 0) {
                    clearInterval(timer);
                    verifyBtn.disabled = false;
                    verifyBtn.innerText = "Complete Handshake";
                }
            }, 1000);
        }
        else {
            // PATTERN GAME (Randomized and Canvas-based to prevent copying)
            const pattern = generateRandomPattern(7);
            correctAnswer = pattern;
            instruction.innerText = "MEMORIZE THIS IMMEDIATELY:";
            
            stage.innerHTML = `<canvas id="pattern-canvas" width="280" height="70" style="cursor:none;"></canvas>`;
            const canvas = document.getElementById('pattern-canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw to Canvas (prevents Chrome text highlighting)
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = "bold 30px 'Courier New'";
            ctx.fillStyle = "blue";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(pattern, canvas.width / 2, canvas.height / 2);

            verifyBtn.disabled = true;

            setTimeout(() => {
                instruction.innerText = "Type the code from memory:";
                stage.innerHTML = `
                    <input type="text" id="pattern-input" autocomplete="off" 
                           style="padding:10px; font-size:18px; text-transform:uppercase; border:2px solid #000; width:80%;">
                `;
                verifyBtn.disabled = false;
                const input = document.getElementById("pattern-input");
                if(input) input.focus();
            }, 1500); // 1.5 seconds to memorize
        }
    }

    // 2. Final Verification & Redirect
    verifyBtn.addEventListener("click", () => {
        const patternInput = document.getElementById("pattern-input");

        if (correctAnswer === "TRAP") {
            // Punishment: It always fails.
            alert("Error 403: Handshake Timeout. Your connection is unstable. Please re-verify.");
            showRandomCaptcha();
        } 
        else if (patternInput) {
            // Handle Pattern Game Success
            if (patternInput.value.toUpperCase() === correctAnswer) {
                alert("Verification Successful. Redirecting...");
                window.location.href = pendingUrl;
            } else {
                alert("Incorrect Pattern. Memory failure detected. Access Denied.");
                showRandomCaptcha();
            }
        }
        else if (currentMathValue === correctAnswer) {
            // Handle Math Game Success
            alert("Verification Successful. Redirecting to Portal...");
            window.location.href = pendingUrl; 
        } 
        else {
            // General failure (Math value wrong)
            alert("Incorrect. Access Denied. Try a different verification method.");
            showRandomCaptcha();
        }
    });
});