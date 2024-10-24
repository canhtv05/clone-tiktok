import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styles from './ModalMessageSetting.module.scss';
import ModalOverlay from '~/components/OverLay';
import { CloseIcon } from '~/components/Icons';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const listRadio = [
    { id: 'friends', value: 'friends', span_text: 'Friends' },
    { id: 'no-one', value: 'no-one', span_text: 'No one' },
];

function ModalMessageSetting({ isShow, setIsShow }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleCloseModal = () => {
        setIsShow(false);
    };

    return (
        <ModalOverlay isShowModal={isShow}>
            <div className={cx('container', { show: isShow, hide: !isShow })}>
                <div className={cx('header')}>
                    <h2 className={cx('title')}>Message settings</h2>
                </div>
                <div className={cx('content')}>
                    <h4 className={cx('what')}>Who can send you direct messages</h4>
                    <p className={cx('detail')}>
                        With any option, you can receive messages from users that you’ve sent messages to. Friends are
                        your followers that you follow back.
                    </p>
                    <div className={cx('radio-group')}>
                        {listRadio.map((item, index) => (
                            <label htmlFor={item.id} className={cx('label-container')} key={index}>
                                <input
                                    type="radio"
                                    id={item.id}
                                    name="message-settings"
                                    value={item.value}
                                    checked={selectedOption === item.value}
                                    onChange={handleOptionChange}
                                    className={cx('input-radio')}
                                />
                                <div className={cx('radio-icon')}></div>
                                <span className={cx('radio-text')}>{item.span_text}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className={cx('footer')}>
                    <div className={cx('button-container')}>
                        <Button className={cx('button-cancel')} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            className={cx('button-next')}
                            primary
                            disable={selectedOption === null}
                            onClick={handleCloseModal}
                        >
                            Save
                        </Button>
                    </div>
                </div>
                <span onClick={handleCloseModal}>
                    <CloseIcon className={cx('close-icon')} />
                </span>
            </div>
        </ModalOverlay>
    );
}

ModalMessageSetting.propTypes = {
    isShow: PropTypes.bool.isRequired,
    setIsShow: PropTypes.func.isRequired,
};

export default ModalMessageSetting;
