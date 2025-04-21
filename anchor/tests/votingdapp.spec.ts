import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Votingdapp } from "../target/types/votingdapp";
import { BankrunProvider } from "anchor-bankrun";
import { startAnchor } from "solana-bankrun";
import { beforeEach } from "node:test";

const IDL = require("../target/idl/votingdapp.json");
const votingDappAddress = new PublicKey(
  "Ambz1D7ee3RAdZC8YEVhW54y2c64oa1b3XwSgyVB9SFA"
);

describe("votingdapp", () => {
  let context;
  anchor.setProvider(anchor.AnchorProvider.env())
  let votingProgram = anchor.workspace.Votingdapp as Program<Votingdapp>
  // let provider: BankrunProvider;
  
  // beforeAll(async () => {
  //   context = await startAnchor(
  //     "",
  //     [{ name: "votingdapp", programId: votingDappAddress }],
  //     []
  //   );
  //   provider = new BankrunProvider(context);
  
  // });

  it("Initializes The Poll", async () => {
    await votingProgram.methods
      .initializePoll(
        new anchor.BN("1001"),
        "Best city to live",
        new anchor.BN("1739172617"),
        new anchor.BN("1739604615")
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN("1001").toArrayLike(Buffer, "le", 8)],
      votingDappAddress
    );
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    expect(poll.pollId.toNumber()).toEqual(1001);
    expect(poll.description).toEqual("Best city to live");
  });


  it("initializes candidates", async () =>{

    const [pollAddress] = PublicKey.findProgramAddressSync([new anchor.BN("1001").toArrayLike(Buffer, "le", 8)],votingDappAddress);
    const [candiadate1PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Dubai")],votingDappAddress);
    const [candiadate2PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Tokyo")],votingDappAddress);


    //candidate 1 - Duabi
    const tx1hash = await votingProgram.methods.initializeCandidate(
      new anchor.BN('1001'),
      "Dubai"
    ).accountsPartial({
      poll:pollAddress,
      candidate:candiadate1PdaAddress,
    }).rpc()

    console.log(tx1hash.toString())

    //candidate 1 - Duabi
    await votingProgram.methods.initializeCandidate(
      new anchor.BN('1001'),
      "Tokyo"
    ).accountsPartial({
      poll:pollAddress,
      candidate:candiadate2PdaAddress,
    }).rpc()

    const candiadate1Pda = await votingProgram.account.candidate.fetch(candiadate1PdaAddress);
    const candiadate2Pda = await votingProgram.account.candidate.fetch(candiadate2PdaAddress);
    
    expect(candiadate1Pda.candidateName).toEqual("Dubai");
    expect(candiadate2Pda.candidateName).toEqual("Tokyo");
  })
  
  // it("votes", async ()=>{
  //   const votingProgram = new Program<Votingdapp>(IDL, provider);
  //   const [candiadate1PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Dubai")],votingDappAddress);
  //   const [candiadate2PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Tokyo")],votingDappAddress);

  //   await votingProgram.methods.vote(new anchor.BN('1001'),"Dubai").accountsPartial({candidate:candiadate1PdaAddress}).rpc()
  //   await votingProgram.methods.vote(new anchor.BN('1001'),"Tokyo").accountsPartial({candidate:candiadate2PdaAddress}).rpc()

  //   const candiadate1Pda = await votingProgram.account.candidate.fetch(candiadate1PdaAddress);
  //   const candiadate2Pda = await votingProgram.account.candidate.fetch(candiadate2PdaAddress);

  //   console.log(candiadate1Pda);
  //   console.log(candiadate2Pda)

  // })
  // it("votes two times on candidate1", async()=>{
  //   const votingProgram = new Program<Votingdapp>(IDL, provider);
  //   const [candiadate1PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Dubai")],votingDappAddress);
  //   const [candiadate2PdaAddress] = PublicKey.findProgramAddressSync([(new anchor.BN('1001')).toArrayLike(Buffer,"le",8),Buffer.from("Tokyo")],votingDappAddress);

  //   await votingProgram.methods.vote(new anchor.BN('1001'),"Dubai").accountsPartial({candidate:candiadate1PdaAddress}).rpc()
  //   await votingProgram.methods.vote(new anchor.BN('1001'),"Dubai").accountsPartial({candidate:candiadate1PdaAddress}).rpc()

  //   const candiadate1Pda = await votingProgram.account.candidate.fetch(candiadate1PdaAddress);
  //   const candiadate2Pda = await votingProgram.account.candidate.fetch(candiadate2PdaAddress);
  //   console.log(candiadate1Pda);
  //   console.log(candiadate2Pda);

  //   expect(candiadate1Pda.candidateVotes.toNumber()).toEqual(3);
  //   expect(candiadate2Pda.candidateVotes.toNumber()).toEqual(1);
    
  // })
});
