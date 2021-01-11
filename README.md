# StakeCube Web3
## JS-based web 3.0 web wallet for SCC

### Installation
To use this web wallet locally click the clone or download button, then chose download as a zip. Unzip the file. Once it is unzipped, open the index.html file in your favorite **_MODERN_** browser. In order to generate new address you must change the debug setting to false, This will generate secure keys by way of window.crypto. There are some cases where this may not work properly make sure you are using a modern browser and that window.crypto works with your browser. Otherwise the generation may not be secure.
### USE

#### Key Generation
**_IF YOU ARE IN DEBUG MODE (top right it will say DEBUG) MAKE SURE TO DEACTIVATE DEBUG BEFORE GENERATING KEYS AS IT WILL GENERATE THE SAME KEY OVER AND OVER AND IT IS NOT SECURE._**

The current setup allows for users to generate one private key and one public key. This is not a HD Wallet (Hierarchical deterministic Wallet) and because of that you must remember to back up every private key you generate. There is no one master. Losing any of the private keys you generate could result in the loss of funds.

#### Transaction
##### Simple Transactions
**Warning** _in the current state do not use this if you have to have more then 1000 input transactions. In that case it would be better to import your wallet to a software wallet or wait for an update. A small transaction was recently sent using this so it does work, but be cautious as this is still in beta_

Simple transactions require you to have networking enabled (cycle the toggle if its not on) in order to connect to a explorer. This is required because simple transactions do all of the heavy lifting for you.
To run a simple transaction go to the transaction tab, then click load transactions (make sure that you have imported or generated a wallet otherwise it won't work.). Then simple put in the wallet address you want to send the coins to and the amount, everything else will be calculated for you (for example, the change address and fees). You will then see the whole signed transaction displayed. You can check that this transaction is what you want by taking the signed transaction and putting in into a software wallet with the command decoderawtransaction. If you feel comfortable with it feel free to send it via explorer or by pressing the button on the site.

##### Advanced Transaction
*The current setup only allows one input transaction and two output transactions if you need more inputs use the simple transaction for now. This will be changed in future updates.*

Advanced transactions do not require network access you can create the whole transaction then send the signed transaction on any node/wallet/explorer it takes a little knowledge of how transactions work in bitcoin to understand how to use the create transaction page. I will briefly go over what needs to be done, if you are unsure I recommend doing more research and testing with small amounts in order to not lose funds. How this works is it takes the inputs from the previous transaction (the one that funded the wallet.) and it make a new transaction that funds other wallets instead. Here is how you do this. We are going to be using one of my transaction in order to understand how this works. You can follow along here: https://explorer.dogec.io/tx/f52fad9c89a5a71532632679dc6cef84e6f7be949925d9190d054457052a61ef Under the raw transactions section you to put the top Transaction ID (txid) where it says Trx Hash, In our example it would be "f52fad9c89a5a71532632679dc6cef84e6f7be949925d9190d054457052a61ef". The next step would be to figure out which part of the transaction funded your public key, this is put into the index field. you can find this based on the vout under the vin section. In this example it would be 1. For the script field you need to put in the hex scriptPubKey of that VOUT with the same value under the VOUT section in Raw Transaction. In our example that would be 76a9142a8248f72e7ca9250f837b6cec46aedd6cf1edb288ac . Now the easy part under outputs you need to put in the address you want to send coins to and a change address. The change address is used for any extra coins currently associated with the account that you don't want to go to fees in most cases this would be your public key. In our example I have 1 DOGEC in my public address I wish to send 0.99 DOGEC to my friend at the address of DQJ24v6oFsobif8MQ6JFuFk6vefGAUQ6f2 . Then I set the change address( which is just my public address) D91rzgEmTyUcPEMPBLLPHVoKjSzwUreeoy with the amount 0.009 (Any money in this transaction not allocated will be used as fees and lost!) which means that the fee for this transaction is 0.001 . Under WIF key you put you private key in WIF (Wallet Import Format)  which if you used the keypair generator it already is. You can see the end result of my transaction here https://explorer.dogec.io/tx/c445a56c5236a6665f88d3fda012e84778588b9a923f3e13d77927313070b14e

#### NETWORK DATA TAB
This show users what the explorer see in association with the public key

#### SETTINGS TAB
##### Explorer
_Note for devs if you want this to connect to your explorer you must set the CORS header to all, otherwise local users won't be able to connect to your explorer_

This is where you can change the explorer this currently is only set up for explorer.dogec.io which is the main current explorer. It is best to currently not mess with this setting as it will be developed more in the future.

##### Toggles
###### Debug Mode
Debug mode sets some things mainly for testing do not use this if you are using this as a user. It will make wallet generation insecure and some other problems if you are meaning to use the site normally.

###### Networking mode
This turns on and off the networking functions of the script. If you truly want privacy and security run this on a offline computer but this should be reasonably secure. With this turned off the script doesn't have access to any networking parts meaning anything that connects to a explorer or outside server doesn't work.

#### BETA **_PROCEED WITH CAUTION, DO STORE LARGE AMOUNTS OF FUNDS_**

