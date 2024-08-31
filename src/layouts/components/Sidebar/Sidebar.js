import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import config from '~/config';
import {
    HomeIcon,
    HomeActiveIcon,
    UserGroupIcon,
    UserGroupActiveIcon,
    LiveIcon,
    LiveActiveIcon,
    ExploreIcon,
    ExploreActiveIcon,
    ProfileIcon,
} from '~/components/Icons';

import Menu, { MenuItem } from './Menu';
import SuggestAccounts from '../SuggestAccounts';
import FollowingAccounts from '../FollowingAccounts';

const cx = classNames.bind(styles);

function Sidebar() {
    return (
        <aside className={cx('wrapper')}>
            <Menu>
                <MenuItem
                    title={'For you'}
                    to={config.routes.home}
                    icon={<HomeIcon />}
                    activeIcon={<HomeActiveIcon />}
                    tabIndex={-1}
                ></MenuItem>
                <MenuItem
                    title={'Explore'}
                    to={config.routes.explore}
                    icon={<ExploreIcon />}
                    activeIcon={<ExploreActiveIcon />}
                    tabIndex={-1}
                ></MenuItem>
                <MenuItem
                    title={'Following'}
                    to={config.routes.following}
                    icon={<UserGroupIcon />}
                    activeIcon={<UserGroupActiveIcon />}
                    tabIndex={-1}
                ></MenuItem>
                <MenuItem
                    title={'LIVE'}
                    to={config.routes.live}
                    icon={<LiveIcon />}
                    activeIcon={<LiveActiveIcon />}
                    tabIndex={-1}
                ></MenuItem>
                <MenuItem
                    title={'Profile'}
                    to={config.routes.profile}
                    icon={<ProfileIcon />}
                    activeIcon={<ProfileIcon />}
                    tabIndex={-1}
                ></MenuItem>
            </Menu>

            <SuggestAccounts label="Suggested Account" />
            <FollowingAccounts label="Following Account" />
        </aside>
    );
}

export default Sidebar;
