import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styles from './ModalMessageSetting.module.scss';
import Overlay from '~/components/OverLay';
import { CloseIcon } from '~/components/Icons';
import Button from '~/components/Button';
import Radio from '~/components/Radio';

const cx = classNames.bind(styles);

const listRadio = [
    { id: 'friends', value: 'friends', span_text: 'Friends' },
    { id: 'no-one', value: 'no-one', span_text: 'No one' },
];

function ModalMessageSetting({ isShow, setIsShow }) {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (isShow) {
            setSelectedOption(null);
        }
    }, [isShow]);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleCloseModal = () => {
        setIsShow(false);
    };

    return (
        <Overlay isShowModal={isShow}>
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
                            <Radio
                                htmlFor={item.id}
                                key={index}
                                value={item.value}
                                isChecked={selectedOption === item.value}
                                onChange={handleOptionChange}
                                spanText={item.span_text}
                                name={'message-setting'}
                            />
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
        </Overlay>
    );
}

ModalMessageSetting.propTypes = {
    isShow: PropTypes.bool.isRequired,
    setIsShow: PropTypes.func.isRequired,
};

export default ModalMessageSetting;
