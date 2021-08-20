/* chainparams */
const PUBKEY_ADDRESS = 30;
const SECRET_KEY     = 212;

importScripts('libs/crypto-min.js', 'libs/crypto-sha256-hmac.js', 'libs/crypto-sha256.js', 'libs/ellipticcurve.js', 'libs/jsbn.js', 'libs/ripemd160.js', 'libs/sha256.js');

// B58 Encoding Map
const MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

// ByteArray to B58
var to_b58 = function (
  B           //Uint8Array raw byte input
) {
  var d = [], //the array for storing the stream of base58 digits
    s = "",   //the result string variable that will be returned
    i,        //the iterator variable for the byte input
    j,        //the iterator variable for the base58 digit array (d)
    c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
    n;        //a temporary placeholder variable for the current base58 digit
  for (i in B) { //loop through each byte in the input stream
    j = 0,                           //reset the base58 digit iterator
      c = B[i];                        //set the initial carry amount equal to the current byte amount
    s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
    while (j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
      n = d[j];                    //set the placeholder for the current base58 digit
      n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
      c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
      d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
      j++                          //iterate to the next base58 digit
    }
  }
  while (j--)        //since the base58 digits are backwards, loop through them in reverse order
    s += MAP[d[j]];  //lookup the character associated with each base58 digit
  return s;          //return the final base58 string
}
//B58 to ByteArray
var from_b58 = function (
  S           //Base58 encoded string input
) {
  var d = [], //the array for storing the stream of decoded bytes
    b = [],   //the result byte array that will be returned
    i,        //the iterator variable for the base58 string
    j,        //the iterator variable for the byte array (d)
    c,        //the carry amount variable that is used to overflow from the current byte to the next byte
    n;        //a temporary placeholder variable for the current byte
  for (i in S) { //loop through each base58 character in the input string
    j = 0,                             //reset the byte iterator
      c = MAP.indexOf(S[i]);           //set the initial carry amount equal to the current base58 digit
    if (c < 0)                         //see if the base58 digit lookup is invalid (-1)
      return undefined;                //if invalid base58 digit, bail out and return undefined
    c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
    while (j in d || c) {              //start looping through the bytes until there are no more bytes and no carry amount
      n = d[j];                      //set the placeholder for the current byte
      n = n ? n * 58 + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
      c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
      d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
      j++                            //iterate to the next byte
    }
  }
  while (j--)               //since the byte array is backwards, loop through it in reverse order
    b.push(d[j]);           //append each byte to the result
  return new Uint8Array(b); //return the final byte array in Uint8Array format
}

// Cryptographic Random-Gen
function getSafeRand() {
  const r = new Uint8Array(32);
  crypto.getRandomValues(r);
  return r;
}

while (true) {
    const privkeyBytes = getSafeRand();
    // Private Key Generation
    const privkeyHex = Crypto.util.bytesToHex(privkeyBytes).toUpperCase();
    const privkeyVer = SECRET_KEY.toString(16) + privkeyHex + "01";
    const shaObj = new jsSHA("SHA-256", "HEX", { "numRounds": 2 });
    shaObj.update(privkeyVer);
    const hash = shaObj.getHash("HEX");
    const checksum = String(hash).substr(0, 8).toUpperCase();
    const keyWithChecksum = privkeyVer + checksum;
    const strPrivkey = to_b58(Crypto.util.hexToBytes(keyWithChecksum));
    // Public Key Derivation
    const privkeyBigInt = BigInteger.fromByteArrayUnsigned(Crypto.util.hexToBytes(privkeyHex));
    const curve = EllipticCurve.getSECCurveByName("secp256k1");
    const curvePt = curve.getG().multiply(privkeyBigInt);
    const x = curvePt.getX().toBigInteger();
    const y = curvePt.getY().toBigInteger();
    const publicKeyBytesCompressed = EllipticCurve.integerToBytes(x, 32);
    if (y.isEven()) {
        publicKeyBytesCompressed.unshift(0x02);
    } else {
        publicKeyBytesCompressed.unshift(0x03);
    }
    const publicKeyHex = Crypto.util.bytesToHex(publicKeyBytesCompressed).toUpperCase();
    const pubKeyHashing = new jsSHA("SHA-256", "HEX", { "numRounds": 1 });
    pubKeyHashing.update(publicKeyHex);
    const pubKeyHash = pubKeyHashing.getHash("HEX");
    const pubKeyHashRipemd160 = Crypto.util.bytesToHex(ripemd160(Crypto.util.hexToBytes(pubKeyHash))).toUpperCase();
    const pubKeyHashNetwork = PUBKEY_ADDRESS.toString(16) + pubKeyHashRipemd160
    const pubKeyHashingS = new jsSHA("SHA-256", "HEX", { "numRounds": 2 });
    pubKeyHashingS.update(pubKeyHashNetwork);
    const pubKeyHashingSF = pubKeyHashingS.getHash("HEX").toUpperCase();
    const checksumPubKey = String(pubKeyHashingSF).substr(0, 8).toUpperCase();
    const pubKeyPreBase = pubKeyHashNetwork + checksumPubKey;
    const strPubkey = to_b58(Crypto.util.hexToBytes(pubKeyPreBase));

    postMessage({'pub': strPubkey, 'priv': strPrivkey});
}