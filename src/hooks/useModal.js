import { useContext } from 'react';
import { contextModal } from '../elements/ModalProvider/ModalProvider';


export const useModal = () => useContext(contextModal);