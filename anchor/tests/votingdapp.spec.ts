import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey, SystemProgram} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider} from "anchor-bankrun";
import {startAnchor} from 'solana-bankrun';

const IDL = require('../target/idl/votingdapp.json')
const votingDappAddress = new PublicKey('Ambz1D7ee3RAdZC8YEVhW54y2c64oa1b3XwSgyVB9SFA');

describe('votingdapp', () => {

  it('Initializes The Poll', async () => {
    const context = await startAnchor("",[{name:"votingdapp",programId: votingDappAddress}],[])
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votingdapp>(IDL,provider);

     await votingProgram.methods.initializePoll(
      new anchor.BN('1001'),
      "Best city to live",
      new anchor.BN('1739172617'),
      new anchor.BN('1739604615'),
    ).rpc()

    const [pollAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer, 'le' , 8)],votingDappAddress);
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log({poll})
    
  })
})
