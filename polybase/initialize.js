import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "pk/0x5474f280482c4c840dd56c72deeb13f62b6cfe018b6edc0c4b27a49d99cc2a2a6b65e2544d51e29516da3ee3eed882b479271a5624726852a57d18bc56c17971/SpiralDAO",
});


// If you want to edit the contract code in the future,
// you must sign the request when calling applySchema for the first time
db.signer((data) => {
  return {
    h: 'eth-personal-sign',
    sig: ethPersonalSign(wallet.privateKey()), data)
  }
})

const createResponse = await db.applySchema(`
  @public
  collection CollectionName {
    id: string;
    country?: string;
    publicKey?: PublicKey;

    constructor (id: string, country: string) {
      this.id = id;
      this.country = country;

      // Assign the public key of the user making the request to this record
      if (ctx.publicKey)
        this.publicKey = ctx.publicKey;
    }
  }
`, 'your-namespace') // your-namespace is optional if you have defined a default namespace
