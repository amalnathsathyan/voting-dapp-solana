#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdapp {
  use super::*;

  pub fn initialize_poll(
    ctx:Context<InitializePoll>,
    poll_id:u64,
    description:String,
    poll_start:u64,
    poll_end:u64,
    poll_candidates: Vec<Pubkey>
  ) -> Result<()>{
    ctx.accounts.poll.set_inner(Poll{
      poll_id,
      description,
      poll_start,
      poll_end,
      poll_candidates
    });
    Ok(())
  }
}

#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct InitializePoll<'info>{

  #[account(mut)]
  pub admin: Signer<'info>,
  #[account(
    init,
    payer=admin,
    space=8+ Poll::INIT_SPACE,
    seeds= [b"Poll",poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info,Poll>,
  pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id:u64,
  #[max_len(100)]
  pub description: String,
  pub poll_start:u64,
  pub poll_end:u64,
  #[max_len(5,32)]
  pub poll_candidates: Vec<Pubkey>
}