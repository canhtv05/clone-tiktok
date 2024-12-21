import { useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './SelectionSettingsAside.module.scss';
import { ArrowIconSmallIcon, TickSmallIcon } from '~/components/Icons';
import { Wrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

const selectLabel = [
    { title: 'Everyone' },
    { title: 'Friends', children: { desc: 'Followers you follow back' } },
    { title: 'Only you ' },
];

function SelectionSettingsAside() {
    const [isVisible, setIsVisible] = useState(false);
    const [typeSelect, setTypeSelect] = useState('Friends');

    const toggleTippy = () => {
        setIsVisible((prev) => !prev);
    };

    const handleSetTypeSelect = (label) => {
        setTypeSelect(label);
        setIsVisible(false);
    };

    const renderTippy = () => (
        <div className={cx('tippy')}>
            <Wrapper>
                <div className={cx('tooltip-container')}>
                    {selectLabel.map((label) => (
                        <div
                            key={label.title}
                            className={cx('tooltip-item')}
                            onClick={() => handleSetTypeSelect(label.title)}
                        >
                            <div className={cx('tooltip-item-label')}>
                                {label.title}
                                {label.children && <div className={cx('tooltip-item-desc')}>{label.children.desc}</div>}
                            </div>

                            {typeSelect === label.title && (
                                <div className={cx('icon-check')}>
                                    <TickSmallIcon />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Wrapper>
        </div>
    );

    return (
        <TippyHeadless
            render={renderTippy}
            interactive
            placement="bottom-start"
            visible={isVisible}
            onClickOutside={() => setIsVisible(false)}
        >
            <button className={cx('select', { active: isVisible })} onClick={toggleTippy}>
                <div className={cx('select-title')}>
                    <div>{typeSelect}</div>
                </div>
                <span className={cx('icon', { active: isVisible })}>
                    <ArrowIconSmallIcon />
                </span>
            </button>
        </TippyHeadless>
    );
}

export default SelectionSettingsAside;
