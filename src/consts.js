


export const ModalProviderFlagsDefault = {
    up: p => p.modal.isUp(),
    mounting: p => p.state.mounting,
    modal: p => !p.props.list,
    list: p => p.props.list,
};

export const popFlagsDefault = {
    top: p => p.isTop(),
    lock: p => p.state.lock
}

export const fetchProps = props => (String.jet.is(props) || React.isValidElement(props)) ? { children: props } : Object.jet.tap(props);

export const onDomUpdate = callback=>{ setTimeout(window.requestAnimationFrame(callback)); }
export const onDomLoad = callback=>document.readyState === 'complete' ? onDomUpdate(callback) : window.addEventListener('load', _ => onDomUpdate(callback));