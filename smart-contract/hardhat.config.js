//https://eth-kovan.alchemyapi.io/v2/1pDUITX1THAiQvQ-pyvw5JN28egrLj83

require('@nomiclabs/hardhat-waffle');

module.exports={
  solidity:"0.8.0",
  networks:{
    ropsten:{
      url:"https://eth-ropsten.alchemyapi.io/v2/QoKMTUvJ5V2KRtRCpu3IxTeXQDMpKkfL",
      accounts:["1e75518c0127cc42f310ffb9d1995c25df66a349504988bce4d26b8880d08199"]
    }
  }
}

