import { GitHubIcon } from './GitHubIcon';
import { LinkedInIcon } from './LinkedInIcon';

function Footer({ size = 24, ...props }) {
    return (
        <div {...props}>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <LinkedInIcon
                    size={size}
                    onClick={() =>
                        window.open('https://www.linkedin.com/in/balazs-kovacs-cs', '_blank')
                    }
                />
                <GitHubIcon
                    size={size}
                    onClick={() => window.open('https://github.com/balazshimself', '_blank')}
                />
            </div>
        </div>
    );
}
export default Footer;
