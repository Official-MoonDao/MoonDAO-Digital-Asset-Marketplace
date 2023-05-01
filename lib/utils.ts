import { BigNumber } from "ethers";
import JSONbig from "json-bigint";
export function BigConvert(hex: any) {
  return BigNumber.from(hex).toString();
}

export function serializable(data: any) {
  //data = array of listings = [[{listingData1}], [{listingData2}]]
  return JSONbig.parse(JSONbig.stringify(data));
}
