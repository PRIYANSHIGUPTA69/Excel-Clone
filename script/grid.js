let sheetList = document.querySelector(".sheet-list"); // it containes all the sheets
let firstSheet = document.querySelector(".sheet");

///   =========  create sheet and make it active ====== /
firstSheet.addEventListener("click", makeMeActive); //add event listner to the first sheet kyuki first sheet phle s bni hui h jbki hum saari sheets create krne k baad unpe event listner lga rhe h islie humein first p phle hi lgana  hoga
firstSheet.addEventListener("dblclick",function(e){
  e.preventDefault();
  deleteSheets(firstSheet)
})
addBtn.addEventListener("click", () => {
  addNewSheetToSheetList();
});
function addNewSheetToSheetList() {
  let Allsheets = document.querySelectorAll(".sheet");
  let newSheet = document.createElement("div");
  let lastSheet = Allsheets[Allsheets.length - 1];
  let idx = Number(lastSheet.getAttribute("idx"));
  newSheet.setAttribute("class", "sheet");
  newSheet.textContent = `Sheet ${idx + 2}`;
  newSheet.setAttribute("idx", `${idx + 1}`);
  for (let i = 0; i < Allsheets.length; i++) {
    Allsheets[i].classList.remove("active");
  }
  newSheet.classList.add("active");
  sheetList.appendChild(newSheet);
  createSheet();

  sheetDb = allSheet.sheets[idx + 1];
  updateUI(sheetDb);
  newSheet.addEventListener("click", makeMeActive);
  newSheet.addEventListener("dblclick", function(e){
    e.preventDefault()
    deleteSheets(newSheet)
  });
}
function deleteSheets(newSheet){
  let Allsheets = document.querySelectorAll(".sheet");
  if(Allsheets.length!= 1){
 
    let deleteModal = document.createElement("div");
    deleteModal.setAttribute("class", "sheet-delete-modal");
    deleteModal.innerHTML = `<div class="sheet-modal-title">${newSheet.innerText}</div>
   <div class="sheet-modal-detail-container">
       <span class="sheet-modal-detail-title">Are you sure?</span>
   </div>
   <div class="sheet-modal-confirmation">
       <div class="button yes-button">
           <i class="fas fa-trash-alt delete-icon"></i>
           <div class="delete"> Delete</div>
       </div>
       <div class="button no-button">Cancel</div>
   </div>
                                    `;
    conatiner.appendChild(deleteModal);
    let cancel =  document.querySelector(".no-button")
   cancel.addEventListener("click" , function(e){
    document.querySelector(".sheet-delete-modal").remove();
   }) 
  let deleteBtn = document.querySelector(".yes-button")
  deleteBtn.addEventListener("click", function(){
    deleteSheet(newSheet);
  })
  }else{
    alert("can not be deleted")
  
  }
 
}
function deleteSheet(sheet) {
 
  document.querySelector(".sheet-delete-modal").remove();
  let sheetIndex = sheet.getAttribute("idx");
 
  if (sheetIndex == 0) {
      selectSheet(sheet.nextElementSibling);
  } else {
      selectSheet(sheet.previousElementSibling);
  }
  
 allSheet.sheets.splice(sheetIndex, 1);
  sheet.remove();
  sheetDb=allSheet.sheets[sheetIndex-1]
  updateUI()
  let Allsheets = document.querySelectorAll(".sheet");
  for(let i=sheetIndex ; i<Allsheets.length; i++){
    
    let index = Number(i)+1;
   
    Allsheets[i].setAttribute("idx" , i)
    Allsheets[i].textContent = `Sheet ${index}`
  }
  
}

function selectSheet(ele) {
  if (ele && !ele.classList.contains("active")) {
    let curr = document.querySelector(".sheet.active")
      curr.classList.remove("active");
      ele.classList.add("active")
      
  }
 
}
function makeMeActive(e) {
  let sheet = e.target;
  let Allsheets = document.querySelectorAll(".sheet");
  for (let i = 0; i < Allsheets.length; i++) {
    Allsheets[i].classList.remove("active");
  }
  sheet.classList.add("active");
  let idx = sheet.getAttribute("idx");
  if (!allSheet.sheets[idx]) {
    // only when you init the workbook
    createSheet();
  }

  sheetDb = allSheet.sheets[idx];
  updateUI(sheetDb);
}

function setUIelement(sheetDB) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let elem = document.querySelector(`.row .cell[rid='${i}'][cid='${j}']`);
      let value = sheetDB[i][j].value;
      elem.innerText = value;
    }
  }
}
//firstSheet.click();
// ====== end of create sheet or make active sheet =========/

