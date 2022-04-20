pragma solidity ^0.8.0;

contract SendPay {
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }


    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function claim(uint248 amount, uint8 v, bytes32 r, bytes32 s) external {
        uint256 total = _totalSupply + amount;
        require(total <= MAX_SUPPLY, "AIRDROP: Exceed max supply");
        require(minted(msg.sender) == 0, "AIRDROP: Claimed");
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encode(
                        amount,msg.sender
                    )
                )
            )
        );
        require(ecrecover(digest, v, r, s) == cSigner, "AIRDROP: Invalid signer");
        _totalSupply = total;
        _mint(msg.sender, amount);
    }
}
