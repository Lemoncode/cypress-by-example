# Stub POST Request

Lets stub a post request with cypress. For this purpose we are going to create a new test.

But before we can do that we are going to update the solution code to achieve this.

> Update `hotel-viewer/src/pods/hotel-edit/api/hotel-edit.api.ts`

```ts
/*diff*/
export const updateHotel = async (hotel: Hotel): Promise<boolean> => {
  const { data } = await Axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
  return true;
};
/*diff*/

/*diff*/
export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
  const { data } = await Axios.post<Hotel>(`${hotelListUrl}`, hotel);
  return true;
};
/*diff*/
```

> Update `hotel-viewer/src/pods/hotel-edit/hotel-edit.container.tsx`

```ts
/*diff*/
const isEditMode = (id: string) => id !== '0';
/*diff*/

export const HotelEditContainer: React.FunctionComponent = (props) => {
  const [hotel, setHotel] = React.useState<Hotel>(createEmptyHotel());
  const [cities, setCities] = React.useState<Lookup[]>([]);
  const { id } = useParams<any>();
  const navigate = useNavigate();

  /*diff*/
  const loadEditMode = async () => {
    const [apiHotel, apiCities] = await Promise.all([
      api.getHotel(id),
      api.getCities(),
    ]);
    setHotel(mapHotelFromApiToVm(apiHotel));
    setCities(apiCities);
  };
  /*diff*/

  /*diff*/
  const loadCreateMode = async () => {
    const apiCities = await api.getCities();
    setCities(apiCities);
  };
  /*diff*/

  const handleLoadData = async () => {
    const [apiHotel, apiCities] = await Promise.all([
      api.getHotel(id),
      api.getCities(),
    ]);
    setHotel(mapHotelFromApiToVm(apiHotel));
    setCities(apiCities);
  };

  React.useEffect(() => {
    handleLoadData();
  }, []);

  const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
    const success = await api.saveHotel(apiHotel);
    if (success) {
      navigate(-1);
    } else {
      alert('Error on save hotel');
    }
  };

  return (
    <HotelEditComponent hotel={hotel} cities={cities} onSave={handleSave} />
  );
};
```

We have created two new functions `loadEditMode` and `loadCreateMode`, depending on an existing `id` will retrive the data for a single hotel, if `id` equals '0', will load default hotel and cities.

Now we can change the behaviour by updating `handleLoadData`

```diff
const handleLoadData = async () => {
-   const [apiHotel, apiCities] = await Promise.all([
-     api.getHotel(id),
-     api.getCities(),
-   ]);
-   setHotel(mapHotelFromApiToVm(apiHotel));
-   setCities(apiCities);
+   if (isEditMode(id)) {
+     await loadEditMode();
+   } else {
+     await loadCreateMode();
+   }
  };
```

And by updating `handleSave` as well

```diff
+import { linkRoutes } from 'core/router';
....
const handleSave = async (hotel: Hotel) => {
    const apiHotel = mapHotelFromVmToApi(hotel);
-   const success = await api.saveHotel(apiHotel);
+   let success = false;
+   
+   if (isEditMode(id)) {
+     success = await api.updateHotel(apiHotel);
+   } else {
+     success = await api.saveHotel(apiHotel);
+   }
+
    if (success) {
-     navigate(-1);
+     navigate(linkRoutes.hotelCollection);
    } else {
      alert('Error on save hotel');
    }
  };
```

Ok, so far so good. But now we need a way on our application to create a new hotel. We're going to achieve this by adding a new entry on main application toolbar.

> Update `hotel-viewer/src/layouts/app.layout.tsx`

```tsx
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
/*diff*/
import { AccountCircle, Add } from '@mui/icons-material';
/*diff*/
import { SessionContext } from 'core/session-context';
import { linkRoutes } from 'core/router';
import * as classes from './app.layout.styles';

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = (props) => {
  const { children } = props;
  const { login } = React.useContext(SessionContext);
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="Menu"
            onClick={() => navigate(linkRoutes.login)}
          >
            <AccountCircle />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {login}
          </Typography>
          {/* diff */}
          <IconButton
            style={{ marginLeft: 'auto' }}
            color="inherit"
            aria-label="Menu"
            onClick={() => navigate(linkRoutes.hotelEdit('0'))}
          >
            <Add />
          </IconButton>
          {/* diff */}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{children}</main>
    </>
  );
};

```


