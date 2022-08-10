// in nodejs
// require()

// in frontend javascript you cant use require()
// import

//const { ethers } = require("ethers")
import { ethers } from "./ethers-5.6.esm.min.js"
import { lottoGameAddress, lottoGameABI, mockUSDCAddress, mockUSDCABI } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const approveButton = document.getElementById("approveButton")
//const getAllowanceButton = document.getElementById("getAllowanceButton")
const betButton = document.getElementById("betButton")
const requestButton = document.getElementById("requestRandomWordsButton")
const balanceButton = document.getElementById("getBalanceButton")

connectButton.onclick = connect
approveButton.onclick = approve
//getAllowanceButton.onclick = getAllowance
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

async function approve() {
    /*let approveAmount = document.getElementById("approveAmount").value
    approveAmount *= 10 ** 6*/

    // max uint256 value
    let approveAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    approveAmount = ethers.BigNumber.from(approveAmount)
    //console.log(approveAmount)
    if (typeof window.ethereum !== "undefined") {
        // connect to the blockchain through metamask (window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // assign signer as the metamask wallet
        const signer = provider.getSigner()
        console.log(signer)
        // get contract
        const contract = new ethers.Contract(mockUSDCAddress, mockUSDCABI, signer)
        console.log("Got contract")
        // make transactions
        try {
            const txResponse = await contract.approve(
                lottoGameAddress,
                approveAmount
            )
            console.log("Tx sent:")
            console.log(txResponse)
            // wait for tx to finish
            await listenForTransactionMined(txResponse, provider)
            console.log("Approved!")
            connectButton.innerHTML = "Approved"
        } catch (e) {
            console.log(e)
        }
    }
}

/*async function getAllowance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const mockUSDC = new ethers.Contract(mockUSDCAddress, mockUSDCABI, signer)
        const allowance = await mockUSDC.allowance(signer.getAddress(), lottoGameAddress)
        console.log(allowance.div(10**6).toString())
    }
}*/

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
        const contract = new ethers.Contract(lottoGameAddress, lottoGameABI, signer)
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
        const balance = await mockUSDC.balanceOf(lottoGameAddress)
        console.log("Pot balance:", balance.div(10**6).toString())
    }
}

// withdraw function
async function requestRandomWords() {
    if (typeof window.ethereum != "undefined") {
        console.log("Requesting...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(lottoGameAddress, lottoGameABI, signer)
        try {
            const txResponse = await contract.requestRandomWords()
            requestButton.innerHTML = "Settling..."
            await listenForTransactionMined(txResponse, provider)
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
