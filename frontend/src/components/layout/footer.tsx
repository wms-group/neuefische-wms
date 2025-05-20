import {FooterComponentProps} from "@/types";
import {FullYear} from "@/utils";

const Footer = ({ footerItems }: FooterComponentProps) => {
    const { showFullYear, company }= footerItems;
    return (
        <footer className="h-16 flex justify-between items-center bg-element-bg border-t-secondary border-t-1 py-4 px-6 lg:px-20">
            <div className="flex w-full lg:max-w-6xl">
                <small>{showFullYear && FullYear()} &#169; {company}</small>
            </div>
        </footer>
    )
}

export default Footer;