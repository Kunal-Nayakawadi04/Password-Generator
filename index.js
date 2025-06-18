const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthnumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".Generate-Button");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
//ste srength circle color to greay
setIndicator("#ccc");

// Set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

// Set indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`
}

// Generate random integer in range
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Character generators
function generateRandomNumber() {
    return getRndInteger(0, 10).toString();
}


function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    return symbols.charAt(getRndInteger(0, symbols.length));
}

// Strength checker
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // strong
    } else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // medium
    } else {
        setIndicator("#f00"); // weak
    }
}

// Copy to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    //To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Shuffle password characters
function shufflePassword(array) {
    //Fisher yeates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J , find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index 
        const temp = array[i];
        array[i] = array[j] 
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>(str += el));
    return str;
}

// Checkbox change handler
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateButton.addEventListener("click", () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numberCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolCheck.checked) funcArr.push(generateSymbol);

    // Add one character from each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill remaining length
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle and show password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Strength check
    calcStrength();
});

