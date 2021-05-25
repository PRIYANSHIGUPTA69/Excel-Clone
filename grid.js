
let sheetList = document.querySelector(".sheet-list")  // it containes all the sheets
let firstSheet = document.querySelector(".sheet") 
 ///   =========  create sheet and make it active ====== /
firstSheet.addEventListener("click", makeMeActive); //add event listner to the first sheet kyuki first sheet phle s bni hui h jbki hum saari sheets create krne k baad unpe event listner lga rhe h islie humein first p phle hi lgana  hoga
addBtn.addEventListener("click", () => {
    
    addNewSheetToSheetList();
});
function addNewSheetToSheetList() {
    let Allsheets = document.querySelectorAll(".sheet")
    let newSheet = document.createElement("div")
    let lastSheet = Allsheets[Allsheets.length-1]
    let idx = Number(lastSheet.getAttribute("idx"))
    newSheet.setAttribute("class", "sheet");
    newSheet.textContent = `Sheet ${idx+2}`
    newSheet.setAttribute("idx", `${idx+1}`)
    for(let i=0; i<Allsheets.length; i++){
        Allsheets[i].classList.remove("active")
    }
    newSheet.classList.add("active")
    sheetList.appendChild(newSheet)
    createSheet();
    
   sheetDb = allSheet.sheets[idx+1];
   updateUI(sheetDb)
    newSheet.addEventListener("click" ,makeMeActive )
};
function makeMeActive(e){
    let sheet = e.currentTarget;
    let Allsheets = document.querySelectorAll(".sheet")
    for(let i=0; i<Allsheets.length; i++){
        Allsheets[i].classList.remove("active")
    }
    sheet.classList.add("active");
    let idx = sheet.getAttribute("idx");
   if (!allSheet.sheets[idx]) {
        // only when you init the workbook
        createSheet();
    }
    sheetDb = allSheet.sheets[idx];
    updateUI( sheetDb );
}

function setUIelement(sheetDB){
      for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let elem = 
                document.querySelector(`.row .cell[rid='${i}'][cid='${j}']`);
                let value = sheetDB[i][j].value;
                elem.innerText = value;
            }
        }
}
firstSheet.click();
// ====== end of create sheet or make active sheet =========/
 
 
// =========  cell event => click , blur , kedown ========/
    let allCell = document.querySelectorAll(".grid .cell");
    for(let i=0; i<allCell.length; i++){
        allCell[i].addEventListener("click", function(){
            let rid = allCell[i].getAttribute("rid");
            let cid = allCell[i].getAttribute("cid");
            rid = Number(rid);
            cid = Number(cid);
           let address = `${String.fromCharCode(65 + cid)}${rid + 1}`;
           addressInput.value = address;
           let cellObject = sheetDb
           if(cellObject[rid][cid].bold == "normal"){
               boldBtn.classList.remove("active-btn");
           }else{
               boldBtn.classList.add("active-btn");
           }
           if(cellObject[rid][cid].underline == "none"){
              underlineBtn.classList.remove("active-btn");
           }else{
               underlineBtn.classList.add("active-btn");
           }
           if(cellObject[rid][cid].italic == "normal"){
               italicBtn.classList.remove("active-btn");
           }else{
               italicBtn.classList.add("active-btn");
           }
           if (cellObject[rid][cid].color != "") {
              colorDiv.style.backgroundColor = cellObject[rid][cid].color;
               allCell[i].style.color = cellObject[rid][cid].color;
           } else {
               colorDiv.style.backgroundColor = "black";
               allCell[i].style.color = "black";
           }
           fontFamily.value = cellObject[rid][cid].fontFamily;
            allCell[i].style.fontFamily = cellObject[rid][cid].fontFamily;

        //font size update
        fontSize.value = cellObject[rid][cid].fontSize;
        allCell[i].style.fontSize = cellObject[rid][cid].fontSize + "px";
     
            allCell[i].innerText = cellObject[rid][cid].value;

            if (cellObject[rid][cid].color != "") {
               colorDiv.style.color = cellObject[rid][cid].color;
               allCell[i].style.color = cellObject[rid][cid].color;
            } else {
               colorDiv.style.color = "";
               allCell[i].style.color=""
            }
            if (cellObject[rid][cid].bColor != "none") {
                colorPicker.style.color = cellObject[rid][cid].bColor;
                allCell[i].style.backgroundColor = cellObject[rid][cid].bColor;
             } else {
                colorPicker.style.color = "";
                allCell[i].style.backgroundColor = "";
             }
      //formula update
           formulaBar.value = cellObject[rid][cid].formula;
            
        })
     allCell[i].addEventListener("keyup" , function(e) {
                let [rid, cid] = getCurrentCellRidCid();
                let cellObj = sheetDb[rid][cid];
                cellObj.value = allCell[i].innerText;
                if (cellObj.formula != "") {
                    removeFormula(cellObj ,  addressInput.value);
                    
                }
                updateChildren(cellObj)
                console.log(e.key)
            
        });
        allCell[i].addEventListener("blur" , function(){
           
                let data = allCell[i].innerText;
                let address = addressInput.value;
                // console.log(address);
               // console.log(allCells[i]);
                let rid = allCell[i].getAttribute("rid");
                let cid = allCell[i].getAttribute("cid");
                // let { rid, cid } = getRIDCIDfromAddress(address);
                let cellObject = sheetDb[rid][cid];
                // cell click -> no change
                if (cellObject.value == data) {
                    return;
                }
                // formula -> manual set
                if (cellObject.formula) {
                    removeFormula(cellObject, address);
                    formulaBar.value = "";
                }
                // db make your so later someone could use your to evaluate there formula
                cellObject.value = data;
                // if you are updating your value then  
                // someone may have included you in there formula so you need to tell them to evaluate there value
                updateChildren(cellObject);
            });
       
    }
   // ======= end code of add event on ui =========/

