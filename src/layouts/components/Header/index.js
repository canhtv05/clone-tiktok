import {
    ChartIcon,
    CreatorIcon,
    KeyboardIcon,
    LanguageIcon,
    LightCreatorIcon,
    LiveIcon,
    MoonIcon,
    QuestionIcon,
    SettingIcon,
} from '~/components/Icons';
export const getMenuItems = (currentUser) => {
    const creatorTools = {
        icon: <CreatorIcon />,
        title: 'Creator tools',
        children: {
            title: 'Create tools',
            data: [
                {
                    icon: <ChartIcon />,
                    type: 'view',
                    title: 'View Analytics',
                },
                ...(currentUser
                    ? [
                          {
                              icon: <LiveIcon style={{ width: '2.6rem', height: '2.6rem' }} />,
                              type: 'live_studio',
                              title: 'LIVE Studio',
                          },
                          {
                              icon: <LightCreatorIcon style={{ width: '3rem', height: '3rem' }} />,
                              type: 'live_creator',
                              title: 'LIVE Creator Hub',
                          },
                      ]
                    : []),
            ],
        },
    };

    const settingItem = currentUser
        ? {
              icon: <SettingIcon />,
              title: 'Setting',
              to: '/setting',
          }
        : null;

    return [
        creatorTools,
        ...(settingItem ? [settingItem] : []),
        {
            icon: <LanguageIcon />,
            title: 'English',
            children: {
                title: 'Language',
                data: [
                    {
                        type: 'language',
                        code: 'vi',
                        title: 'English',
                    },
                    {
                        type: 'language',
                        code: 'en',
                        title: 'Vietnamese',
                    },
                ],
            },
        },
        {
            icon: <QuestionIcon />,
            title: 'Feedback and help',
            to: '/feedback',
        },
        {
            icon: <KeyboardIcon />,
            title: 'Keyboard shortcut',
        },
        {
            icon: <MoonIcon />,
            title: 'Dark mode',
            children: {
                title: 'Dark mode',
                data: [
                    {
                        type: 'dark',
                        title: 'Dark mode',
                    },
                    {
                        type: 'light',
                        title: 'Light mode',
                    },
                ],
            },
        },
    ];
};

export { default } from './Header';
