import React from "react";
import { SelectedItem } from "../../../../../common/type/SelectedRestaurantAndItems";
import { Item } from "./item/Item";

import styles from "./CategoryItems.scss";

type CategoryItemsProps = {
    items: SelectedItem[];
};

const CategoryItems: React.FC<CategoryItemsProps> = (props) => {
    const { items } = props;

    const result = items.map((selectedItem) => (
        <Item key={selectedItem.item.id} item={selectedItem.item} />
    ));

    return <div className={styles.categoryItems}>{result}</div>;
};

export { CategoryItems };
