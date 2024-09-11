import {
    EmailIcon,
    EmbedIcon,
    FBIcon,
    LineIcon,
    LinkedInIcon,
    PinterestIcon,
    RedditIcon,
    SendIcon,
    TelegramIcon,
    Twitter2Icon,
    WhatsappIcon,
} from '~/components/Icons';

export const centerRowItems = [
    {
        title: 'Embed',
        icon: <EmbedIcon style={{ color: 'currentColor' }} />,
    },
    {
        title: 'Send to friends',
        icon: <SendIcon />,
    },
    {
        title: 'Share to Facebook',
        icon: <FBIcon style={{ width: 24, height: 24 }} />,
    },
    {
        title: 'Share to WhatsApp',
        icon: <WhatsappIcon />,
    },
    {
        title: 'Share to Twitter',
        icon: <Twitter2Icon />,
    },
];

export const menuItem = [
    {
        title: 'Privacy settings',
        separate: true,
    },
    {
        title: 'Delete',
        separate: false,
    },
];

export const menuShareItem = [
    {
        title: 'Share to LinkedIn',
        icon: <LinkedInIcon />,
    },
    {
        title: 'Share to Reddit',
        icon: <RedditIcon />,
    },
    {
        title: 'Share to Telegram',
        icon: <TelegramIcon />,
    },
    {
        title: 'Share to Email',
        icon: <EmailIcon />,
    },
    {
        title: 'Share to Line',
        icon: <LineIcon width="2.6rem" height="2.6rem" />,
    },
    {
        title: 'Share to Pinterest',
        icon: <PinterestIcon />,
    },
];

export const menuEllipsis = [
    {
        title: 'Report',
        icon: '',
        separate: true,
    },
    {
        icon: '',
        title: 'Delete',
    },
];
