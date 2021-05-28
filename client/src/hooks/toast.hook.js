import { useCallback } from 'react';

export const useToast = () => {
    return useCallback((text) => {
        if ( window.M && text ) {
            window.M.toast({html: text, displayLength: 4500});
        }
    }, []);
}