function evaluate(formula){
    let operands = [];
  let oper = [];
  let expression = formula.split(" ")
  
      for(let i=0; i<expression.length ; i++){
          let character = expression[i];
          if(character == " "){
              continue;
          }
          if(character == "("){
              oper.push(character)
          }else if( isFinite(character)){
              
              operands.push(Number.parseFloat(character));
          }else if(character == "+" || character=="-" || character=="*" || character=="/"){
                  // and precendence of charackter is less or equal to operator's top element
                  while(oper.length>0 &&oper[oper.length - 1] != "("
                   && precedence(character) <= precedence(oper[oper.length - 1]) ){
                     let v1 = operands.pop();
                      let v2 = operands.pop();
                     let op = oper.pop();
                      let val = operation(op , v1 , v2);
                      operands.push(val);
                  }
                  oper.push(character);
          }else{
              //closing bracket => pop until operator != opening bracket 
              while( oper.length > 0 && oper[oper.length - 1] != "("){
                  let v1 = operands.pop();
                 let v2 = operands.pop();
                  let op = oper.pop();
                  let val = operation(op , v1 , v2);
                  operands.push(val);
                  
              }
              if (oper.length > 0) {
                  oper.pop();
              }
          }
      }
  
      while (oper.length > 0) {
          let val2 = operands.pop();
          let val1 = operands.pop();
          let optr = oper.pop();
  
          let finalVal = operation(val1, val2, optr);
    
          operands.push(finalVal);
      }
  
      return operands.pop();
  }
  
  function precedence( op){
      if(op == '+'){
          return 1;
      }else if(op == '-'){
          return 1;
      }else if(op == '*'){
          return 2;
      }else {
          return 2;
      }
  }
  function operation( op ,v1 , v2){
       if(op == '+'){
          return v1+v2;
      }else if(op == '-'){
          return v1-v2;
      }else if(op == '*'){
          return v1*v2;
      }else {
          return v1/v2;
      }
  }
  
