let addTask = document.querySelector(".addTask");
let taskList = document.querySelector(".task-list");
let BtnImg = document.querySelector(".buttonImg");
let themeChangeBtn = document.querySelector(".themebtn");
let footerList = document.querySelector(".foot");

function checkBg(status,taskBar){
    if(status == 1){
        taskBar.classList.remove("Incomplete");
        taskBar.classList.remove("InProcess");
        taskBar.classList.add("complate");
    }
    else if(status == 0){
        taskBar.classList.remove("Incomplete");
        taskBar.classList.remove("complate");
        taskBar.classList.add("InProcess"); 
    }
    else if(status == -1){
        taskBar.classList.remove("complate");
        taskBar.classList.remove("InProcess");
        taskBar.classList.add("Incomplete");
    }
}

function task(taskNum,taskText) {
    return `
        <li class="task task${taskNum} flex-box">
            <p class="task-text"><span>task ${taskNum} : </span><span class="S_taskText">${taskText}</span></p>
            <div class="superBtnBox center-item">
                <div class="buttonBox flex-box">
                    <button class="editBtn" value="${taskNum}">edit</button>
                    <button class="archiveBtn" value="${taskNum}">archive</button>
                    <button class="closeBtn" value="${taskNum}">close</button>
                </div>
                <button class="dropList">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                    </svg>
                </button>
                <div class="mobile-btnList">
                    <button class="editBtn Mbtn" value="${taskNum}">edit</button> 
                    <button class="archiveBtn Mbtn" value="${taskNum}">archive</button>
                    <button class="closeBtn Mbtn" value="${taskNum}">close</button>
                </div>
            </div>
        </li>
    `;
}

function displayAll(){
    let List = JSON.parse(localStorage.getItem("taskList")) || [];
    if(localStorage.length != 0){
        for(let i=0 ; i<List.length ; i++){
            let obj = List[i];
            taskList.innerHTML += task(obj.taskNum,obj.taskText);
            checkBg(obj.status,document.querySelector(`.task${i+1}`));
        }
    }
}

function display(stat){
    let List = JSON.parse(localStorage.getItem("taskList")) || [];
    for(let i=0 ; i<List.length ; i++){
        let obj = List[i];
        console.log(obj);
        if(obj.status === stat){
            taskList.innerHTML += task(obj.taskNum,obj.taskText);
            checkBg(obj.status,document.querySelector(`.task${i+1}`));
        }
   }
}

function dropDownForMobile() {
    let dropList = document.querySelectorAll(".dropList");
    dropList.forEach((btn,index) => {
        btn.addEventListener("click" , () => {
            let nextE = btn.nextElementSibling;

            if(index === 0){
                nextE.classList.add("atTop");
            }
            else if(index === dropList.length-1){
                nextE.classList.add("atBottom");
            }
            else{
                nextE.classList.add("atCenter");
            }

            setTimeout(function(){
                document.addEventListener("click" , function hendler(e){
                    if(!nextE.contains(e.target) && e.target !== btn){
                        nextE.classList.remove("atTop", "atBottom", "atCenter");
                        document.removeEventListener("click", hendler);
                    }
                });
            }, 0);
        });
    });
}

function buttonImg(){
    if(!document.body.classList.contains("dark")){
        BtnImg.src = "./assets/white-sun.svg";
        document.body.classList.add("dark");
        localStorage.setItem("theme","dark");
    }
    else{
        BtnImg.src = "./assets/moon.svg";
        document.body.classList.remove("dark");
        localStorage.setItem("theme","light");
    }
}

function chechTheme(){
    let currentTheme = localStorage.getItem("theme") || localStorage.setItem("theme","light");

    if(currentTheme === "dark"){
        BtnImg.src = "./assets/white-sun.svg";
        document.body.classList.add("dark");
    }
    else{
        BtnImg.src = "./assets/moon.svg";
        document.body.classList.remove("dark");
    }
}

window.addEventListener("load", () => {
    displayAll();
    dropDownForMobile();
    chechTheme();
});

