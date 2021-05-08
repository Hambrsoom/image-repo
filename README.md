# image-repo
Simple Restful API which provides the chance for a user register, login safely to upload pictures and comment on their pictures and other people's pictures if they were public. 

## Requirements:
You need to have MySql Server with image_repo database

## Install Node dependencies:
```bash
$ npm i
```
## Run the server:
```bash
$ npm run dev
```
## Run the tests:
```bash
npm run test
```

## Testing the API:
- After running the server, you can test the API by accessing the swagger UI through the link http://localhost:5000/swagger/
- First, you need to register and then login by using the provided endpoints.
- Once login, copy the token provided in the response and put it Autorization header by clicking on "Authorize" and putting 
"bearer provided_token" in the Value field as shown in the below picture.
![image](https://user-images.githubusercontent.com/32947679/117521339-3c279f80-af7b-11eb-95bf-54cafc45024a.png)
- After clicking on "Authorize, you can test the other endpoints.


