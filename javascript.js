#captcha-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

#captcha-overlay.hidden {
    display: none;
}

#captcha-container {
    background: white;
    padding: 40px;
    border-radius: 4px;
    text-align: center;
    max-width: 450px;
    font-family: "Courier New", Courier, monospace;
    border: 5px solid #ff0000;
    /* Prevents highlighting of instructions/labels across the whole UI */
    user-select: none;
    -webkit-user-select: none;
}

#captcha-verify-btn {
    background: #4285f4;
    color: white;
    border: none;
    padding: 12px 24px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
    margin-top: 20px;
}

#captcha-verify-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* Container for math elements to keep them inline */
.math-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

/* Equal sized math buttons */
.math-step {
    width: 50px; /* Fixed width ensures +/- are identical */
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    background: #eee;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

#math-display {
    width: 80px;
    height: 46px;
    text-align: center;
    font-size: 24px;
    border: 2px solid #000;
    background: #fff;
    font-family: inherit;
}

#captcha-container {
    -webkit-user-select: none;
    user-select: none;
}