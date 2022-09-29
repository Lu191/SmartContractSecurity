from scripts.helpful_scripts import get_account
from brownie import UnibaToken, UnibaBank, Wbtc, Usdc, Dai, Contract
from brownie.network import gas_price
from brownie.network.gas.strategies import LinearScalingStrategy
from time import sleep

gas_strategy = LinearScalingStrategy("60 gwei", "70 gwei", 1.1)

gas_price(gas_strategy)

def deploy_token(verify):
    account = get_account()

    token = UnibaToken.deploy(
        {"from": account,
        "gas_price": gas_strategy},
        publish_source=verify
    )
    print(f"UnibaToken contract deployed to {token.address}")
    return token.address

def deploy_tokens(verify):
    account = get_account()

    contracts = {
        'wbtc': {
            'name': Wbtc._name,
            'address': '',
            'abi': Wbtc.abi,
        },
        'usdc': {
            'name': Usdc._name,
            'address': '',
            'abi': Usdc.abi,
        },
        'dai': {
            'name': Dai._name,
            'address': '',
            'abi': Dai.abi,
        },
        'ubt': {
            'name': UnibaToken._name,
            'address': '',
            'abi': UnibaToken.abi,
        },
    }
    token = Wbtc.deploy(
        {"from": account,
        "gas_price": gas_strategy},
        publish_source=verify
    )
    sleep(300)
    print(f"Wbtc contract deployed to {token.address}")
    contracts['wbtc']['address'] = token.address
    token = Usdc.deploy(
        {"from": account,
        "gas_price": gas_strategy},
        publish_source=verify
    )
    sleep(300)
    print(f"Usdc contract deployed to {token.address}")
    contracts['usdc']['address'] = token.address
    token = Dai.deploy(
        {"from": account,
        "gas_price": gas_strategy},
        publish_source=verify
    )
    print(f"Dai contract deployed to {token.address}")
    contracts['dai']['address'] = token.address
    return contracts

def deploy_dapp(token, verify):
    account = get_account()

    dapp = UnibaBank.deploy(
        token,
        {"from": account,
        "gas_price": gas_strategy},
        publish_source=verify
    )
    print(f"Dapp contract deployed to {dapp.address}")
    return dapp.address

def transferToken(contract, toAddress, amount):
    contract = Contract.from_abi(contract['name'], contract['address'], contract['abi'])
    contract.transfer(toAddress, amount, {"from":get_account()})

def mintToken(contract, amount):
    contract = Contract.from_abi(contract['name'], contract['address'], contract['abi'])
    contract.mintUbt(amount, {"from":get_account()})

def addCoins(contractAddress, tokenContract):
    contract = Contract.from_abi(UnibaBank._name, contractAddress, UnibaBank.abi)
    contract.addMultCoin(tokenContract, {"from":get_account()})

def addStables(contractAddress, tokenContract):
    contract = Contract.from_abi(UnibaBank._name, contractAddress, UnibaBank.abi)
    contract.addMultStablecoin(tokenContract, {"from":get_account()})

def main(verify=False):
    token = deploy_token(verify)
    sleep(300)
    dapp = deploy_dapp(token, verify)
    sleep(300)
    tokens = deploy_tokens(verify)
    tokens['ubt']['address'] = token
    dev_addresses = ['0x55b79744F998cEc1E72c58EceAf827322800394B', '0xe176D85Ae422617c066022Fd412f3992165eAAD7']
    addCoins(dapp, tokens['wbtc']['address'])
    addStables(dapp, tokens['usdc']['address'])
    addStables(dapp, tokens['dai']['address'])
    mintToken(tokens['ubt'], 2500000)
    transferToken(tokens['ubt'], dapp, 2102400 * 10 ** 18)
    for a in dev_addresses:
        transferToken(tokens['ubt'], a, 100000 * 10 ** 18)
        transferToken(tokens['wbtc'], a, 100000 * 10 ** 18)
        transferToken(tokens['usdc'], a, 100000 * 10 ** 18)
        transferToken(tokens['dai'], a, 100000 * 10 ** 18)

