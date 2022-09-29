// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {TransferHelper} from "./TransferHelper.sol";

/**
 * @title UnibaBank
 * @notice It handles the logic of the bank
 */
contract UnibaBank is Ownable {
    struct UserInfo {
        mapping(address => uint256) tokenDeposited; // tokens  deposited
        uint256 ethDeposited; //eth deposited
        uint256 lastBlockClaimedRewards; //number of the last block claimed
        uint256 shares; // total shares of the account
        uint256 tokenAccrued; // number of tokens accumulated
    }

    struct coinType {
        address[] tokenContracts; // array of all token's address
        uint8 mult; // multiplier of the token
    }

    uint256 public constant PRECISION_FACTOR = 10**18;

    address private immutable unibaToken;

    uint256 public constant REWARD_PER_BLOCK = 1 * PRECISION_FACTOR;
    uint256 public TOTAL_BLOCKS = 2102400;
    uint256 public immutable startBlock;

    uint8 private constant UNIBA_MULT = 6;
    coinType private coinMult;
    coinType private stableMult;

    mapping(address => UserInfo) private userInfo;
    mapping(uint256 => uint256) private totalShares;
    uint256 private latestBlockUpdated;
    mapping(address => uint256) private latestBlockUpdatedAddress;

    mapping(address => uint256) public totalTokenDeposited;
    uint256 public totalEthDeposited;

    event Deposit(address indexed user, uint256 amount);
    event Harvest(address indexed user, uint256 harvestedAmount);
    event Withdraw(address indexed user, uint256 amount, uint256 harvestedAmount);

    /**
     * @notice Constructor
     * @param _unibaToken address of the Uniba token
     */
    constructor(address _unibaToken) {
        unibaToken = _unibaToken;
        startBlock = block.number;
        coinMult.mult = 3;
        stableMult.mult = 1;
    }

    /**
     * @notice Deposit ETH
     */
    function depositETH() external payable {
        require(msg.value > 0, "The amount deposited should be greater than 0!");

        userInfo[msg.sender].ethDeposited += msg.value;
        totalEthDeposited += msg.value;

        if (userInfo[msg.sender].lastBlockClaimedRewards != 0) userInfo[msg.sender].tokenAccrued += calculateRewards(msg.sender);
        userInfo[msg.sender].lastBlockClaimedRewards = block.number;
        userInfo[msg.sender].shares = calculateSharesDeposit(userInfo[msg.sender], msg.value, coinMult.mult);
        latestBlockUpdated = block.number;
        latestBlockUpdatedAddress[msg.sender] = latestBlockUpdated;

        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @notice Deposit tokens
     * @param token address of the token to deposit
     * @param amount amount to deposit
     */
    function deposit(address token, uint256 amount) public {
        TransferHelper.safeTransferFrom(token, msg.sender, address(this),amount);

        userInfo[msg.sender].tokenDeposited[token] += amount;
        totalTokenDeposited[token] += amount;

        if (userInfo[msg.sender].lastBlockClaimedRewards != 0) userInfo[msg.sender].tokenAccrued += calculateRewards(msg.sender);
        userInfo[msg.sender].lastBlockClaimedRewards = block.number;
        uint8 mult = token == unibaToken ? UNIBA_MULT : isCoin(token) ? coinMult.mult : isStablecoin(token) ? stableMult.mult : 0;
        userInfo[msg.sender].shares = calculateSharesDeposit(userInfo[msg.sender], amount, mult);
        latestBlockUpdated = block.number;
        latestBlockUpdatedAddress[msg.sender] = latestBlockUpdated;

        emit Deposit(msg.sender, amount);
    }

    /**
     * @notice Returns the amount of tokens deposited by an user
     * @param account address of the user
     * @param token address of the token
     */
    function getTokensDepositedByUser(address account, address token) external view returns (uint256 amount) {
        amount = userInfo[account].tokenDeposited[token];
    }

    /**
     * @notice Returns the amount of ethers deposited by an user
     * @param account address of the user
     */
    function getEthersDepositedByUser(address account) external view returns (uint256 amount) {
        amount = userInfo[account].ethDeposited;
    }

    /**
     * @notice Withdraw ETH
     * @param amount amount to withdraw
     */
    function withdrawETH(uint256 amount) external {
        require(amount <= userInfo[msg.sender].ethDeposited, "The amount to withdraw should be less or equal than the one deposited!");

        if (userInfo[msg.sender].ethDeposited >= amount) userInfo[msg.sender].ethDeposited -= amount;
        totalEthDeposited -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);

        if (userInfo[msg.sender].lastBlockClaimedRewards != 0) userInfo[msg.sender].tokenAccrued += calculateRewards(msg.sender);
        userInfo[msg.sender].lastBlockClaimedRewards = block.number;
        userInfo[msg.sender].shares = calculateSharesWithdraw(userInfo[msg.sender], amount, coinMult.mult);
        latestBlockUpdated = block.number;
        latestBlockUpdatedAddress[msg.sender] = latestBlockUpdated;

        emit Withdraw(msg.sender, amount, 0);
    }

    /**
     * @notice Withdraw tokens
     * @param token address of the token to withdraw
     * @param amount amount to withdraw
     */
    function withdraw(address token, uint256 amount) public {
        require(amount <= userInfo[msg.sender].tokenDeposited[token], "The amount to withdraw should be less or equal than the one deposited!");
        userInfo[msg.sender].tokenDeposited[token] -= amount;
        totalTokenDeposited[token] -= amount;

        TransferHelper.safeApprove(token, address(this), amount);
        TransferHelper.safeTransferFrom(token, address(this), msg.sender, amount);

        if (userInfo[msg.sender].lastBlockClaimedRewards != 0) userInfo[msg.sender].tokenAccrued += calculateRewards(msg.sender);
        userInfo[msg.sender].lastBlockClaimedRewards = block.number;
        uint8 mult = token == unibaToken ? UNIBA_MULT : isCoin(token) ? coinMult.mult : isStablecoin(token) ? stableMult.mult : 0;
        userInfo[msg.sender].shares = calculateSharesWithdraw(userInfo[msg.sender], amount, mult);
        latestBlockUpdated = block.number;
        latestBlockUpdatedAddress[msg.sender] = latestBlockUpdated;

        emit Withdraw(msg.sender, amount, 0);
    }

    /**
     * @notice Inserts the address of the token of a coin that isn't a stable or UBT
     * @param token address of the token to add
     */
    function addMultCoin(address token) public onlyOwner {
        uint256 index = coinMult.tokenContracts.length + 1;
        for (uint256 i = 0; i < coinMult.tokenContracts.length; i++) {
            if (coinMult.tokenContracts[i] == token) index = i;
        }
        if (index == coinMult.tokenContracts.length + 1) coinMult.tokenContracts.push(token);
    }

    /**
     * @notice Inserts the address of the token of a stable coin
     * @param token address of the token to add
     */
    function addMultStablecoin(address token) public onlyOwner {
        uint256 index = stableMult.tokenContracts.length + 1;
        for (uint256 i = 0; i < stableMult.tokenContracts.length; i++) {
            if (stableMult.tokenContracts[i] == token) index = i;
        }
        if (index == stableMult.tokenContracts.length + 1) stableMult.tokenContracts.push(token);
    }

    /**
     * @notice Checks if the token is a coin that isn't a stable or UBT
     * @param token address of the token to check
     */
    function isCoin(address token) internal view returns (bool result) {
        result = false;
        uint256 index = coinMult.tokenContracts.length + 1;
        for (uint256 i = 0; i < coinMult.tokenContracts.length; i++) {
            if (coinMult.tokenContracts[i] == token) index = i;
        }
        if (index != coinMult.tokenContracts.length + 1) result = true;
    }

    /**
     * @notice Checks if the token is a stable coin
     * @param token address of the token to check
     */
    function isStablecoin(address token) internal view returns (bool result) {
        result = false;
        uint256 index = stableMult.tokenContracts.length + 1;
        for (uint256 i = 0; i < stableMult.tokenContracts.length; i++) {
            if (stableMult.tokenContracts[i] == token) index = i;
        }
        if (index != stableMult.tokenContracts.length + 1) result = true;
    }

    /**
     * @notice Calculate the rewards of a specif user
     * @param user address of the user
     */
    function calculateRewards(address user) internal view returns (uint256 result) {
        result = 0;
        if (userInfo[user].lastBlockClaimedRewards < block.number && block.number <= (startBlock + TOTAL_BLOCKS)) {
            if (latestBlockUpdated > 0) {
                if (userInfo[user].lastBlockClaimedRewards != 0 && latestBlockUpdated > userInfo[user].lastBlockClaimedRewards) {
                    uint256 blockWindow = latestBlockUpdated - userInfo[user].lastBlockClaimedRewards;
                    if (totalShares[userInfo[user].lastBlockClaimedRewards] != 0) result += ((userInfo[user].shares * REWARD_PER_BLOCK) / totalShares[userInfo[user].lastBlockClaimedRewards]) * blockWindow;
                }
                if (block.number > latestBlockUpdated) {
                    uint256 blockWindow = block.number - latestBlockUpdated - (latestBlockUpdatedAddress[user] == latestBlockUpdated && block.number - latestBlockUpdated >= 1 ? 1 : 0);
                    if (totalShares[latestBlockUpdated] != 0) result += ((userInfo[user].shares * REWARD_PER_BLOCK) / totalShares[latestBlockUpdated]) * blockWindow;
                }
            }
        }
    }

    /**
     * @notice Calculates the amount of shares when a user deposits
     * @param user address of the user
     * @param amount amount deposited
     * @param mult multiplier of the token deposited
     */
    function calculateSharesDeposit(UserInfo storage user, uint256 amount, uint8 mult) internal returns (uint256 result) {
        uint256 prevShares = user.shares;
        uint256 newShares = mult * amount;
        totalShares[block.number] = newShares + prevShares + (latestBlockUpdated != 0 ? totalShares[latestBlockUpdated] - prevShares : 0);
        result = newShares + prevShares;
    }

    /**
     * @notice Calculates the amount of shares when a user withdraws
     * @param user address of the user
     * @param amount amount withdrawed
     * @param mult multiplier of the token withdrawed
     */
    function calculateSharesWithdraw(UserInfo storage user, uint256 amount, uint8 mult) internal returns (uint256 result) {
        uint256 prevShares = user.shares;
        uint256 newShares = mult * amount;
        totalShares[block.number] = (prevShares >= newShares ? prevShares - newShares : newShares) + (latestBlockUpdated != 0 ? totalShares[latestBlockUpdated] - prevShares : 0);
        result = (prevShares >= newShares ? prevShares - newShares : 0);
    }

    /**
     * @notice Returns the available rewards to claim
     * @param user address of the user
     */
    function getTokenToClaim(address user) public view returns (uint256 result) {
        result = calculateRewards(user) + userInfo[user].tokenAccrued;
    }

    /**
     * @notice Claim available rewards
     */
    function claim() public {
        require(userInfo[msg.sender].lastBlockClaimedRewards != 0, "No tokens to claim!");
        uint256 toClaim = 0;

        toClaim = getTokenToClaim(msg.sender);
        userInfo[msg.sender].tokenAccrued = 0;
        userInfo[msg.sender].lastBlockClaimedRewards = block.number;
        totalShares[block.number] = totalShares[latestBlockUpdated];
        latestBlockUpdated = block.number;
        latestBlockUpdatedAddress[msg.sender] = latestBlockUpdated;

        TransferHelper.safeTransfer(unibaToken, msg.sender, toClaim);

        emit Harvest(msg.sender, toClaim);
    }
}
