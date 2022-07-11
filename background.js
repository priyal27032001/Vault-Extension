chrome.runtime.onMessage.addListener(function(request, sender,sendResponse) {
  if(request.type!="reload"){
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(
          tabs[0].id,
          {from: 'background', subject: 'userInfo'},
          (response)=>{
            if (request.type == "notification"){
            fetch(response.secretsUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Vault-Token': response.token,
              },
            }).then((response) => {
              return response.json()
          })
          .then((json) => {
            sendResponse(Object.entries(json.data.data));
          }).catch((error) => {console.log(error)});
        }
          else{
            var abc=window.open("popup.html",'_blank','height=510,width=490');
            abc.name=response.url;
        }
    });
  })
}
else {
  console.log(request);
}
 return true;
});