// ===========  handle ui ==========/
 colorPickerBtn.addEventListener("mouseover", (e) => {
    colorPickerBtn.classList.add("hidden");
    colorDiv.classList.remove("hidden");
});
colorDiv.addEventListener("change", (e) => {
    let color = colorDiv.value;
    
    colorDiv.style.backgroundC636r = color;//dekh is line ko
    handleFontColor(color)
})
function handleFontColor(color){    
    //update ui
   
   
   let uiCellElement = findUICellElement();
   uiCellElement.style.color = color;

   //update database
   let rid = uiCellElement.getAttribute("rid");
   let cid = uiCellElement.getAttribute("cid");
   let cellObject = sheetDb[rid][cid];
   cellObject.color = color;
   
   
}
colorPicker.addEventListener("change", (e) => {
    let color = colorPicker.value;
    console.log(color);
    colorPickerBtn.classList.remove("hidden");
    colorPicker.classList.add("hidden");
    colorDiv.style.backgroundC636r = color;//dekh is line ko
    handleCellColor(color);
});

colorPicker.addEventListener("mouseleave", () => {
    setTimeout(() => {
        console.log("hi")
        colorPickerBtn.classList.remove("hidden");
        colorPicker.classList.add("hidden");
    }, 1000);
});
 function handleCellColor(color){    
     //update ui
    
    
    let uiCellElement = findUICellElement();
    uiCellElement.style.backgroundColor = color;

    //update database
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetDb[rid][cid];
    cellObject.bColor = color;
    
    
}
 //styling ui 
 boldBtn.addEventListener("click", function(){
    let uiCellElement = findUICellElement();
    let rid = uiCellElement.getAttribute("rid");
    let cid = uiCellElement.getAttribute("cid");
    let cellObject = sheetDb[rid][cid];
  
    if (cellObject.bold == "normal") {
      uiCellElement.style.fontWeight = "bold";
      boldBtn.classList.add("active-btn");
      cellObject.bold = "bold";
    } else {
      boldBtn.classList.remove("active-btn");
      uiCellElement.style.fontWeight = "normal";
      cellObject.bold = "normal";
    }
 })
