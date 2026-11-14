import type {ReactNode} from 'react';
import type {Lang} from './data';
import {t} from './translations';
export type VideoAsset = {src:`/${string}`;captions:`/${string}`;captionLang:Lang;captionLabel:string};
// Local media only. Never configure an asset before Deaf-led approval.
export default function MslVideo({lang,title,children,asset}:{lang:Lang;title:string;children?:ReactNode;asset?:VideoAsset}) {
 if(asset && [asset.src,asset.captions].some(url=>!url.startsWith('/')||url.startsWith('//')||url.includes('\\'))) throw new Error('Video assets must be local');
 return <section className="msl-video" aria-label={`${t(lang,'msl_title')}: ${title}`}>
  <h2>{t(lang,'msl_title')}: {title}</h2>
  {asset ? <video controls playsInline preload="none" aria-label={`${t(lang,'msl_title')}: ${title}`}>
   <source src={asset.src}/><track kind="captions" src={asset.captions} srcLang={asset.captionLang} label={asset.captionLabel} default/>
  </video> : <p className="msl-empty">{t(lang,'msl_soon')}</p>}
  {lang==='mn'&&<p className="meta">{t(lang,'msl_native')}</p>}
  <div className="msl-transcript"><h3>{t(lang,'msl_text')}</h3>{children}</div>
 </section>;
}
