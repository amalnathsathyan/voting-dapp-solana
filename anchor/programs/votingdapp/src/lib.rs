#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Ambz1D7ee3RAdZC8YEVhW54y2c64oa1b3XwSgyVB9SFA");

#[program]
pub mod votingdapp {

use super::*;

  pub fn initialize_poll(
    ctx:Context<InitializePoll>,
    poll_id:u64,
    description:String,
    poll_start:u64,
    poll_end:u64
  ) -> Result<()>{
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.description = description;
      poll.poll_start = poll_start;
      poll.poll_end = poll_end;
      poll.candidate_amount = 0;
    Ok(())
  }
   pub fn initialize_candidate(ctx:Context<InitializeCandidate>, _poll_id:u64, _candiate_name:String) -> Result<()> {
    let candidate = &mut ctx.accounts.candidate;
    candidate.candidate_votes = 0;
    candidate.candidate_name = _candiate_name;
    let poll = &mut ctx.accounts.poll;
    poll.candidate_amount += 1;
    Ok(())
   }

   pub fn vote(ctx:Context<Vote>,_poll_id:u64,_candidate_name:String) -> Result<()> {
    let candidate = &mut ctx.accounts.candidate;
    candidate.candidate_name = _candidate_name;
    candidate.candidate_votes += 1;
      Ok(())
   }

}

#[derive(Accounts)]
#[instruction(_poll_id:u64,_candidate_name:String)]
pub struct Vote <'info> {
  pub voter: Signer<'info>,
  #[account(
    mut,
    seeds = [_poll_id.to_le_bytes().as_ref(), _candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>,
  pub system_program:Program<'info, System>
}

#[derive(Accounts)]
#[instruction(_poll_id:u64, _candidate_name:String)]
pub struct InitializeCandidate<'info>{
  #[account(mut)]
  pub admin: Signer<'info>,

  #[account(
    mut,
    seeds = [_poll_id.to_le_bytes().as_ref()],
  bump)]
  pub poll: Account<'info,Poll>,

  #[account(
    init,
    payer = admin,
    space = 8+ Candidate::INIT_SPACE,
    seeds = [_poll_id.to_le_bytes().as_ref(), _candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info,Candidate>,
  pub system_program: Program<'info, System>

}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
  #[max_len(20)]
  pub candidate_name:String,
  pub candidate_votes:u64
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
    seeds= [poll_id.to_le_bytes().as_ref()],
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
  pub candidate_amount: u64,
}