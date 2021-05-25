function getCell(id) {
    let [cid, rid] = id.split(/(\d+)/); // split string with number
    cid = cid.charCodeAt(0) - 65; // convert char to num
    rid--; // reduce rid to match idx
    return document.querySelector(`.grid .cell[rid="${rid}"][cid="${cid}"]`);
};

function evaluateFormula(formula){
    let formulaTokens = formula.split(" ");
    for(let i=0; i<formulaTokens.length; i++){
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii<= 90){
            let {rid, cid} = getRIDCIDfromAddress(formulaTokens[i]);
            let value = sheetDb[rid][cid].value;
            if(value == ""){
                value = 0;
            }
            console.log(value)
            formulaTokens[i] = value; 
        }
    }
    let newFormula = formulaTokens.join(" ");
    return eval(newFormula);
}
function setParentChildrenArr(formula,chAddress){
    let formulaTokens = formula.split(" ");
    for(let i=0; i<formulaTokens.length; i++){
        let ascii = formulaTokens[i].charCodeAt(0);
        if(ascii >= 65 && ascii<= 90){
            let {rid, cid} = getRIDCIDfromAddress(formulaTokens[i]);
             let parentObj = sheetDb[rid][cid];
            parentObj.children.push(chAddress)  
        }
    }
}
function setUI(value , formula){
    let UIelement = findUICellElement();
    UIelement.innerText = value;
    //set db;
    let {rid , cid} = getRIDCIDfromAddress(addressInput.value);
    sheetDb[rid][cid].value = value;
    sheetDb[rid][cid].formula = formula;
}

function updateChildren(cellObject){
    let children = cellObject.children;
    for(let i=0; i<children.length; i++){
        let childCell = getCell(children[i]);
        let rid = childCell.getAttribute("rid");
        let cid = childCell.getAttribute("cid");
        let cellobjectOfChild = sheetDb[rid][cid];
        
        let chFormula = cellobjectOfChild.formula;
        let newValue = evaluateFormula(chFormula);
         ///update ui
         childCell.innerText = newValue
         //update sheetdb
        cellobjectOfChild.value = newValue
        
        updateChildren(cellobjectOfChild);
    }
}
 function setChild (formula, childID) {
    const formulaArr = formula.split(" ");

    for (let i = 0; i < formulaArr.length; i++) {
        let ascii = formulaArr[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let parentCellID = formulaArr[i];
            let pcell = getCell(parentCellID);
           
            let rid = pcell.getAttribute("rid");
            let cid = pcell.getAttribute("cid");

            sheetDb[rid][cid].children.push(childID);
        }
    }
};

function removeFormula(formula , cellObject , mName){
    let formulaTokens = formula.split(" ");
    for(let i=0; i<formulaTokens.length; i++){
        let ascii = formulaTokens[i].charCodeAt(0) // => charCodeof A
        if(ascii >= 65 && ascii <= 90){
            let pcell = getCell(formulaTokens[i]);
            let rid = pcell.getAttribute("rid");
            let cid = pcell.getAttribute("cid")
            let parentObj = sheetDb[rid][cid];
            
            let idx = parentObj.children.indexOf(mName);
            parentObj.children.splice(idx,1); 
            
        }
    } 
    cellObject.formula = "";
}

formulaBar.addEventListener("keydown" , function(e){
    if(e.key=="Enter" && formulaBar.value != ""){
        let Currformula = formulaBar.value;

        let address = addressInput.value; // in case we change the formula
        let {rid , cid} = getRIDCIDfromAddress(address);
        let cellObject = sheetDb[rid][cid];
        let oldformula =  cellObject.formula
        if(oldformula != Currformula && oldformula != ""){
           
            removeFormula(oldformula, cellObject,addressInput.value);
        }
        setChild(Currformula , address);
       let value = evaluateFormula(Currformula);
       setUI(value , Currformula);
       setParentChildrenArr(Currformula , addressInput.value)
       formulaBar.value = "";
       updateChildren(cellObject)
    }
    
})
