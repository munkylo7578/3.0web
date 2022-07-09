import React,{useContext, useEffect,useState} from "react"
import {ethers} from "ethers"

import {contractABI,contractAddress} from "../ultils/constant"

export const TransactionContext = React.createContext()

const {ethereum} = window

const getEthereumContract = ()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer)
    return transactionContract
}   

export const TransactionProvider = ({children})=>{
    const [currentAccount,setCurrentAccount] = useState("")
    const [formData,setFormData] = useState({
        addressTo:"",amount:"",keyword:"",message:""
    })
    const [isLoading,setIsLoading] = useState(false)
    const [transactionCount,setTransactionCount] = useState(0)
    const handleChange = (e,name)=>{
        setFormData((oldFormData)=>({...oldFormData,[name]:e.target.value}))
    }
    const checkIfWalletConnected = async()=>{
        try {
            if(!ethereum) return alert("PLease install metaMask")
    
            const accounts = await ethereum.request({method:"eth_accounts"})
            if(accounts.length){
                setCurrentAccount(accounts[0])
    
                    // getAllTransactions()
            }else{
                console.log("no account found")
            }
            
        } catch (error) {
            console.log(error)
            throw new Error("No Ethereum Object")
        }
      
    }
    const connectWallet = async()=>{
        try{
            if(!ethereum) return alert("PLease install metaMask")  
            const accounts = await ethereum.request({method:"eth_requestAccounts"})
            setCurrentAccount(accounts[0])
        }catch(error){
            console.log(error)
            throw new Error("No Ethereum Object")
        }
    }
    const sendTransaction = async ()=>{
        try{
            if(!ethereum) return alert("PLease install metaMask") 
            const {addressTo,amount,keyword,message} = formData
            const transactionContract = getEthereumContract()
            const parsedAmount =ethers.utils.parseEther(amount)
            await ethereum.request({
                method:"eth_sendTransaction",
                params:[{
                    from:currentAccount,
                    to:addressTo,
                    gas: "0x5208", // 21000 GWEI
                    value:parsedAmount._hex
                }]
            })
            const transactionHash = await transactionContract.addToBlockChain(addressTo,parsedAmount,message,keyword)
            setIsLoading(true)
            console.log(transactionHash.hash)
            await transactionHash.wait()
            setIsLoading(false)
            console.log("success",transactionHash.hash)
            const transactionCount = await transactionContract.getTransactionCount
            setTransactionCount(transactionCount.toNumber())
            
        }catch(error){
            console.log(error)
            throw new Error("NO Ethereum object")
        }
    }
    useEffect(()=>{
        checkIfWalletConnected()
    },[])
    return <TransactionContext.Provider value={{connectWallet,currentAccount,formData,setFormData,handleChange,sendTransaction}}>
        {children}
    </TransactionContext.Provider>
}
export const useTransactionContext = ()=>{
    return useContext(TransactionContext)
}