// =========  cell event => click , blur , kedown ========/
let allCell = document.querySelectorAll(".grid .cell");
for (let i = 0; i < allCell.length; i++) {
  allCell[i].addEventListener("click", function () {
    updateAddress(allCell[i]);
    let rid = allCell[i].getAttribute("rid");
    let cid = allCell[i].getAttribute("cid");
    rid = Number(rid);
    cid = Number(cid);
    let address = `${String.fromCharCode(65 + cid)}${rid + 1}`;
    addressInput.value = address;
    cellHeight(allCell[i]);

    let cellObject = sheetDb;
    if (cellObject[rid][cid].bold == "normal") {
      boldBtn.classList.remove("active-btn");
    } else {
      boldBtn.classList.add("active-btn");
    }
    if (cellObject[rid][cid].underline == "none") {
      underlineBtn.classList.remove("active-btn");
    } else {
      underlineBtn.classList.add("active-btn");
    }
    if (cellObject[rid][cid].italic == "normal") {
      italicBtn.classList.remove("active-btn");
    } else {
      italicBtn.classList.add("active-btn");
    }
    if (cellObject[rid][cid].color != "") {
      colorDiv.style.backgroundColor = cellObject[rid][cid].color;
      allCell[i].style.color = cellObject[rid][cid].color;
    } else {
      colorDiv.style.backgroundColor = "black";
      allCell[i].style.color = "black";
    }

    allCell[i].style.textAlign = cellObject[rid][cid].align;
    for (let i = 0; i < alignbtn.length; i++) {
      alignbtn[i].classList.remove("active-btn");
    }
    makeActive(cellObject[rid][cid].align);
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
      allCell[i].style.color = "";
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

  colorDiv.style.backgroundC636r = color; //dekh is line ko
  handleFontColor(color);
});
function handleFontColor(color) {
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
  colorDiv.style.backgroundC636r = color; //dekh is line ko
  handleCellColor(color);
});

