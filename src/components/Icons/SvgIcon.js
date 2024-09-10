import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const SvgIcon = forwardRef(({ icon, style = {}, className, onClick, fontSize }, ref) => {
    return (
        <span className={className} style={{ fontSize: fontSize, ...style }} onClick={onClick} ref={ref}>
            {icon}
        </span>
    );
});

SvgIcon.propTypes = {
    icon: PropTypes.node.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    fontSize: PropTypes.number,
    onClick: PropTypes.func,
};

export default SvgIcon;
