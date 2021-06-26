import React, { useState } from "react";
import { Deutch } from "./Deutch";
import { DictionaryContext } from "./dictionaryContext";
import { English } from "./English";
import { Franch } from "./Franch";
import { Russian } from "./Russian";

export const DictionaryState = ({children}) => {
    const [lang, setLang] = useState('en');

    const Dictionary = {
        en: English, ru: Russian, de: Deutch, fr: Franch
    }

    const dg = key => Dictionary[lang][key] ?? '';

    return (
        <DictionaryContext.Provider value={{lang, setLang, dg}}>
            {children}
        </DictionaryContext.Provider>
    );
}