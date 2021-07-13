import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth.hook";
import { Deutch } from "./Deutch";
import { DictionaryContext } from "./dictionaryContext";
import { English } from "./English";
import { Franch } from "./Franch";
import { Russian } from "./Russian";
import { Turkey } from "./Turkey";

export const DictionaryState = ({children}) => {
    const auth = useAuth();
    const Dictionary = {
        en: English, ru: Russian, de: Deutch, fr: Franch, tr: Turkey
    }
    let initLang = 'en';
    if ( Boolean(Dictionary[navigator.language]) ) initLang = navigator.language;
    if ( auth.lang ) initLang = auth.lang;
    const [lang, setLang] = useState(initLang);

    const dg = key => Dictionary[lang][key] ?? '';

    useEffect(() => {
        document.querySelector('html').setAttribute('lang', lang);
    }, [lang]);

    useEffect(() => {
        if ( auth.lang ) {
            setLang(auth.lang);
        }
    }, [auth.lang]);

    return (
        <DictionaryContext.Provider value={{lang, setLang, dg}}>
            {children}
        </DictionaryContext.Provider>
    );
}