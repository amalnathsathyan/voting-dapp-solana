import { BN, Program } from "@coral-xyz/anchor";
import {
  ActionGetResponse,
  ActionPostRequest,
  createPostResponse,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";

import IDL from '../../../../anchor/target/idl/votingdapp.json';
import { Votingdapp } from '../../../../anchor/target/types/votingdapp';

export const ACTIONS_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://dial.to", // ✅ specific origin
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding, X-Accept-Action-Version, X-Accept-Blockchain-Ids",
  "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
  "Content-Type": "application/json",
};


// Dedicated OPTIONS handler for preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function GET(request: Request) {
  const actionGetMetadata: ActionGetResponse = {
    icon: "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    title: "Best city to live?",
    description: "In your opinion, which is the best city to live? Dubai or Tokyo?",
    label: "vote",
    links: {
      actions: [
        //using ngrok for testing from local and explosing the localhost to dial.to
        { href: "https://2d29-2405-201-d002-e02d-7d7c-d255-309f-399e.ngrok-free.app/api/vote/?candidate=Tokyo", label: "Tokyo" },
        { href: "https://2d29-2405-201-d002-e02d-7d7c-d255-309f-399e.ngrok-free.app/api/vote/?candidate=Dubai", label: "Dubai" },
      ],
    },
  };

  return Response.json(actionGetMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");
  const postBody: ActionPostRequest = await request.json();

  if (candidate !== "Dubai" && candidate !== "Tokyo") {
    return new Response("Invalid Candidate", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  let voter;
  try {
    voter = new PublicKey(postBody.account);
  } catch (error) {
    return new Response("Invalid Account", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const connection = new Connection('http://127.0.0.1:8899', "confirmed");
  const program: Program<Votingdapp> = new Program<Votingdapp>(IDL, { connection });

  const instruction = await program.methods
    .vote(new BN("1001"), candidate)
    .accounts({ voter })
    .instruction();

  const blockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction);

  const response = await createPostResponse({
    fields: { transaction, type: "transaction" },
  });

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}