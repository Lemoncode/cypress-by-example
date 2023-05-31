# Test Varaitions

We're going to create a new spec to check that hotels are filtered. Before we can do that we're going to refactor our solution, and introduce a new feature, a filter.

> Create `hotel-viewer/src/pods/hotel-collection/components/hotel-filter-panel.component.tsx`

```tsx
import * as React from "react";
import { Button, ButtonGroup } from "@mui/material";

export type FilterOptions = "all" | "bad" | "good" | "excellent";

interface Props {
  onClickFilterOption: (filterOptions: FilterOptions) => void;
}

export const HotelFilterComponent: React.FC<Props> = (props: Props) => {
  const filterOptionHandler = (filterOption: FilterOptions) => () =>
    props.onClickFilterOption(filterOption);

  return (
    <ButtonGroup>
      <Button onClick={filterOptionHandler("all")}>all</Button>
      <Button onClick={filterOptionHandler("bad")}>bad</Button>
      <Button onClick={filterOptionHandler("good")}>good</Button>
      <Button onClick={filterOptionHandler("excellent")}>excellent</Button>
    </ButtonGroup>
  );
};
```

> Update `hotel-viewer/src/pods/hotel-collection/hotel-collection.styles.ts`

```ts
/*diff*/
export const filterLayout = css`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;
/*diff*/
```

> Update `hotel-viewer/src/pods/hotel-collection/hotel-collection.container.tsx`

```tsx
import * as React from "react";
import { HotelCollectionComponent } from "./hotel-collection.component";
import {
  HotelFilterComponent,
  FilterOptions,
} from "./components/hotel-filter-panel.component";
import { useHotelCollection } from "./hotel-collection.hook";
import * as classes from "./hotel-collection.styles";
import { HotelEntityVm } from "./hotel-collection.vm";

const filterReactions =
  (hotelCollection: HotelEntityVm[]) => (filterOption: FilterOptions) => {
    const reactions = {
      all: () => hotelCollection,
      bad: () => hotelCollection.filter((h) => h.rating >= 0 && h.rating < 2.5),
      good: () =>
        hotelCollection.filter((h) => h.rating >= 2.5 && h.rating < 4),
      excellent: () => hotelCollection.filter((h) => h.rating >= 4),
    };
    return reactions[filterOption]();
  };

let doFilterReactions;

export const HotelCollectionContainer = () => {
  const { hotelCollection, loadHotelCollection } = useHotelCollection();
  const [filterOption, setFilterOption] = React.useState<FilterOptions>("all");
  const [filteredCollection, setFilteredCollection] = React.useState<
    HotelEntityVm[]
  >([]);

  React.useEffect(() => {
    loadHotelCollection();
  }, []);

  React.useEffect(() => {
    if (hotelCollection && hotelCollection.length > 0) {
      doFilterReactions = filterReactions(hotelCollection);
    }
  }, [hotelCollection]);

  React.useEffect(() => {
    if (hotelCollection && hotelCollection.length > 0) {
      setFilteredCollection(doFilterReactions(filterOption));
    }
  }, [filterOption, hotelCollection]);

  return (
    <>
      <HotelFilterComponent
        onClickFilterOption={setFilterOption}
        className={classes.filterLayout}
      />

      <HotelCollectionComponent hotelCollection={filteredCollection} />
    </>
  );
};
```

We are ready to test the new feature, to do that, we're going to create a new fixture with more data to test all our options.

> Create `e2e/cypress/fixtures/hotels-extended.json`

```json
[
  {
    "id": "0248058a-27e4-11e6-ace6-a9876eff01b3",
    "picture": "/thumbnails/50947_264_t.jpg",
    "name": "Motif Seattle",
    "city": "Seattle",
    "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
    "address": "1415 5th Ave",
    "hotelRating": 2
  },
  {
    "id": "024bd61a-27e4-11e6-ad95-35ed01160e57",
    "picture": "/thumbnails/16673_260_t.jpg",
    "name": "The Westin Seattle",
    "city": "Burmiggan",
    "address": "1900 5th Ave",
    "shortDescription": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
    "hotelRating": 4
  },
  {
    "id": "0248058a-27e4-11e6-ace6-a9876eff01cd",
    "picture": "/thumbnails/50947_264_t.jpg",
    "name": "Seattle Marina",
    "city": "Seattle",
    "shortDescription": "With a stay at Motif Seattle, you will be centrally located in Seattle, steps from 5th Avenue Theater and minutes from Pike Place Market. This 4-star hotel is within",
    "address": "1415 5th Ave",
    "hotelRating": 1
  },
  {
    "id": "024bd61a-27e4-11e6-ad95-35ed01160eff",
    "picture": "/thumbnails/16673_260_t.jpg",
    "name": "The Eastin Seattle",
    "city": "Burmiggan",
    "address": "1900 5th Ave",
    "shortDescription": "With a stay at The Westin Seattle, you'll be centrally laocated in Seattle, steps from Westlake Center and minutes from Pacific Place. This 4-star hotel is close to",
    "hotelRating": 3
  }
]
```

> Create `e2e/cypress/e2e/hotel-viewer-filter.cy.js`

```javascript
/// <reference types="Cypress" />

describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json"); // [1]
  });
});
```

1. We're passing the new extended fixture. We can run this and see if it works.

Now lets find a button and click on it. One strategy is to use `contains`. This command will find what ever inner text inside an HTML element and retrieve to us.

```javascript
describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json");
    /*diff*/
    cy.contains("bad").click(); // [2]
    /*diff*/
  });
});
```

2. Because we're using **material-ui** the inner text is transform and we see it on upper case.

- We can assert now

```javascript
describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json");

    cy.contains("bad").click();
    /*diff*/
    cy.get('[data-testid="hotels"] > li').should("have.length", 2); // [1]
    /*diff*/
  });
});
```

1. Because we have filtered, we're expecting that this list have two items.

Now we can create segragate tests for each filter value, or instead use a `Cypress` feature that avoid code duplication. Lets remove the current filtering action, and update the test.

> Update `e2e/cypress/e2e/hotel-viewer-filter.cy.js`

```diff
describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json");

-   cy.contains("bad").click();
-
-   cy.get('[data-testid="hotels"] > li').should("have.length", 2);
  });
});
```

```javascript
describe("Filter panel", () => {
  it("filters hotels by rating", () => {
    cy.loadAndVisit("hotels-extended.json");

    const filters = [
      // [1]
      { value: "all", expectedLength: 4 },
      { value: "bad", expectedLength: 2 },
      { value: "good", expectedLength: 1 },
      { value: "excellent", expectedLength: 1 },
    ];

    cy.wrap(filters) // [2]
        .each((filter) => { // [3]
            const { value, expectedLength } = filter;
            cy.contains(value).click();
            cy.get('[data-testid="hotels"] > li').should(
                "have.length",
                expectedLength
            );
        });
  });
});
```

1. We create a new array of objects. The fields that we're using are value (filtering value) and expectedLenght (the length expectation after filtering).
2. Then we user `wrap`, this will allow us to use `each`.
3. For last in each iteration we access an onbject of filters array. Is inside this callback where we do the test.
