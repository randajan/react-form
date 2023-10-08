import { useState } from 'react';
import { Modal } from '../elements/Modal/Modal';


export const usePop = props => {
    const modal = Modal.use();
    return useState(_ => modal.addPop(props))[0];
}