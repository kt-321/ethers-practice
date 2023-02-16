import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { abi } from "./../artifacts/ERC20K.json"

interface ethereumWindow extends Window {
    ethereum: any;
}
declare const window: ethereumWindow;

export default function Sign() {
    const [msg, setMsg] = useState("");
    const [isVerified, setIsVerified] = useState(false)
    const contractAddr = '0xCA3c9cAB433F35d5C3f9118c6b9365662D7CB96d'

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddr, abi, signer);
        const filter = contract.filters.Transfer(null, null);
        contract.on(filter, (_from:string, _to:string, _amount: any) => {
            console.log("from: ", _from);
            console.log("_to: ", _to);
            console.log("_amount: ", _amount);
        });
    }, []);

    const onClick = async () => {
        if (!window.ethereum) {
            console.error('!window.ethereum')
            return
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        await provider.send('eth_requestAccounts', [])

        const signer = await provider.getSigner()
        const message = 'message'
        const address = await signer.getAddress()
        const signature = await signer.signMessage(message)
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ message, address, signature }),
        })

        const body = await response.json()
        setIsVerified(body.isVerified)
    }

    const onMintClick = async () => {
        if (!window.ethereum) {
            console.error('!window.ethereum')
            return
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        console.log("address:", address)
        const contract = new ethers.Contract(contractAddr, abi, signer)

        const re = await contract.mint(address, 1).then((res: any) => {window.alert("success")}).catch((err:Error) => {window.alert(err.message)});
    }

    return (
        <>
            <button onClick={onClick}>Sign</button>
            {isVerified && <p>Verified!</p>}
            <button onClick={onMintClick}>mint</button>
        </>
    )
}