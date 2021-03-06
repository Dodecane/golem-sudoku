# golem-sudoku
## Game of Sudoku with size variants, powered by Golem.

### Video Demo
[Link to video](https://youtu.be/CkJZt0CSoNI)

### Demo website
[Link to website](https://dfdc8063415c.ngrok.io)

### Running instructions
Please install the dependencies `nodejs` and `yarn` before proceeding.
 1. Set up and run the yagna requestor service following the instructions provided [here](https://handbook.golem.network/requestor-tutorials/flash-tutorial-of-requestor-development).
 2. Clone this repository with git or download and unzip the files to a folder. Then open a new terminal and change your directory to the folder.
 3. Run `yarn install`followed by `yarn run build-all` (Windows users: please run `npm install -g win-node-env` beforehand).
 4. Remember to set your yagna app key as an environment variable and initialize yagna payments. Then run `yarn run start-server`.
 5. Visit localhost:3000 in a browser and you should see the Golem Sudoku app.

### File layout

 - `/golem` contains the file structure of the docker image and the docker file is `Dockerfile`
 - `/public` contains public website assets
 - `/puzzles` contains generated sudoku puzzles
 - `/server` contains the code for the express server and the requestors
 - `/src` contains React components
