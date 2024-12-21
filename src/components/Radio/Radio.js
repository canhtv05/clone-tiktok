import { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Radio.module.scss';

const cx = classNames.bind(styles);

function Radio({ htmlFor, value, isChecked, onChange, spanText, name, disabled = false, className }) {
    return (
        <label htmlFor={htmlFor} className={cx('label-container')}>
            <input
                type="radio"
                id={htmlFor}
                name={name}
                value={value}
                checked={isChecked}
                onChange={onChange}
                className={cx('input-radio', className)}
                disabled={disabled}
            />
            <div className={cx('radio-icon', className)}></div>
            <span className={cx('radio-text', { disabled })}>{spanText}</span>
        </label>
    );
}

Radio.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isChecked: PropTypes.bool,
    onChange: PropTypes.func,
    spanText: PropTypes.string.isRequired,
    name: PropTypes.string,
};

export default memo(Radio);
