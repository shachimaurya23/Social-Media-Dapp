
import web3 from './web3'; 
const address = "0x51Bb40529cEDdAF3B6DF512A64554735C0C2f389";
const abi = [
	{
		"anonymous": false,
		"inputs": [],
		"name": "NewPost",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getHash",
		"outputs": [
			{
				"internalType": "string",
				"name": "img",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_img",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_text",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
export default new web3.eth.Contract(abi, address);