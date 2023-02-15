import { useState } from "react"
import { ethers } from "ethers"

interface ethereumWindow extends Window {
    ethereum: any;
}
declare const window: ethereumWindow;

export default function Sign() {
    const [isVerified, setIsVerified] = useState(false)

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

    return (
        <>
            <button onClick={onClick}>Sign</button>
            {isVerified && <p>Verified!</p>}
        </>
    )
}