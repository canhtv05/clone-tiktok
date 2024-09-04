import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './NotFoundActive.module.scss';
import SvgIcon from '~/components/Icons/SvgIcon';

const cx = classNames.bind(styles);

function NotFoundActive({ icon = <SvgIcon />, title, desc, noBorder }) {
    return (
        <div className={cx('div-wrapper')}>
            <div className={cx('wrapper')}>
                <div className={cx('icon', { 'no-border': noBorder })}>{icon}</div>
                <p className={cx('title')}>{title}</p>
                <p className={cx('desc')}>{desc}</p>
            </div>
        </div>
    );
}

NotFoundActive.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string,
    desc: PropTypes.string,
};

export default NotFoundActive;
