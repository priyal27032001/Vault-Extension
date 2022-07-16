---Start Vault(in cmd)

1 -> vault server -dev -dev-root-token-id root

---On a different window

*change directory to the extension folder location 

1 -> set VAULT_ADDR=http://127.0.0.1:8200

2 -> vault login root

3 -> vault auth enable userpass

4 -> vault write auth/userpass/users/browser password=browser

5 -> vault secrets enable -path=vaultpass kv-v2

6 -> vault policy write admin vault_pass-policy

7 -> vault write auth/userpass/users/browser policies=admin

--- Setting up extension

1-> open Chrome.

2-> click in extension icon in toolbar and click on manage extesnion

3-> from the Extensions page, enable Developer mode.

4-> select Load unpacked and open the extension folder.

5-> from the Extensions menu, pin the browser extension.

--- login to vault

1-> enter vault server url as "http://127.0.0.1:8200"

2-> Username and password as browser

3-> Auth mountpoint as userpass

Browser Extension

---HTML files

1. popup.html -> opens when the extension icon is clicked.
If vault token exists i.e. the user is authenticated the secrets for the current webpage are dispalyed.
Secrets can be added or updated and passwords can be generated from popup.html.

2. options.html -> displays the vault token if it exists else it asks user to authenticate and generate a token.

---Js files

1. popup.js -> makes API calls to fetch the username and password, add and update username and password for the current website.

2. Options.js -> makes API calls to authenticate the user and generate token for the session.
   
3. content.js -> loads when a web page is visited. It can read details of the web page and make changes to them. It can pass information to the parent extension and also receive information from the parent extension. When a website is loaded the content.js sends msg 

4. background.js -> part of the brower extension which keeps running as long as it is performing an action (the browser extension need not be opened).
 
When a website is loaded content.js 

a -> adds the icon button to the username and password fiels
clicking on this button content.js send message to the background.js to open the popup.html(as a child window) to manipulate the username and password.

b -> sends message to background.js to return the username and password if it exists for the current website or null otherwise. background.js makes an API call with vault to get the username and password for the website and also sends message to the popup.js to get the vault token and then sends the response to content.js which autoplays the username and password to the respective fields. 

--- Websites:
1. https://codeforces.com/enter
2. https://webmail.incometax.gov.in/iwc_static/layout/login.html
3. https://www.facebook.com/login
4. https://www.interviewbit.com/
5. https://www.codechef.com/login
6. https://leetcode.com/accounts/login/
7. https://www.primevideo.com/
8. https://www.coursera.org/
9. https://www.udemy.com/
10. https://login.salesforce.com/
11. https://github.com/login
12. https://academic.iitg.ac.in/sso/


