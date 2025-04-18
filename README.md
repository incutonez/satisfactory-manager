# Satisfactory Production Manager

I wanted a tool that could help me keep track of what I'm producing and consuming in my factory.  I know things like [Satisfactory Calculator](https://satisfactory-calculator.com/en/planners/production) exist, but I wanted to try and make my own in React.

## Data

The [initial data](https://github.com/greeny/SatisfactoryTools/blob/master/data/data1.0.json#L3154) was pulled from the SatisfactoryTools GH repo, and I wrote a generator.ts script to massage the data into what I needed.  This included both recipes and items that can be produced.  The images for the items were pulled from [here](https://github.com/greeny/SatisfactoryTools/tree/master/www/assets/images/items).

## UI

The UI is pretty simple.  The user is presented with a data table (using [TanStack Table](https://tanstack.com/table/latest)), with the items and the current production, consumption, and total amounts.  If the total amount is positive, the cell will be green, red if negative, and white if neutral.  The producing and consuming cells can be clicked, which opens a dialog to edit the amounts from recipes.