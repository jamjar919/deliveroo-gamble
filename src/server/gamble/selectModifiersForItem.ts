import {DeliverooItem} from "../type/deliveroo/DeliverooItem";
import {DeliverooModifierGroup} from "../type/deliveroo/DeliverooModifierGroup";
import {SelectedModifier} from "../../common/type/SelectedRestaurantAndItems";
import {DeliverooModifierOption} from "../type/deliveroo/DeliverooModifierOption";
import {pickOneFromArray} from "../../common/util/pickOneFromArray";

const MODIFIER_SELECT_PROBABILITY = 0.5;

const selectModifiersForItem = (
    item: DeliverooItem,
    modifiers: DeliverooModifierGroup[],
): SelectedModifier[] => {
    const validModifierGroupsForItem = modifiers
        .filter(group => item.modifierGroupIds.includes(group.id));

    return (validModifierGroupsForItem
        .map((group) => {
            const options: DeliverooModifierOption[] = [];

            let validOptions = group.modifierOptions.filter((option) => option.available);

            // Select any required options
            while (options.length < group.minSelection) {
                options.push(pickOneFromArray(validOptions));
            }

            const canSelectOption = () =>
                Math.random() < MODIFIER_SELECT_PROBABILITY &&
                validOptions.length > 0 &&
                options.length < group.maxSelection;

            // Optionally select any up to the maximum options
            // Chance of selecting multiple options based on probability
            while (canSelectOption()) {
                const selectedOption = pickOneFromArray(validOptions)
                validOptions = validOptions.filter((option) => option.id !== selectedOption.id)
                options.push(selectedOption);
            }

            if (options.length < 0) {
                return null;
            }

            return {
                group: {
                    ...group,
                    modifierOptions: undefined
                },
                options,
            };
        })
        .filter((selectedModifier: SelectedModifier | null) => selectedModifier !== null) as SelectedModifier[])
        .filter((selectedModifier: SelectedModifier) => selectedModifier.options.length > 0);
}

export { selectModifiersForItem }