import type { NextApiRequest, NextApiResponse } from 'next';
import { hashMessage, recoverAddress, TypedDataDomain, TypedDataField, verifyTypedData } from 'ethers';
import { z } from 'zod';


const Schema = z.object({
  signatureType: z.enum(['EIP191', 'EIP712']),
  message: z.string(),
  signature: z.string(),
  address: z.string(),
  domain: z.any().optional(),
  types: z.any().optional(),
  value: z.any().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = Schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid body', issues: parse.error.issues });

  const { signatureType, message, signature, address, domain, types, value } = parse.data;

  try {
    if (signatureType === 'EIP191') {
      const msgHash = hashMessage(hashMessage(message)); 
      const recovered = recoverAddress(msgHash, signature);
      return res.status(200).json({ ok: recovered.toLowerCase() === address.toLowerCase(), recovered });
    } else {
      const ok = verifyTypedData(domain as TypedDataDomain, types as Record<string, Array<TypedDataField>>, value, signature, address);
      return res.status(200).json({ ok, recovered: ok ? address : null });
    }
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || 'Verification failed' });
  }
}
