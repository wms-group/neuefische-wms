import {FooterComponentProps} from "@/types";
import {FullYear} from "@/utils";

const Footer = ({ footerItems }: FooterComponentProps) => {
    const { showFullYear, company }= footerItems;
    return (
        <footer className="h-16 flex justify-between items-center bg-gray-100 py-4 px-30">
            <div className="flex w-full max-w-6xl">
                <small>{showFullYear && FullYear()} &#169; {company}</small>
            </div>
        </footer>
    )
}

export default Footer;