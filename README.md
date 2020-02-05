The build folder is ready to be deployed

to compile the project and run it in development mode (npm and Node.js required):

	npm install

	npm run start

node_modules folder is not included in the repository because it's too big. Running npm install will install all dependencies.

The project was made with React JS, create-react-app, and some UI elements from React Material-UI

Since the test instruction is not specific on some details, I made a few assumption on my own. Here are some explanations on the project:

  1. The project allows users to add new technician data or to edit existing technician's data. The instruction does not state where the list of all technician comes from, so I assumed that all technicians are added my the user. In a normal website, the data likely comes from users and is stored in a database.The project also allows users to remove technicians from the list. 
	
  2.  The time format on the shift table is 24-hour format, as indicated in the instruction graph and the JSON model (no "AM" or "PM shown). 

  3.  The instruction doesn't show what input fields are required, so I assumed the name and the date are required, since the description
is not logically necessary and technicians don't necessarily have a shift on everyday. However, completing the whole shift table or entering description will still change the progress shown on the progress bar on the bottom.
  
 
  4.  Without a backend, there is no a reasonable way to save technician data because the Javascript runs on a browser nad browsers don't have access to file system. I provided a way to download the JSON file containing all the technician data. When "submit" button is clicked, data will be stored locally in JSON format. When "download" button is clicked, a JSON file containing all the data wil be downloaded on the browser. In a normal project, the data will likely be stored in the database and the data will be sent to the backend via aJax requests.

Honesty Statement is in honestyStatement.txt
