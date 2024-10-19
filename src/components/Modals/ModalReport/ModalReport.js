import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './ModalReport.module.scss';
import { useEffect, useState } from 'react';
import { CloseIcon } from '~/components/Icons';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const listTitleReport = [
    { title: 'Nudity and sexual content' },
    { title: 'Regulated goods and activities' },
    { title: 'Hate and harassment' },
    { title: 'Frauds and scams' },
    { title: 'Minor safety' },
    { title: 'Misinformation' },
    { title: 'Violence, abuse, and criminal exploitation' },
    { title: 'Shocking and graphic content' },
    { title: 'Suicide and self-harm' },
    { title: 'Disordered eating and unhealthy body image' },
    { title: 'Dangerous activities and challenges' },
    { title: 'Deceptive behavior and spam' },
    { title: 'Sharing personal information' },
    { title: 'Dangerous goods or services' },
    { title: 'Intellectual property infringement' },
    { title: 'Advertisement does not match the item' },
    { title: 'Other' },
];

function ModalReport({ isShowModalReport, onClose, isNext, setIsNext, setContentReport }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        if (!isShowModalReport) {
            setSelectedItem(null);
        }
        if (isNext) {
            setIsSelected(false);
        }
    }, [isShowModalReport, isNext]);

    const handleSelectedItem = (index, title) => {
        setContentReport(title);
        setSelectedItem(index);
        setIsSelected(true);
    };

    const handleCloseModal = () => {
        onClose();
    };

    const handleNextButton = () => {
        setIsNext(true);
        onClose();
    };

    const ListReport = () => {
        return listTitleReport.map((item, index) => (
            <div
                className={cx('report-reason-item', { selected: selectedItem === index })}
                tabIndex={0}
                key={index}
                onClick={() => handleSelectedItem(index, item.title)}
            >
                {item.title}
            </div>
        ));
    };

    return (
        isShowModalReport && (
            <div className={cx('overlay')}>
                <div className={cx('container')}>
                    <div className={cx('wrapper')}>
                        <div className={cx('header')}>
                            <span className={cx('span-header')}>Report</span>
                            <span className={cx('close-icon')} onClick={handleCloseModal}>
                                <CloseIcon />
                            </span>
                        </div>
                        <div className={cx('wrapper-content')}>
                            <div className={cx('content')}>
                                <div className={cx('report-reason-why-title')}>Why are you reporting this account?</div>
                                <div className={cx('report-reason-group')}>
                                    <ListReport />
                                </div>
                            </div>
                        </div>
                        <div className={cx('footer')}>
                            <div className={cx('button-container')}>
                                <Button className={cx('button-cancel')} onClick={handleCloseModal}>
                                    Cancel
                                </Button>
                                <Button
                                    primary
                                    className={cx('button-next')}
                                    disable={isSelected === false}
                                    onClick={handleNextButton}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

ModalReport.propTypes = {
    onClose: PropTypes.func.isRequired,
    isShowModalReport: PropTypes.bool.isRequired,
    setIsNext: PropTypes.func.isRequired,
    isNext: PropTypes.bool.isRequired,
    setContentReport: PropTypes.func.isRequired,
};

export default ModalReport;
