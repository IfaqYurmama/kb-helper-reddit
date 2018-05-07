# kb-helper-reddit

A reddit bot that assist with commonly used links (primarily NavCoin knowledge base articles)

# Setup

Make sure you have node and npm installed. Download this repository to a directory of your choice. Change into the directory like this:  
`cd /home/pi/kb-helper-reddit/`

Install your dependencies using npm:  
`npm install`  

Create a new file in your directory called `.env` using `nano .env` and add your reddit bot information:  
    `CLIENT_ID=abc`  
    `CLIENT_SECRET=abc`  
    `REDDIT_USER=abc`  
    `REDDIT_PASS=abc`  
Save the file by pressing Ctrl+X, Y, Enter.

Run the bot using `node app.js`
