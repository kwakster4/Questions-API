# Questions-and-Answers-API

Questions-and-Answers-API is an Atelier API microservice for the Questions and Answers endpoint that can be containerized and deployed with Docker.

## Installation

Deploy a mongodb database on another server, with specific username and password.
Build the docker image with hostname as the database server ip, username as the mongodb username and password as the mongodb password. The following command will generate an image named api.
```node
sudo docker build --build-arg hostname=<database IP> --build-arg username=<mongodb username> --build-arg password=<mongodb password> -t api .
```
Once the api server is deployed with the image present, run the image. The following command spins up a container named api.
```node
sudo docker run -dp 80:3001 --name api api
```

## Usage
Available Endpoints: 
GET /questions \
Gets list of unreported questions and the relevant data \
GET /questions/:question_id/answers \
Gets list of answers from a specific question \
POST /questions \
Posts a new question \
POST /questions/:question_id/answers \
Posts a new answer to a specific answer \
PUT /questions/:question_id/helpful \
Increments counter by one to question's helpful property \
PUT /questions/:question_id/report \
Reports question \
PUT /answers/:answer_id/helpful \
Increments counter by one to answer's helpful property \
PUT /answers/:answer_id/report \
Reports answer \

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GNU](https://choosealicense.com/licenses/gpl-3.0/)
