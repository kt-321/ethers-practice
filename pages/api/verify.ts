import { ethers } from "ethers"

export default async function apiVerify (req:any, res:any) {
    const {message, address: expected, signature} = req.body
    const digest = ethers.utils.hashMessage(message)
    console.log("digest:", digest)
    const actual = ethers.utils.recoverAddress(digest, signature)
    console.log("actual:", actual)
    const isVerified = actual === expected

    res.send({isVerified})
}
