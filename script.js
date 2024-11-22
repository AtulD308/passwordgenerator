const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%$^&*()_+-={}[]|\:;.,<>/?";

let password="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize= ((passwordLength - min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor= color;
    //shadow
    indicator.styleboxShadow ='0px 0px 12px 1px ${color}'
}

function getRndInteger( min,max){
   return Math.floor (Math.random() * (max - min)) + min; 
}

function getRandomNumber(){
   return getRndInteger(0,9);
}
function generateLowerCase(){
   return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
   return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
   const randNum = getRandomNumber(0,symbols,length);
   return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasUpper = true;
    if(numbersCheck.checked) hasUpper = true;
    if(symbolsCheck.checked) hasUpper = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper)&&
        (hasNum || hasSym)&&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

 async function copycontent(){
    try{
      await navigator.clipboard.writeText(passwordDisplay.value);
      copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    } ,2000);
}

function shufflePassword(array){
    //fisher yates pwd

    // Fisher-Yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copycontent();
    }
})

generateBtn.addEventListener ('click',()=>{
//none of checkbox are selcted
if(checkCount==0) return;
if(passwordLength<checkCount){
    passwordLength = checkCount;
    handleSlider();
}
// console.log("starting journey");
//remove old password
password="";
//lets put stuff mentioned by checkbox
// if(uppercaseCheck.checked){
//     password+=generateUppercase();
// }
// if(lowercaseCheck.checked){
//     password+=generateLowercase();
// }
// if(numbersCheck.checked){
//     password+=getRandomNumber();
// }
// if(symbolsCheck.checked){
//     password+=generateSymbol();
// }
let funcArr = [];
if(uppercaseCheck.checked)
    funcArr.push(generateUppercase);
 
if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
}

if(numbersCheck.checked){
    funcArr.push(getRandomNumber);
}

if(symbolsCheck.checked){
    funcArr.push(generateSymbol);
}

//compulsory addn
for(let i = 0;i<funcArr.length;i++){
    password+=funcArr[i]();
}
// console.log("starting journey comp");

//remainnng pwd
for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex = getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
}
// console.log("starting  rem journey");

  password=shufflePassword(Array.from(password));
  //show in UI
// console.log("starting  shuffle journey");

  passwordDisplay.value=password;
// console.log("starting  UI journey");

  calcStrength();

});
