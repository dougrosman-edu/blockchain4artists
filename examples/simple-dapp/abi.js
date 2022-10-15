var contractAddress = "0xbA447E9FB7Db81514e4fe638eA35efFAAa5a4741";

var contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newNumber",
				"type": "uint256"
			}
		],
		"name": "NumIncreasedEvent",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getNum",
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
		"inputs": [],
		"name": "increaseNum",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "num",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]