setTimeout(function() {
    var passinput,userinput;
    var forms = document.getElementsByTagName('form');
    for (let i = 0; i < forms.length; i++) {
          var form = forms[i];  
          var inputs = form.getElementsByTagName("input");
          for (var j = 0; j < inputs.length; j++) { 
            var input = inputs[j];  
            if(input.type!="password") continue;
            console.log(input);
            hidden_userinput=inputs[j-1]
            for(let k=j-1;k>=0;k--) 
            { 
              if(inputs[k].type=="hidden" || inputs[k].ariaHidden) continue;
              else {userinput=inputs[k];break;}
            }
            if(!input.ariaHidden)
            {
              passinput=input;
              var button = document.createElement('button');  
              button.id="added-pass";
              button.type="button";
              var image=document.createElement('img');
              button.appendChild(image);
              image.src = chrome.runtime.getURL("icons/logo-my.png");
              image.className="up-image";
              input.parentNode.insertBefore(button, input.nextSibling);
            }
          }
    }
    if(userinput)
    {
      var button = document.createElement('button');
      button.id="added-user";
      button.type="button"; 
      var image=document.createElement('img');
      button.appendChild(image);
      image.src = chrome.runtime.getURL("icons/logo-my.png");
      image.className="up-image";
      userinput.parentNode.insertBefore(button, userinput.nextSibling);
    }
    //  event for when username extension button is clicked
    if(userinput){
    document.getElementById('added-user').addEventListener('click', addeduserfunc, false);
    function addeduserfunc(){ 
      chrome.runtime.sendMessage({type: "open-popup"},(response)=>{
        ;
      });
    }}
    // event for when password extension button is clicked
    if(passinput){
    document.getElementById('added-pass').addEventListener('click', addedpassfunc, false);
    function addedpassfunc(){
      chrome.runtime.sendMessage({type: "open-popup"},(response)=>{
        ;
      }); 
    }}
    console.log("huh");
  chrome.runtime.sendMessage({type: "notification"},(response)=>{
    if(response)
    {
      console.log(response);
      if(passinput) passinput.value=response[0][1];
      
      if(userinput) userinput.value=response[1][1];
    }
  });  
},3000);
browser.runtime.onMessage.addListener(request => {});