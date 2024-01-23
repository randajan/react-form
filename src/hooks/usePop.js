import { useEffect, useState } from 'react';
import { Modal } from '../elements/Modal/Modal';


export const usePop = (props) => {
    const modal = Modal.use();
    const [ pop ] = useState(_ => modal.addPop(props));
    useEffect(_=>(_=>pop.down()), []);
    return pop;
}