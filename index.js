// in nodejs
// require()

// in frontend javascript you cant use require()
// import

//const { ethers } = require("ethers")
import { ethers } from "./ethers-5.6.esm.min.js"
import { raffleAddress, raffleABI, mockUSDCAddress, mockUSDCABI } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const betButton = document.getElementById("betButton")
const requestButton = document.getElementById("requestRandomWordsButton")
const balanceButton = document.getElementById("getBalanceButton")

connectButton.onclick = connect
betButton.onclick = bet
requestButton.onclick = requestRandomWords
balanceButton.onclick = getBalance

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("I see a metamask")
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            console.log("Connected!")
            connectButton.innerHTML = "Connected"
        } catch (e) {
            console.log(e)
        }
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        console.log("I do not see metamask")
        connectButton.innerHTML = "Please install metamask"
    }
}

async function bet() {
    let usdcAmount = document.getElementById("usdcAmount").value
    usdcAmount *= 10 ** 6
    console.log(usdcAmount)
    usdcAmount = ethers.BigNumber.from(usdcAmount)
    console.log(usdcAmount)
    if (typeof window.ethereum !== "undefined") {
        // connect to the blockchain through metamask (window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // assign signer as the metamask wallet
        const signer = provider.getSigner()
        console.log(signer)
        // get contract
        const contract = new ethers.Contract(raffleAddress, raffleABI, signer)
        console.log("Got contract")
        // make transactions
        try {
            const txResponse = await contract.bet(
                usdcAmount,
            )
            console.log("Tx sent:")
            console.log(txResponse)
            // wait for tx to finish
            await listenForTransactionMined(txResponse, provider)
            console.log("Done!")
        } catch (e) {
            console.log(e)
        }
    }
}

function listenForTransactionMined(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    // listen for this transaction to finish
    // contract.once
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations.`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const mockUSDC = new ethers.Contract(mockUSDCAddress, mockUSDCABI, signer)
        const balance = await mockUSDC.balanceOf(raffleAddress)
        console.log(balance.div(10**6).toString())
    }
}

// withdraw function
async function requestRandomWords() {
    if (typeof window.ethereum != "undefined") {
        console.log("Requesting...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(raffleAddress, raffleABI, signer)
        try {
            const txResponse = await contract.requestRandomWords()
            await listenForTransactionMined(txResponse, provider)
            requestButton.innerHTML = "Settling..."
            let balance = await contract.getBalance()
            while (balance != 0) {
                balance = await contract.getBalance()
            }
            console.log("Round settled!")
            requestButton.innerHTML = "Settle Round"
        } catch (e) {
            console.log(e)
        }
    }
}
