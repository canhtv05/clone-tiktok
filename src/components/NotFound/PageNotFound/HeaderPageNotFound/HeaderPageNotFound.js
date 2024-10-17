import classNames from 'classnames/bind';
import styles from './HeaderPageNotFound.module.scss';
import images from '~/assets/images';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { PlayIcon } from '~/components/Icons';

const cx = classNames.bind(styles);

function HeaderPageNotFound() {
    return (
        <div className={cx('container')}>
            <div
                className={cx('div-wrapper')}
                style={{
                    background: `url(${images.backgroundNotFound}) center center / cover no-repeat`,
                }}
            >
                <p className={cx('not-found')}>
                    <span>4</span>
                    <Image src={images.img404} alt={'not-found'} className={cx('img-face')} />
                    <span>4</span>
                </p>
                <p className={cx('not-found-desc')}>Couldn't find this page</p>
                <p className={cx('recommend-desc')}>Check out more trending videos on TikTok</p>
                <Button className={cx('button')} primary to={'/'} leftIcon={<PlayIcon className={cx('play-icon')} />}>
                    <span className={cx('span-text')}>Watch now</span>
                </Button>
            </div>
        </div>
    );
}

export default HeaderPageNotFound;
