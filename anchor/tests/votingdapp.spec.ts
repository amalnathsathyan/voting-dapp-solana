import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider} from "anchor-bankrun";
import {startAnchor} from 'solana-bankrun';

const IDL = require('../target/idl/votingdapp.json')
const votingDappAddress = 'Ambz1D7ee3RAdZC8YEVhW54y2c64oa1b3XwSgyVB9SFA';

describe('votingdapp', () => {

  it('Initializes The Poll', async () => {
    const context = await startAnchor("",[{name:"votingdapp",programId:new PublicKey(votingDappAddress)}],[])
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingdapp>(IDL,provider);

     await votingProgram.methods.initializePoll(
      new anchor.BN('1001'),
      "Who should be the upgrade authority?",
      new anchor.BN('1739172617'),
      new anchor.BN('1739604615'),
      [new PublicKey('8ihFoSeui5Dq1a46Zgj2o8F5DtjxWKMKjxm6jMsUZ3MK'),new PublicKey('JE8fYGocJkzrAiBsihmH3bycdb6kRHkDcud2oxRs9RH9')]
    ).rpc()
  })
})