addTask.addEventListener("click",()=>{
    let taskInput = document.querySelector(".taskBox");
    let taskListArray = JSON.parse(localStorage.getItem("taskList")) || [];
    let elementObj = {};
    taskList.innerHTML = "";
    displayAll();

    taskInput.addEventListener("click" , () => taskInput.style.border = "0");

    if(taskInput.value === "" || taskInput === null){
        taskInput.style.border = "2px solid red";
        console.log("enter a value");
    }
    else{   
        elementObj.taskNum = taskListArray.length+1;
        elementObj.taskText = taskInput.value;
        elementObj.status = 0;
        console.log(elementObj);
        console.log(taskInput.value);
        taskList.innerHTML += task(elementObj.taskNum,elementObj.taskText);
        taskListArray.push(elementObj);
        localStorage.setItem("taskList", JSON.stringify(taskListArray));    
        checkBg(elementObj.status,document.querySelector(`.task${elementObj.taskNum}`));
    }
    dropDownForMobile();
    taskInput.value = "";
}); 

taskList.addEventListener("click" , (e) => {
    // console.log(e);
    e.preventDefault();
    let List = JSON.parse(localStorage.getItem("taskList"));

    if(e.target.classList.contains("archiveBtn")){
        console.log("archive is clicked");
        let aBtn = e.target;
        let tempObj = List[aBtn.value-1]; 
        let temptask = document.querySelector(`.task${aBtn.value}`);
        console.log(tempObj);
        if(tempObj.status === 0 && tempObj.status !== -1){
            tempObj.status = 1;
            checkBg(tempObj.status,temptask);
            localStorage.setItem("taskList",JSON.stringify(List));
        }
    }

    if(e.target.classList.contains("editBtn")){
        let aBtn = e.target;
        let tempObj = List[aBtn.value-1]; 
        
        if(tempObj.status === 0){   
            let superperant = e.target.parentElement.parentElement.parentElement;
            let taskText = superperant.querySelector(".task-text");
            let editText = taskText.querySelector("span.S_taskText");
            let input_box = document.createElement("input");
            
            input_box.classList.add("btn-style");
            input_box.type = "text";
            input_box.placeholder = editText.innerText;
            editText.innerText = "";
            taskText.appendChild(input_box);

            input_box.focus();
            input_box.addEventListener("blur", (e) => {
                editText.innerText = (e.target.value === "" || e.target.value === null) ? tempObj.taskText : e.target.value;
                tempObj.taskText = (e.target.value === "" || e.target.value === null) ? tempObj.taskText : e.target.value;
                localStorage.setItem("taskList",JSON.stringify(List));
                e.target.remove();
            });
            e.target.parentElement.classList.remove("atTop","atBottom","atCenter");
        }
    }
    
    if(e.target.classList.contains("closeBtn")){
        let cBtn = e.target;
        let tempObj = List[cBtn.value-1];
        console.log(cBtn.value);
        console.log(tempObj);
        if(tempObj.status === 0 || tempObj.status !== 1){
            tempObj.status = -1;
            checkBg(tempObj.status,document.querySelector(`.task${cBtn.value}`));
            localStorage.setItem("taskList",JSON.stringify(List));
        }
    }
});

footerList.addEventListener("click", (e) => {
    e.preventDefault(); 
    let footerBtn = document.querySelectorAll(".footBtn");

    footerBtn.forEach((b)=>{
        b.value = 0; 
    });
    taskList.innerHTML = "";

    if(e.target.classList.contains("all")){
        console.log("all is clicked");
        if(e.target.value == 0){
            displayAll();
            e.target.value = 1;
        }
    }
    
    if(e.target.classList.contains("process")){
        console.log("process is clicked");
        if(e.target.value == 0){
            display(0);
            e.target.value = 1;
        }
    }
    
    if(e.target.classList.contains("archive")){
        console.log("archive is clicked");
        if(e.target.value == 0){
            display(1);
            e.target.value = 1;
        }
    } 
    
    if(e.target.classList.contains("close")){
        console.log("close is clicked");
        if(e.target.value == 0){
            display(-1);
            e.target.value = 1;
        }
    }
    
    if(e.target.classList.contains("clear")){
        console.log("clear is clicked");
        if(e.target.value == 0){
            localStorage.removeItem("taskList");
            e.target.value = 1;
        }
    }
    dropDownForMobile();
});

themeChangeBtn.addEventListener("click" , () => {
    console.log("theme button is clicked");
    buttonImg();
});