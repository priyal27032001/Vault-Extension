chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if ((msg.from === 'background') && (msg.subject === 'userInfo')) {
  (browser.storage.sync.get('vaultAddress')).then(vaultServerAddress=>{
    currentUrlHost = window.location.hostname;
    (browser.storage.local.get('vaultToken')).then(vaultToken=>{
      var secretsUrl = `${vaultServerAddress.vaultAddress}/v1/vaultpass/data/${currentUrlHost}`
      sendResponse({"url":currentUrlHost,"token":vaultToken.vaultToken,"secretsUrl":secretsUrl});
    });
    });
}
return true;
});   
const notify = new Notify(document.querySelector('#notify'));
async function mainLoaded() {
  var currentUrlHost;
  if(!window.opener) currentUrlHost = await getUrlHostOfCurrentTab();
  else {currentUrlHost=window.name;}
  document.getElementById("url-name").value=currentUrlHost;
  var vaultToken = await getStoredVaultToken();
  var vaultServerAddress = (await browser.storage.sync.get('vaultAddress'))
    .vaultAddress;
  var secretsUrl = `${vaultServerAddress}/v1/vaultpass/data/${currentUrlHost}`
  await getSecretsAtUrl(secretsUrl,vaultToken,showSecrets);
}

async function getUrlHostOfCurrentTab() {
  var tabs = await browser.tabs.query({ active: true, currentWindow: true });
  for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
    var tab = tabs[tabIndex];
    if (tab.url) {
      return tab.url.match(/.+:\/\/(?<baseurl>[^\/]+).+$/).groups.baseurl
      break;
    }
  }
}
async function getStoredVaultToken() {
  var vaultToken = (await browser.storage.local.get('vaultToken')).vaultToken;
  if (!vaultToken || vaultToken.length === 0) {
    return notify.clear().info(
      `No Vault-Token information available.<br>
      Please use the <a href="/options.html" class="link">options page</a> to login.`,
      { removeOption: false }
    );
  }
  return vaultToken;
}

function showSecrets(secrets) {
  document.getElementById('username').value = secrets[1][1]; 
  document.getElementById('password').value = secrets[0][1]; 
  document.getElementById('resultList').style.display='block';
  document.getElementById('copy-username').addEventListener('click', copyclipu);
  document.getElementById('copy-password').addEventListener('click', copyclipp);
  document.getElementById('update-button').addEventListener('click', Updatesecrets);   
}
async function copyclipu()
{
  var copyText = document.getElementById("username").value;
    navigator.clipboard.writeText(copyText).then(() => {
        alert("Copied to clipboard");
    });
}
async function copyclipp()
{
  var copyText = document.getElementById("password").value;
    navigator.clipboard.writeText(copyText).then(() => {
        alert("Copied to clipboard");
    });
}
async function copyclipg()
{
  var copyText = document.getElementById("generated-password").value;
    navigator.clipboard.writeText(copyText).then(() => {
        alert("Copied to clipboard");
    });
}
async function getSecretsAtUrl(secretsUrl, vaultToken, withSecrets) {
  fetch(secretsUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': vaultToken,
    },
  }).then((response) => {
    return response.json()
})
.then((json) => {
  withSecrets(Object.entries(json.data.data))
}).catch((error) => {
  notify.error(`Not able to read secrets at ${secretsUrl} <br/> ${error}`, {
    removeOption: true,
  })
  document.getElementById('add').style.display = 'block';
  document.getElementById('update').style.display = 'none';
  document.getElementById('add-button').addEventListener('click',Addsecrets,false);
})
}
async function Addsecrets(){
  var vaultServerAddress = (await browser.storage.sync.get('vaultAddress')).vaultAddress;
  var currentUrlHost;
  if(!window.opener) currentUrlHost = await getUrlHostOfCurrentTab();
  else {console.log(window.name); currentUrlHost=window.name;}
  var secretsUrl = `${vaultServerAddress}/v1/vaultpass/data/${currentUrlHost}`
  var vaultToken = await getStoredVaultToken();
  var ausername = document.getElementById('add-username').value;
  var apassword = document.getElementById('add-password').value;
  var creds={"username" : ausername , "password" : apassword};
  console.log(creds);
  Addsec(secretsUrl, vaultToken, creds);  
}
async function Updatesecrets(){
  var vaultServerAddress = (await browser.storage.sync.get('vaultAddress')).vaultAddress;
  var currentUrlHost;
  if(!window.opener) currentUrlHost = await getUrlHostOfCurrentTab();
  else {console.log(window.name); currentUrlHost=window.name;}
  var secretsUrl = `${vaultServerAddress}/v1/vaultpass/data/${currentUrlHost}`
  var vaultToken = await getStoredVaultToken();
  var ausername = document.getElementById('update-username');
  var apassword = document.getElementById('update-password');
  if(ausername.value.length==0 || apassword.value.length==0 )
  {
    alert("Enter Username and password");return;
  }
  var creds={"username" : ausername.value , "password" : apassword.value};
  Addsec(secretsUrl, vaultToken, creds);
}
async function Addsec(secretsUrl, vaultToken, creds) {
  fetch(secretsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Vault-Token': vaultToken,
    },
    body:JSON.stringify({"data":creds}),
}).then((response) => {
     response.json()
})
.then((json) => {
    alert("Updated");
    //window.location.href = 'popup.html';
    window.close();
}).catch((error) => {
  notify.error(`Could not write secrets at ${secretsUrl} <br/> ${error}`, {
    removeOption: true,
  })
})
}
document.getElementById('gen-pass').addEventListener('click', GeneratePassword,false);
document.getElementById('copy-gen-pass').addEventListener('click', copyclipg);
async function GeneratePassword() {
	let password = "";
	let length = 18;
	let lowers = "abcdefghijklmnopqrstuvwxyz";
	let uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let numbers = "1234567890";
	let specials = "!@#$%?&*";

	for (let i = 0; i < length; i++)  password += lowers.charAt(randRange(0, lowers.length));

	password = password.split("");
		let upper_amount = Math.floor(length / 2 - Math.random() * (length / 2) + 1);
		for (let i = 0; i < upper_amount; i++) {
			password[randRange(0, password.length)] = uppers.charAt(randRange(0, uppers.length));
		}
		let number_amount = Math.floor(length / 2 - Math.random() * (length / 2) + 1);
		for (let i = 0; i < number_amount; i++) {
			password[randRange(0, password.length)] = numbers.charAt(randRange(0, numbers.length));
		}
    
		let special_amount = randRange(1, 3);
		for (let i = 0; i < special_amount; i++) {
			password[randRange(0, password.length)] = specials.charAt(randRange(0, specials.length));

	}

	password = password.join("");

	document.getElementById('generated-password').value = password;
}
function randRange(min, max) {
	var range = max - min;
	var requestBytes = Math.ceil(Math.log2(range) / 8);
	if (!requestBytes) return min;
		
	var maxNum = Math.pow(256, requestBytes);
	var ar = new Uint8Array(requestBytes);

	while (true) {
		window.crypto.getRandomValues(ar);
		var val = 0;
		for (var i = 0;i < requestBytes;i++) val = (val << 8) + ar[i];
		if (val < maxNum - maxNum % range) return min + (val % range);
	}
}
document.addEventListener('DOMContentLoaded', mainLoaded, false);
