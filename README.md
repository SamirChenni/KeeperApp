Hi guys! This keeper app from Angela Yu's course , but it's pretty different , this project includes signing up for users in a secure manner ,
every user has his own notes , which means protecting his privacy . This project includes Google OAuth2.0 too . I've used Vite to create this react
application.

-In order to run this project all you have to do is :
1/Download this project from github
2/Install the dependencies recommended (check each package.json )
3/use this command to run it globally from the root folder (KeeperApp) : npm run dev
  -if you wanna see just the frontend use : 1-cd ./frontend  
                                            2-npm run client
  -backend: 1-cd ./backend
            2- nodemon ./server.js
4/Download mongoDB Atlas from mongodb official website.
Some problems I've faced during development : 
*At the signup : when I add a new user and pressing sign up button , nothing happened (it didn't redirect me to the dashboard)
Solution : It was dependecies issue , I was using Incompatible versions of mongoose (9.x) and passport-local-mongoose (9.0.1) , so to solve it 
I've used an older version of mongoose (7.8.8) & the stable version of passport-local-mongoose (8.0.0)
*When I refresh login and signup page , a blank page appears with (Cannot GET \login or \signup)
Solution : I've add this piece of code to the server.js :
const path = require("path");
app.get(/^(?!\/api\/).+/, (req, res) => {
  res.sendFile(path.join(__dirname,".." , "frontend", "index.html"));
});

-at index.html , at the head add this : 
<script type="module">
      import RefreshRuntime from "http://localhost:5173/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>

That's all , thanks for reading this , I hope it helps you , goodbye ;) and happy coding .
