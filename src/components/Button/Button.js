import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disable = false,
    small = false,
    large = false,
    upload = false,
    circle = false,
    noPadding = false,
    children,
    className,
    leftIcon,
    rightIcon,
    midIcon,
    onClick,
    width,
    height,
    fontSize,
    ...pastProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        ...pastProps,
    };

    const styles = {
        width,
        height,
        fontSize,
    };

    //remove event listener when button disable
    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof key === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
        circle,
        text,
        rounded,
        upload,
        disable,
        small,
        large,
    });

    return (
        <Comp className={classes} {...props} style={{ ...styles }}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            {midIcon && circle ? (
                <span className={cx('title')}>
                    {circle && <span className={cx('icon')}>{midIcon}</span>}
                    {children}
                </span>
            ) : (
                <span className={cx('title')}>{children}</span>
            )}
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    noPadding: PropTypes.bool,
    rounded: PropTypes.bool,
    midIcon: PropTypes.node,
    circle: PropTypes.bool,
    disable: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    upload: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number,
    fontSize: PropTypes.number,
};

export default Button;
