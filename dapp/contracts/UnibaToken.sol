// contracts/UnibaToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UnibaToken is ERC20, Ownable {
    string  private constant _name     = "Uniba Token";
    string  private constant _symbol   = "UBT";
    uint8   private constant _decimals = 18;
    uint256 private immutable TOTAL_SUPPLY;
    uint256 public current_supply = 0;

    /**
     * @notice Constructor
     */
    constructor() ERC20(_name, _symbol) {
        TOTAL_SUPPLY = 3000000;
        current_supply = 500000;
        _mint(msg.sender, current_supply * 10 ** _decimals);
    }

    /**
     * @notice Return the totalSupply of this Token
     */
    function totalSupply() override public view returns (uint256 _totalSupply){
        _totalSupply = TOTAL_SUPPLY;
    }

    /**
     * @notice Mints the token
     * @dev Errors with 'You can't mint more than the total supply' if amount to add is greater than TOTAL_SUPPLY
     * @param amount amount to mint
     */
    function mintUbt(uint256 amount) public onlyOwner {
        require(current_supply + amount <= TOTAL_SUPPLY, "You can't mint more than the total supply");
        current_supply = current_supply + amount;
        _mint(msg.sender, amount * 10 ** _decimals);
    }
}