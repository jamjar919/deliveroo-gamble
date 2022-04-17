import {UILayoutList} from "./DeliverooUI";
import {DeliverooItem} from "./DeliverooItem";
import {DeliverooRestaurantFull} from "./DeliverooRestaurant";

type DeliverooMenuPageState = {
    menu: {
        meta: {
            items: DeliverooItem[],
            restaurant: DeliverooRestaurantFull
        }
    }
}

type DeliverooHomeState = {
    feed: {
        meta: {
            title: string,
            restaurantCount: {results: number, location: number}
        },
        results: {
            data: UILayoutList[]
        }
    }
}

/** Reverse engineered Deliveroo page state */
type DeliverooState = {
    props: {
        initialState: {
            home: DeliverooHomeState,
            menuPage: DeliverooMenuPageState
        }
    }
};

export { DeliverooState }
