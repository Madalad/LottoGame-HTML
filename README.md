# LottoGame-HTML
Frontend for the OllieM26/LottoGame repository

Currently uses the LottoGame contract deployed on avalanche fuji testnet at address 0x5c089Df16179f5125075C3F4B6988C37643065c6
Uses a mock USDC token for betting (0x727c9B4C6EC121C65709528AD5094B4F0A17f8f4)

![image](https://user-images.githubusercontent.com/107412855/183887761-e84e3738-e180-4df9-beb7-ed27fbde4aa3.png)

Connect - connects a metamask wallet
Approve - approves the contract to spend your mock USDC
Bet - places a bet for any input amount
Pot Balance - logs the pots current balance into the console
Settle Round - calls the requestRandomWords function from the Chainlink VRF coordinator to get a random number, then chooses a winner and sends the funds (only the smart contract owner can use this button succesfully)