underlineBtn.addEventListener("click", function(){
    let elem = findUICellElement();
    let rid = elem.getAttribute("rid");
    let cid = elem.getAttribute("cid");
    let cellObject = sheetDb[rid][cid];
    if(cellObject.underline == "none"){
        elem.style.textDecoration = "underline";
        cellObject.underline="underline";
        underlineBtn.classList.add("active-btn")
    }else{
        elem.style.textDecoration = "none";
        cellObject.underline="none";
        underlineBtn.classList.remove("active-btn")
    }
})
italicBtn.addEventListener("click", function(){
    let elem = findUICellElement();
   // elem.style.fontStyle = "italic";
    let rid = elem.getAttribute("rid");
    let cid = elem.getAttribute("cid");
    let cellObject = sheetDb[rid][cid];
    if(cellObject.italic == "normal"){
        elem.style.fontStyle = "italic";
        cellObject.italic="italic";
        italicBtn.classList.add("active-btn")
    }else{
        elem.style.fontStyle = "normal";
        cellObject.italic ="normal";
        italicBtn.classList.remove("active-btn")
    }
})

for(let i=0; i<alignbtn.length; i++){
    alignbtn[i].addEventListener("click", function(){
        let elem = findUICellElement();
        let alignment = alignbtn[i].getAttribute("class")  // string of three classes
        let align = alignment.split(" ");  
        let al =  align[align.length-1]
        elem.style.textAlign = al;
        alignbtn[i].classList.add("active-btn")
        makeActive(al)
    },)
}
function makeActive(e){
    let  tar = e  //event jispe click hua h 
    
    let element = document.getElementsByClassName(tar);
     //all sheets
    for(let i=0; i<alignbtn.length; i++){
        alignbtn[i].classList.remove("active-btn")
    }
    console.log(element[0])
    element[0].classList.add("active-btn")
}

// set font famil on ui
fontFamily.addEventListener("change", function(){
    let elem = findUICellElement();
    elem.style.fontFamily =  fontFamily.value
} )
//set font size on ui
fontSize.addEventListener("change", function(){
    let elem = findUICellElement();
    elem.style.fontSize =  fontSize.value+ "px"
})

//get the rid cid from addressbar
 function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
  
    return { rid: rid, cid: cid };
}


// get the cell element from ui 
 function findUICellElement(){
    let address = addressInput.value;
    let {rid , cid} = getRIDCIDfromAddress(address);
    let UIelement = document.querySelector(
       `.cell[rid="${rid}"][cid="${cid}"]`
     );
     return UIelement;
  }


  /* ========= new open save ======== */
 menu_title.addEventListener("click", () => {
    menu_titleInput.select();
});

menu_titleInput.addEventListener("keyup", () => {
    const title = menu_titleInput.value;
    allSheet.title = title;
});
function resetSheetsUI() {
    //removing all sheets except 1
    let allSheets = document.querySelectorAll(".sheet");
    for (let i = allSheets.length - 1; i >= 1; i--) {
        allSheets[i].remove();
    }
    //removing active class so that click event works and resets UI
    allSheets[0].classList.remove("active");
    //clicking first sheet to update UI
    allSheets[0].click();
};
const fileInputEl = document.querySelector(".file-input");
//new
menu_new.addEventListener("click", () => {
    //reset workseetDB
    allSheet = {
        title: "Untitled Spreadsheet",
        sheets: [],
    };
    //init sheet DB
    createSheet();
    //reset open file input so that change event will work if we open the same file after making a new sheet
    fileInputEl.value = "";

    menu_titleInput.value = allSheet.title;

    //reseting sheets ui
    resetSheetsUI();
});

//save btn
menu_save.addEventListener("click", () => {
    const a = document.createElement("a");

    const url =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(allSheet));

    a.setAttribute("href", url);
    a.setAttribute("download", `${allSheet.title}.json`);
    a.click();
});

