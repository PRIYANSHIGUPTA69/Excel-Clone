// =========== formula bar ======== /
for(let i=0; i<allCell.length; i++){
allCell[i].addEventListener("keyup" , function(e) { 
    let address = addressInput.value // text type krne k lie
    let {rid, cid} = getRIDCIDfromAddress(address) // find the rid cid of the cell
    let cellObj = sheetDb[rid][cid];  //get the object of this cell
    cellObj.value = allCell[i].innerText; //sheet database value to the cell value
    if (cellObj.formula != "") {
        removeFormula(cellObj ,  addressInput.value);  // agr hum cell ki value khud change kr rhe tb formula remove krna h us cell p s
        
    }
    updateChildren(cellObj)  // change the value of its children
    cellHeight(allCell[i]);
});
allCell[i].addEventListener("blur" , function(){  //when click on somewhere

    let data = allCell[i].innerText; //get the text of this perticular cell
    let address = addressInput.value;  // get the addres from address bar ( addressInput != allcell[i])
    let rid = allCell[i].getAttribute("rid"); 
    let cid = allCell[i].getAttribute("cid");
   let cellObject = sheetDb[rid][cid];
    if (cellObject.value == data) {
        return;
    }
    if (cellObject.formula) {   // agr koi formula change kia h toh phle wala remove kro
        removeFormula(cellObject, address);
        formulaBar.value = "";
    }
    //change in db
   cellObject.value = data;
    updateChildren(cellObject); //update its children
    cellHeight(allCell[i]);
});
}

// delete formula 
function removeFormula(cellObject, myName) {
    let formula = cellObject.formula;  // get formula from cellobject
    let formulaTokens = formula.split(" "); // "( A1 )""
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDb[rid][cid];
            let idx = parentObj.children.indexOf(myName);
            parentObj.children.splice(idx, 1);  // parent k children s khud ko remove kro
        }
    }
    cellObject.formula = "";
}

formulaBar.addEventListener("keydown", function (e) {
    if (e.key == "Enter" && formulaBar.value) {
    
        let currentFormula = formulaBar.value; //formula bar m abhi jo formula h
        let address = addressInput.value;  // address bar ka cell
        let { rid, cid } = getRIDCIDfromAddress(address);  // is adress s cell k rid cid nikale
        let cellObject = sheetDb[rid][cid]; // rid cid s uska database
        // formula update
        let oldFormula = cellObject.formula;  //database m us cellobject ka formula check kia( empt or a formula )
        if (currentFormula != cellObject.formula) {  //agr formula formula bar s match nhi hota h tb cellobject s vo phlr wala formula remove kro

            removeFormula(cellObject, address);
        }
       //ab currrent formula hi formula hoga
        //if cycle detected toh database phle wala formula remove kro
        if (isCycle(addressInput.value, currentFormula)) {
            removeFormula( cellObject, address);

            //schildren ki value bhi update krdo
            updateChildren(cellObject);

            cellObject.formula = oldFormula;  
            formulaBar.value = oldFormula;

            alert("you enterd a wrong formula , it may contain cycle");
            return;
        }
        let value = evaluateFormula(currentFormula) // get the value from the formula
        
        setCell(value, currentFormula);
        //    formula is equation -> hold true
        // formula cell -> cell object -> name add 
        setParentCHArray(currentFormula, address);
        updateChildren(cellObject);
    }
})

function evaluateFormula(formula) {
  
    let formulaTokens = formula.split(" "); // " ( A1 + A2 )" A1 =1 , A2 =2
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
   let evaluatedFormula = formulaTokens.join(" "); // ( 1 + 2 ) 
   
   return evaluate(evaluatedFormula); //3
}
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    uicellElem.innerText = value;
    // db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDb[rid][cid].value = value;
    sheetDb[rid][cid].formula = formula;
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


