import { useState } from 'react';
import { useModal } from './useModal';


export const usePop = props => {
    const modal = useModal();
    return useState(_ => modal.addPop(props))[0];
}