//open
 function updateUI() {
    let allCells = document.querySelectorAll(
        ".grid .cell"
    );

    for (const cell of allCells) {
        //handle cell height due to active cell border
        // handleCellHeight(cell);

        //update ui according to cell data
        const [rid, cid] = [cell.getAttribute("rid"), cell.getAttribute("cid")];
        const cellObj = sheetDb[rid][cid];

        //bold btn update
        if (cellObj.bold != "normal") {
           boldBtn.classList.add("active");
            cell.style.fontWeight = "bold";
        } else {
            boldBtn.classList.remove("active");
            cell.style.fontWeight = "normal";
        }

        //underline btn update
        if (cellObj.underline != "none") {
            underlineBtn.classList.add("active");
            cell.style.textDecoration = "underline";
        } else {
           underlineBtn.classList.remove("active");
            cell.style.textDecoration = "none";
        }

        //italic btn update
        if (cellObj.italic != "normal") {
            italicBtn.classList.add("active");
            cell.style.fontStyle = "italic";
        } else {
           italicBtn.classList.remove("active");
            cell.style.fontStyle = "normal";
        }

        

        // alignment btn update
      /*  switch (cellObj.align) {
            case "left":
                handleAlignment("left", menu_leftAlignBtn, cell);
                break;
            case "center":
                handleAlignment("center", menu_centerAlignBtn, cell);
                break;
            case "right":
                handleAlignment("right", menu_rightAlignBtn, cell);
                break;
        }*/

        //color picker update
        if (cellObj.color != "black") {
            colorDiv.style.color = cellObj.color;
            cell.style.color = cellObj.color;
        } else {
            colorDiv.style.color = "black";
            cell.style.color = "black";
        }
        if(cellObj.bColor != "none"){
            colorPicker.style.backgroundColor = cellObj.bColor;
            cell.style.backgroundColor = cellObj.bColor;
        } else {
            colorPicker.style.backgroundColor = "none";
            cell.style.backgroundColor = "none";
        }

        //font selector update
        fontFamily.value = cellObj.fontFamily;
        cell.style.fontFamily = cellObj.fontFamily;

        //font size update
        fontSize.value = cellObj.fontSize;
        cell.style.fontSize = cellObj.fontSize + "px";

        //value update
        cell.innerText = cellObj.value;
    }

    allCells[0].click();
};

menu_open.addEventListener("click", () => {
    fileInputEl.click();

    fileInputEl.addEventListener("change", () => {
        let filesArr = fileInputEl.files;
        let fileObj = filesArr[0];
        // console.log(fileObj);
        //file reader API
        const fr = new FileReader();
        fr.readAsText(fileObj);
        fr.addEventListener("load", () => {
            const stringData = fr.result;
            allSheet = JSON.parse(stringData);
            sheetDb = allSheet.sheets[0];
            menu_titleInput.value = allSheet.title;
            updateUI();
            resetSheetsUI();
            //add sheet according to worksheetDB
            for (let i = 0; i < allSheet.sheets.length - 1; i++) {
                let allSheets = document.querySelectorAll(".sheet");

                //get last sheet idx
                let idx = allSheets.length;

                // create new sheet element
               let newSheet = document.createElement("div");

                //add class and sheetidx
                newSheet.classList.add("sheets__sheet");
                newSheet.setAttribute("sheetIdx", idx);
                newSheet.innerText = `Sheet ${idx + 1}`;

                //add event listner to new sheet
                newSheet.addEventListener("click", handleSheetChange);

                //add new sheet to sheet lists
                sheetList.appendChild(newSheet);
            }
        });
    });
});





function getCurrentSheet(){
    let Allsheets = document.querySelectorAll(".sheet")
    let sheet = allSheet.sheets[0];
    for(let i=1; i<Allsheets.length; i++){
        if(Allsheets[i].classList.contains("active")){
            sheet = allSheet.sheets[i];
        }
    }
    return sheet;
}

const getCurrentCellRidCid = function () {
    let cellId = addressInput.value;
    let [cid, rid] = cellId.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx
    return [rid, cid];
};




// =========== formula bar ======== /

