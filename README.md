# Caso di studio Metodi e modelli per la sicurezza delle applicazioni

[![Status](https://circleci.com/gh/Lu191/SmartContractsSecurity.svg?style=svg&circle-token=efa123fd61531cc5c212ac9e8bc068b583243708)](https://circleci.com/gh/Lu191/SmartContractsSecurity.svg?style=svg)

## Progetto SmartContractsSecurity

__Autori__: _Amendolagine Luigi Pio_, _Andriani Claudio_, _Coppolecchia Dario_

Questa repository consiste nello studio di uno degli attacchi più famosi sugli smart contract sviluppati con la blockchain Ethereum. Il progetto consisterebbe nelle seguenti frasi:

- __Studio del linguaggio__ utilizzato per la scrittura degli smart contract, [__Solidity__](Soliditylang.org) e [__OpenZeppelin Docs__](https://docs.openzeppelin.com/)

- __Studio dell'attacco Reentrancy__ utilizzato nel famoso DAO Hack che ha portato all’hard fork e la nascita di Ethereum Classic

- __Sviluppo di una dapp di lending__ (decentralized application) che utilizza uno smart contract che è vulnerabile all'attacco studiato

- __Realizzazione di un PoC__ (Proof of Concept) che mostra come la dapp (e in sé lo smart contract) può essere attaccato per ad esempio tentare di rubare i fondi depositati sullo stesso

## Token economics dell'Uniba Token

### Total supply
3.000.000 UBT

### Distribuzione
- 100.000 al 1° sviluppatore, `0x55b79744F998cEc1E72c58EceAf827322800394B`
- 100.000 al 2° sviluppatore, `0xe176D85Ae422617c066022Fd412f3992165eAAD7`
- 2.102.400 allo smart contract dell'applicazione principale, `0xeE105303827375bBE717dd87d6d4222027f86F80`
- 697.600 al creatore del token UBT, `0x982f44112Ab73D0e3bCFd5fbA3E8E983DE97AdB4`

I token distribuiti allo smart contract della dapp saranno utilizzati per incentivare l'utilizzo della piattaforma di lending e favorirne la distribuzione.

Quindi, i 2.102.400 token, saranno distribuiti entro l'arco del primo anno di vita dell'applicazione agli utenti che utilizzeranno la dapp.

Considerando che un blocco viene minato ogni circa 15 secondi sulla testnet Rinkeby di Ethereum (dove è stato distribuito lo smart contract), e quindi, sono minati circa 5.760 blocchi al giorno, poichè lo smart contract distribuirà 1 token per blocco agli utenti, significa che saranno distribuiti 5.760 token al giorno

## Live:

- ### Front-end: https://smart-contracts-security.vercel.app/

- ### API: https://scs-backend.vercel.app/api/assets


