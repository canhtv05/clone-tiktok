import classNames from 'classnames/bind';
import styles from './ModalReportSuccess.module.scss';
import { TickReportSuccessIcon } from '~/components/Icons';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ModalReportSuccess({ isShowModalReportSuccess, setIsShowModalReportSuccess }) {
    return (
        isShowModalReportSuccess && (
            <div className={cx('overlay')}>
                <div className={cx('container')}>
                    <TickReportSuccessIcon />
                    <p className={cx('title')}>Thanks for reporting</p>
                    <p className={cx('desc')}>
                        We’ll review your report and if there is a violation of our Community Guidelines, we’ll take
                        appropriate action.
                    </p>
                    <Button primary className={cx('button')} onClick={setIsShowModalReportSuccess}>
                        Done
                    </Button>
                </div>
            </div>
        )
    );
}

export default ModalReportSuccess;