Now we are ready to create new test.

> Create `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```javascript
/// <reference types="Cypress" />

describe("Hotel edit form submission", () => {
  const newHotel = {
    id: "Test id",
    picture: "Test picture",
    name: "Test hotel",
    description: "This a foo description",
    city: "Seattle",
    address: "Foo address",
    rating: 4,
  };

  it('Adds a new hotel', () => {
    cy.intercept('POST', '/api/hotels', newHotel).as('create');
  });
});
```

Because we don't  want to delay on real API request, we have to stub cities combo, so we're going to stub this XHR call, and add a new command to visit the page:

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```js
describe("Hotel edit form submission", () => {
  const newHotel = {
    id: "Test id",
    picture: "Test picture",
    name: "Test hotel",
    description: "This a foo description",
    city: "Seattle",
    address: "Foo address",
    rating: 4,
  };
  
  /*diff*/
  const cities = [
    {
      id: "Seattle",
      name: "Seattle",
    },
    {
      id: "Burlingame",
      name: "Burlingame",
    },
  ];
  /*diff*/

  it("Adds a new hotel", () => {
    cy.intercept("POST", "/api/hotels", newHotel).as("create");
    /*diff*/
    cy.intercept("GET", "/api/cities", cities);
    cy.visit('/hotel-edit/0');
    /*diff*/
  });
});
```

- Lets run the test suit
  - `backend` - `npm start`
  - `hotel-viewer` - `npm run start:dev`
  - `e2e` - `npm run test:e2e`

We can check that the cities are stubbed, since only two are loaded. Now it's time to fill the form.

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```diff
it("Adds a new hotel", () => {
    cy.intercept("POST", "/api/hotels", newHotel).as("create");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");
+
+   cy.get('#name')
+     .type(newHotel.name);
+
+   cy.get('#address')
+     .type(newHotel.address);
+
+   cy.get('#description')
+     .type(newHotel.description);
});
```

The trickiest part is to get an option on multiselect, we go this way due to __material ui__. 

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```diff
it("Adds a new hotel", () => {
    cy.intercept("POST", "/api/hotels", newHotel).as("create");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

+   cy.get("#city").click();
+   cy.get('[data-value="Seattle"]').click();
 });
```

Now what we want is to post the new created hotel, because we're stubbing all calls, we have to access the hotels fixture and make that this reflect the new added hotel.

> Update `e2e/cypress/e2e/hotel-edit-submission.cy.js`

```js
it("Adds a new hotel", () => {
    cy.intercept("POST", "/api/hotels", newHotel).as("create");
    cy.intercept("GET", "/api/cities", cities);
    cy.visit("/hotel-edit/0");

    cy.get("#name").type(newHotel.name);
    cy.get("#address").type(newHotel.address);
    cy.get("#description").type(newHotel.description);

    cy.get("#city").click();
    cy.get('[data-value="Seattle"]').click();
    /*diff*/
    cy.fixture("hotels").then((hotels) => {
      hotels.push(newHotel);
      cy.intercept("GET", "/api/hotels", hotels).as("hotelAdded");
      cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
      cy.wait("@create");
      cy.wait("@hotelAdded");
    });
    /*diff*/
  });
```

For last we only have to assert that the new number of hotels is updated.

```diff
cy.fixture("hotels").then((hotels) => {
      hotels.push(newHotel);
      cy.intercept("GET", "/api/hotels", hotels).as("hotelAdded");
      cy.get(".css-115ypaa-root > .MuiButtonBase-root").click();
      cy.wait("@create");
      cy.wait("@hotelAdded");

+     cy.get('[data-testid="hotels"] > li').should("have.length", 3);
    });
```
