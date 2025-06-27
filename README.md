## Bitcoin-wallet
This project is for demonstration purposes only. The project has the following functionalities :- 
1. Generates wallet address for a user, which can be used to receive bitcoins in.
2. Shows Transaction history for the address. 
3. Integrates a separate page for sending bitcoins (requires entering amount in BTC) to a user, using their bitcoin address. 
4. Shows the current account balance. 

![HomePage](https://github.com/user-attachments/assets/c83f3017-c439-443e-a419-c281fb1b4789)



![Sendpage](https://github.com/user-attachments/assets/4c25360c-0742-4e70-8ce2-dbf82dc8d300)

### Tech stack 

##### Frontend : 

> HTML \
> Vanilla CSS\
> React.js

##### Backend : 
```
> Node.js 
> Express.js ( for API building ) 
> dotenv ( for environment variables )
> bitcoinjs-lib ( for Bitcoin transactions ) 
> bip32, bip39 ( for generating wallet addresses ) 
> axios ( for making API requests ) 
> cors ( to allow frontend requests ) 
> body-parser ( to parse JSON requests )
```


### Setting up backend : 

> Here, its presumed that you have node.js and node package manager (npm) installed. 
Open your backend directory and initialize a node.js project 
```
npm init -y
```

Now run - 
```
npm install express dotenv bitcoinjs-lib bip32 bip39 axios cors body-parser
```
Use server.js script and run - 

```
node server.js 
```

The output should be something like - 

``` Server running on port 5000 ```

### For frontend - 

Install frontend dependencies by running - 

```
npm install axios react-router-dom
```

Use the src/pages and all the scripts written there for the forntend setup. d o
On the terminal run :- 

``` 
npm start
 ```

























































