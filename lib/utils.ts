import { BigNumber } from "ethers";
import JSONbig from "json-bigint";
export function BigConvert(data: any) {
  return !data ? 0 : BigNumber.from(data).toString();
}

export function serializable(data: any) {
  //data = array of listings = [[{listingData1}], [{listingData2}]]
  return JSONbig.parse(JSONbig.stringify(data));
}
