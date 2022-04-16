import {Request, Response} from "express";
import {sendJSON} from "../util/sendJSON";
import {getPlacesToEat} from "./getPlacesToEat";
import {getDeliverooContextFromUrl} from "./getDeliverooContextFromUrl";
import {pickOneFromArray} from "../util/pickOneFromArray";
import {getMenuItems} from "./getMenuItems";
import {selectMenuItems} from "./selectMenuItems";
import {GambleResponse} from "../../common/type/GambleResponse";
import { DeliverooItem } from "../type/deliveroo/DeliverooItem";
import { Restaurant } from "../type/Restaurant";

const createGambleResponse = (
    placesToEat: Restaurant[],
    selectedPlace: Restaurant,
    items: DeliverooItem[],
    selectedItems: DeliverooItem[]
): GambleResponse => {
    return {
        all: {
            restaurants: placesToEat,
            items
        },
        selected: {
            restaurant: selectedPlace,
            items: selectedItems
        }
    }
}

type GambleRequest = {
    priceLimit?: number
}

export const gamble = async (req: Request<{}, GambleRequest>, res: Response) => {

    console.log(req.body);

    let priceLimit = 12_00; // £12.00
    if (req.body?.priceLimit) {
        priceLimit = req.body?.priceLimit;
    }

    // Obtain restaurants in the area
    const searchPageContext = await getDeliverooContextFromUrl(
        "/restaurants/oxford/littlemore-blackbird-leys?collection=all-restaurants",
    );
    const placesToEat = getPlacesToEat(searchPageContext);

    // Select one randomly
    const selectedPlace = pickOneFromArray(placesToEat);

    // Fetch + get context for it
    const restaurantContext = await getDeliverooContextFromUrl(
        selectedPlace.url,
    );

    // Get items
    const items = getMenuItems(restaurantContext);

    // Select some random items
    const selectedItems = selectMenuItems(items, priceLimit);

    sendJSON(createGambleResponse(
        placesToEat,
        selectedPlace,
        items,
        selectedItems
    ), res);
};