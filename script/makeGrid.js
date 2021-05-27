let top_row = document.querySelector(".top_row");
let leftCol = document.querySelector(".left_col");
let grid = document.querySelector(".grid")
let rows = 100;
let cols = 26;




for(let i=0; i<rows; i++){
    let col_box=  document.createElement("div");
    col_box.setAttribute("class", "left-col-box");
    col_box.setAttribute("class", "box");
    col_box.innerText= i+1;
    leftCol.appendChild(col_box)
 }
 
 for(let j=0; j<cols; j++){
     let cell =  document.createElement("div");
     cell.setAttribute("class", "cell");
     //cell.setAttribute("class", "cell");
     cell.innerText = String.fromCharCode(j+65)
     top_row.appendChild(cell);
  }
 
  for(let i=0; i<rows;i++){
      let row = document.createElement("div")
      row.setAttribute("class", "row")
     for(let j=0; j<cols; j++){
         let cell = document.createElement("div");
         cell.setAttribute("class", "cell");
         cell.setAttribute("contenteditable"  , "true")
         let rid = i;
         let cid = j;
         cell.setAttribute("rid", rid);
         cell.setAttribute("cid", cid)
         
         row.appendChild(cell);
        
     }
     grid.appendChild(row);
  }
 
 
  
  
 