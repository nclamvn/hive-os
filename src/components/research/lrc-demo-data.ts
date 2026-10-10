/** Display only: the retained OFFLINE replay, not these helpers, accepted TIP084. */
export interface Rational { n: bigint; d: bigint }
export interface LrcArc { speedIndex: number; center: number }
export interface LrcDemoData { gw: { speeds: string[]; cover: LrcArc[] }; shift: { Q: string; speeds: string[] } }
const zero=BigInt(0),one=BigInt(1);
const purpose="TIP084_FIXED_LRC_METHOD_DEMO";
export function rational(n:bigint,d:bigint):Rational {
  if(d<=zero)throw new Error("Positive denominator required");
  let a=n<zero?-n:n,b=d;
  while(b!==zero){const next=a%b;a=b;b=next;}
  return {n:n/a,d:d/a};
}
export const fractionLabel=(value:Rational)=>`${value.n}/${value.d}`;
/** Coordinates only; never use this rounded value for a GOOD/FAIL decision. */
export const approximate=(value:Rational)=>Number(value.n*BigInt(1000000)/value.d)/1000000;
export function arcEndpoints(speed:string,center:number) {
  const v=BigInt(speed),k=BigInt(center),den=BigInt(14)*v;
  return {lower:rational(k*BigInt(14)-one<zero?zero:k*BigInt(14)-one,den),
    upper:rational(k*BigInt(14)+one>den?den:k*BigInt(14)+one,den)};
}
export function shiftDistances(data:LrcDemoData["shift"],j:number) {
  if(!Number.isInteger(j)||j<0||j>4)throw new Error("Fixed shift0..4 required");
  const q=BigInt(data.Q),den=BigInt(10)*q,num=one+BigInt(2)*q*BigInt(j);
  return {time:rational(num,den),runners:data.speeds.map((speed,index)=>{
    const residue=BigInt(speed)*num%den;
    const distance=rational(residue<den-residue?residue:den-residue,den);
    return {speed,index,phase:rational(residue,den),distance,good:distance.n*BigInt(15)>=distance.d};
  })};
}
const object=(value:unknown):Record<string,unknown>|null=>value!==null&&typeof value==="object"&&!Array.isArray(value)?value as Record<string,unknown>:null;
/** Bind presentation to the two frozen public cases and accepted retained receipt. */
export function readLrcDemo(raw:unknown):LrcDemoData|null {
  try {
    const root=object(raw),certificate=object(root?.certificate),receipt=object(root?.independentReplay);
    if(!certificate||!receipt||certificate.version!==1||certificate.purpose!==purpose||certificate.globalLrcProved!==false||
      receipt.accepted!==true||receipt.purpose!==purpose||receipt.globalLrcProved!==false||
      !Array.isArray(receipt.cases)||receipt.cases.join(",")!=="GW14,SHIFT15"||receipt.cases.length!==2||
      !Array.isArray(certificate.cases)||certificate.cases.length!==2)return null;
    const gw=object(certificate.cases[0]),shift=object(certificate.cases[1]);
    const q=BigInt("1000000000000000000000000000000");
    const gwSpeeds=[...Array.from({length:11},(_,i)=>String(i+1)),"13","24"];
    const shiftSpeeds=[...Array.from({length:10},(_,i)=>String(BigInt(5)*q*BigInt(2*i+1))),...[10,8,6,4].map(a=>String(BigInt(a)*q+one))];
    const same=(value:unknown,expected:string[])=>Array.isArray(value)&&value.length===expected.length&&value.every((v,i)=>v===expected[i]);
    if(!gw||gw.id!=="GW14"||gw.threshold!=="1/14"||gw.witness!=="1/14"||!same(gw.speeds,gwSpeeds)||!Array.isArray(gw.cover)||gw.cover.length!==59||
      !shift||shift.id!=="SHIFT15"||shift.Q!==String(q)||shift.threshold!=="1/15"||shift.baseTime!==`1/${BigInt(10)*q}`||
      shift.firstGoodShift!==4||shift.witness!==`${BigInt(8)*q+one}/${BigInt(10)*q}`||!same(shift.speeds,shiftSpeeds))return null;
    const cover:LrcArc[]=[];
    const seen=new Set<string>();
    for(const value of gw.cover){
      const arc=object(value);
      if(!arc||Object.keys(arc).length!==2||!Number.isInteger(arc.speedIndex)||!Number.isInteger(arc.center))return null;
      const speedIndex=arc.speedIndex as number,center=arc.center as number;
      if(speedIndex<0||speedIndex>=13||center<0||center>Number(gwSpeeds[speedIndex])||seen.has(`${speedIndex}:${center}`))return null;
      seen.add(`${speedIndex}:${center}`);cover.push({speedIndex,center});
    }
    return {gw:{speeds:gwSpeeds,cover},shift:{Q:String(q),speeds:shiftSpeeds}};
  } catch {return null;}
}
