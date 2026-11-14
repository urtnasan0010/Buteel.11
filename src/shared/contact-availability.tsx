import type {Lang} from './data';
import {t} from './translations';
// The directory currently records phone and email only. A phone number does
// not establish SMS availability, and email does not establish interpreting.
export default function ContactAvailability({lang,email}:{lang:Lang;email?:string|null}){
 return <div className="contact-availability">
  {!email?.trim()&&<p>{t(lang,'written_unknown')}</p>}
  <p>{t(lang,'interpreting_unknown')}</p>
 </div>;
}
