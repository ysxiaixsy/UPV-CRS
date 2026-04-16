document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("captcha-overlay");
    const stage = document.getElementById("captcha-stage");
    const instruction = document.getElementById("captcha-instruction");
    const verifyBtn = document.getElementById("captcha-verify-btn");
    
    let pendingUrl = "";

    // This targets EVERY link on the page
    const allLinks = document.querySelectorAll("a");

    allLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            // Get the destination (e.g., admin.html)
            const destination = this.getAttribute("href");

            // If it's a real page and not just a dummy "#" link
            if (destination && destination !== "#") {
                // STOP the browser from going to the page
                event.preventDefault(); 
                
                // Save where the user wanted to go
                pendingUrl = destination; 
                
                // Launch the annoying captcha
                showRandomCaptcha();
            }
        });
    });

    function showRandomCaptcha() {
        overlay.classList.remove("hidden");
        stage.innerHTML = ""; // Clear previous game
        
        const games = ['math', 'wait', 'grid'];
        const randomGame = games[Math.floor(Math.random() * games.length)];

        if (randomGame === 'math') {
            instruction.innerText = "Security Check: Solve to proceed.";
            stage.innerHTML = `<p>What is $15 \times 3 + (100 / 4)$?</p>
                               <input type="text" style="margin-top:10px;">`;
        } else if (randomGame === 'wait') {
            instruction.innerText = "Verifying connection stability...";
            verifyBtn.disabled = true;
            let countdown = 5;
            verifyBtn.innerText = `Wait ${countdown}s`;
            const timer = setInterval(() => {
                countdown--;
                verifyBtn.innerText = `Wait ${countdown}s`;
                if (countdown <= 0) {
                    clearInterval(timer);
                    verifyBtn.disabled = false;
                    verifyBtn.innerText = "Verify";
                }
            }, 1000);
        } else {
            instruction.innerText = "Select all images containing 'Bicycles'";
            stage.innerHTML = `<div class="captcha-grid">
                ${new Array(9).fill(0).map((_, i) => `<div class="captcha-img" style="background:#ccc; border:1px solid #999;" onclick="this.classList.toggle('selected')">IMG_${i}</div>`).join('')}
            </div>`;
        }
    }

    // When they click the "Verify" button on the captcha
  verifyBtn.addEventListener("click", () => {
    // 30% chance the "Verify" button just refreshes the captcha instead of letting them through
    if (Math.random() < 0.3) {
        alert("Verification expired. Please try again.");
        showRandomCaptcha();
    } else {
        overlay.classList.add("hidden");
        window.location.href = pendingUrl;
    }
});
});