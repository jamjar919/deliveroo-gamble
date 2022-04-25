import {DeliverooItem} from "../type/deliveroo/DeliverooItem";
import {pickOneFromArray} from "../../common/util/pickOneFromArray";
import {SelectedItem} from "../../common/type/SelectedRestaurantAndItems";
import {filterItemsBelowPrice} from "./item-filters/filterItemsByPrice";
import {filterToPreferredItems} from "./item-filters/filterToPreferredItems";
import {DeliverooModifierGroup} from "../type/deliveroo/DeliverooModifierGroup";
import {getPriceFromDeliverooObject} from "../../common/util/getPriceFromDeliverooObject";
import {selectModifiersForItem} from "./selectModifiersForItem";

/**
 *  Given a set of menu items and a maximum price, fill a basket
 *  of items that sum to that price
 */
const selectMenuItems = (
    items: DeliverooItem[],
    modifiers: DeliverooModifierGroup[],
    priceLimit: number,
    options: {
        firstItemIsLarge: boolean
    },
    itemsPicked: number = 0,
): SelectedItem[] => {
    // Get all the items that we could pick
    const validItems = filterItemsBelowPrice(items, priceLimit);

    // If we don't have any items to pick then return
    if (validItems.length <= 0) {
        return []
    }

    // Pick one
    let selectedItem = pickOneFromArray(validItems);

    // If this is the first item then pick a priority item
    if (itemsPicked === 0 && options.firstItemIsLarge) {
        const preferredItems = filterToPreferredItems(validItems);

        if (preferredItems.length > 0) {
            selectedItem = pickOneFromArray(preferredItems)
        }
    }

    // Get random modifiers for the item (if any exist)
    const selectedModifiers = selectModifiersForItem(
        selectedItem,
        modifiers
    );

    // Update our new price limit
    const priceOfModifiers = selectedModifiers
        .flatMap((group) => group.options)
        .map((option) => getPriceFromDeliverooObject(option))
        .reduce((a, b) => b.fractional + a, 0);

    console.log(
        "modifiers",
        priceOfModifiers,
        selectedItem.name
    )

    const newPriceLimit = priceLimit - priceOfModifiers - getPriceFromDeliverooObject(selectedItem).fractional;

    // Filter to list of unselected items
    const unselectedItems = validItems
        .filter((item) => item.id !== selectedItem.id)

    const result = {
        item: selectedItem,
        modifiers: selectedModifiers
    }

    // Recursively select more items up to the new price limit
    return [
        result,
        ...selectMenuItems(unselectedItems, modifiers, newPriceLimit, options, itemsPicked + 1)
    ]

};

export { selectMenuItems }