colorPicker.addEventListener("mouseleave", () => {
  setTimeout(() => {
    colorPickerBtn.classList.remove("hidden");
    colorPicker.classList.add("hidden");
  }, 1000);
});
function handleCellColor(color) {
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
boldBtn.addEventListener("click", function () {
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
});
underlineBtn.addEventListener("click", function () {
  let elem = findUICellElement();
  let rid = elem.getAttribute("rid");
  let cid = elem.getAttribute("cid");
  let cellObject = sheetDb[rid][cid];
  if (cellObject.underline == "none") {
    elem.style.textDecoration = "underline";
    cellObject.underline = "underline";
    underlineBtn.classList.add("active-btn");
  } else {
    elem.style.textDecoration = "none";
    cellObject.underline = "none";
    underlineBtn.classList.remove("active-btn");
  }
});
italicBtn.addEventListener("click", function () {
  let elem = findUICellElement();
  // elem.style.fontStyle = "italic";
  let rid = elem.getAttribute("rid");
  let cid = elem.getAttribute("cid");
  let cellObject = sheetDb[rid][cid];
  if (cellObject.italic == "normal") {
    elem.style.fontStyle = "italic";
    cellObject.italic = "italic";
    italicBtn.classList.add("active-btn");
  } else {
    elem.style.fontStyle = "normal";
    cellObject.italic = "normal";
    italicBtn.classList.remove("active-btn");
  }
});

for (let i = 0; i < alignbtn.length; i++) {
  alignbtn[i].addEventListener("click", function () {
    let elem = findUICellElement();
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    let alignment = alignbtn[i].getAttribute("class"); // string of three classes
    let align = alignment.split(" ");
    let al = align[align.length - 1];
    elem.style.textAlign = al;
    alignbtn[i].classList.add("active-btn");
    sheetDb[rid][cid].align = al;
    makeActive(al);
  });
}
function makeActive(e) {
  let tar = e; //event jispe click hua h
  let element = document.querySelector(`.${tar}`);
  //all sheets
  for (let i = 0; i < alignbtn.length; i++) {
    alignbtn[i].classList.remove("active-btn");
    //
  }
  element.classList.add("active-btn");
}

// set font famil on ui
fontFamily.addEventListener("change", function () {
  let elem = findUICellElement();
  elem.style.fontFamily = fontFamily.value;
  //update on db
  let rid = elem.getAttribute("rid");
  let cid = elem.getAttribute("cid");
  sheetDb[rid][cid].fontFamily = fontFamily.value;
  cellHeight(elem);
});
//set font size on ui
fontSize.addEventListener("change", function () {
  let elem = findUICellElement();
  elem.style.fontSize = fontSize.value + "px";
  //update on db
  let rid = elem.getAttribute("rid");
  let cid = elem.getAttribute("cid");
  sheetDb[rid][cid].fontSize = fontSize.value + "px";;
  cellHeight(elem);
});

//get the rid cid from addressbar
function getRIDCIDfromAddress(address) {
  let cid = Number(address.charCodeAt(0)) - 65;
  let rid = Number(address.slice(1)) - 1;

  return { rid: rid, cid: cid };
}

// get the cell element from ui
function findUICellElement() {
  let address = addressInput.value;
  let { rid, cid } = getRIDCIDfromAddress(address);
  let UIelement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  return UIelement;
}
function updateUI() {
  let allCells = document.querySelectorAll(".grid .cell");
  for (let cell of allCells) {
    //update ui => cellobject k data k according ui ko change krenge
    let [rid, cid] = [cell.getAttribute("rid"), cell.getAttribute("cid")];
    let cellObj = sheetDb[rid][cid];

    //bold
    if (cellObj.bold != "normal") {
      boldBtn.classList.add("active");
      cell.style.fontWeight = "bold";
    } else {
      boldBtn.classList.remove("active");
      cell.style.fontWeight = "normal";
    }

    //italic
    if (cellObj.italic != "normal") {
      italicBtn.classList.add("active");
      cell.style.fontStyle = "italic";
    } else {
      italicBtn.classList.remove("active");
      cell.style.fontStyle = "normal";
    }
    //underline
    if (cellObj.underline != "none") {
      underlineBtn.classList.add("active");
      cell.style.textDecoration = "underline";
    } else {
      underlineBtn.classList.remove("active");
      cell.style.textDecoration = "none";
    }

    //color picker update
    if (cellObj.color != "black") {
      colorDiv.style.color = cellObj.color;
      cell.style.color = cellObj.color;
    } else {
      colorDiv.style.color = "black";
      cell.style.color = "black";
    }
    if (cellObj.bColor != "none") {
      colorPicker.style.backgroundColor = cellObj.bColor;
      cell.style.backgroundColor = cellObj.bColor;
    } else {
      colorPicker.style.backgroundColor = "none";
      cell.style.backgroundColor = "none";
    }
    if (cellObj.align == "") {
      cell.style.textAlign = "left";
    }
    cell.style.textAlign = cellObj.align;
    //makeActive(cellObj..align)
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
}

function getCurrentSheet() {
  let Allsheets = document.querySelectorAll(".sheet");
  let sheet = allSheet.sheets[0];
  for (let i = 1; i < Allsheets.length; i++) {
    if (Allsheets[i].classList.contains("active")) {
      sheet = allSheet.sheets[i];
    }
  }
  return sheet;
}

function findUICellElement() {
  let address = addressInput.value;
  let ricidObj = getRIDCIDfromAddress(address);
  let rid = ricidObj.rid;
  let cid = ricidObj.cid;
  let uiCellElement = document.querySelector(
    `.cell[rid="${rid}"][cid="${cid}"]`
  );
  return uiCellElement;
}
// Address (string)-> rid /cid
function getRIDCIDfromAddress(address) {
  let cid = Number(address.charCodeAt(0)) - 65;
  let rid = Number(address.slice(1)) - 1;
  return { rid: rid, cid: cid };
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
}
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
        newSheet.classList.add("sheet");
        newSheet.setAttribute("idx", idx);
        newSheet.innerText = `Sheet ${idx + 1}`;

        //add event listner to new sheet
        newSheet.addEventListener("click", makeMeActive);

        //add new sheet to sheet lists
        sheetList.appendChild(newSheet);
      }
    });
   
  });
});

function cellHeight(cell) {
  let cellHeight = cell.getBoundingClientRect().height;
  let rid = cell.getAttribute("rid");
  let leftBox = document.querySelectorAll(".box")[rid];
  let leftBoxHeight = leftBox.getBoundingClientRect().height;
  console.log("left", leftBoxHeight);
  console.log("cell", cellHeight);
  if (cellHeight != leftBoxHeight) {
    leftBox.style.height = cellHeight + "px";
  }
}
grid_container.addEventListener("scroll", handleGridScroll);

function handleGridScroll(e) {
  let top = e.target.scrollTop;
  let left = e.target.scrollLeft;
  topLeftBox.style.top = top + "px";
  topLeftBox.style.left = left + "px";
  topRow.style.top = top + "px";
  leftCol.style.left = left + "px";
}


function updateAddress(cell){
  
    let rid = Number.parseInt(cell.getAttribute("rid"));
    let cid = Number.parseInt(cell.getAttribute("cid"));
    let cellAddress = `${String.fromCharCode(cid + 65)}${rid + 1}`;
    addressInput.value = cellAddress;

}