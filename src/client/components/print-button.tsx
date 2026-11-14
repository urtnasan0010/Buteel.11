'use client';
import type {Lang} from '@/shared/data';
import {t} from '@/shared/translations';
export default function PrintButton({lang}:{lang:Lang}){return <button className="print-button" onClick={()=>window.print()}>{t(lang,'print_page')}</button>;}
