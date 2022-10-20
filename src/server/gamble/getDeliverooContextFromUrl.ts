import cheerio from "cheerio";
import {DeliverooState} from "../type/deliveroo/DeliverooState";
import {CaptchaRequiredError} from "./error/CaptchaRequiredError";
import {doDeliverooFetch} from "../util/doDeliverooFetch";

const getDeliverooContextFromUrl = async (
    url: string,
): Promise<DeliverooState> => {
    const html = await doDeliverooFetch(url)
        .then(restaurants => restaurants.text());

    const $ = cheerio.load(html);

    const data = $('#__NEXT_DATA__')

    if (!data) {
        const html = $("html").html();

        if ($("title").text().indexOf("Cloudflare") > 0) {
            console.log("Captcha required - sending it back to the user")
            throw new CaptchaRequiredError(String(html));
        }

        throw new Error(`State is null or undefined. State: ${data}`)
    }

    // Get the NEXT state + cookie
    return JSON.parse(data.html() as string) as DeliverooState;
};

export { getDeliverooContextFromUrl };