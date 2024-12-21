import classNames from 'classnames/bind';
import styles from './EditPageSettingsAside.module.scss';
import Radio from '~/components/Radio';
import SelectionSettingsAside from './SelectionSettingsAside';

const cx = classNames.bind(styles);

function EditPageSettingsAside() {
    return (
        <div className={cx('container')}>
            <div className={cx('title')}>Settings</div>
            <div className={cx('card')}>
                <div className={cx('div-container')}>
                    <div className={cx('caption-title')}>
                        <span className={cx('post-title')}>When to post</span>
                    </div>
                    <div className={cx('schedule-radio-container')}>
                        <Radio
                            htmlFor="now"
                            name="schedule"
                            value="now"
                            spanText="Now"
                            className={cx('my-radio')}
                            isChecked
                        />
                        <Radio
                            htmlFor="schedule"
                            name="schedule"
                            value="schedule"
                            spanText="Schedule"
                            className={cx('my-radio')}
                            disabled
                        />
                    </div>
                </div>

                <div className={cx('div-container')}>
                    <div className={cx('caption-title')}>
                        <span className={cx('post-title')}>Who can watch this video</span>
                    </div>
                    <div className={cx('selection-container')}>
                        <SelectionSettingsAside />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditPageSettingsAside;
