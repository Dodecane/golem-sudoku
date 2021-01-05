# golem-sudoku
## Game of Sudoku with size variants, powered by Golem.
### Running instructions

 1. Set up and run the yagna requestor service following the instructions provided [here](https://handbook.golem.network/requestor-tutorials/flash-tutorial-of-requestor-development).
 2. Clone this repository with git or download and unzip the files to a folder. Then open a new terminal and change your directory to the folder.
 3. Run `yarn install`followed by `yarn run build-all` (run `yarn run build` and `yarn run build-server` if you encounter errors).
 4. Remember to set your yagna app key as an environment variable. Then run `yarn run start-server`.
 5. Visit localhost:3000 in a browser and you should see the Golem Sudoku app.
