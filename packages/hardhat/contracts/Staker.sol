// SPDX-License-Identifier: MIT
pragma solidity 0.8.20; //Do not change the solidity version as it negatively impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;
    
    // Mapping to track individual balances
    mapping(address => uint256) public balances;
    
    // Threshold for execution
    uint256 public constant threshold = 1 ether;
    
    // Deadline for staking (72 hours from deployment)
    uint256 public deadline;
    
    // Event for frontend display
    event Stake(address indexed staker, uint256 amount);

    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(
            exampleExternalContractAddress
        );
        deadline = block.timestamp + 72 hours;
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)
    function stake() public payable {
        require(msg.value > 0, "Cannot stake 0 ETH");
        require(block.timestamp < deadline, "Staking period has ended");
        
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()` 
    function execute() public {
        //require(block.timestamp >= deadline, "Deadline has not passed yet");
        require(address(this).balance >= threshold, "Threshold not met");
        
        exampleExternalContract.complete{value: address(this).balance}();
    }

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance
    function withdraw() public {
        //require(block.timestamp >= deadline, "Deadline has not passed yet");
        require(address(this).balance < threshold, "Threshold was met, cannot withdraw");
        require(balances[msg.sender] > 0, "No balance to withdraw");
        
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend
    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