// parent ->chrildren ->  remove
// formula clear 
function removeFormula(cellObject, myName) {
    // formula -> parent -> children remove yourself
    let formula = cellObject.formula;
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDb[rid][cid];
            let idx = parentObj.children.indexOf(myName);
            parentObj.children.splice(idx, 1);
        }
    }
    cellObject.formula = "";
}
// formula bar -> formual set 
formulaBar.addEventListener("keydown", function (e) {

    if (e.key == "Enter" && formulaBar.value) {
        // user input formula
        let currentFormula = formulaBar.value;
        let address = addressInput.value;
        let { rid, cid } = getRIDCIDfromAddress(address);
        let cellObject = sheetDb[rid][cid];
        // formula update
        let oldFormula = cellObject.formula;
        if (currentFormula != cellObject.formula) {
            removeFormula(cellObject, address);
        }
        // formula -> value get
        //if cycle detected remove new formula and add old formula
        if (isCycle(addressInput.value, currentFormula)) {
            removeFormula( cellObject, address);

            //set old formula
            updateChildren(cellObject);

            cellObject.formula = oldFormula;
            formulaBar.value = oldFormula;

            alert("you enterd a wrong formula , it may contain cycle");
            return;
        }
        let value = evaluateFormula(currentFormula);
        // jis cell ke liye formula apply kar rhe hai (address bar wala cell)
        //  ui-> value update
        // ,db-> value,formula update 
        setCell(value, currentFormula);
        //    formula is equation -> hold true
        // formula cell -> cell object -> name add 
        setParentCHArray(currentFormula, address);
        updateChildren(cellObject);
    }
})

function evaluateFormula(formula) {
    // ( A1 + A2 )
    // split 
    // [(,A1,+,A2,)]
    // a-> z
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetDb[rid][cid].value;
            if (value == "") {
                value = 0;
            }
            formulaTokens[i] = value;
        }
    }
    // [(,10,+,20,)]
    let evaluatedFormula = formulaTokens.join(" ");
    // ( 10 + 20 )
    // stack 
    return eval(evaluatedFormula);
}
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
    // db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDb[rid][cid].value = value;
    sheetDb[rid][cid].formula = formula;
}
// dom element reference that is inside address bar  
function findUICellElement() {
    let address = addressInput.value;
    let ricidObj = getRIDCIDfromAddress(address);
    let rid = ricidObj.rid;
    let cid = ricidObj.cid;
    let uiCellElement =
        document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    return uiCellElement;
}
// Address (string)-> rid /cid
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65;
    let rid = Number(address.slice(1)) - 1;
    return { "rid": rid, "cid": cid };
}
// register yourself as children of the parent(cells that are appearing in the formula)
function setParentCHArray(formula, chAddress) {
    // (A1 +A2 )
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDb[rid][cid];
            parentObj.children.push(chAddress);

        }
    }
}
function updateChildren(cellObject) {
    let children = cellObject.children;
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress = children[i];
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        // 2d array
        let childObj = sheetDb[rid][cid];
        // get formula of children
        let chFormula = childObj.formula;
        let newValue = evaluateFormula(chFormula);
        SetChildrenCell(newValue, chFormula, rid, cid);
        // if you are updating your value then  
        // someone may have included you in there formula so you need to tell them to evaluate there value
        updateChildren(childObj);
    }
}
function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement =
        document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value;
    sheetDb[rid][cid].value = value;
    // sheetDB[rid][cid].formula = formula;
}

// check is any cycle

const isCycle = function (cellID, formula) {
    const formulaArr = formula.split(" ");
  let {rid , cid} =  getRIDCIDfromAddress(cellID)
    
    const cellObj = sheetDb[rid][cid];
    const children = cellObj.children;

    for (let i = 0; i < children.length; i++) {
        const childID = children[i];
        for (let j = 0; j < formulaArr.length; j++) {
            let ascii = formulaArr[j].charCodeAt(0);
            if (ascii >= 65 && ascii <= 90) {
                const parentCellID = formulaArr[j];
                if (parentCellID == childID) {
                    return true;
                }
            }
        }
        return isCycle(childID, formula);
    }

    return false;
};


