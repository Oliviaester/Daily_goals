const listDiv = document.querySelector('.list');
const descriptionP = document.querySelector('p.description');
const addItemInput = document.querySelector('input.add-input');
const addItemButton = document.querySelector('button.add-button');
const goalSummary = document.querySelector('#goal-summary');
const completedSpan = document.querySelector('#completed-span');
const totalSpan = document.querySelector('#total-span');
const percentage = document.querySelector('#percentage');
const ul = document.querySelector('ul');
const dateSpan = document.querySelector('#date-span');


// Get Today's date
let now = new Date();
let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
dateSpan.textContent = daysOfWeek[now.getDay()] + ", " + months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear();


// escaping input
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// Get Current Time function
function currentTime(){
    let now = new Date();
    let str = "";
    let hr = now.getHours();
    let min = now.getMinutes();
    if (hr == 0){
        str += "12:";
    } else if ( hr < 10){
        str += "0" + hr + ":";
    } else if ( hr < 12){
        str += hr + ":";
    } else if ( hr < 22){
        str += "0" + (hr-12) + ":";
    } else{
        str += (hr-12) + ":";
    }
    if ( min < 10){
        str += "0" + min;
    }else{
        str += min;
    }
    let ampm = "am";
    if ( hr > 12){
        ampm = "pm";
    }
    str += " " + ampm;
    return str;
}



function attachListItemChildren (li) {
    let timeSpan = document.createElement('span');
    timeSpan.className = "time-span";
    li.appendChild(timeSpan);
    let buttonDiv = document.createElement('button-div');
    buttonDiv.className = "button-div";
    li.appendChild(buttonDiv);
    let up = document.createElement('button');
    up.className = "up";
    up.textContent = "Up";
    buttonDiv.appendChild(up);
    let down = document.createElement('button');
    down.className = "down";
    down.textContent = "Down";
    buttonDiv.appendChild(down);
    let completed = document.createElement('button');
    completed.className = "completed";
    completed.textContent = "Completed";
    buttonDiv.appendChild(completed);
    let remove = document.createElement('button');
    remove.className = "remove";
    remove.textContent = "Remove";
    buttonDiv.appendChild(remove);
}

const disableTwoButtons = () => {
    let up = ul.firstElementChild.lastElementChild.firstElementChild;
    up.disabled = true;
    let down = ul.lastElementChild.lastElementChild.firstElementChild.nextElementSibling;
    down.disabled = true;
}
const enableButtons = (li) => {
    li.lastElementChild.firstElementChild.disabled = false;
    li.lastElementChild.firstElementChild.nextElementSibling.disabled = false;
}

for ( let i=0; i<ul.children.length; i++){
    attachListItemChildren(ul.children[i]);
}
disableTwoButtons();

const recalculatePercentage = () => {
    let completed = parseInt(completedSpan.textContent,10);
    let total = parseInt(totalSpan.textContent,10);
    percentage.textContent = Math.round( completed/total*100 );
}

const appendList = () =>{
    let ul = document.getElementsByTagName('ul')[0];
    let li = document.createElement('li');
    li.innerHTML = encodeHTML(addItemInput.value);
    attachListItemChildren(li);
    ul.appendChild(li);
    // if first li appending
    if ( ul.children.length == 1){
        disableTwoButtons();
        goalSummary.style.display = "inline";
    } else{
        enableButtons(ul.lastElementChild.previousElementSibling);
        disableTwoButtons();
    }
    totalSpan.textContent = parseInt(totalSpan.textContent,10) + 1;
    recalculatePercentage();
    addItemInput.value = "";
    addItemInput.focus();
}

addItemButton.addEventListener('click', appendList);

addItemInput.addEventListener('keydown', (e) => {
    if ( e.key == "Enter"){
        appendList();
    }
})

const addHighlight = (li) => {
    let prevBgColor = li.style.backgroundColor;
    li.style.backgroundColor = "#e6ffff";
    return prevBgColor;
}

const removeHighlight = (li, prevBgColor) => {
    if ( li ){
        li.style.backgroundColor = prevBgColor;
    }
}

ul.addEventListener('click', (e)=>{
    if ( e.target.tagName == 'BUTTON'){
        if ( e.target.className == 'remove'){
            let li = e.target.parentNode.parentNode;
            let ul = li.parentNode;
            if ( li.style.backgroundColor == "rgb(187, 241, 187)"){
                completedSpan.textContent = parseInt(completedSpan.textContent,10) - 1;
            }
            totalSpan.textContent = parseInt(totalSpan.textContent,10) - 1;
            recalculatePercentage();
            ul.removeChild(li);
            if ( ul.children.length > 0){
                disableTwoButtons();
            } else{
                goalSummary.style.display = "none";
            }
        } else if ( e.target.className == 'completed'){
            let li = e.target.parentNode.parentNode;
            if ( li.style.backgroundColor == 'rgb(187, 241, 187)'){
                li.firstElementChild.textContent = "";
                li.style.backgroundColor = "transparent";
                completedSpan.textContent = parseInt(completedSpan.textContent,10) - 1;
                recalculatePercentage();
            }else{
                let now = currentTime();
                li.firstElementChild.textContent = "(" + now + ")";
                li.style.backgroundColor = "rgb(187, 241, 187)";
                completedSpan.textContent = parseInt(completedSpan.textContent,10) + 1;
                recalculatePercentage();
            }
        }else if ( e.target.className == 'up'){
            let li = e.target.parentNode.parentNode;
            let prevLi = li.previousElementSibling;
            let ul = li.parentNode;
            // if condition is unneccessary as buttons are disabled, but just in case
            if ( prevLi ) {
                // if only two elements, disable buttons
                if ( ul.children.length == 2 ){
                    enableButtons(li);
                    enableButtons(prevLi);
                    ul.insertBefore(li, prevLi);
                    disableTwoButtons();
                }
                // if its lastElement, enable buttons
                else if ( ul.lastElementChild == li){
                    enableButtons(li);
                    ul.insertBefore(li, prevLi);
                    disableTwoButtons();
                }
                // if its second element
                else if ( prevLi == ul.firstElementChild ){
                    enableButtons(prevLi);
                    ul.insertBefore(li, prevLi);
                    disableTwoButtons();
                } else{
                    ul.insertBefore(li, prevLi);
                }
                let prevBgColor = addHighlight(li);
                setTimeout(removeHighlight, 300, li, prevBgColor);
            }
        } else if ( e.target.className == "down"){
            let li = e.target.parentNode.parentNode;
            let nextLi = li.nextElementSibling;
            let ul = li.parentNode;
            if ( nextLi ){
                // if only two elements, disable buttons
                if ( ul.children.length == 2 ){
                    enableButtons(li);
                    enableButtons(nextLi);
                    ul.insertBefore(nextLi, li);
                    disableTwoButtons();
                }
                // if it's first element, enable buttons
                else if ( ul.firstElementChild == li ){
                    enableButtons(li);
                    ul.insertBefore(nextLi, li);
                    disableTwoButtons();
                }
                // if its second last element
                else if ( nextLi == ul.lastElementChild ){
                    enableButtons(nextLi);
                    ul.insertBefore(nextLi, li);
                    disableTwoButtons();
                } else{
                    ul.insertBefore(nextLi, li);
                }
                let prevBgColor = addHighlight(li);
                setTimeout(removeHighlight, 300, li, prevBgColor);
            }
        }
    }
});

