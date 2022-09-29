from brownie import (
    accounts,
    UnibaBank,
    Contract,
    config,
)

def get_account(index=0):
    return accounts.add(config["wallets"]["from_key"])

def depositETH(user, contract_address, amount):
    contract = Contract.from_abi(UnibaBank._name, contract_address, UnibaBank.abi)
    contract.depositETH({"from":user,"value":amount})
